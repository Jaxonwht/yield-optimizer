"""Modified apy model data

Revision ID: aa15c27a847b
Revises:
Create Date: 2022-03-01 00:55:18.169839

"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "aa15c27a847b"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "pool_info",
        sa.Column("pool_name", sa.String(length=50), nullable=False),
        sa.Column("tokens", postgresql.ARRAY(sa.String(length=30))),
        sa.PrimaryKeyConstraint("pool_name"),
    )
    op.create_table(
        "apy_series_data",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("pool_info_name", sa.String(length=50), nullable=False),
        sa.Column("pool_yield", sa.Float(), nullable=False),
        sa.ForeignKeyConstraint(
            ["pool_info_name"],
            ["pool_info.pool_name"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("apy_series_data")
    op.drop_table("pool_info")
    # ### end Alembic commands ###
