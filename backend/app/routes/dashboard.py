from fastapi import APIRouter

import json

from app.services.news_service import fetch_global_news
from app.services.event_processor import process_articles
from app.services.risk_engine import (
    update_country_risks,
    update_route_risks,
)


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


def load_world():

    with open(
        "app/data/world.json",
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)


@router.get("/")
def get_dashboard():

    world = load_world()

    # Fetch latest news
    articles = fetch_global_news(
        max_records=50
    )

    # Convert news → geopolitical events
    live_events = process_articles(
        articles
    )

    # Update risk model
    countries = update_country_risks(
        world["countries"],
        live_events
    )

    routes = update_route_risks(
        world["routes"],
        live_events
    )

    return {
        "countries": countries,
        "ports": world["ports"],
        "suppliers": world["suppliers"],
        "routes": routes,
        "events": live_events,
    }