"""Remove incorrect nullable constraint

Revision ID: a6f81fb19032
Revises: aa15c27a847b
Create Date: 2022-03-01 01:01:44.048208

"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "a6f81fb19032"
down_revision = "aa15c27a847b"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("pool_info", "tokens", existing_type=postgresql.ARRAY(sa.VARCHAR(length=30)), nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("pool_info", "tokens", existing_type=postgresql.ARRAY(sa.VARCHAR(length=30)), nullable=False)
    # ### end Alembic commands ###
