# Yield Optimizer for Beefy

## Development
Some set up instructions for local development.

### Python Setup
This project uses Python 3.9. Please create a virtual environment and upgrade your pip.
```bash
python -m venv .venv
source .venv/bin/activate
pip install -U pip wheel pip-tools
pip install -r dev-requirements.txt
pre-commit install
```

### Docker Setup
You can run `docker compose build && docker compose up` to spin up a development server.
The web backend server is accessible at `localhost:5000`.
