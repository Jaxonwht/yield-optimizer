"""DAL for manipulating pool infos."""
from typing import List

from init import db
from models.series_data import PoolInfo


def get_all_pool_infos() -> List[PoolInfo]:
    """
    Return all the PoolInfo stored so far in the database.
    """
    return db.session.query(PoolInfo).all()
