from datetime import date

from sqlalchemy import Date, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base

class Produto(Base):
    __tablename__ = "produto"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(150), nullable=False)
    data: Mapped[date] = mapped_column(Date, nullable=False)