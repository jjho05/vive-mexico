import httpx
from typing import Dict, Any
from backend.services.currency_service import currency_service
import os
import re
import io

try:
    from PIL import Image
    import pytesseract
except Exception:  # Optional local OCR deps
    Image = None
    pytesseract = None

class VisionService:
    def __init__(self):
        # Hugging Face Inference API Config (Serverless)
        self.hf_token = os.getenv("HF_TOKEN", "")
        # HF Inference API (router) - models list
        self.ocr_model_ids = [
            "microsoft/trocr-small-printed",
            "microsoft/trocr-base-printed",
        ]
        self.hf_router_base = "https://router.huggingface.co/hf-inference/models"
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
        for model_id in self.ocr_model_ids:
            url = f"{self.hf_router_base}/{model_id}"
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

        # Fallback a OCR local si HF falla
        if not raw_text and Image is not None and pytesseract is not None:
            try:
                image = Image.open(io.BytesIO(file_content))
                raw_text = pytesseract.image_to_string(image, lang="spa+eng")
                if ocr_error:
                    ocr_error = f"{ocr_error}; local OCR used"
            except Exception as e:
                if ocr_error:
                    ocr_error = f"{ocr_error}; local OCR failed: {e}"
                else:
                    ocr_error = f"Local OCR failed: {e}"
        
        # 3. Traducción Cultural (Simulada para mantener el flujo pero preparada para NLLB-200)
        # En una versión full, enviaríamos el 'raw_text' a self.translate_api_url

        # Parse por bloques: detectar nombres y luego asociar precios cercanos
        items = []
        if raw_text:
            lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
            price_lines = []
            name_lines = []
            for line in lines:
                if re.fullmatch(r"\\$?\\s*[0-9]{1,4}(?:[\\.,][0-9]{1,2})?\\s*", line):
                    price_lines.append(line)
                else:
                    name_lines.append(line)

            # If there are both, pair by order
            if name_lines and price_lines:
                pairs = min(len(name_lines), len(price_lines))
                for i in range(pairs):
                    price_str = price_lines[i].replace("$", "").replace(",", ".").strip()
                    try:
                        price = float(price_str)
                    except Exception:
                        continue
                    name = name_lines[i]
                    items.append({"name": name, "price_mxn": price})
            else:
                # Fallback to window parse
                cleaned = re.sub(r"\\s+", " ", raw_text).strip()
                price_matches = list(re.finditer(r"(?i)(?:mxn|\\$)?\\s*([0-9]{1,4}(?:[\\.,][0-9]{1,2})?)", cleaned))
                for match in price_matches:
                    price_str = match.group(1).replace(",", ".")
                    try:
                        price = float(price_str)
                    except Exception:
                        continue
                    prefix = cleaned[:match.start()].strip()
                    words = prefix.split(" ")
                    name = " ".join(words[-6:]).strip()
                    if name:
                        items.append({"name": name, "price_mxn": price})

            # De-duplicate by name+price
            seen = set()
            deduped = []
            for item in items:
                key = (item["name"].lower(), item["price_mxn"])
                if key in seen:
                    continue
                seen.add(key)
                deduped.append(item)
            items = deduped
        
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
