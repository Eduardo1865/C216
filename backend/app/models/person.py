from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Person(Base):
    __tablename__ = "people"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    cpf: Mapped[str] = mapped_column(String(14), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    telefone: Mapped[str] = mapped_column(String(30), nullable=False)
    endereco: Mapped[str] = mapped_column(String(255), nullable=False)
