from datetime import date

from sqlalchemy import Date, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base

class Produto(Base):
    __tablename__ = "produto"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(150), nullable=False)
    lote: Mapped[str] = mapped_column(String(150), nullable=False)
    dataFabricacao: Mapped[date] = mapped_column(Date, nullable=False)
    dataValidade: Mapped[date] = mapped_column(Date, nullable=False)
    preco:Mapped[float] = mapped_column(nullable=False)
    estoqueAtual:Mapped [int] = mapped_column(nullable=False)
    foto: Mapped[str | None] = mapped_column(Text, nullable=True)