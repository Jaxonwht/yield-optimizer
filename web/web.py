"""Entry point for flask app."""
from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from utils.config import get_config

app = Flask(__name__)
config = get_config()
app.config["SQLALCHEMY_DATABASE_URI"] = config.postgres.uri
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = config.sqlalchemy.track_modifications

db = SQLAlchemy(app)
migrate = Migrate(app, db)


@app.route("/")
def hello_world():
    """Temporary entry point."""
    return "<p>Hello, World!</p>"
