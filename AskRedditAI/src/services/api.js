const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api/v1").replace(/\/$/, "");

export async function fetchRedditAnswer({ query, subreddits, limit }) {
  const params = new URLSearchParams();
  params.set("query", query.trim());
  params.set("limit", String(limit));

  for (const subreddit of subreddits) {
    const normalized = subreddit.trim();
    if (normalized) {
      params.append("subreddits", normalized);
    }
  }

  const response = await fetch(`${API_BASE_URL}/search/answer?${params.toString()}`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorDetail = payload?.detail || "Unable to fetch answer right now.";
    throw new Error(errorDetail);
  }

  return payload;
}
