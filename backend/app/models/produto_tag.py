from sqlalchemy import Table, Column, ForeignKey

from app.db.database import Base

produto_tag = Table(
    "produto_tag",
    Base.metadata,

    Column("produto_id", ForeignKey("produto.id"), primary_key=True),
    Column("tag_id", ForeignKey("tag.id"), primary_key=True)
)