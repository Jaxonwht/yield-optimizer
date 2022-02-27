"""Entrypoint routes."""
from application import app


@app.route("/")
def hello_world():
    """Temporary entrypoint."""
    return "<p>Hello World!</p>"
