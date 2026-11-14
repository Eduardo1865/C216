from pydantic import BaseModel, ConfigDict, EmailStr, Field


class PersonCreate(BaseModel):
    nome: str = Field(min_length=1, max_length=120)
    cpf: str = Field(min_length=14, max_length=14)
    email: EmailStr
    telefone: str = Field(min_length=1, max_length=30)
    endereco: str = Field(min_length=1, max_length=255)


class PersonResponse(PersonCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
