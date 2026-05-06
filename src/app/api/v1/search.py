from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.services import (
    answer_query_from_reddit_context,
    answer_query_from_subreddit_context,
    answer_query_from_subreddits_context,
    search_subreddit_posts,
)

router = APIRouter(prefix="/search")


@router.get("", tags=["search"])
def search(
    query: str = Query(..., min_length=1),
    subreddit: str = Query(..., min_length=1),
    limit: int = Query(5, ge=1),
) -> list[dict]:
    return search_subreddit_posts(query=query, subreddit=subreddit, limit=limit)


@router.get("/answer", tags=["search"])
def answer_search_query(
    query: str = Query(..., min_length=1),
    subreddit: Optional[str] = Query(None, min_length=1),
    subreddits: Optional[list[str]] = Query(None),
    limit: int = Query(5, ge=1),
) -> dict:
    try:
        normalized_subreddits = _normalize_subreddits(subreddit=subreddit, subreddits=subreddits)
        if not normalized_subreddits:
            return answer_query_from_reddit_context(query=query, limit=limit)
        if len(normalized_subreddits) == 1:
            return answer_query_from_subreddit_context(query=query, subreddit=normalized_subreddits[0], limit=limit)
        return answer_query_from_subreddits_context(query=query, subreddits=normalized_subreddits, limit=limit)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


def _normalize_subreddits(subreddit: Optional[str], subreddits: Optional[list[str]]) -> list[str]:
    merged_subreddits: list[str] = []
    if subreddit:
        merged_subreddits.append(subreddit)

    if subreddits:
        for value in subreddits:
            if not value:
                continue
            merged_subreddits.extend(part.strip() for part in value.split(",") if part.strip())

    unique_subreddits: list[str] = []
    seen: set[str] = set()
    for value in merged_subreddits:
        lowered = value.lower()
        if lowered in seen:
            continue
        seen.add(lowered)
        unique_subreddits.append(value)

    return unique_subreddits
