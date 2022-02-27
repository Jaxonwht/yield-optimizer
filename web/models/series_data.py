"""Raw series data for different pools."""
# pylint: disable=too-few-public-methods
from init import db
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class ApySeriesData(db.Model):
    """Raw data for APY yields."""

    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, default=func.now())
    pool_info = relationship("PoolInfo", backref="apy_series_data", uselist=False)
    pool_info_name = Column(String, ForeignKey("pool_info.pool_name"), nullable=False)
    pool_yield = Column(Float, nullable=False)


class PoolInfo(db.Model):
    """Information about a pool on defi."""

    pool_name = Column(String(50), primary_key=True, nullable=False)
    tokens = Column(ARRAY(String))
