"""Entry point for flask app."""
from flask import Flask
from init import db, migrate
from utils.config import APPLICATION_CONFIG
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

# Start apy getters and inserters
start_beefy_apy_workers(app)

import models  # noqa: F401, E402
import views  # noqa: F401, E402
