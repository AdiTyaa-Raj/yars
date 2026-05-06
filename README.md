# AskRedditAI

AskRedditAI is a full-stack app that fetches Reddit context and uses an LLM to generate grounded answers.

- Backend: FastAPI (`src/`) for Reddit retrieval + LLM answer generation.
- Frontend: React + Vite + MUI (`AskRedditAI/`) with landing and chat pages.

## Project Structure

- `src/` FastAPI backend
- `AskRedditAI/` Vite React frontend

## Backend Setup (FastAPI)

1. Install dependencies (from repo root):

```bash
uv sync --project src
```

2. Configure backend env in root `.env`:

```bash
GROK_API_KEY=your_groq_api_key
# Optional
GROK_MODEL=llama-3.3-70b-versatile
# Optional: comma-separated frontend origins
CORS_ALLOW_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

3. Run backend:

```bash
uv run --project src uvicorn main:app --app-dir src --host 0.0.0.0 --port 8005 --reload
```

Backend base URL: `http://localhost:8005`

## Frontend Setup (React + Vite)

1. Go to frontend directory:

```bash
cd AskRedditAI
```

2. Install dependencies:

```bash
npm install
```

3. Create env file:

```bash
cp .env.example .env
```

4. Set API endpoint in `AskRedditAI/.env`:

```bash
VITE_API_BASE_URL=http://localhost:8005/api/v1
```

5. Start frontend:

```bash
npm run dev
```

Frontend URL: `http://localhost:5173`

## API Endpoints

- `GET /health`
- `GET /api/v1/search?query=...&subreddit=...&limit=5`
- `GET /api/v1/search/answer?query=...&subreddit=...&limit=5`

### Example

```bash
curl "http://localhost:8005/api/v1/search/answer?query=how%20to%20learn%20algotrading&subreddit=algotrading&limit=5"
```

## Notes

- If you call backend directly from frontend (`localhost:5173` -> `localhost:8005`), CORS must allow the frontend origin.
- The backend already supports CORS origins via `CORS_ALLOW_ORIGINS`.
