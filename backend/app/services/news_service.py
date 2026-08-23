import httpx
import xml.etree.ElementTree as ET
from urllib.parse import quote
import time


# Cache
_cached_news = []
_last_fetch_time = 0

CACHE_SECONDS = 300


def fetch_google_news(query: str, max_records: int = 20):

    encoded_query = quote(query)

    url = (
        "https://news.google.com/rss/search"
        f"?q={encoded_query}"
        "&hl=en-US"
        "&gl=US"
        "&ceid=US:en"
    )

    try:

        response = httpx.get(
            url,
            timeout=20,
            follow_redirects=True
        )

        response.raise_for_status()

        root = ET.fromstring(response.text)

        articles = []

        for item in root.findall(".//item")[:max_records]:

            title = item.findtext("title", "")

            link = item.findtext("link", "")

            pub_date = item.findtext(
                "pubDate",
                ""
            )

            source = item.findtext(
                "source",
                ""
            )

            description = item.findtext(
                "description",
                ""
            )

            articles.append({
                "title": title,
                "url": link,
                "seendate": pub_date,
                "domain": source,
                "description": description,
            })

        return articles

    except Exception as e:

        print("Google News error:", e)

        return []


def fetch_global_news(max_records: int = 50):

    global _cached_news
    global _last_fetch_time

    now = time.time()
    if (
        _cached_news
        and now - _last_fetch_time < CACHE_SECONDS
    ):
        print("Using cached news")
        return _cached_news[:max_records]

    queries = [
    "geopolitics news",
    "international conflict latest",
    "military tensions latest",
    "new sanctions",
    "diplomatic crisis latest",
    "trade restrictions latest",
    "oil supply disruption",
    "shipping disruption",
]

    all_articles = []

    for query in queries:

        articles = fetch_google_news(
            query,
            max_records=10
        )

        all_articles.extend(articles)

    # Remove duplicate URLs
    unique = {}

    for article in all_articles:

        url = article.get("url")

        if url:
            unique[url] = article

    _cached_news = list(unique.values())

    _last_fetch_time = now

    print(
        f"Fetched {len(_cached_news)} global news articles."
    )

    return _cached_news[:max_records]