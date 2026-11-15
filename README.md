# Propaganda Technique Highlighter

A web application that analyzes text for propaganda techniques using AI-powered span detection and classification.

## Architecture

- **Frontend**: React Router SSR app (Node.js/Express)
- **Backend**: FastAPI service (Python)
- **AI Models**: gemma-4-31b for span detection, jev-latest for technique classification

## Project Structure

```
├── backend/          # FastAPI service
│   ├── app/
│   │   ├── main.py          # API endpoints
│   │   ├── detector.py      # Detection logic
│   │   ├── config.py        # Configuration
│   │   └── schemas.py       # Response models
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/         # React Router SSR app
│   ├── apps/web/
│   │   ├── src/
│   │   └── server.ts
│   └── .env.example
└── README.md
```

## Local Development

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Set environment variables
export API_BASE_URL="https://router.hostinger.com"
export API_KEY="your-api-key"

uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install

# Set environment variables
export BACKEND_API_URL="http://127.0.0.1:8000"

npm run dev
```

## Production Deployment

### Environment Variables

**Frontend** (required):
```env
BACKEND_API_URL=https://api.yourdomain.com
```

**Backend** (required):
```env
API_BASE_URL=https://router.hostinger.com
API_KEY=your-actual-api-key
BACKEND_PORT=8000  # optional, defaults to 8000
```

### Deploy Backend (Docker)

```bash
cd backend
docker build -t hackjunction-backend .
docker run -d \
  -p 8000:8000 \
  -e API_BASE_URL=https://router.hostinger.com \
  -e API_KEY=your-actual-api-key \
  hackjunction-backend
```

### Deploy Frontend

The frontend is a Node.js SSR app. Deploy to:
- **Vercel**: Supports React Router SSR natively
- **Railway/Render**: Easy Node.js deployment
- **VPS**: Run with PM2

```bash
cd frontend
npm install
npm run build
PORT=3000 BACKEND_API_URL=https://api.yourdomain.com npm start
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/techniques` - List propaganda techniques
- `POST /api/analyze` - Analyze text (non-streaming)
- `POST /api/analyze/stream` - Analyze text (SSE streaming)

## Features

- Real-time streaming analysis with SSE
- Sequential left-to-right highlight animations
- Auto-scrolling to highlighted spans
- 14 propaganda technique classifications
- Character limit: 10,000
