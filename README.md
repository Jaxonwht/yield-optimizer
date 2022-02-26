# Yield Optimizer for Beefy

## Development
Some set up instructions for local development.

### Web Backend Setup
This project uses Python 3.9. Please create a virtual environment and upgrade your pip.
```bash
cd web
python3 -m venv .venv
source .venv/bin/activate
pip install -U pip wheel pip-tools
pip install -r dev-requirements.txt
pre-commit install
```

Note that the web backend uses the environment variable `CONFIG_ENV` to choose the config
yaml file. The default is `dev.yml` if the environment variable is unspecified, and the web
backend will use the [corresponding config file](config/dev.yml).

### Docker Setup
You can run `docker compose build && docker compose up` to spin up a development server.
- The web backend server is accessible at `localhost:5000`.
- The React web client will run at `localhost:3000`.
- The postgres server will run at `localhost:5432`.
