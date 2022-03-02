"""API routes that handle basic features."""
from typing import List

from application import app
from dal.pool_list_dal import add_pool_list_to_db
from flask import jsonify, request
from utils.exceptions import APIInvalidRequestException


@app.route("/add-pool-list", methods=["POST"])
def add_pool_list():
    """
    Add a list of your favorite pools to the `pool_list` database.
    """

    if "list_name" not in request.args:
        raise APIInvalidRequestException("Must supply a list name!")
    list_name = request.args["pool_list"]
    pool_list: List[str] = request.args.get("pool_list", [])
    add_pool_list_to_db(list_name=list_name, pool_list=pool_list)
    return jsonify(success=True)
