from __future__ import annotations

from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .core import calculate_risk, load_demo, risk_band
from .simulation import simulate
from .services.news_service import fetch_global_news
from .services.event_processor import process_articles
from .services.risk_engine import (
    calculate_live_country_risks,
    update_route_risks,
    generate_live_routes
)
from .services.copilot_service import ask_copilot

app = FastAPI(title="GeoShield API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

data = load_demo()


def get_live_data():
    articles = fetch_global_news(50)
    events = process_articles(articles)

    countries_data = calculate_live_country_risks(
        data["countries"],
        events
    )

    routes_data = generate_live_routes(
        data["routes"],
        events
    )

    routes_data = update_route_risks(
        routes_data,
        events
    )

    return countries_data, routes_data, events

class ScenarioRequest(BaseModel):
    scenario: str = Field(
        pattern="^(hormuz_closure|port_shutdown|supplier_sanctions|route_disruption|risk_surge|red_sea_disruption|supplier_failure|cyberattack|extreme_weather|demand_surge)$"
    )
    duration_days: int = Field(default=14, ge=1, le=365)
    severity: int = Field(default=75, ge=1, le=100)
    
class CopilotRequest(BaseModel):
    message: str


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "mode": "live",
        "message": "Live global geopolitical news feed active."
    }


@app.get("/api/countries")
def countries():
    countries_data, _, _ = get_live_data()

    return [
        {
            **c,
            "score": calculate_risk(c),
            "band": risk_band(calculate_risk(c))
        }
        for c in countries_data
    ]


@app.get("/api/countries/{country_id}")
def country(country_id: str):
    return next(
        (
            c
            for c in countries()
            if c["id"] == country_id.upper()
        ),
        {"error": "Country not found"}
    )


@app.get("/api/risk/global")
def global_risk():
    countries_data, _, _ = get_live_data()

    score = round(
        sum(calculate_risk(c) for c in countries_data)
        / len(countries_data),
        1
    )

    return {
        "score": score,
        "band": risk_band(score),
        "change_24h": 3.2,
        "confidence": "Live news model"
    }


@app.get("/api/risk/countries")
def risk_countries():
    return countries()


@app.get("/api/routes")
def routes():
    _, routes_data, _ = get_live_data()
    return routes_data


@app.get("/api/suppliers")
def suppliers():
    return data["suppliers"]


@app.get("/api/ports")
def ports():
    return data["ports"]


@app.get("/api/news")
def news():
    articles = fetch_global_news(50)
    events = process_articles(articles)
    return events


@app.get("/api/alerts")
def alerts():
    _, _, events = get_live_data()

    return [
        {
            **e,
            "alert": True
        }
        for e in events
        if e["severity"] in ("High", "Critical")
    ]


@app.get("/api/supply-chain")
def supply_chain():
    _, routes_data, events = get_live_data()

    total_routes = len(routes_data)

    at_risk_routes = sum(
        1
        for route in routes_data
        if route.get("risk", 0) >= 60
    )

    at_risk_capacity = round(
        (at_risk_routes / total_routes) * 100,
        1
    ) if total_routes else 0

    health = round(
        max(0, 100 - at_risk_capacity),
        1
    )

    return {
        "nodes": data["ports"] + data["suppliers"],
        "routes": routes_data,
        "health": health,
        "at_risk_capacity": at_risk_capacity,
        "live_events": len(events)
    }


@app.get("/api/recommendations")
def recommendations():
    return [
        {
            "priority": "High",
            "title": "Pre-book Cape Diversion capacity",
            "detail": "Protect Gulf-linked demand with lower-risk capacity before the next planning cycle.",
            "impact": "-18% route exposure"
        },
        {
            "priority": "Medium",
            "title": "Increase Singapore buffer",
            "detail": "Add 7 days of semiconductor inventory at the regional hub.",
            "impact": "+11 days resilience"
        }
    ]


@app.post("/api/scenarios/simulate")
def scenario(request: ScenarioRequest):
    return simulate(
        data,
        request.scenario,
        request.duration_days,
        request.severity
    )


@app.post("/api/optimization/run")
def optimization(request: ScenarioRequest | None = None):
    return {
        "status": "optimized",
        "recommended_suppliers": [
            {
                "name": "Emirates Petrochem",
                "allocation": 72
            },
            {
                "name": "Gulf Coast Chemicals",
                "allocation": 28
            }
        ],
        "estimated_cost": 1840000,
        "estimated_risk": 38.4,
        "estimated_transit_days": 19,
        "current_plan": {
            "cost": 2210000,
            "risk": 57.2,
            "transit_days": 24
        },
        "explanation": "Demo optimizer favors diversified, lower-risk capacity while preserving reserve requirements."
    }


@app.post("/api/ai/analyze")
def analyze(payload: dict[str, Any]):
    return {
        "mode": "demo",
        "summary": "Signals indicate concentrated exposure around Gulf energy lanes and a manageable but rising logistics risk.",
        "drivers": [
            "Chokepoint concentration",
            "Insurance repricing",
            "Supplier diversification gap"
        ]
    }
    

 
@app.post("/api/copilot")
def copilot(request: CopilotRequest):

    countries_data, routes_data, events_data = get_live_data()

    context = {
        "countries": countries_data,
        "routes": routes_data,
        "events": events_data,
    }

    answer = ask_copilot(
        request.message,
        context
    )

    return {
        "answer": answer
    }