import os

import pytest

os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from app.db.database import Base, engine


@pytest.fixture(autouse=True)
def banco_limpo():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    yield
    Base.metadata.drop_all(engine)
