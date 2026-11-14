from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate, UserUpdate


def create_user(db: Session, user_data: UserCreate) -> User:
    return UserRepository(db).create(user_data.name, str(user_data.email))


def get_user(db: Session, user_id: int) -> User | None:
    return UserRepository(db).get(user_id)


def list_users(db: Session) -> list[User]:
    return UserRepository(db).list()


def update_user(db: Session, user: User, user_data: UserUpdate) -> User:
    values = {
        field: str(value) if field == "email" else value
        for field, value in user_data.model_dump(exclude_unset=True).items()
        if value is not None
    }
    return UserRepository(db).update(user, values)


def delete_user(db: Session, user: User) -> None:
    UserRepository(db).delete(user)
