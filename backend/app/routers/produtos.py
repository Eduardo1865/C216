from fastapi import APIRouter, Depends, status
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