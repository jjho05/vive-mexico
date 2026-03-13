import os
from supabase import create_client, Client

# Este script llena la base de datos con negocios reales para la demo
# Se recomienda correrlo localmente una vez tengas tu .env configurado

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("❌ Error: Necesitas configurar SUPABASE_URL y SUPABASE_KEY como variables de entorno.")
    exit(1)

supabase: Client = create_client(url, key)

REAL_BUSINESSES = [
    {
        "name": "Tacos Los Cocuyos",
        "category": "Comida",
        "description": "Famosos tacos de suadero y tripa en el corazón del Centro Histórico.",
        "tags": ["tacos", "centro", "tradicional", "barato"],
        "image_url": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
        "lat": 19.4312,
        "lng": -99.1352,
        "rating": 4.9,
        "address": "Calle de Bolívar 57, Centro Histórico"
    },
    {
        "name": "Artesanías El Caracol",
        "category": "Compras",
        "description": "Lo mejor del arte popular mexicano: textiles de Oaxaca y alebrijes.",
        "tags": ["artesanías", "regalos", "cultura", "oaxaca"],
        "image_url": "https://images.unsplash.com/photo-1590076215667-873d3215904a",
        "lat": 19.4350,
        "lng": -99.1380,
        "rating": 4.7,
        "address": "Av. Juárez 70, Colonia Centro"
    },
    {
        "name": "Pastelería Ideal",
        "category": "Comida",
        "description": "Icónica panadería mexicana abierta desde 1927. Prueba las conchas.",
        "tags": ["panadería", "postres", "histórico", "tradicional"],
        "image_url": "https://images.unsplash.com/photo-1555507036-ab1f4038808a",
        "lat": 19.4338,
        "lng": -99.1365,
        "rating": 4.8,
        "address": "Av. 16 de Septiembre 18, Centro"
    }
]

def seed_db():
    print("🚀 Iniciando carga de datos en Supabase...")
    for biz in REAL_BUSINESSES:
        try:
            res = supabase.table("businesses").insert(biz).execute()
            print(f"✅ Insertado: {biz['name']}")
        except Exception as e:
            print(f"❌ Error insertando {biz['name']}: {e}")
    print("✨ ¡Base de datos lista!")

if __name__ == "__main__":
    seed_db()
