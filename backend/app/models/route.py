from pydantic import BaseModel
from typing import List


class Route(BaseModel):
    id: str
    name: str
    from_: str
    to: str
    countries: List[str]
    capacity: int
    cost: int
    transit_days: int
    risk: int
    chokepoint: str