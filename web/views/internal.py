"""API routes that are meant for developers."""
from application import app
from flask import jsonify, request
from models.series_data import ApySeriesData


@app.route("/raw-yields")
def get_raw_yields():
    """
    Get some random raw yields in the database.
    The number of returned records will be capped by `get_limit`, which defaults to 10.
    """
    get_limit = int(request.args.get("get_limit", "10"))
    return jsonify(
        tuple(
            row._asdict()
            for row in ApySeriesData.query.with_entities(ApySeriesData.pool_info_name, ApySeriesData.pool_yield).limit(get_limit).all()
        )
    )
