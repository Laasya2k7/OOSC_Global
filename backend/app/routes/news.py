from fastapi import APIRouter

from app.services.news_service import fetch_global_news
from app.services.event_processor import process_articles


router = APIRouter(
    prefix="/news",
    tags=["News"]
)


@router.get("/")
def get_news():

    articles = fetch_global_news(
        max_records=50
    )

    return {
        "count": len(articles),
        "articles": articles
    }


@router.get("/events")
def get_live_events():

    articles = fetch_global_news(
        max_records=50
    )

    events = process_articles(
        articles
    )

    return {
        "count": len(events),
        "events": events
    }