from __future__ import annotations

import json
from pathlib import Path
from typing import Any

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "raw" / "demo.json"


def load_demo() -> dict[str, list[dict[str, Any]]]:
    return json.loads(DATA_PATH.read_text(encoding="utf-8"))


def risk_band(score: float) -> str:
    if score < 20: return "Low"
    if score < 40: return "Moderate"
    if score < 60: return "Elevated"
    if score < 80: return "High"
    return "Critical"


def calculate_risk(country: dict[str, Any]) -> float:
    score = (country["risk"] * .25 + country["conflict"] * .20 + country["sanctions"] * .15
             + country["risk"] * .15 + (100 - country["stability"]) * .10
             + country["risk"] * .10 + country["conflict"] * .05)
    return round(min(100, max(0, score)), 1)
