from fastapi import APIRouter, Query

from app.services import search_subreddit_posts

router = APIRouter(prefix="/search")


@router.get("", tags=["search"])
def search(
    query: str = Query(..., min_length=1),
    subreddit: str = Query(..., min_length=1),
    limit: int = Query(5, ge=1),
) -> list[dict]:
    return search_subreddit_posts(query=query, subreddit=subreddit, limit=limit)
