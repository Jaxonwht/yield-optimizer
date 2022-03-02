"""Entry point for flask app."""
import traceback

from flask import Flask, jsonify
from init import db, migrate
from utils.config import APPLICATION_CONFIG
from utils.exceptions import APIInvalidRequestException
from workers.store_beefy import start_beefy_apy_workers

app = Flask(__name__)

# Initialize config
config = APPLICATION_CONFIG
app.config["SQLALCHEMY_DATABASE_URI"] = config.postgres.uri
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = config.sqlalchemy.track_modifications

# Initialize db
db.init_app(app)

# Initialize migrate
migrate.init_app(app, db)


# Register api error handler
@app.errorhandler(APIInvalidRequestException)
def handle_invalid_request_exception(exception: APIInvalidRequestException):
    """Handle invalid requests"""

    traceback.print_exc()
    response = jsonify({"errorMessage": exception.message})
    response.status_code = exception.status_code
    return response


@app.errorhandler(Exception)
def handle_processing_exception(exception: Exception):
    """Handle exceptions thrown during processing of an api request."""

    traceback.print_exc()
    response = jsonify({"errorMessage": exception.message})
    response.status_code = 500
    return response


# Start apy getters and inserters
start_beefy_apy_workers(app)

import models  # noqa: F401, E402
import views  # noqa: F401, E402
