from datetime import date

from pydantic import BaseModel, ConfigDict, Field
from app.schemas.tag import TagResponse

class ProdutoCreate(BaseModel):
    nome: str
    lote: str
    dataFabricacao: date
    dataValidade: date
    preco: float
    estoqueAtual: int
    foto: str | None = None
    tag_ids: list[int] = Field(default_factory=list)


class ProdutoResponse(BaseModel):
    id: int
    nome: str
    lote: str
    dataFabricacao: date
    dataValidade: date
    preco: float
    estoqueAtual: int
    foto: str | None = None
    tags: list[TagResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)