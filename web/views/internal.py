"""API routes that are meant for developers."""
from application import app
from flask import jsonify
from models.series_data import ApySeriesData


@app.route("/raw-yields")
def get_raw_yields():
    """Get all the raw yields in the database."""
    return jsonify(ApySeriesData.query.all())
