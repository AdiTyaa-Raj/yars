import json
import os
from pathlib import Path
from urllib.parse import urlparse

from openai import OpenAI

from yars.yars import YARS

REMOVED_BODY = "[removed]"
DELETED_AUTHOR = "[deleted]"
GROQ_BASE_URL = "https://api.groq.com/openai/v1"
DEFAULT_GROK_MODEL = "llama-3.3-70b-versatile"
ANSWER_SYSTEM_PROMPT = (
    "You are a retrieval-grounded assistant for Reddit analysis. "
    "Use only the provided context to answer the user query. "
    "Do not invent facts, links, users, or quotes. "
    "If context is missing or conflicting, say that clearly. "
    "Cite evidence inline with source indexes like [1], [2] that map to the provided context list. "
    "Keep the answer concise, factual, and actionable."
)


def search_subreddit_posts(query: str, subreddit: str, limit: int = 5) -> list[dict]:
    client = YARS()
    posts = client.search_subreddit(subreddit=subreddit, query=query, limit=limit, sort="top")
    return _hydrate_posts_with_top_comments(client=client, posts=posts)


def search_reddit_posts(query: str, limit: int = 5) -> list[dict]:
    client = YARS()
    posts = client.search_reddit(query=query, limit=limit)
    return _hydrate_posts_with_top_comments(client=client, posts=posts)


def _hydrate_posts_with_top_comments(client: YARS, posts: list[dict]) -> list[dict]:
    filtered_posts: list[dict] = []

    for post in posts:
        if _should_discard_post(post):
            continue

        permalink = urlparse(post.get("link", "")).path
        if not permalink:
            post["top_comments"] = []
            post.pop("author", None)
            filtered_posts.append(post)
            continue

        post_details = client.scrape_post_details(permalink)
        comments = post_details.get("comments", []) if post_details else []
        filtered_comments = [comment for comment in comments if not _should_discard_comment(comment)]
        sorted_comments = sorted(filtered_comments, key=_comment_score, reverse=True)
        post["top_comments"] = [
            {
                "author": comment.get("author", ""),
                "body": comment.get("body", ""),
                "score": comment.get("score", 0),
            }
            for comment in sorted_comments[:10]
        ]
        post.pop("author", None)
        filtered_posts.append(post)

    return filtered_posts


def answer_query_from_subreddit_context(query: str, subreddit: str, limit: int = 5) -> dict:
    context_posts = _with_subreddit_label(
        posts=search_subreddit_posts(query=query, subreddit=subreddit, limit=limit),
        subreddit=subreddit,
    )
    context_text = _build_context_text(context_posts)
    answer = _generate_answer_with_llm(query=query, context=context_text)

    return {
        "query": query,
        "subreddit": subreddit,
        "subreddits": [subreddit],
        "answer": answer,
        "context": context_posts,
        "context_by_subreddit": {subreddit: context_posts},
    }


def answer_query_from_subreddits_context(query: str, subreddits: list[str], limit: int = 5) -> dict:
    context_by_subreddit: dict[str, list[dict]] = {}
    merged_context: list[dict] = []

    for subreddit in subreddits:
        subreddit_posts = _with_subreddit_label(
            posts=search_subreddit_posts(query=query, subreddit=subreddit, limit=limit),
            subreddit=subreddit,
        )
        context_by_subreddit[subreddit] = subreddit_posts
        merged_context.extend(subreddit_posts)

    context_text = _build_context_text(merged_context)
    answer = _generate_answer_with_llm(query=query, context=context_text)

    response: dict = {
        "query": query,
        "subreddits": subreddits,
        "answer": answer,
        "context": merged_context,
        "context_by_subreddit": context_by_subreddit,
    }
    if len(subreddits) == 1:
        response["subreddit"] = subreddits[0]
    return response


def answer_query_from_reddit_context(query: str, limit: int = 5) -> dict:
    context_posts = search_reddit_posts(query=query, limit=limit)
    context_text = _build_context_text(context_posts)
    answer = _generate_answer_with_llm(query=query, context=context_text)

    return {
        "query": query,
        "subreddits": [],
        "answer": answer,
        "context": context_posts,
        "context_by_subreddit": {},
    }


def _comment_score(comment: dict) -> int:
    score = comment.get("score", 0)
    return score if isinstance(score, int) else 0


def _should_discard_post(post: dict) -> bool:
    return post.get("description", "") == REMOVED_BODY or post.get("author", "") == DELETED_AUTHOR


def _should_discard_comment(comment: dict) -> bool:
    return comment.get("body", "") == REMOVED_BODY or comment.get("author", "") == DELETED_AUTHOR


def _build_context_text(posts: list[dict]) -> str:
    context_items: list[dict] = []
    for index, post in enumerate(posts, start=1):
        context_items.append(
            {
                "index": index,
                "subreddit": post.get("subreddit", ""),
                "title": post.get("title", ""),
                "link": post.get("link", ""),
                "description": post.get("description", ""),
                "top_comments": post.get("top_comments", []),
            }
        )
    return json.dumps(context_items, ensure_ascii=True)


def _with_subreddit_label(posts: list[dict], subreddit: str) -> list[dict]:
    return [{**post, "subreddit": subreddit} for post in posts]


def _generate_answer_with_llm(query: str, context: str) -> str:
    api_key = os.getenv("GROK_API_KEY", "").strip() or _read_env_file_value("GROK_API_KEY")
    if not api_key:
        raise RuntimeError("GROK_API_KEY environment variable is not set")

    model = os.getenv("GROK_MODEL", "").strip() or _read_env_file_value("GROK_MODEL") or DEFAULT_GROK_MODEL
    client = OpenAI(base_url=GROQ_BASE_URL, api_key=api_key)

    user_prompt = (
        "Answer the query using only this context.\n\n"
        f"Query:\n{query}\n\n"
        f"Context JSON:\n{context}"
    )
    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": ANSWER_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
        )
    except Exception as exc:  # pragma: no cover - third-party SDK/network failures
        raise RuntimeError(f"Grok API request failed: {exc}") from exc

    answer_text = (completion.choices[0].message.content or "").strip()
    if not answer_text:
        raise RuntimeError("Grok API returned an empty answer.")
    return answer_text


def _read_env_file_value(key: str) -> str:
    candidate_files = [Path.cwd() / ".env", Path(__file__).resolve().parents[3] / ".env"]
    for env_file in candidate_files:
        if not env_file.exists():
            continue
        try:
            for line in env_file.read_text(encoding="utf-8").splitlines():
                stripped = line.strip()
                if not stripped or stripped.startswith("#"):
                    continue
                if stripped.startswith("export "):
                    stripped = stripped[len("export ") :].strip()
                if "=" not in stripped:
                    continue
                env_key, env_value = stripped.split("=", 1)
                if env_key.strip() != key:
                    continue
                return env_value.strip().strip("'").strip('"')
        except OSError:
            continue
    return ""
