FROM ghcr.io/mliezun/caddy-snake:latest-py3.12

WORKDIR /app

COPY . /app

RUN python -m venv venv &&\
    . venv/bin/activate &&\
    pip install -r requirements.txt

CMD ["caddy", "run", "--config", "/app/Caddyfile"]
