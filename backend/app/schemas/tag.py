from pydantic import BaseModel, ConfigDict, Field


class TagCreate(BaseModel):
    nome: str = Field(min_length=1)


class TagResponse(BaseModel):
    id: int
    nome: str

    model_config = ConfigDict(from_attributes=True)
