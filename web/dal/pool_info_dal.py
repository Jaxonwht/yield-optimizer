"""DAL for manipulating pool infos."""
from datetime import datetime
from typing import Iterable, List, Tuple

from init import db
from models.series_data import ApySeriesData, PoolInfo
from sqlalchemy.dialects.postgresql import aggregate_order_by, array_agg


def get_all_pool_infos() -> List[PoolInfo]:
    """
    Return all the PoolInfo stored so far in the database.
    """
    return db.session.query(PoolInfo).all()


def get_tokens_by_pool_name(pool_name: str) -> List[str]:
    return db.session.get(PoolInfo, pool_name).tokens


def get_pool_yields(pool_name: str) -> Iterable[Tuple[datetime, float]]:
    """
    Return a list of ApySeriesData sorted by `created_at` for the given `pool_name`.
    """
    rows = (
        db.session.query(ApySeriesData.created_at, ApySeriesData.pool_yield)
        .filter_by(pool_info_name=pool_name)
        .order_by(ApySeriesData.created_at)
        .all()
    )
    for row in rows:
        yield tuple(row._asdict().values())


def get_pools_yields(pool_names: List[str], start_time: datetime, end_time: datetime) -> Iterable[Tuple[str, List[datetime], List[float]]]:
    """
    Given a list of pool names, return an iterable of tuples of pool name, a list of `create_at`
    timestamps, and a list of yields that have a 1-1 correspondence with the list of `created_at`,
    within the time range specified by `start_time` and `end_time`.
    """
    query = (
        db.session.query(
            ApySeriesData.pool_info_name,
            array_agg(aggregate_order_by(ApySeriesData.created_at, ApySeriesData.created_at)).label("created_at_list"),
            array_agg(aggregate_order_by(ApySeriesData.pool_yield, ApySeriesData.created_at)).label("pool_yield_list"),
        )
        .filter(
            db.and_(
                ApySeriesData.pool_info_name.in_(pool_names), ApySeriesData.created_at >= start_time, ApySeriesData.created_at <= end_time
            )
        )
        .group_by(ApySeriesData.pool_info_name)
    )
    rows = query.all()
    for row in rows:
        yield tuple(row._asdict().values())
