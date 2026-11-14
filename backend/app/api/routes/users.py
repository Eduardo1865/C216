from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.user import UserResponse
from app.services.user import list_users

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserResponse])
def list_users_endpoint(db: Session = Depends(get_db)) -> list[UserResponse]:  # noqa: B008
    return list_users(db)
