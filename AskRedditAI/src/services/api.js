const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api/v1").replace(/\/$/, "");

export async function fetchRedditAnswer({ query, subreddit, limit }) {
  const params = new URLSearchParams({
    query: query.trim(),
    subreddit: subreddit.trim(),
    limit: String(limit),
  });

  const response = await fetch(`${API_BASE_URL}/search/answer?${params.toString()}`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorDetail = payload?.detail || "Unable to fetch answer right now.";
    throw new Error(errorDetail);
  }

  return payload;
}
