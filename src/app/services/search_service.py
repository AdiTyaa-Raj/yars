from urllib.parse import urlparse

from yars.yars import YARS

REMOVED_BODY = "[removed]"
DELETED_AUTHOR = "[deleted]"


def search_subreddit_posts(query: str, subreddit: str, limit: int = 5) -> list[dict]:
    client = YARS()
    posts = client.search_subreddit(subreddit=subreddit, query=query, limit=limit)
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


def _comment_score(comment: dict) -> int:
    score = comment.get("score", 0)
    return score if isinstance(score, int) else 0


def _should_discard_post(post: dict) -> bool:
    return post.get("description", "") == REMOVED_BODY or post.get("author", "") == DELETED_AUTHOR


def _should_discard_comment(comment: dict) -> bool:
    return comment.get("body", "") == REMOVED_BODY or comment.get("author", "") == DELETED_AUTHOR
