from datetime import date

from pydantic import BaseModel, ConfigDict

class ProdutoCreate(BaseModel):
    nome: str
    data: date


class ProdutoResponse(BaseModel):
    id: int
    nome: str
    data: date

    model_config = ConfigDict(from_attributes=True)