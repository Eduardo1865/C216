from datetime import date

import pytest
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.database import engine
from app.models.produto import Produto
from app.models.tag import Tag
from app.routers.produtos import (
    criar_produto,
    editar_produto,
    excluir_produto,
    listar_produtos,
)
from app.schemas.produto import ProdutoCreate


def produto_data(nome="Cafe", tag_ids=None):
    return ProdutoCreate(
        nome=nome,
        lote="L1",
        dataFabricacao=date(2026, 1, 1),
        dataValidade=date(2027, 1, 1),
        preco=10.5,
        estoqueAtual=3,
        foto="foto-teste",
        tag_ids=[] if tag_ids is None else tag_ids,
    )


def test_criar_produto_com_todos_os_campos():
    with Session(engine) as db:
        produto = criar_produto(produto_data(), db)

        assert produto.id is not None
        assert produto.nome == "Cafe"
        assert produto.lote == "L1"
        assert produto.dataFabricacao == date(2026, 1, 1)
        assert produto.dataValidade == date(2027, 1, 1)
        assert produto.preco == 10.5
        assert produto.estoqueAtual == 3
        assert produto.foto == "foto-teste"
        assert produto.tags == []


def test_criar_produto_com_multiplas_tags():
    with Session(engine) as db:
        tag_nova = Tag(nome="novo")
        tag_oferta = Tag(nome="oferta")
        db.add_all([tag_nova, tag_oferta])
        db.commit()

        produto = criar_produto(
            produto_data(tag_ids=[tag_nova.id, tag_oferta.id]),
            db,
        )

        assert {tag.nome for tag in produto.tags} == {"novo", "oferta"}


def test_listar_produtos_na_ordem_de_cadastro():
    with Session(engine) as db:
        primeiro = criar_produto(produto_data("Primeiro"), db)
        segundo = criar_produto(produto_data("Segundo"), db)

        resultado = listar_produtos(db)

        assert [produto.id for produto in resultado] == [
            primeiro.id,
            segundo.id,
        ]
        assert [produto.nome for produto in resultado] == ["Primeiro", "Segundo"]


def test_editar_todos_os_campos_do_produto():
    with Session(engine) as db:
        produto = criar_produto(produto_data(), db)
        dados_edicao = ProdutoCreate(
            nome="Cafe editado",
            lote="L2",
            dataFabricacao=date(2025, 2, 2),
            dataValidade=date(2026, 2, 2),
            preco=25.75,
            estoqueAtual=12,
            foto=None,
            tag_ids=[],
        )

        editado = editar_produto(produto.id, dados_edicao, db)

        assert editado.nome == "Cafe editado"
        assert editado.lote == "L2"
        assert editado.dataFabricacao == date(2025, 2, 2)
        assert editado.dataValidade == date(2026, 2, 2)
        assert editado.preco == 25.75
        assert editado.estoqueAtual == 12
        assert editado.foto is None


def test_editar_produto_404():
    with Session(engine) as db:
        with pytest.raises(HTTPException) as erro:
            editar_produto(999, produto_data(), db)

        assert erro.value.status_code == 404
        assert erro.value.detail == "Produto não encontrado."


def test_excluir_produto_remove_do_banco():
    with Session(engine) as db:
        produto = criar_produto(produto_data(), db)

        excluir_produto(produto.id, db)

        assert db.get(Produto, produto.id) is None


def test_excluir_produto_inexistente_404():
    with Session(engine) as db:
        with pytest.raises(HTTPException) as erro:
            excluir_produto(999, db)

        assert erro.value.status_code == 404
