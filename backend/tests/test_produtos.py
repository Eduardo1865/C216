import asyncio
from datetime import date
from io import BytesIO

import pytest
from fastapi import HTTPException, UploadFile
from openpyxl import Workbook
from sqlalchemy.orm import Session

from app.db.database import engine
from app.models.produto import Produto
from app.models.tag import Tag
from app.routers.produtos import (
    criar_produto,
    editar_produto,
    excluir_produto,
    importar_produtos,
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


def criar_planilha(linhas):
    workbook = Workbook()
    worksheet = workbook.active
    worksheet.append(
        [
            "Nome",
            "Lote",
            "Data de fabricação",
            "Data de validade",
            "Preço",
            "Estoque atual",
            "Tags",
            "Valor Total em Estoque",
        ]
    )
    for linha in linhas:
        worksheet.append(linha)

    arquivo = BytesIO()
    workbook.save(arquivo)
    arquivo.seek(0)
    return arquivo


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


def test_importar_produtos_da_planilha_cria_tags_e_deixa_foto_vazia():
    with Session(engine) as db:
        tag_existente = Tag(nome="Mercearia")
        db.add(tag_existente)
        db.commit()

        arquivo = criar_planilha(
            [
                [
                    "Arroz",
                    "A1",
                    date(2026, 1, 1),
                    date(2027, 1, 1),
                    5.49,
                    20,
                    "Mercearia; Grãos",
                    109.8,
                ],
                [
                    "Feijão",
                    "F1",
                    date(2026, 2, 1),
                    date(2027, 2, 1),
                    8.99,
                    10,
                    "Mercearia",
                    89.9,
                ],
                ["TOTAL GERAL", None, None, None, None, None, None, None],
            ]
        )
        resultado = asyncio.run(
            importar_produtos(
                UploadFile(filename="produtos.xlsx", file=arquivo),
                db,
            )
        )

        produtos = listar_produtos(db)

        assert resultado == {"quantidade": 2}
        assert [produto.nome for produto in produtos] == ["Arroz", "Feijão"]
        assert all(produto.foto is None for produto in produtos)
        assert {tag.nome for tag in produtos[0].tags} == {"Mercearia", "Grãos"}
        assert {tag.nome for tag in produtos[1].tags} == {"Mercearia"}
        assert db.query(Tag).count() == 2


def test_importacao_invalida_nao_insere_produtos_parcialmente():
    with Session(engine) as db:
        arquivo = criar_planilha(
            [
                [
                    "Arroz",
                    "A1",
                    date(2026, 1, 1),
                    date(2027, 1, 1),
                    5.49,
                    20,
                    "",
                    109.8,
                ],
                [
                    "",
                    "F1",
                    date(2026, 2, 1),
                    date(2027, 2, 1),
                    8.99,
                    10,
                    "",
                    89.9,
                ],
            ]
        )

        with pytest.raises(HTTPException) as erro:
            asyncio.run(
                importar_produtos(
                    UploadFile(filename="produtos.xlsx", file=arquivo),
                    db,
                )
            )

        assert erro.value.status_code == 422
        assert listar_produtos(db) == []


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
