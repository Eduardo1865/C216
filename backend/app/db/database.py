import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://admin:admin@localhost:5432/c216-projeto-final",
)


class Base(DeclarativeBase):
    pass


engine = create_engine(DATABASE_URL)