import os
from datetime import date

os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from sqlalchemy.orm import Session

from app.db.database import Base, engine
from app.models.tag import Tag
from app.routers.produtos import buscar_produtos_por_tag, criar_produto, editar_produto
from app.schemas.produto import ProdutoCreate


def produto_data(tag_ids):
    return ProdutoCreate(
        nome="Cafe",
        lote="L1",
        dataFabricacao=date(2026, 1, 1),
        dataValidade=date(2027, 1, 1),
        preco=10.5,
        estoqueAtual=3,
        tag_ids=tag_ids,
    )


def test_associar_tag_na_criacao_e_substituir_na_edicao():
    Base.metadata.create_all(engine)

    with Session(engine) as db:
        tag_nova = Tag(nome="novo")
        tag_oferta = Tag(nome="oferta")
        db.add_all([tag_nova, tag_oferta])
        db.commit()
        db.refresh(tag_nova)
        db.refresh(tag_oferta)

        produto = criar_produto(produto_data([tag_nova.id]), db)
        assert [tag.nome for tag in produto.tags] == ["novo"]

        produto = editar_produto(
            produto.id,
            produto_data([tag_oferta.id]),
            db,
        )
        assert [tag.nome for tag in produto.tags] == ["oferta"]


def test_buscar_produtos_por_tag():
    Base.metadata.create_all(engine)

    with Session(engine) as db:
        tag = Tag(nome="frutas")
        db.add(tag)
        db.commit()
        db.refresh(tag)

        produto = criar_produto(produto_data([tag.id]), db)

        resultado = buscar_produtos_por_tag(tag.id, db)

        assert [item.id for item in resultado] == [produto.id]
