import re
import unicodedata
from datetime import date, datetime
from io import BytesIO
from math import isfinite
from typing import Annotated
from zipfile import BadZipFile

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from openpyxl import load_workbook
from openpyxl.utils.datetime import from_excel
from openpyxl.utils.exceptions import InvalidFileException
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.produto import Produto
from app.models.tag import Tag
from app.schemas.produto import ProdutoCreate, ProdutoResponse

router = APIRouter(prefix="/produtos", tags=["Produtos"])
MAX_PLANILHA_BYTES = 10 * 1024 * 1024
MAX_LINHAS_PLANILHA = 10_000


def normalizar_cabecalho(valor: object) -> str:
    texto = unicodedata.normalize("NFKD", str(valor or ""))
    return texto.encode("ascii", "ignore").decode("ascii").strip().casefold()


def valor_obrigatorio(valor: object, campo: str, linha: int) -> str:
    texto = str(valor or "").strip()
    if not texto:
        raise ValueError(f"Linha {linha}: o campo {campo} é obrigatório.")
    return texto


def converter_data(valor: object, campo: str, linha: int) -> date:
    if isinstance(valor, datetime):
        return valor.date()
    if isinstance(valor, date):
        return valor
    if isinstance(valor, (int, float)) and not isinstance(valor, bool):
        try:
            convertido = from_excel(valor)
            if isinstance(convertido, datetime):
                return convertido.date()
            if isinstance(convertido, date):
                return convertido
        except (OverflowError, ValueError):
            pass
    if isinstance(valor, str):
        texto = valor.strip()
        try:
            return date.fromisoformat(texto)
        except ValueError:
            pass
        try:
            dia, mes, ano = (int(parte) for parte in texto.split("/"))
            return date(ano, mes, dia)
        except ValueError:
            pass
    raise ValueError(f"Linha {linha}: data inválida no campo {campo}.")


def converter_tags(valor: object, linha: int) -> list[str]:
    if valor is None or not str(valor).strip():
        return []

    tags = list(
        dict.fromkeys(
            tag.strip() for tag in re.split(r"[;,]", str(valor)) if tag.strip()
        )
    )
    if any(len(tag) > 100 for tag in tags):
        raise ValueError(f"Linha {linha}: cada tag pode ter no máximo 100 caracteres.")
    return tags


def obter_tags(tag_ids: list[int], db: Session) -> list[Tag]:
    ids = list(dict.fromkeys(tag_ids))
    if not ids:
        return []

    tags = list(db.scalars(select(Tag).where(Tag.id.in_(ids))).all())
    encontrados = {tag.id for tag in tags}
    ausentes = [tag_id for tag_id in ids if tag_id not in encontrados]

    if ausentes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tags não encontradas: {ausentes}",
        )

    return tags


@router.post(
    "/",
    response_model=ProdutoResponse,
    status_code=status.HTTP_201_CREATED,
)
def criar_produto(
    produto_data: ProdutoCreate,
    db: Session = Depends(get_db),
) -> Produto:
    tags = obter_tags(produto_data.tag_ids, db)

    produto = Produto(
        nome=produto_data.nome,
        lote=produto_data.lote,
        dataFabricacao=produto_data.dataFabricacao,
        dataValidade=produto_data.dataValidade,
        preco=produto_data.preco,
        estoqueAtual=produto_data.estoqueAtual,
        foto=produto_data.foto,
        tags=tags,
    )

    db.add(produto)
    db.commit()
    db.refresh(produto)

    return produto


@router.post(
    "/importar",
    status_code=status.HTTP_201_CREATED,
)
async def importar_produtos(
    planilha: Annotated[UploadFile, File()],
    db: Annotated[Session, Depends(get_db)],
) -> dict[str, int]:
    try:
        if not (planilha.filename or "").lower().endswith(".xlsx"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Envie uma planilha no formato .xlsx.",
            )

        conteudo = await planilha.read(MAX_PLANILHA_BYTES + 1)
    finally:
        await planilha.close()

    if len(conteudo) > MAX_PLANILHA_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="A planilha deve ter no máximo 10 MB.",
        )
    if not conteudo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A planilha está vazia.",
        )

    try:
        workbook = load_workbook(BytesIO(conteudo), read_only=True, data_only=True)
    except (BadZipFile, InvalidFileException, OSError, ValueError, EOFError) as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não foi possível ler a planilha .xlsx enviada.",
        ) from error

    try:
        if not workbook.worksheets:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="A planilha não contém abas.",
            )

        worksheet = workbook.worksheets[0]
        cabecalhos = next(
            worksheet.iter_rows(min_row=1, max_row=1, values_only=True),
            None,
        )
        if not cabecalhos:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="A primeira aba não contém cabeçalhos.",
            )

        colunas = {
            normalizar_cabecalho(cabecalho): indice
            for indice, cabecalho in enumerate(cabecalhos)
            if cabecalho is not None
        }
        colunas_obrigatorias = {
            "nome": "Nome",
            "lote": "Lote",
            "data de fabricacao": "Data de fabricação",
            "data de validade": "Data de validade",
            "preco": "Preço",
            "estoque atual": "Estoque atual",
        }
        ausentes = [
            rotulo
            for chave, rotulo in colunas_obrigatorias.items()
            if chave not in colunas
        ]
        if ausentes:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail=f"Cabeçalhos obrigatórios ausentes: {', '.join(ausentes)}.",
            )

        registros: list[tuple[ProdutoCreate, list[str]]] = []
        for numero_linha, valores in enumerate(
            worksheet.iter_rows(min_row=2, values_only=True),
            start=2,
        ):
            if numero_linha > MAX_LINHAS_PLANILHA + 1:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="A planilha pode conter no máximo 10.000 linhas.",
                )
            if not any(valor is not None and str(valor).strip() for valor in valores):
                continue

            valores_por_campo = {
                campo: valores[indice] if indice < len(valores) else None
                for campo, indice in colunas.items()
            }
            if normalizar_cabecalho(valores_por_campo.get("nome")) in {
                "total",
                "total geral",
            } and all(
                valores_por_campo.get(campo) is None
                or not str(valores_por_campo.get(campo)).strip()
                for campo in (
                    "lote",
                    "data de fabricacao",
                    "data de validade",
                    "preco",
                    "estoque atual",
                    "tags",
                )
            ):
                continue

            try:
                nome = valor_obrigatorio(
                    valores_por_campo.get("nome"),
                    "Nome",
                    numero_linha,
                )
                lote = valor_obrigatorio(
                    valores_por_campo.get("lote"),
                    "Lote",
                    numero_linha,
                )
                if len(nome) > 150 or len(lote) > 150:
                    raise ValueError(
                        f"Linha {numero_linha}: nome e lote podem ter no máximo 150 caracteres."
                    )

                produto_data = ProdutoCreate.model_validate(
                    {
                        "nome": nome,
                        "lote": lote,
                        "dataFabricacao": converter_data(
                            valores_por_campo.get("data de fabricacao"),
                            "Data de fabricação",
                            numero_linha,
                        ),
                        "dataValidade": converter_data(
                            valores_por_campo.get("data de validade"),
                            "Data de validade",
                            numero_linha,
                        ),
                        "preco": valores_por_campo.get("preco"),
                        "estoqueAtual": valores_por_campo.get("estoque atual"),
                        "foto": None,
                    }
                )
                if not isfinite(produto_data.preco) or produto_data.preco < 0:
                    raise ValueError(
                        f"Linha {numero_linha}: o preço deve ser um número não negativo."
                    )
                if produto_data.estoqueAtual < 0:
                    raise ValueError(
                        f"Linha {numero_linha}: o estoque deve ser não negativo."
                    )

                registros.append(
                    (
                        produto_data,
                        converter_tags(
                            valores_por_campo.get("tags"),
                            numero_linha,
                        ),
                    )
                )
            except ValidationError as error:
                campo = error.errors()[0]["loc"][0]
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail=f"Linha {numero_linha}: valor inválido no campo {campo}.",
                ) from error
            except ValueError as error:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail=str(error),
                ) from error

        if not registros:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="A planilha não contém produtos para importar.",
            )
    finally:
        workbook.close()

    nomes_tags = {nome for _, tags in registros for nome in tags}
    tags_existentes = (
        db.scalars(select(Tag).where(Tag.nome.in_(nomes_tags))).all()
        if nomes_tags
        else []
    )
    tags_por_nome = {tag.nome: tag for tag in tags_existentes}
    novas_tags = [Tag(nome=nome) for nome in nomes_tags if nome not in tags_por_nome]
    db.add_all(novas_tags)
    db.flush()
    tags_por_nome.update({tag.nome: tag for tag in novas_tags})

    produtos_novos = [
        Produto(
            nome=produto_data.nome,
            lote=produto_data.lote,
            dataFabricacao=produto_data.dataFabricacao,
            dataValidade=produto_data.dataValidade,
            preco=produto_data.preco,
            estoqueAtual=produto_data.estoqueAtual,
            foto=None,
            tags=[tags_por_nome[nome] for nome in nomes],
        )
        for produto_data, nomes in registros
    ]
    db.add_all(produtos_novos)
    db.commit()
    return {"quantidade": len(produtos_novos)}


@router.get(
    "/",
    response_model=list[ProdutoResponse],
)
def listar_produtos(
    db: Session = Depends(get_db),
) -> list[Produto]:
    query = select(Produto).order_by(Produto.id)
    resultado = db.scalars(query).all()

    return list(resultado)


@router.get(
    "/por-tag/{tag_id}",
    response_model=list[ProdutoResponse],
)
def buscar_produtos_por_tag(
    tag_id: int,
    db: Session = Depends(get_db),
) -> list[Produto]:
    tag = db.get(Tag, tag_id)
    if tag is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag não encontrada.",
        )

    query = (
        select(Produto).join(Produto.tags).where(Tag.id == tag_id).order_by(Produto.id)
    )
    resultado = db.scalars(query).unique().all()

    return list(resultado)


@router.put(
    "/{produto_id}",
    response_model=ProdutoResponse,
)
def editar_produto(
    produto_id: int,
    produto_data: ProdutoCreate,
    db: Session = Depends(get_db),
) -> Produto:
    produto = db.get(Produto, produto_id)
    if produto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado.",
        )

    produto.tags = obter_tags(produto_data.tag_ids, db)
    produto.nome = produto_data.nome
    produto.lote = produto_data.lote
    produto.dataFabricacao = produto_data.dataFabricacao
    produto.dataValidade = produto_data.dataValidade
    produto.preco = produto_data.preco
    produto.estoqueAtual = produto_data.estoqueAtual
    produto.foto = produto_data.foto

    db.commit()
    db.refresh(produto)
    return produto


@router.delete(
    "/{produto_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def excluir_produto(
    produto_id: int,
    db: Session = Depends(get_db),
) -> None:
    produto = db.get(Produto, produto_id)
    if produto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado.",
        )

    db.delete(produto)
    db.commit()
