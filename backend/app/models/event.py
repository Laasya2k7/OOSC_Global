from pydantic import BaseModel
from typing import List


class Event(BaseModel):
    id: str
    title: str
    severity: str
    type: str
    countries: List[str]
    timestamp: str
    source: str = ""
    url: str = ""