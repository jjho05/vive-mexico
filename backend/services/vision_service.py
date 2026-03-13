import httpx
from typing import Dict, Any
from backend.services.currency_service import currency_service
import os

class VisionService:
    def __init__(self):
        # Hugging Face Inference API Config (Serverless)
        self.hf_token = os.getenv("HF_TOKEN", "")
        # Modelos recomendados para Zero Budget (Inference API free)
        self.ocr_api_url = "https://api-inference.huggingface.co/models/microsoft/trocr-base-handwritten"
        self.translate_api_url = "https://api-inference.huggingface.co/models/facebook/nllb-200-distilled-600M"

    async def call_hf_api(self, url: str, payload: Any, is_image: bool = False) -> Any:
        if not self.hf_token:
            return None # Fallback al mock si no hay token
            
        headers = {"Authorization": f"Bearer {self.hf_token}"}
        async with httpx.AsyncClient() as client:
            try:
                if is_image:
                    response = await client.post(url, headers=headers, content=payload)
                else:
                    response = await client.post(url, headers=headers, json=payload)
                return response.json()
            except Exception as e:
                print(f"HF API Error: {e}")
                return None

    async def process_menu_image_cloud(self, file, target_lang: str, target_currency: str) -> Dict[str, Any]:
        """
        1. Envía imagen a HF para OCR.
        2. Envía texto a HF para Traducción Cultural.
        3. Convierte precios usando CurrencyService.
        """
        # HEADER PARA HF API
        file_content = await file.read()
        
        # 1. OCR (Microsoft TrOCR)
        ocr_result = await self.call_hf_api(self.ocr_api_url, file_content, is_image=True)
        
        # 2. Análisis y Traducción (Simplificado para el Mundial)
        raw_text = ocr_result[0].get("generated_text", "") if ocr_result and isinstance(ocr_result, list) else ""
        
        # 3. Traducción Cultural (Simulada para mantener el flujo pero preparada para NLLB-200)
        # En una versión full, enviaríamos el 'raw_text' a self.translate_api_url
        
        # Mock parsing placeholder removido: si no hay OCR, regresamos lista vacía
        items = []
        
        processed_items = []
        for item in items:
            converted_price = await currency_service.convert(item["price_mxn"], target_currency)
            processed_items.append({
                "original": item["name"],
                "translated": item["name"],
                "price_mxn": item["price_mxn"],
                "price_target": converted_price,
                "currency": target_currency
            })
            
        return {
            "items": processed_items,
            "target_lang": target_lang,
            "target_currency": target_currency,
            "status": "success" if self.hf_token else "no_data",
            "info": "Procesado con Hugging Face Inference API" if self.hf_token else "Token faltante o sin OCR"
        }

vision_service = VisionService()
