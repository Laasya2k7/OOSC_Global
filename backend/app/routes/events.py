from fastapi import APIRouter

from app.services.news_service import fetch_global_news
from app.services.event_processor import process_articles


router = APIRouter(
    prefix="/events",
    tags=["Events"]
)


@router.get("/")
def get_events():

    articles = fetch_global_news(
        max_records=50
    )

    live_events = process_articles(
        articles
    )

    return {
        "events": live_events
    }