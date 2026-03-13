from fastapi import APIRouter, UploadFile, File
from backend.services.vision_service import vision_service
from backend.services.currency_service import currency_service
from typing import Optional

router = APIRouter(prefix="/api/vision", tags=["vision"])

@router.post("/scan-menu")
async def scan_menu(file: UploadFile = File(...), target_lang: str = "en", target_currency: str = "USD"):
    # En un entorno real, guardaríamos el archivo temporalmente o lo procesaríamos en memoria
    # Por ahora, usamos el servicio que conectará con Hugging Face Inference API
    # simulation of processing
    result = await vision_service.process_menu_image_cloud(file, target_lang, target_currency)
    return result

vision_router = router
