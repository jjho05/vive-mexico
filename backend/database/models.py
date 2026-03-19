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
    price_level: Optional[str] = None
    is_open: Optional[bool] = None

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

class AuthRegister(BaseModel):
    role: str
    email: str
    password: str
    name: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    preferred_currency: Optional[str] = None

class AuthLogin(BaseModel):
    email: str
    password: str

class Review(BaseModel):
    id: Optional[int] = None
    business_id: int
    tourist_id: str
    rating: int
    comment: Optional[str] = None
    created_at: Optional[str] = None
