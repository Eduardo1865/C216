from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.person import Person


class PersonRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, values: dict[str, str]) -> Person:
        person = Person(**values)
        self.db.add(person)
        self.db.commit()
        self.db.refresh(person)
        return person

    def list(self) -> list[Person]:
        return list(self.db.scalars(select(Person).order_by(Person.id.desc())).all())

    def find_by_name(self, name: str) -> Person | None:
        return self.db.scalar(select(Person).where(Person.nome == name))
