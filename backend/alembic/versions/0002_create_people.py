"""create people table"""

import sqlalchemy as sa

from alembic import op

revision = "0002_create_people"
down_revision = "0001_create_users"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "people",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nome", sa.String(length=120), nullable=False),
        sa.Column("cpf", sa.String(length=14), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("telefone", sa.String(length=30), nullable=False),
        sa.Column("endereco", sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_people_nome", "people", ["nome"], unique=True)
    op.create_index("ix_people_cpf", "people", ["cpf"], unique=True)
    op.create_index("ix_people_email", "people", ["email"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_people_email", table_name="people")
    op.drop_index("ix_people_cpf", table_name="people")
    op.drop_index("ix_people_nome", table_name="people")
    op.drop_table("people")
