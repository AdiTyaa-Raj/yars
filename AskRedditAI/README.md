# AskRedditAI

A React + Vite frontend for querying Reddit context and generating grounded LLM answers from the backend API.

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create env file for backend endpoint:

   ```bash
   cp .env.example .env
   ```

3. Start the app:

   ```bash
   npm run dev
   ```

## Backend endpoint env

Use `VITE_API_BASE_URL` in `.env`:

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

If you want to use Vite proxy instead, set:

```bash
VITE_API_BASE_URL=/api/v1
```
