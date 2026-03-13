from pydantic import BaseModel
from typing import List, Optional

class Business(BaseModel):
    id: Optional[int] = None
    merchant_id: Optional[str] = None
    name: str
    category: str
    description: str
    tags: List[str]
    image_url: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    rating: float
    address: str

class SwipeAction(BaseModel):
    user_id: str
    business_id: int
    action: str # "like" or "dislike"

class Tourist(BaseModel):
    id: Optional[int] = None
    name: str
    email: Optional[str] = None
    country: Optional[str] = None
    preferred_currency: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

class Merchant(BaseModel):
    id: Optional[str] = None
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
