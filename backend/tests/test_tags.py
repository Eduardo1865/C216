from datetime import date

import pytest
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db.database import engine
from app.models.tag import Tag
from app.routers.produtos import (
    buscar_produtos_por_tag,
    criar_produto,
    editar_produto,
    excluir_produto,
)
from app.routers.tags import (
    criar_tag,
    editar_tag,
    excluir_tag,
    listar_tags,
    obter_tag,
)
from app.schemas.produto import ProdutoCreate
from app.schemas.tag import TagCreate


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


def test_criar_e_listar_tags():
    with Session(engine) as db:
        tag = criar_tag(TagCreate(nome="laticinios"), db)

        resultado = listar_tags(db)

        assert [item.id for item in resultado] == [tag.id]
        assert resultado[0].nome == "laticinios"


def test_nao_permite_nome_de_tag_duplicado():
    with Session(engine) as db:
        criar_tag(TagCreate(nome="frutas"), db)

        with pytest.raises(HTTPException) as erro:
            criar_tag(TagCreate(nome="frutas"), db)

        assert erro.value.status_code == 409


def test_editar_tag_e_impedir_nome_duplicado():
    with Session(engine) as db:
        primeira = criar_tag(TagCreate(nome="frutas"), db)
        segunda = criar_tag(TagCreate(nome="bebidas"), db)

        editada = editar_tag(primeira.id, TagCreate(nome="alimentos"), db)

        assert editada.nome == "alimentos"

        with pytest.raises(HTTPException) as erro:
            editar_tag(segunda.id, TagCreate(nome="alimentos"), db)

        assert erro.value.status_code == 409


def test_obter_e_excluir_tag():
    with Session(engine) as db:
        tag = criar_tag(TagCreate(nome="cereais"), db)

        assert obter_tag(tag.id, db).nome == "cereais"

        excluir_tag(tag.id, db)

        with pytest.raises(HTTPException) as erro:
            obter_tag(tag.id, db)

        assert erro.value.status_code == 404


def test_associar_tag_na_criacao_e_substituir_na_edicao():

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
    with Session(engine) as db:
        tag = Tag(nome="frutas")
        db.add(tag)
        db.commit()
        db.refresh(tag)

        produto = criar_produto(produto_data([tag.id]), db)

        resultado = buscar_produtos_por_tag(tag.id, db)

        assert [item.id for item in resultado] == [produto.id]


def test_rejeita_tag_inexistente_na_criacao_do_produto():
    with Session(engine) as db:
        with pytest.raises(HTTPException) as erro:
            criar_produto(produto_data([999]), db)

        assert erro.value.status_code == 404


def test_edicao_remove_tags_quando_lista_vazia():
    with Session(engine) as db:
        tag = criar_tag(TagCreate(nome="promocao"), db)
        produto = criar_produto(produto_data([tag.id]), db)

        editado = editar_produto(produto.id, produto_data([]), db)

        assert editado.tags == []


def test_busca_por_tag_retorna_404_para_tag_inexistente():
    with Session(engine) as db:
        with pytest.raises(HTTPException) as erro:
            buscar_produtos_por_tag(999, db)

        assert erro.value.status_code == 404


def test_excluir_produto():
    with Session(engine) as db:
        produto = criar_produto(produto_data([]), db)

        excluir_produto(produto.id, db)

        with pytest.raises(HTTPException) as erro:
            editar_produto(produto.id, produto_data([]), db)

        assert erro.value.status_code == 404
