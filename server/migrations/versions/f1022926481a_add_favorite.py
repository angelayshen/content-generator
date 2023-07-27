"""add favorite

Revision ID: f1022926481a
Revises: 807a498f3b26
Create Date: 2023-07-26 13:50:11.626344

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f1022926481a'
down_revision = '807a498f3b26'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('stories', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_favorite', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('stories', schema=None) as batch_op:
        batch_op.drop_column('is_favorite')

    # ### end Alembic commands ###