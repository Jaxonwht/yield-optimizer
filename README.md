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
backend will use the [corresponding config file](config/dev.yml). All the configs will be merged
into [config/base.yml](config/base.yml) recursively to produce the final config.

### Docker Setup

You can run `docker compose build && docker compose up` to spin up a development server.

- The web backend server is accessible at `localhost:5000`.
- The React web client will run at `localhost:3000`.
- The postgres server will run at `localhost:5432`.

During development, the code to run both React and Flask will be mounted into the docker container
using volumes. This means changes in code are synced between the hosts and the dockers, while
Docker images are kept at a reasonable size. However in deployment, separate Dockerfiles should be created
that actually add the code into the images themselves via `COPY` or `ADD`.

### Database Migration

In development context, the Postgres server is running as a docker image. We use [Flask-Migrate](https://flask-migrate.readthedocs.io/en/latest/)
to do automatic database migrations through SQLAlchemy. Normally you do not have to carry out migration
unless you define a new SQLAlchemy model or modify an existing one. You cannot run `flask db <command>` directly
because the web backend runs in a Docker container. There are three ways to run those commands.

```bash
# First make sure you start the web server and the Postgres server.
docker compose up web_backend db

# You can ssh into the web_backend server and run commands from within.
docker compose exec web_backend /bin/bash
flask db init
flask db migrate -m "Some migration"
flask db upgrade

# You can also run these commands from the host directly.
docker compose run web_backend flask db init
docker compose run web_backend flask db migrate -m "Some migration"
docker compose run web_backend flask db upgrade

# It's possible to run these commands from host because of port mapping.
# Make sure your `FLASK_APP` is set to `application`.
export FLASK_APP="application"
# Then you can run the commands from your host.
flask db init
flask db migrate -m "Some migration"
flask db upgrade
```

Always double-check the auto-generated migration file before commiting to the upgrade.
