from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.produto import Produto
from app.schemas.produto import ProdutoCreate, ProdutoResponse

router = APIRouter(prefix="/produtos", tags=["Produtos"])

@router.post(
    "/",
    response_model=ProdutoResponse,
    status_code=status.HTTP_201_CREATED,
)
def criar_produto(
    produto_data: ProdutoCreate,
    db: Session = Depends(get_db),
) -> Produto:
    produto = Produto(
        nome=produto_data.nome,
        lote=produto_data.lote,
        dataFabricacao=produto_data.dataFabricacao,
        dataValidade=produto_data.dataValidade,
        preco=produto_data.preco,
        estoqueAtual=produto_data.estoqueAtual,
        foto=produto_data.foto,
    )

    db.add(produto)
    db.commit()
    db.refresh(produto)

    return produto

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