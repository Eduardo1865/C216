from sqlalchemy.orm import Session

from app.models.person import Person
from app.repositories.person import PersonRepository
from app.schemas.person import PersonCreate


def create_person(db: Session, person_data: PersonCreate) -> Person:
    return PersonRepository(db).create(person_data.model_dump(mode="json"))


def list_people(db: Session) -> list[Person]:
    return PersonRepository(db).list()


def find_person_by_name(db: Session, name: str) -> Person | None:
    return PersonRepository(db).find_by_name(name)
