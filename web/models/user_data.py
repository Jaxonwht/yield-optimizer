"""User-created data."""
# pylint: disable=too-few-public-methods
from init import db

list_pool_association = db.Table(
    "list_pool_association",
    db.Column("pool_info_name", db.String(50), db.ForeignKey("pool_info.pool_name"), primary_key=True),
    db.Column("list_name", db.String(50), db.ForeignKey("named_pool_list.list_name"), primary_key=True),
)


class NamedPoolList(db.Model):
    """Named list of pools created by users."""

    list_name = db.Column(db.String(50), nullable=False, primary_key=True)
    pool_infos = db.relationship("PoolInfo", secondary=list_pool_association, back_populates="named_pool_lists")
