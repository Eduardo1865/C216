from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.tag import Tag
from app.schemas.tag import TagCreate, TagResponse

router = APIRouter(prefix="/tags", tags=["Tags"])


@router.post(
    "/",
    response_model=TagResponse,
    status_code=status.HTTP_201_CREATED,
)
def criar_tag(tag_data: TagCreate, db: Session = Depends(get_db)) -> Tag:
    existente = db.scalar(select(Tag).where(Tag.nome == tag_data.nome))
    if existente is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe uma tag com este nome.",
        )

    tag = Tag(nome=tag_data.nome)
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag


@router.get("/", response_model=list[TagResponse])
def listar_tags(db: Session = Depends(get_db)) -> list[Tag]:
    return list(db.scalars(select(Tag).order_by(Tag.id)).all())


@router.get("/{tag_id}", response_model=TagResponse)
def obter_tag(tag_id: int, db: Session = Depends(get_db)) -> Tag:
    tag = db.get(Tag, tag_id)
    if tag is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag não encontrada.",
        )
    return tag


@router.put("/{tag_id}", response_model=TagResponse)
def editar_tag(
    tag_id: int,
    tag_data: TagCreate,
    db: Session = Depends(get_db),
) -> Tag:
    tag = db.get(Tag, tag_id)
    if tag is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag não encontrada.",
        )

    existente = db.scalar(
        select(Tag).where(Tag.nome == tag_data.nome, Tag.id != tag_id)
    )
    if existente is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe uma tag com este nome.",
        )

    tag.nome = tag_data.nome
    db.commit()
    db.refresh(tag)
    return tag


@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_tag(tag_id: int, db: Session = Depends(get_db)) -> None:
    tag = db.get(Tag, tag_id)
    if tag is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag não encontrada.",
        )

    db.delete(tag)
    db.commit()
