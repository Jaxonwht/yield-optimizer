"""User-created data."""
# pylint: disable=too-few-public-methods
from init import db


class PoolList(db.Model):
    """Pools names in each user-created list."""

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    list_name = db.Column(db.String(50), nullable=False)
    pool_name = db.Column(db.String(50), db.ForeignKey("pool_info.pool_name"), nullable=False)
