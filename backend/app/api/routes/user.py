from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.services.user import create_user, delete_user, get_user, update_user

router = APIRouter(prefix="/users", tags=["users"])


def _find_user(user_id: int, db: Session) -> User:
    user = get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user_endpoint(
    user_data: UserCreate,
    db: Session = Depends(get_db),  # noqa: B008
) -> UserResponse:
    return create_user(db, user_data)


@router.get("/{user_id}", response_model=UserResponse)
def get_user_endpoint(
    user_id: int,
    db: Session = Depends(get_db),  # noqa: B008
) -> UserResponse:
    return _find_user(user_id, db)


@router.put("/{user_id}", response_model=UserResponse)
def update_user_endpoint(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),  # noqa: B008
) -> UserResponse:
    user = _find_user(user_id, db)
    return update_user(db, user, user_data)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_endpoint(
    user_id: int,
    db: Session = Depends(get_db),  # noqa: B008
) -> None:
    user = _find_user(user_id, db)
    delete_user(db, user)
