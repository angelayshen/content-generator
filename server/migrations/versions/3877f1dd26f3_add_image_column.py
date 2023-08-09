"""add image column

Revision ID: 3877f1dd26f3
Revises: f1022926481a
Create Date: 2023-08-09 15:31:34.904824

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3877f1dd26f3'
down_revision = 'f1022926481a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('stories', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image_base64', sa.Text(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('stories', schema=None) as batch_op:
        batch_op.drop_column('image_base64')

    # ### end Alembic commands ###