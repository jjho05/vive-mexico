import math
from typing import Optional, Tuple

import httpx


class GeoService:
    def __init__(self):
        self.nominatim_url = "https://nominatim.openstreetmap.org/search"

    async def geocode(self, address: str) -> Optional[Tuple[float, float]]:
        if not address:
            return None
        params = {
            "q": address,
            "format": "json",
            "limit": 1,
        }
        headers = {
            "User-Agent": "vive-mexico/1.0 (contact: local-dev)"
        }
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(self.nominatim_url, params=params, headers=headers)
            if resp.status_code != 200:
                return None
            data = resp.json()
            if not data:
                return None
            return float(data[0]["lat"]), float(data[0]["lon"])

    def distance_km(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        # Haversine
        r = 6371.0
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlambda = math.radians(lon2 - lon1)
        a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return r * c


geo_service = GeoService()
