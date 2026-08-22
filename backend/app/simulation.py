from __future__ import annotations
from typing import Any


def simulate(data: dict[str, Any], scenario: str, duration_days: int, severity: int) -> dict[str, Any]:
    routes = data["routes"]
    suppliers = data["suppliers"]
    multiplier = severity / 100
    affected = []
    if scenario == "hormuz_closure":
        affected = [r for r in routes if "Hormuz" in r["chokepoint"] or "Gulf" in r["chokepoint"]]
    elif scenario == "port_shutdown":
        port = data["ports"][0]["id"]
        affected = [r for r in routes if r["from"] == port or r["to"] == port]
    elif scenario == "supplier_sanctions":
        affected = [r for r in routes if "IR" in r["countries"] or "RU" in r["countries"]]
    elif scenario == "route_disruption":
        affected = sorted(routes, key=lambda r: r["risk"], reverse=True)[:2]
    else:
        affected = sorted(routes, key=lambda r: r["risk"], reverse=True)[:3]
    capacity = sum(r["capacity"] for r in routes)
    lost = sum(r["capacity"] * multiplier for r in affected)
    deficit = min(95, lost / capacity * 100 + duration_days * .15)
    cost = round((sum(r["cost"] for r in affected) / max(1, len(affected))) * multiplier * 0.42, 1)
    delay = round((sum(r["transit_days"] for r in affected) / max(1, len(affected))) * multiplier * 0.55, 1)
    impacted_countries = sorted({c for r in affected for c in r["countries"]})
    impacted_suppliers = [s for s in suppliers if s["country"] in impacted_countries]
    return {"scenario": scenario, "duration_days": duration_days, "severity": severity,
            "supply_deficit_percent": round(deficit, 1), "cost_increase_percent": cost,
            "transit_time_increase_percent": delay, "reserve_days_remaining": round(max(2, 18 - deficit * .22), 1),
            "affected_suppliers": len(impacted_suppliers), "affected_routes": len(affected),
            "affected_markets": len(impacted_countries), "route_details": affected,
            "supplier_details": impacted_suppliers,
            "mitigation": "Shift volume to Cape Diversion and North Atlantic Lane; secure 14-day buffer inventory."}
