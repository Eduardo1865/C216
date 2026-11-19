from datetime import date

from pydantic import BaseModel, ConfigDict

class ProdutoCreate(BaseModel):
    nome: str
    lote: str
    dataFabricacao: date
    dataValidade: date
    preco: float
    estoqueAtual: int
    foto: str | None = None


class ProdutoResponse(BaseModel):
    id: int
    nome: str
    lote: str
    dataFabricacao: date
    dataValidade: date
    preco: float
    estoqueAtual: int
    foto: str | None = None

    model_config = ConfigDict(from_attributes=True)