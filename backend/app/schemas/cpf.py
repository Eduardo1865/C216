from pydantic import BaseModel, Field


class CPFRequest(BaseModel):
    cpf: str = Field(min_length=1, description="CPF com ou sem pontuação")


class CPFValidationResponse(BaseModel):
    cpf: str
    valid: bool


class CPFGenerationResponse(BaseModel):
    cpf: str
    formatted_cpf: str


class CPFFormatResponse(BaseModel):
    cpf: str
    formatted_cpf: str