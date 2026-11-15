# Backend

FastAPI service that reports persuasion/propaganda techniques found in a text.

## Setup

```bash
cd backend
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
```

## Environment Variables

```env
API_BASE_URL=https://router.hostinger.com
API_KEY=your-api-key
BACKEND_PORT=8000  # optional, defaults to 8000
```

## Run

```bash
.venv/bin/uvicorn app.main:app --reload --port 8000
```

Interactive docs are served at http://127.0.0.1:8000/docs.

## Docker

```bash
docker build -t hackjunction-backend .
docker run --rm -p 8000:8000 -e API_BASE_URL=https://router.hostinger.com -e API_KEY=your-api-key hackjunction-backend
```

Run both from `backend/`. The API is then served at http://127.0.0.1:8000, the
same address as the `uvicorn` command above. The image holds only `app/` and the
packages in `requirements.txt`; tests and dev dependencies are left out.

## Test

```bash
.venv/bin/pytest
```

## Endpoints

| Method | Path              | Description                                             |
| ------ | ----------------- | ------------------------------------------------------- |
| GET    | `/api/health`     | Health check, returns `{"status": "ok"}`                |
| GET    | `/api/techniques` | List of technique classes (`id`, `name`, `description`) |
| POST   | `/api/analyze`    | Analyze the `text` field of the JSON body (required)    |
| POST   | `/api/analyze/stream` | Stream classification progress as SSE               |

`text` must be 1 to 10,000 characters long.

Example:

```bash
curl -X POST http://127.0.0.1:8000/api/analyze -H "Content-Type: application/json" -d '{"text": "This outrageous plan was written by crooks."}'
```

In each span, `start` is inclusive and `end` is exclusive (`text[start:end]`).
`band` is `detected` when `probability >= 0.7`, otherwise `possible`.

## AI Models

- **Span Detection**: gemma-4-31b identifies propaganda passages
- **Technique Classification**: jev-latest classifies each passage
