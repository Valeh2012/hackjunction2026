FROM python:3.12-slim

# Logs reach `docker logs` unbuffered; the unprivileged user below cannot write .pyc files anyway.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /srv

# Installed before the code is copied, so a code change does not reinstall the packages.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

RUN useradd --uid 10001 --no-create-home --shell /usr/sbin/nologin api
USER api

EXPOSE 8000

# python:3.12-slim ships no curl, so the check uses the interpreter.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["python", "-c", "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/api/health', timeout=3)"]

# 0.0.0.0 so the published port reaches the server; inside a container 127.0.0.1 is not reachable from the host.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${BACKEND_PORT:-8000}"]
