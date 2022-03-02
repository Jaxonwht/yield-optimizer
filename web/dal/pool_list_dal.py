from typing import List

from init import db
from models.user_data import PoolList


def add_pool_list_to_db(list_name: str, pool_list: List[str]):
    for pool_name in pool_list:
        db.session.add(PoolList(list_name=list_name, pool_name=pool_name))
    db.session.commit()
