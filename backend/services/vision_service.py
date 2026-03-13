import httpx
from typing import Dict, Any
from backend.services.currency_service import currency_service
import os
import re

class VisionService:
    def __init__(self):
        # Hugging Face Inference API Config (Serverless)
        self.hf_token = os.getenv("HF_TOKEN", "")
        # Modelos recomendados para Zero Budget (Inference API free)
        self.ocr_api_urls = [
            "https://api-inference.huggingface.co/models/microsoft/trocr-small-printed",
            "https://api-inference.huggingface.co/models/microsoft/trocr-base-printed",
        ]
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
                if response.status_code != 200:
                    return {
                        "error": "HF API request failed",
                        "status_code": response.status_code,
                        "body": response.text[:500]
                    }
                return response.json()
            except Exception as e:
                print(f"HF API Error: {e}")
                return {"error": str(e)}

    async def process_menu_image_cloud(self, file, target_lang: str, target_currency: str) -> Dict[str, Any]:
        """
        1. Envía imagen a HF para OCR.
        2. Envía texto a HF para Traducción Cultural.
        3. Convierte precios usando CurrencyService.
        """
        # HEADER PARA HF API
        file_content = await file.read()
        
        # 1. OCR (Microsoft TrOCR)
        ocr_result = None
        ocr_error = None
        for url in self.ocr_api_urls:
            ocr_result = await self.call_hf_api(url, file_content, is_image=True)
            if isinstance(ocr_result, list) and ocr_result:
                break
            if isinstance(ocr_result, dict) and ocr_result.get("generated_text"):
                break
            if isinstance(ocr_result, dict) and ocr_result.get("error"):
                ocr_error = ocr_result.get("error")
                if ocr_result.get("status_code"):
                    ocr_error = f"{ocr_error} (status {ocr_result.get('status_code')})"
        
        # 2. Análisis y Traducción (Simplificado para el Mundial)
        raw_text = ""
        if isinstance(ocr_result, list) and ocr_result:
            raw_text = ocr_result[0].get("generated_text", "")
        elif isinstance(ocr_result, dict):
            if "generated_text" in ocr_result:
                raw_text = ocr_result.get("generated_text", "")
            elif "error" in ocr_result:
                ocr_error = ocr_result.get("error")
                if ocr_result.get("status_code"):
                    ocr_error = f"{ocr_error} (status {ocr_result.get('status_code')})"
        
        # 3. Traducción Cultural (Simulada para mantener el flujo pero preparada para NLLB-200)
        # En una versión full, enviaríamos el 'raw_text' a self.translate_api_url

        # Parse básico: detectar líneas con precio y asignar nombre
        items = []
        if raw_text:
            lines = [line.strip() for line in raw_text.replace("|", "\n").splitlines() if line.strip()]
            for line in lines:
                matches = re.findall(r"(?i)(?:mxn|\\$)?\\s*([0-9]{1,4}(?:[\\.,][0-9]{1,2})?)", line)
                if not matches:
                    continue
                price_str = matches[-1].replace(",", ".")
                try:
                    price = float(price_str)
                except Exception:
                    continue
                name = re.sub(r"(?i)\\$?\\s*[0-9]{1,4}(?:[\\.,][0-9]{1,2})?\\s*(mxn)?", "", line).strip()
                if name:
                    items.append({"name": name, "price_mxn": price})
        
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
            "raw_text": raw_text,
            "ocr_error": ocr_error,
            "target_lang": target_lang,
            "target_currency": target_currency,
            "status": "success" if self.hf_token and not ocr_error else "no_data",
            "info": "Procesado con Hugging Face Inference API" if self.hf_token else "Token faltante o sin OCR"
        }

vision_service = VisionService()
