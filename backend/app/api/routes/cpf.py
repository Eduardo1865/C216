from fastapi import APIRouter, Query

from app.schemas.cpf import (
    CPFFormatResponse,
    CPFGenerationResponse,
    CPFRequest,
    CPFValidationResponse,
)
from app.services.cpf import format_cpf, generate_cpf, is_valid_cpf

router = APIRouter(prefix="/cpf", tags=["cpf"])
generated_cpfs: set[str] = set()


@router.get("/validate", response_model=CPFValidationResponse)
def validate_cpf(cpf: str = Query(..., min_length=1)) -> CPFValidationResponse:
    return CPFValidationResponse(cpf=cpf, valid=is_valid_cpf(cpf))


@router.post("/validate", response_model=CPFValidationResponse)
def validate_cpf_from_body(request: CPFRequest) -> CPFValidationResponse:
    return CPFValidationResponse(cpf=request.cpf, valid=is_valid_cpf(request.cpf))


@router.get("/generate", response_model=CPFGenerationResponse)
def generate_cpf_endpoint() -> CPFGenerationResponse:
    cpf = generate_cpf()
    generated_cpfs.add(cpf)
    return CPFGenerationResponse(cpf=cpf, formatted_cpf=format_cpf(cpf))


@router.post("", response_model=CPFGenerationResponse, status_code=201)
def create_cpf() -> CPFGenerationResponse:
    return generate_cpf_endpoint()


@router.put("/format", response_model=CPFFormatResponse)
def format_cpf_endpoint(request: CPFRequest) -> CPFFormatResponse:
    return CPFFormatResponse(cpf=request.cpf, formatted_cpf=format_cpf(request.cpf))


@router.patch("/validate", response_model=CPFValidationResponse)
def partially_validate_cpf(request: CPFRequest) -> CPFValidationResponse:
    return validate_cpf_from_body(request)


@router.delete("/{cpf}", status_code=204)
def delete_generated_cpf(cpf: str) -> None:
    generated_cpfs.discard(cpf)