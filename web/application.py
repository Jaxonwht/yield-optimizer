"""Entry point for flask app."""
from flask import Flask
from init import db, migrate
from utils.config import get_config

app = Flask(__name__)

# Initialize config
config = get_config()
app.config["SQLALCHEMY_DATABASE_URI"] = config.postgres.uri
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = config.sqlalchemy.track_modifications

# Initialize db
db.init_app(app)

# Initialize migrate
migrate.init_app(app, db)

from models import series_data  # noqa: F401, E402
from views import entrypoint  # noqa: F401, E402
