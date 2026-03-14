from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from typing import List, Optional
import uuid
import uvicorn
import os
import bcrypt
from backend.api.routes import vision_router
from backend.services.currency_service import currency_service
from backend.database.supabase_client import supabase
from backend.database.models import Business, Tourist, Merchant, AuthRegister, AuthLogin
from backend.services.geo_service import geo_service
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

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except Exception:
        return False

def get_response_error(resp) -> Optional[str]:
    err = getattr(resp, "error", None)
    if not err:
        return None
    try:
        return getattr(err, "message", None) or str(err)
    except Exception:
        return str(err)

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

@app.post("/api/auth/register")
async def register_account(payload: AuthRegister):
    if supabase is None:
        return JSONResponse({"message": "Supabase no configurado"}, status_code=500)
    role = payload.role.lower().strip()
    if role not in ["merchant", "tourist"]:
        return JSONResponse({"message": "Rol inválido"}, status_code=400)
    try:
        existing = supabase.table("accounts").select("id").eq("email", payload.email).execute()
        existing_error = get_response_error(existing)
        if existing_error:
            return JSONResponse({"message": "Error consultando cuentas", "detail": existing_error}, status_code=500)
        if existing.data:
            return JSONResponse({"message": "Email ya registrado"}, status_code=409)

        account_id = str(uuid.uuid4())
        merchant_id = None
        tourist_id = None

        if role == "merchant":
            merchant_id = account_id
            merchant_data = {
                "id": merchant_id,
                "name": payload.name or payload.email.split("@")[0],
                "phone": payload.phone,
                "email": payload.email,
            }
            merchant_res = supabase.table("merchants").insert(merchant_data).execute()
            merchant_error = get_response_error(merchant_res)
            if merchant_error:
                return JSONResponse({"message": "No se pudo crear comerciante", "detail": merchant_error}, status_code=500)
        else:
            tourist_data = {
                "name": payload.name or "Turista",
                "email": payload.email,
                "country": payload.country,
                "preferred_currency": payload.preferred_currency,
            }
            tourist_res = supabase.table("tourists").insert(tourist_data).execute()
            tourist_error = get_response_error(tourist_res)
            if tourist_error:
                return JSONResponse({"message": "No se pudo crear turista", "detail": tourist_error}, status_code=500)
            if tourist_res.data:
                tourist_id = tourist_res.data[0].get("id")

        account_data = {
            "id": account_id,
            "role": role,
            "email": payload.email,
            "password_hash": hash_password(payload.password),
            "merchant_id": merchant_id,
            "tourist_id": tourist_id,
        }
        res = supabase.table("accounts").insert(account_data).execute()
        account_error = get_response_error(res)
        if account_error:
            return JSONResponse({"message": "No se pudo crear cuenta", "detail": account_error}, status_code=500)
        return {"message": "Cuenta creada", "account": res.data[0] if res.data else account_data}
    except Exception as e:
        print(f"Register Account Error: {e}")
        return JSONResponse({"message": "No se pudo registrar", "detail": str(e)}, status_code=500)

@app.post("/api/auth/login")
async def login_account(payload: AuthLogin):
    if supabase is None:
        return JSONResponse({"message": "Supabase no configurado"}, status_code=500)
    try:
        res = supabase.table("accounts").select("*").eq("email", payload.email).execute()
        res_error = get_response_error(res)
        if res_error:
            return JSONResponse({"message": "Error consultando cuentas", "detail": res_error}, status_code=500)
        if not res.data:
            return JSONResponse({"message": "Credenciales inválidas"}, status_code=401)
        account = res.data[0]
        if not verify_password(payload.password, account.get("password_hash", "")):
            return JSONResponse({"message": "Credenciales inválidas"}, status_code=401)
        return {"message": "OK", "account": account}
    except Exception as e:
        print(f"Login Error: {e}")
        return JSONResponse({"message": "No se pudo iniciar sesión"}, status_code=500)

@app.post("/api/merchant/register")
async def register_merchant(business: Business):
    try:
        data = business.dict()
        if (not data.get("lat") or not data.get("lng")) and data.get("address"):
            coords = await geo_service.geocode(data.get("address"))
            if coords:
                data["lat"], data["lng"] = coords
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

@app.post("/api/merchant/update-location")
async def update_merchant_location(merchant_id: int, address: str):
    try:
        data = {"address": address}
        coords = await geo_service.geocode(address)
        if coords:
            data["lat"], data["lng"] = coords
        if supabase is not None:
            res = supabase.table("businesses").update(data).eq("id", merchant_id).execute()
            return {"message": "Ubicacion actualizada", "data": res.data}
    except Exception as e:
        print(f"Update Location Error: {e}")
    return {"message": "No se pudo actualizar"}

@app.post("/api/merchants")
async def create_merchant(merchant: Merchant):
    try:
        data = merchant.dict()
        data["id"] = data.get("id") or str(uuid.uuid4())
        if supabase is not None:
            res = supabase.table("merchants").insert(data).execute()
            return {"message": "Comerciante creado", "data": res.data}
    except Exception as e:
        print(f"Create Merchant Error: {e}")
    return {"message": "Supabase no configurado", "merchant": merchant}

@app.get("/api/merchants/{merchant_id}")
async def get_merchant(merchant_id: str):
    try:
        if supabase is not None:
            res = supabase.table("merchants").select("*").eq("id", merchant_id).execute()
            return res.data[0] if res.data else None
    except Exception as e:
        print(f"Get Merchant Error: {e}")
    return None

@app.put("/api/merchants/{merchant_id}")
async def update_merchant(merchant_id: str, merchant: Merchant):
    try:
        data = merchant.dict()
        data.pop("id", None)
        if supabase is not None:
            res = supabase.table("merchants").update(data).eq("id", merchant_id).execute()
            return {"message": "Comerciante actualizado", "data": res.data}
    except Exception as e:
        print(f"Update Merchant Error: {e}")
    return {"message": "No se pudo actualizar"}

@app.get("/api/merchants/{merchant_id}/businesses")
async def get_merchant_businesses(merchant_id: str):
    try:
        if supabase is not None:
            res = supabase.table("businesses").select("*").eq("merchant_id", merchant_id).execute()
            res_error = get_response_error(res)
            if res_error:
                return JSONResponse({"message": "No se pudo cargar locales", "detail": res_error}, status_code=500)
            return res.data
    except Exception as e:
        print(f"Get Merchant Businesses Error: {e}")
    return []

@app.post("/api/merchants/{merchant_id}/businesses")
async def create_merchant_business(merchant_id: str, business: Business):
    try:
        data = business.dict()
        data["merchant_id"] = merchant_id
        if (not data.get("lat") or not data.get("lng")) and data.get("address"):
            coords = await geo_service.geocode(data.get("address"))
            if coords:
                data["lat"], data["lng"] = coords
        if supabase is not None:
            res = supabase.table("businesses").insert(data).execute()
            res_error = get_response_error(res)
            if res_error:
                return JSONResponse({"message": "No se pudo crear local", "detail": res_error}, status_code=500)
            return {"message": "Local creado", "data": res.data}
    except Exception as e:
        print(f"Create Merchant Business Error: {e}")
    return JSONResponse({"message": "No se pudo crear", "detail": "unknown"}, status_code=500)

@app.put("/api/merchants/{merchant_id}/businesses/{business_id}")
async def update_merchant_business(merchant_id: str, business_id: int, business: Business):
    try:
        data = business.dict()
        data["merchant_id"] = merchant_id
        data.pop("id", None)
        if (not data.get("lat") or not data.get("lng")) and data.get("address"):
            coords = await geo_service.geocode(data.get("address"))
            if coords:
                data["lat"], data["lng"] = coords
        if supabase is not None:
            res = supabase.table("businesses").update(data).eq("id", business_id).execute()
            res_error = get_response_error(res)
            if res_error:
                return JSONResponse({"message": "No se pudo actualizar local", "detail": res_error}, status_code=500)
            return {"message": "Local actualizado", "data": res.data}
    except Exception as e:
        print(f"Update Merchant Business Error: {e}")
    return JSONResponse({"message": "No se pudo actualizar", "detail": "unknown"}, status_code=500)

@app.get("/api/recommendations")
async def get_recommendations(interests: Optional[str] = None):
    # For now, just return all if no interests
    return MOCK_BUSINESSES

@app.post("/api/tourists/register")
async def register_tourist(tourist: Tourist):
    try:
        data = tourist.dict()
        if supabase is not None:
            res = supabase.table("tourists").insert(data).execute()
            return {"message": "Turista registrado", "data": res.data}
    except Exception as e:
        print(f"Tourist Register Error: {e}")
    return {"message": "Supabase no configurado", "tourist": tourist}

@app.get("/api/tourists/{tourist_id}")
async def get_tourist(tourist_id: int):
    try:
        if supabase is not None:
            res = supabase.table("tourists").select("*").eq("id", tourist_id).execute()
            return res.data[0] if res.data else None
    except Exception as e:
        print(f"Get Tourist Error: {e}")
    return None

@app.put("/api/tourists/{tourist_id}")
async def update_tourist(tourist_id: int, tourist: Tourist):
    try:
        data = tourist.dict()
        data.pop("id", None)
        if supabase is not None:
            res = supabase.table("tourists").update(data).eq("id", tourist_id).execute()
            return {"message": "Turista actualizado", "data": res.data}
    except Exception as e:
        print(f"Update Tourist Error: {e}")
    return {"message": "No se pudo actualizar"}

@app.delete("/api/tourists/{tourist_id}")
async def delete_tourist(tourist_id: int):
    try:
        if supabase is not None:
            res = supabase.table("tourists").delete().eq("id", tourist_id).execute()
            return {"message": "Turista eliminado", "data": res.data}
    except Exception as e:
        print(f"Delete Tourist Error: {e}")
    return {"message": "No se pudo eliminar"}

@app.get("/api/businesses/nearby")
async def get_nearby_businesses(lat: float, lng: float, radius_km: float = 3.0, limit: int = 20):
    businesses = await get_businesses()
    results = []
    for biz in businesses:
        try:
            dist = geo_service.distance_km(lat, lng, float(biz["lat"]), float(biz["lng"]))
        except Exception:
            continue
        if dist <= radius_km:
            biz_copy = dict(biz)
            biz_copy["distance_km"] = round(dist, 2)
            results.append(biz_copy)
    results.sort(key=lambda b: b.get("distance_km", 9999))
    return results[:limit]

@app.get("/api/businesses/search")
async def search_businesses(query: str, lat: Optional[float] = None, lng: Optional[float] = None, limit: int = 20):
    businesses = await get_businesses()
    q = query.lower().strip()
    filtered = [b for b in businesses if q in b.get("name", "").lower()]
    if lat is not None and lng is not None:
        for biz in filtered:
            try:
                biz["distance_km"] = round(
                    geo_service.distance_km(lat, lng, float(biz["lat"]), float(biz["lng"])), 2
                )
            except Exception:
                biz["distance_km"] = None
        filtered.sort(key=lambda b: b.get("distance_km") if b.get("distance_km") is not None else 9999)
    return filtered[:limit]

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
