"""API routes that handle basic features."""
import statistics
from datetime import datetime
from typing import List

from application import app
from dal.pool_info_dal import (
    get_all_pool_infos,
    get_pool_yields,
    get_pools_yields,
    get_tokens_by_pool_name,
)
from dal.pool_list_dal import (
    create_or_append_pool_list,
    delete_pool_if_exists,
    delete_pool_list_if_exists,
    get_all_named_pool_lists,
    get_pool_list_info,
)
from dateutil.parser import parse
from flask import jsonify, request
from sampling.sampling import resample
from stats.yield_ratio_allocator import optimize_ratios
from utils.exceptions import APIInvalidRequestException


@app.route("/add-pool-list", methods=["PUT"])
def add_pool_list():
    """
    Add a list of your favorite pools to the `pool_list` database.

    The PUT request body should contain a list_name, and a list of strings
    in the parameter pool_list.
    """

    request_json = request.get_json()
    app.logger.info(request_json)
    if not request_json or "list_name" not in request_json:
        raise APIInvalidRequestException("Must supply a list name!")
    list_name = request_json["list_name"]
    pool_list: List[str] = request_json.get("pool_list", [])
    create_or_append_pool_list(list_name=list_name, pool_list=pool_list)
    return jsonify(success=True)


@app.route("/get-all-pool-list-names", methods=["GET"])
def get_all_pool_list_names():
    """
    Get the names of all the stored Pool Lists in the database
    """
    return jsonify(tuple(pool_list.list_name for pool_list in get_all_named_pool_lists()))


@app.route("/get-pools-by-list-name/<string:queried_list_name>", methods=["GET"])
def get_pools_by_list_name(queried_list_name: str):
    """
    Get the information of the pools in a named list. list_name should be a url argument.
    For exmaple, /get-pools-by-list-name/my_list.

    If the requested list name does not exist in the database. An empty list is returned.
    """
    return jsonify(tuple({"pool_name": info.pool_name, "tokens": info.tokens} for info in get_pool_list_info(queried_list_name)))


@app.route("/get-information-about-pool/<string:pool_name>", methods=["GET"])
def get_information_about_pool(pool_name: str):
    """
    Get the tokens that are stored corresponding to the argument pool. For example,
    a request can be like /get-tokens-by-pool-name/cometh-eth-usdc.
    At the same time, get the mean and standard deviation of the named pool yields
    over all time.

    If the requested Pool name does not exist in the database, an empty list is returned.
    If the requested Pool name does not have token information, an empty list is returned.
    """
    tokens = get_tokens_by_pool_name(pool_name) or []
    all_yields = tuple(data[1] for data in get_pool_yields(pool_name))
    return jsonify({"tokens": tokens, "mean_yield": statistics.mean(all_yields), "standard_deviation": statistics.stdev(all_yields)})


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


@app.route("/get-pool-yields-by-pool-names", methods=["GET"])
def get_pool_yields_by_pool_names():
    """
    Get a list of [`pool_name`, [`created_at`] sorted by `created_at`, [`pool_yield`] sorted by `created_at`].
    """
    pool_names = request.args.getlist("pool_names")
    if not pool_names:
        return jsonify()

    start_time = request.args.get("start_time")
    end_time = request.args.get("end_time")
    if not start_time:
        start_time = datetime.min
    else:
        start_time = parse(start_time)

    if not end_time:
        end_time = datetime.max
    else:
        end_time = parse(end_time)

    return jsonify(tuple(get_pools_yields(pool_names, start_time, end_time)))


@app.route("/get-optimized-allocation-by-pool-names", methods=["GET"])
@app.route("/get-optimized-allocation-by-pool-list-name", methods=["GET"])
def get_optimized_allocation_by_pool_names():
    """
    Given a list of pool names passed in as `pool_names`, a float `k`, and a resampling interval,
    returns a `OptimizerResult` object as a list. See `stats.yield_ratio_allocator.optimize_ratios`
    for more details on how to select `k`. See
    https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#dateoffset-objects
    for more details on how to select a resampling interval.

    Alternatively, a pool list name can be supplied in place of a list of pool names. In that case,
    the pools within the named pool list will be used.
    """
    pool_names = request.args.getlist("pool_names")
    pool_list_name = request.args.get("pool_list_name")
    if pool_names and pool_list_name:
        raise APIInvalidRequestException("Do not supply both pool_names and pool_list_name")
    if not pool_names and not pool_list_name:
        raise APIInvalidRequestException("Must supply a list of pool names or a pool list name!")
    if pool_list_name:
        pool_names = [pool_info.pool_name for pool_info in get_pool_list_info(pool_list_name)]

    k = request.args.get("k")
    if not k:
        raise APIInvalidRequestException("Must supply a k!")
    k = float(k)

    resampling_interval = request.args.get("resampling_interval")
    if not resampling_interval:
        raise APIInvalidRequestException("Must supply an interval for resampling!")

    start_time = request.args.get("start_time")
    end_time = request.args.get("end_time")
    if not start_time:
        start_time = datetime.min
    else:
        start_time = parse(start_time)

    if not end_time:
        end_time = datetime.max
    else:
        end_time = parse(end_time)

    resampled_iterable = resample(pools_yields=get_pools_yields(pool_names, start_time, end_time), resampling_interval=resampling_interval)
    result = optimize_ratios(stats=resampled_iterable, k=k)
    return jsonify(result._asdict())
