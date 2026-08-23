EVENT_IMPACT = {
    "Conflict": 8,
    "Military": 6,
    "Sanctions": 5,
    "Security": 5,
    "Energy": 4,
    "Trade": 3,
    "Diplomacy": -3,
    "General": 1,
}


def calculate_country_impact(event):

    event_type = event.get(
        "type",
        "General"
    )

    base_impact = EVENT_IMPACT.get(
        event_type,
        1
    )

    severity = event.get(
        "severity",
        "Moderate"
    )

    if severity == "Critical":

        base_impact *= 2

    elif severity == "High":

        base_impact = int(
            base_impact * 1.5
        )

    return base_impact


def calculate_live_country_risks(
    countries,
    events
):

    results = []

    for original_country in countries:

        country = original_country.copy()
        baseline_risk = country["risk"]
        total_impact = 0
        relevant_events = []

        for event in events:

            if country["id"] not in event.get(
                "countries",
                []
            ):
                continue

            impact = calculate_country_impact(
                event
            )

            total_impact += impact
            relevant_events.append(
                event
            )
        total_impact = max(
            -20,
            min(20, total_impact)
        )

        live_risk = max(
            0,
            min(
                100,
                baseline_risk + total_impact
            )
        )

        country["baseline_risk"] = (
            baseline_risk
        )

        country["risk"] = live_risk

        country["live_impact"] = (
            total_impact
        )

        country["live_events"] = len(
            relevant_events
        )

        if relevant_events:

            priority = {
                "Critical": 4,
                "High": 3,
                "Moderate": 2,
                "Low": 1
            }

            relevant_events.sort(
                key=lambda e: priority.get(
                    e.get("severity"),
                    1
                ),
                reverse=True
            )

            country["top_event"] = (
                relevant_events[0]
            )

        else:

            country["top_event"] = None

        results.append(country)

    return results


def update_route_risks(
    routes,
    events
):

    results = []

    for original_route in routes:

        route = original_route.copy()

        baseline_risk = route["risk"]

        total_impact = 0

        for event in events:

            affected_countries = set(
                event.get(
                    "countries",
                    []
                )
            )

            route_countries = set(
                route.get(
                    "countries",
                    []
                )
            )

            if affected_countries & route_countries:

                impact = calculate_country_impact(
                    event
                )

                total_impact += impact

        # Prevent unlimited stacking
        total_impact = max(
            -20,
            min(20, total_impact)
        )

        route["baseline_risk"] = (
            baseline_risk
        )

        route["risk"] = max(
            0,
            min(
                100,
                baseline_risk + total_impact
            )
        )

        route["live_impact"] = (
            total_impact
        )

        results.append(route)

    return results

def generate_live_routes(routes, events):
    results = [route.copy() for route in routes]

    existing_ids = {
        route["id"]
        for route in results
    }

    route_templates = {
        "IR": {
            "id": "R-LIVE-IR",
            "name": "Iran Regional Route",
            "from": "IR",
            "to": "RTM",
            "countries": ["IR", "AE", "SA"],
            "capacity": 180,
            "cost": 65,
            "transit_days": 18,
            "chokepoint": "Persian Gulf"
        },
        "RU": {
            "id": "R-LIVE-RU",
            "name": "Russia-Europe Route",
            "from": "RU",
            "to": "DE",
            "countries": ["RU", "DE"],
            "capacity": 150,
            "cost": 55,
            "transit_days": 14,
            "chokepoint": "Northern Eurasia"
        },
        "CN": {
            "id": "R-LIVE-CN",
            "name": "China-Europe Supply Route",
            "from": "CN",
            "to": "DE",
            "countries": ["CN", "DE"],
            "capacity": 300,
            "cost": 52,
            "transit_days": 20,
            "chokepoint": "China-Europe Corridor"
        },
        "US": {
            "id": "R-LIVE-US",
            "name": "US-Atlantic Supply Route",
            "from": "US",
            "to": "DE",
            "countries": ["US", "DE", "NL"],
            "capacity": 280,
            "cost": 48,
            "transit_days": 16,
            "chokepoint": "North Atlantic"
        }
    }

    for event in events:

        affected_countries = event.get(
            "countries",
            []
        )

        for country_id in affected_countries:

            if country_id not in route_templates:
                continue

            template = route_templates[country_id]

            if template["id"] in existing_ids:
                continue

            route = template.copy()

            route["baseline_risk"] = 50

            impact = calculate_country_impact(
                event
            )

            route["risk"] = max(
                0,
                min(
                    100,
                    route["baseline_risk"] + impact
                )
            )

            route["live_impact"] = impact

            route["live_event"] = event["id"]

            results.append(route)

            existing_ids.add(
                route["id"]
            )

    return results