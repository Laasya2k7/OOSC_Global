from __future__ import annotations

from typing import Any


def simulate(
    data: dict[str, Any],
    scenario: str,
    duration_days: int,
    severity: int
) -> dict[str, Any]:

    routes = data["routes"]
    suppliers = data["suppliers"]

    multiplier = severity / 100
    affected = []

    # 1. Strait of Hormuz closure
    if scenario == "hormuz_closure":
        affected = [
            r for r in routes
            if "Hormuz" in r["chokepoint"]
            or "Gulf" in r["chokepoint"]
        ]

    # 2. Major port shutdown
    elif scenario == "port_shutdown":
        port = data["ports"][0]["id"]

        affected = [
            r for r in routes
            if r["from"] == port
            or r["to"] == port
        ]

    # 3. Supplier sanctions
    elif scenario == "supplier_sanctions":
        affected = [
            r for r in routes
            if "IR" in r["countries"]
            or "RU" in r["countries"]
        ]

    # 4. Shipping route disruption
    elif scenario == "route_disruption":
        affected = sorted(
            routes,
            key=lambda r: r["risk"],
            reverse=True
        )[:2]

    # 5. Geopolitical risk increase
    elif scenario == "risk_surge":
        affected = sorted(
            routes,
            key=lambda r: r["risk"],
            reverse=True
        )[:3]

    # 6. Red Sea / Suez disruption
    elif scenario == "red_sea_disruption":
        affected = [
            r for r in routes
            if "Red Sea" in r["name"]
            or "Suez" in r["name"]
            or "Red Sea" in r["chokepoint"]
            or "Suez" in r["chokepoint"]
        ]

        # If no specific Red Sea route exists,
        # affect the highest-risk routes instead.
        if not affected:
            affected = sorted(
                routes,
                key=lambda r: r["risk"],
                reverse=True
            )[:2]

    # 7. Major supplier failure
    elif scenario == "supplier_failure":
        affected = sorted(
            routes,
            key=lambda r: r["capacity"],
            reverse=True
        )[:2]

    # 8. Cyberattack on logistics network
    elif scenario == "cyberattack":
        affected = sorted(
            routes,
            key=lambda r: r["risk"],
            reverse=True
        )[:3]

    # 9. Extreme weather disruption
    elif scenario == "extreme_weather":
        affected = sorted(
            routes,
            key=lambda r: r["transit_days"],
            reverse=True
        )[:3]

    # 10. Global demand surge
    elif scenario == "demand_surge":
        affected = routes

    capacity = sum(
        r["capacity"]
        for r in routes
    )

    lost = sum(
        r["capacity"] * multiplier
        for r in affected
    )

    deficit = min(
        95,
        lost / capacity * 100
        + duration_days * 0.15
    )

    cost = round(
        (
            sum(r["cost"] for r in affected)
            / max(1, len(affected))
        )
        * multiplier
        * 0.42,
        1
    )

    delay = round(
        (
            sum(r["transit_days"] for r in affected)
            / max(1, len(affected))
        )
        * multiplier
        * 0.55,
        1
    )

    impacted_countries = sorted({
        country
        for route in affected
        for country in route["countries"]
    })

    impacted_suppliers = [
        supplier
        for supplier in suppliers
        if supplier["country"] in impacted_countries
    ]

    return {
        "scenario": scenario,
        "duration_days": duration_days,
        "severity": severity,

        "supply_deficit_percent": round(
            deficit,
            1
        ),

        "cost_increase_percent": cost,

        "transit_time_increase_percent": delay,

        "reserve_days_remaining": round(
            max(2, 18 - deficit * 0.22),
            1
        ),

        "affected_suppliers": len(
            impacted_suppliers
        ),

        "affected_routes": len(
            affected
        ),

        "affected_markets": len(
            impacted_countries
        ),

        "route_details": affected,

        "supplier_details": impacted_suppliers,

        "mitigation": (
            "Shift volume to Cape Diversion and "
            "North Atlantic Lane; secure 14-day "
            "buffer inventory."
        ),
    }