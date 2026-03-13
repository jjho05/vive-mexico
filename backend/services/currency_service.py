import httpx
import time
from typing import Dict, Optional

class CurrencyService:
    def __init__(self):
        # Utilizaremos la capa gratuita de ExchangeRate-API
        # No requiere API Key para el endpoint de pares básicos o tiene una cuota alta para free
        self.base_url = "https://open.er-api.com/v6/latest/MXN"
        self.cache: Dict[str, float] = {}
        self.last_update: float = 0
        self.cache_duration = 3600 * 12  # Actualizar cada 12 horas

    async def get_rates(self) -> Optional[Dict[str, float]]:
        current_time = time.time()
        if not self.cache or (current_time - self.last_update > self.cache_duration):
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(self.base_url)
                    data = response.json()
                    if data["result"] == "success":
                        self.cache = data["rates"]
                        self.last_update = current_time
            except Exception as e:
                print(f"Error fetching rates: {e}")
                return self.cache if self.cache else None
        
        return self.cache

    async def convert(self, amount_mxn: float, target_currency: str) -> float:
        rates = await self.get_rates()
        if rates and target_currency in rates:
            return round(amount_mxn * rates[target_currency], 2)
        return amount_mxn # Fallback a MXN si falla

currency_service = CurrencyService()
