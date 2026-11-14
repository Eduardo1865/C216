from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.person import PersonCreate, PersonResponse
from app.services.person import create_person, find_person_by_name, list_people

router = APIRouter(prefix="/people", tags=["people"])


@router.get("", response_model=list[PersonResponse])
def list_people_endpoint(db: Session = Depends(get_db)) -> list[PersonResponse]:  # noqa: B008
    return list_people(db)


@router.post("", response_model=PersonResponse, status_code=status.HTTP_201_CREATED)
def create_person_endpoint(
    person_data: PersonCreate,
    db: Session = Depends(get_db),  # noqa: B008
) -> PersonResponse:
    if find_person_by_name(db, person_data.nome) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe uma pessoa com esse nome",
        )

    try:
        return create_person(db, person_data)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Os dados da pessoa já estão cadastrados",
        ) from None
