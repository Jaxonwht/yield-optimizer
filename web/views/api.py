"""API routes that handle basic features."""
from typing import List

from application import app
from dal.pool_info_dal import get_all_pool_infos
from dal.pool_list_dal import (
    create_or_append_pool_list,
    delete_pool_if_exists,
    delete_pool_list_if_exists,
    get_pool_list_info,
)
from flask import jsonify, request
from utils.exceptions import APIInvalidRequestException


@app.route("/add-pool-list", methods=["PUT"])
def add_pool_list():
    """
    Add a list of your favorite pools to the `pool_list` database.

    The PUT request body should contain a list_name, and a list of strings
    in the parameter pool_list.
    """

    request_json = request.get_json()
    if not request_json or "list_name" not in request_json:
        raise APIInvalidRequestException("Must supply a list name!")
    list_name = request_json["list_name"]
    pool_list: List[str] = request_json.get("pool_list", [])
    create_or_append_pool_list(list_name=list_name, pool_list=pool_list)
    return jsonify(success=True)


@app.route("/get-pools-by-list-name/<string:queried_list_name>", methods=["GET"])
def get_pools_by_list_name(queried_list_name: str):
    """
    Get the information of the pools in a named list. list_name should be a url argument.
    For exmaple, /get-pools-by-list-name/my_list.

    If the requested list name does not exist in the database. An empty list is returned.
    """
    return jsonify(tuple({"pool_name": info.pool_name, "tokens": info.tokens} for info in get_pool_list_info(queried_list_name)))


@app.route("/delete-pool-list-by-name/<string:list_name_to_delete>", methods=["DELETE"])
def delete_pool_list_by_name(list_name_to_delete: str):
    """
    Delete a named list from database.
    """
    delete_pool_list_if_exists(list_name_to_delete)
    return jsonify(success=True)


@app.route("/delete-pool-by-name/<string:pool_name_to_delete>", methods=["DELETE"])
def delete_pool_by_name(pool_name_to_delete: str):
    """
    Delete a pool from the databases.
    """
    delete_pool_if_exists(pool_name_to_delete)
    return jsonify(success=True)


@app.route("/get-all-pools", methods=["GET"])
def get_all_pools():
    """
    Get the names of all the pools stored in db.
    """
    pool_infos = get_all_pool_infos()
    return jsonify(tuple(pool_info.pool_name for pool_info in pool_infos))
