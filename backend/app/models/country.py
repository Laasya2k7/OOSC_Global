from pydantic import BaseModel


class Country(BaseModel):
    id: str
    name: str
    risk: int
    stability: int
    conflict: int
    sanctions: int
    lat: float
    lng: float