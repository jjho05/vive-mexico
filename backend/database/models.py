from pydantic import BaseModel
from typing import List, Optional

class Business(BaseModel):
    id: int
    name: str
    category: str
    description: str
    tags: List[str]
    image_url: str
    lat: float
    lng: float
    rating: float
    address: str

class SwipeAction(BaseModel):
    user_id: str
    business_id: int
    action: str # "like" or "dislike"
