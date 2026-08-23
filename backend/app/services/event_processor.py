import hashlib
import re
from datetime import datetime, timezone


COUNTRY_KEYWORDS = {
    "IN": ["India", "Indian", "New Delhi"],
    "SA": ["Saudi Arabia", "Saudi", "Riyadh"],
    "AE": ["United Arab Emirates", "UAE", "Emirates", "Abu Dhabi"],
    "IR": ["Iran", "Iranian", "Tehran"],
    "IQ": ["Iraq", "Iraqi", "Baghdad"],
    "US": ["United States", "USA", "U.S.", "American", "Washington"],
    "CN": ["China", "Chinese", "Beijing"],
    "RU": ["Russia", "Russian", "Moscow"],
    "SG": ["Singapore"],
    "DE": ["Germany", "German", "Berlin"],
    "TR": ["Turkey", "Türkiye", "Turkish", "Ankara"],
    "NL": ["Netherlands", "Dutch", "Amsterdam"],
}


EVENT_KEYWORDS = {
    "Conflict": [
        "war",
        "attack",
        "airstrike",
        "missile",
        "battle",
        "fighting",
        "invasion",
        "bombing",
    ],

    "Military": [
        "military",
        "troops",
        "navy",
        "naval",
        "weapon",
        "weapons",
        "drill",
        "exercise",
        "defense",
    ],

    "Sanctions": [
        "sanction",
        "sanctions",
        "embargo",
        "export ban",
        "blacklist",
        "trade restriction",
    ],

    "Diplomacy": [
        "summit",
        "talks",
        "negotiations",
        "agreement",
        "diplomatic",
        "ceasefire",
        "treaty",
    ],

    "Trade": [
        "tariff",
        "trade",
        "export",
        "import",
        "shipping",
        "supply chain",
        "manufacturing",
    ],

    "Energy": [
        "oil",
        "gas",
        "energy",
        "pipeline",
        "refinery",
        "petroleum",
        "fuel",
    ],

    "Security": [
        "terrorism",
        "security",
        "threat",
        "border",
        "escalation",
    ],
}


HIGH_RISK_WORDS = [
    "war",
    "attack",
    "airstrike",
    "missile",
    "invasion",
    "killed",
    "bombing",
    "escalation",
]


def contains_keyword(text: str, keyword: str) -> bool:
    """
    Match whole words instead of arbitrary substrings.

    This prevents things like:
    UAE matching inside unrelated words.
    """

    pattern = r"\b" + re.escape(keyword.lower()) + r"\b"

    return re.search(
        pattern,
        text.lower()
    ) is not None


def detect_countries(text: str):

    found = []

    for country_id, keywords in COUNTRY_KEYWORDS.items():

        for keyword in keywords:

            if contains_keyword(text, keyword):

                found.append(country_id)

                break

    return found


def detect_event_type(text: str):

    best_type = "General"
    best_score = 0

    for event_type, keywords in EVENT_KEYWORDS.items():

        score = 0

        for keyword in keywords:

            if contains_keyword(text, keyword):
                score += 1

        if score > best_score:

            best_score = score
            best_type = event_type

    return best_type


def detect_severity(text: str):

    high_count = 0

    for keyword in HIGH_RISK_WORDS:

        if contains_keyword(text, keyword):
            high_count += 1

    if high_count >= 2:
        return "Critical"

    if high_count == 1:
        return "High"

    return "Moderate"


def create_event(article):

    title = article.get("title", "")

    description = article.get(
        "description",
        ""
    )

    url = article.get("url", "")

    source = article.get(
        "domain",
        ""
    )

    # Use title + description
    text = f"{title} {description}"

    countries = detect_countries(text)

    # Ignore unrelated articles
    if not countries:
        return None

    event_type = detect_event_type(text)

    severity = detect_severity(text)

    event_id = hashlib.md5(
        (title + url).encode()
    ).hexdigest()[:10]

    timestamp = article.get(
        "seendate",
        datetime.now(timezone.utc).isoformat()
    )

    return {
        "id": f"LIVE-{event_id}",
        "title": title,
        "severity": severity,
        "type": event_type,
        "countries": countries,
        "timestamp": timestamp,
        "source": source,
        "url": url,
    }


def process_articles(articles):

    events = []

    for article in articles:

        event = create_event(article)

        if event:
            events.append(event)

    return events