# Yield Optimizer for Beefy

## Development

Some set up instructions for local development.

### Logging (Web Backend)

In web backend, print statements will not appear in the console. Instead, you can import the `app` instance,
and use `app.logger.info()` or `app.logger.error()` etc.

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
backend will use the [corresponding config file](web/config/dev.yml). All the configs will be merged
into [web/config/base.yml](web/config/base.yml) recursively to produce the final config.

### Docker Setup

You can run `docker compose build && docker compose up` to spin up a development server.

- The web backend server is accessible at `localhost:5000`.
- The React web client will run at `localhost:3001`.
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
# First make sure you start the Postgres server.
docker compose up db

# You can ssh into the web_backend server and run commands from within.
docker compose run web_backend /bin/bash
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

In most circumstances, this repository already has alemibc initialized, so you most likely do not
need to run `flask db init`. If you just cloned the repository and need to have the latest database
tables, you do not need to run any migration either. You can simply invoke the `flask db upgrade` command.

Always double-check the auto-generated migration file before commiting to the upgrade.



### Okteto cluster deployment
1. `curl https://get.okteto.com -sSfL | sh` to install the Okteto CLI.
2. `okteto context use https://cloud.okteto.com -n <namespace> -t <token>` to configure CLI.
3. `okteto build . -f Dockerfile.web -t okteto.dev/yield-optimizer-web:latest` to build and push image to Okteto registry.
4. `okteto build . -f Dockerfile.client -t okteto.dev/yield-optimizer-client:latest` to build and push image to Okteto registry.
5. `kubectl config set-context --current --namespace <namespace>` after uploading kubernetes config file to `~/.kube/config`.
8. `kubectl apply -f k8s/`
9. `kubectl delete -f k8s/`

### How to deploy and use secret?
1. `kubectl create secret generic <secret-name> --from-literal='<key>=<secret>'`.
2. 
```
apiVersion: v1
kind: Pod
metadata:
  name: <pod-name>
spec:
  containers:
    - name: <container-name>
      image: nginx
      volumeMounts:
        # name must match the volume name below
        - name: <secret-volume>
          mountPath: <mount-path>
  # The secret data is exposed to Containers in the Pod through a Volume.
  volumes:
    - name: <secret-volume>
      secret:
        secretName: <secret-name>
```
