from __future__ import annotations
from typing import Any
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from .core import calculate_risk, load_demo, risk_band
from .simulation import simulate

app = FastAPI(title="GeoShield API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origin_regex=r"http://(localhost|127\.0\.0\.1):[0-9]+", allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
data = load_demo()

class ScenarioRequest(BaseModel):
    scenario: str = Field(pattern="^(hormuz_closure|port_shutdown|supplier_sanctions|route_disruption|risk_surge)$")
    duration_days: int = Field(default=14, ge=1, le=365)
    severity: int = Field(default=75, ge=1, le=100)

@app.get("/api/health")
def health(): return {"status": "ok", "mode": "demo", "message": "Synthetic data active; no live feeds configured."}
@app.get("/api/countries")
def countries(): return [{**c, "score": calculate_risk(c), "band": risk_band(calculate_risk(c))} for c in data["countries"]]
@app.get("/api/countries/{country_id}")
def country(country_id: str): return next((c for c in countries() if c["id"] == country_id.upper()), {"error": "Country not found"})
@app.get("/api/risk/global")
def global_risk():
    score = round(sum(calculate_risk(c) for c in data["countries"]) / len(data["countries"]), 1)
    return {"score": score, "band": risk_band(score), "change_24h": 3.2, "confidence": "Demo model"}
@app.get("/api/risk/countries")
def risk_countries(): return countries()
@app.get("/api/routes")
def routes(): return data["routes"]
@app.get("/api/suppliers")
def suppliers(): return data["suppliers"]
@app.get("/api/ports")
def ports(): return data["ports"]
@app.get("/api/news")
def news(): return data["events"]
@app.get("/api/alerts")
def alerts(): return [{**e, "alert": True} for e in data["events"] if e["severity"] in ("High", "Elevated")]
@app.get("/api/supply-chain")
def supply_chain(): return {"nodes": data["ports"] + data["suppliers"], "routes": data["routes"], "health": 71, "at_risk_capacity": 29}
@app.get("/api/recommendations")
def recommendations(): return [{"priority":"High","title":"Pre-book Cape Diversion capacity","detail":"Protect Gulf-linked demand with lower-risk capacity before the next planning cycle.","impact":"-18% route exposure"},{"priority":"Medium","title":"Increase Singapore buffer","detail":"Add 7 days of semiconductor inventory at the regional hub.","impact":"+11 days resilience"}]
@app.post("/api/scenarios/simulate")
def scenario(request: ScenarioRequest): return simulate(data, request.scenario, request.duration_days, request.severity)
@app.post("/api/optimization/run")
def optimization(request: ScenarioRequest | None = None): return {"status":"optimized","recommended_suppliers":[{"name":"Emirates Petrochem","allocation":72},{"name":"Gulf Coast Chemicals","allocation":28}],"estimated_cost":1840000,"estimated_risk":38.4,"estimated_transit_days":19,"current_plan":{"cost":2210000,"risk":57.2,"transit_days":24},"explanation":"Demo optimizer favors diversified, lower-risk capacity while preserving reserve requirements."}
@app.post("/api/ai/analyze")
def analyze(payload: dict[str, Any]): return {"mode":"demo","summary":"Signals indicate concentrated exposure around Gulf energy lanes and a manageable but rising logistics risk.","drivers":["Chokepoint concentration","Insurance repricing","Supplier diversification gap"]}
