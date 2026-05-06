from fastapi import APIRouter, HTTPException, Query

from app.services import answer_query_from_subreddit_context, search_subreddit_posts

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
    subreddit: str = Query(..., min_length=1),
    limit: int = Query(5, ge=1),
) -> dict:
    try:
        return answer_query_from_subreddit_context(query=query, subreddit=subreddit, limit=limit)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
