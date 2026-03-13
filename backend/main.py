from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from typing import List, Optional
import uvicorn
import os
from backend.api.routes import vision_router
from backend.services.currency_service import currency_service
from backend.database.supabase_client import supabase
from backend.database.models import Business
app = FastAPI(title="Ola México API")

app.include_router(vision_router)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static export path for Next.js build output (Dockerfile copies it to /app/static)
static_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")

# Mock database - will move to PostgreSQL later
MOCK_BUSINESSES = [
    {
        "id": 1,
        "name": "Tacos El Guero",
        "category": "Comida",
        "description": "Los mejores tacos al pastor de la zona, receta secreta desde 1980.",
        "tags": ["tacos", "callejero", "barato", "tradicional"],
        "image_url": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
        "lat": 19.4326,
        "lng": -99.1332,
        "rating": 4.8,
        "address": "Calle Bolivar 54, Centro Histórico"
    },
    {
        "id": 2,
        "name": "Artesanías El Jaguar",
        "category": "Compras",
        "description": "Artesanías huicholes y barro negro directamente de manos artesanas.",
        "tags": ["artesanías", "regalos", "cultura", "hecho a mano"],
        "image_url": "https://images.unsplash.com/photo-1590076215667-873d3215904a",
        "lat": 19.4340,
        "lng": -99.1350,
        "rating": 4.5,
        "address": "Av. Independencia 23, Juárez"
    }
]

@app.get("/api/businesses")
async def get_businesses():
    try:
        if supabase is not None:
            response = supabase.table("businesses").select("*").execute()
            if response.data:
                return response.data
    except Exception as e:
        print(f"Supabase Error: {e}")
    # Fallback if DB empty or error
    return MOCK_BUSINESSES

@app.post("/api/merchant/register")
async def register_merchant(business: Business):
    try:
        data = business.dict()
        # En Supabase no necesitamos ID manual si es autoincremental,
        # pero para compatibilidad con el modelo lo enviamos o dejamos que DB lo asigne
        if supabase is not None:
            res = supabase.table("businesses").insert(data).execute()
            return {"message": "Negocio registrado en la nube", "data": res.data}
    except Exception as e:
        print(f"Register Error: {e}")
        # Local mock fallback
        MOCK_BUSINESSES.append(business.dict())
        return {"message": "Error en DB, guardado en memoria local", "business": business}
    # Fallback if no Supabase configured
    MOCK_BUSINESSES.append(business.dict())
    return {"message": "Supabase no configurado, guardado en memoria local", "business": business}

@app.get("/api/recommendations")
async def get_recommendations(interests: Optional[str] = None):
    # For now, just return all if no interests
    return MOCK_BUSINESSES

@app.get("/api/fx/convert")
async def convert_currency(amount: float, to_currency: str):
    converted = await currency_service.convert(amount, to_currency)
    return {"original_amount": amount, "target_amount": converted, "currency": to_currency}

@app.get("/api/fx/rates")
async def get_all_rates():
    rates = await currency_service.get_rates()
    return rates

if os.path.exists(static_path):
    # Disable html=True so /scanner hits the 404 handler, where we can intercept RSC
    app.mount("/_next", StaticFiles(directory=os.path.join(static_path, "_next")), name="next_static")
    
    # Montamos archivos exactos sueltos pero sin html=True global
    app.mount("/static", StaticFiles(directory=static_path), name="static")

    @app.api_route("/{path:path}", methods=["GET", "HEAD", "POST"])
    async def catch_all_spa(request: Request, path: str):
        # Prevent intercepting API routes that might have somehow fallen through
        if path.startswith("api/"):
            return JSONResponse({"detail": "Not Found"}, status_code=404)
            
        path = path.strip("/")
        if not path:
            path = "index"
            
        is_rsc = request.headers.get("rsc") == "1"
        
        # 1. Provide exact file if it exists (e.g., favicon.ico, file.svg)
        exact_path = os.path.join(static_path, path)
        if os.path.isfile(exact_path):
            return FileResponse(exact_path)
            
        # 2. If Next.js client router is prefetching/soft-navigating
        if is_rsc:
            txt_path = os.path.join(static_path, f"{path}.txt")
            if os.path.isfile(txt_path):
                return FileResponse(txt_path, media_type="text/x-component")
                
        # 3. Normal browser navigation
        html_path = os.path.join(static_path, f"{path}.html")
        if os.path.isfile(html_path):
            return FileResponse(html_path, media_type="text/html")
            
        return FileResponse(os.path.join(static_path, "404.html"), media_type="text/html")


if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
