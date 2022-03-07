"""Raw series data for different pools."""
# pylint: disable=too-few-public-methods
from init import db
from sqlalchemy.dialects.postgresql import ARRAY


class ApySeriesData(db.Model):
    """Raw data for APY yields."""

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_at = db.Column(db.DateTime, default=db.func.now())
    # For some complicated reasons explained in this stackoverflow post, we will have to add the delete logic
    # in this relationship as well. https://stackoverflow.com/questions/5033547/sqlalchemy-cascade-delete
    pool_info = db.relationship(
        "PoolInfo", backref=db.backref("apy_series_data", cascade="all, delete-orphan", passive_deletes=True), uselist=False
    )
    pool_info_name = db.Column(db.String(50), db.ForeignKey("pool_info.pool_name", ondelete="CASCADE"), nullable=False)
    pool_yield = db.Column(db.Float, nullable=False)


class PoolInfo(db.Model):
    """Information about a pool on defi."""

    pool_name = db.Column(db.String(50), primary_key=True, nullable=False)
    tokens = db.Column(ARRAY(db.String(30)))
