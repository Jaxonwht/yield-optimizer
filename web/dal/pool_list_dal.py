"""DAL for manipulating named list of pools."""
from typing import List

from init import db
from models.series_data import PoolInfo
from models.user_data import NamedPoolList


def create_or_append_pool_list(list_name: str, pool_list: List[str]) -> None:
    """
    Add a List of pools to a named list. If the list name already exists,
    do not create a new list.
    """
    named_pool_list = db.session.get(NamedPoolList, list_name)
    if not named_pool_list:
        named_pool_list = NamedPoolList(list_name=list_name)
    for pool_name in pool_list:
        pool_info = db.session.get(PoolInfo, pool_name)
        if not pool_info:
            raise Exception(f"Entered pool name {pool_name} does not exist")
        named_pool_list.pool_infos.append(pool_info)
    db.session.add(named_pool_list)
    db.session.commit()


def get_pool_list_info(list_name: str) -> List[PoolInfo]:
    """
    Given a list name, output the associated list of pools. If the list name does not
    exist in the database, an empty list is returned.
    """
    named_pool_list = db.session.get(NamedPoolList, list_name)
    if not named_pool_list:
        return []
    return named_pool_list.pool_infos


def get_all_named_pool_lists() -> List[NamedPoolList]:
    """
    Get all the stored named Pool lists.
    """
    return NamedPoolList.query.all()


def delete_pool_list_if_exists(list_name: str) -> None:
    """
    Delete a named list if the list exists. Do not delete the associated pools.
    """
    list_to_delete = db.session.get(NamedPoolList, list_name)
    if list_to_delete:
        db.session.delete(list_to_delete)
        db.session.commit()


def delete_pool_if_exists(pool_name: str) -> None:
    """
    Delete a named pool from `pool_info`, `api_series_data`, and all lists containing this pool.
    """
    pool_info_to_delete = db.session.get(PoolInfo, pool_name)
    if pool_info_to_delete:
        db.session.delete(pool_info_to_delete)
        db.session.commit()
