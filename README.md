---
title: Vive México
emoji: 🌮
colorFrom: green
colorTo: red
sdk: docker
app_port: 7860
pinned: false
---

# Vive México — World Cup 2026 Edition

**Vive México** es una super‑app para **nivelar la cancha digital** entre turistas del Mundial 2026 y micro‑negocios locales, con **descubrimiento auténtico**, **menús universales con IA**, **pagos internacionales con QR**, y **datos útiles** para decisiones locales.

---

## Problema y solución (resumen)

**Problema (1 frase):** Los micro‑negocios turísticos locales pierden ventas porque los turistas no los encuentran, no entienden menús y no pueden pagar fácil con métodos internacionales.

**Solución:** Vive México unifica **descubrimiento**, **menú entendible** y **pago internacional** en una sola experiencia.

---

## Evidencia y KPIs

**Datos públicos (base):**
- 2024: **45 millones de turistas internacionales** en México.
- 2024: **USD 32,956.3 millones** en divisas por visitantes internacionales.

**KPIs propuestos:**
1) # turistas activos mensuales.  
2) # escaneos de menú por negocio.  
3) % de pagos completados vs iniciados.  
4) Ingreso adicional estimado a micro‑negocios.  
5) Tiempo promedio para encontrar un local auténtico.

**Referencia:**  
SECTUR (11‑Feb‑2025) — https://www.gob.mx/sectur/articulos/el-turismo-mexicano-rebasa-expectativas-con-el-ingreso-de-mas-de-32-mmdd-en-divisas-por-visitantes-internacionales-en-2024-7-4-mas-que-2023

---

## Arquitectura (alto nivel)

```
Turista/Comerciante
        |
   Web App (Next.js)
        |
   API (FastAPI)
  /   |      \
DB  OCR     Pagos
 |   |        |
Supabase   Stripe
 |   |
POIs (Wiki/OSM)
```

---

## Qué está implementado hoy

### Turista
- **Mapa de la ciudad** con puntos de interés (Wikipedia GeoSearch) + locales cercanos.
- **Ruta auténtica** basada en swipes (categorías guardadas).
- **Descubrimiento local** con búsqueda por nombre y “cerca de mí”.

### Comerciante
- Registro de comerciante + múltiples locales.
- Búsqueda de ubicación con autocompletado y mapa.
- **Stripe Connect Express** para cobros con QR.

### Menú Universal AI
- OCR y extracción con **Gemini** (`GEMINI_API_KEY`).
- Traducción y conversión de moneda en tiempo real.

---

## Roadmap / Mejoras

**Corto plazo (hackathon)**  
- Estabilidad y UX crítica (auth, mapa, OCR).  
- Flujo de pago QR completo.  
- Onboarding simple para comerciante.

**Medio plazo**  
- Panel B2B (OlaData Hub) con métricas agregadas.  
- Recomendaciones mejoradas (LocalScore 2.0).  
- Antifraude básico en pagos.

**Largo plazo**  
- Integraciones con gobiernos/municipios.  
- Observabilidad y escalabilidad a nivel nacional.  
- Programas de fidelidad y alianzas.

---

## Stack y Tecnologías (detalle)

### Backend (Python / FastAPI)
- **FastAPI**: API principal (REST).
- **Uvicorn**: servidor ASGI.
- **Pydantic**: validación de datos.
- **httpx**: llamadas a APIs externas (Wikipedia, Gemini).
- **supabase-py**: acceso a Supabase.
- **bcrypt**: hashing de contraseñas.
- **python-multipart**: manejo de imágenes para OCR.
- **Stripe SDK**: pagos y Connect Express.

### Frontend (Next.js / React)
- **Next.js 16** (App Router): UI web y despliegue estático.
- **React 19**: interfaz principal.
- **Tailwind CSS v4**: estilos.
- **Framer Motion**: animaciones (swipes).
- **i18next + react-i18next**: internacionalización.
- **Leaflet**: mapa interactivo.
- **Lucide React**: iconografía.

---

## Servicios y APIs usadas

- **Supabase** (DB + RLS)
- **Gemini** (OCR/vision)
- **Wikipedia GeoSearch** (POIs turísticos)
- **OpenStreetMap + Leaflet** (mapa interactivo)
- **Stripe Connect Express** (pagos con QR)

---

## APIs internas (resumen)

### Negocios y comerciantes
- `GET /api/businesses`
- `GET /api/businesses/nearby`
- `GET /api/businesses/search`
- `POST /api/merchants`
- `GET /api/merchants/{merchant_id}`
- `PUT /api/merchants/{merchant_id}`
- `GET /api/merchants/{merchant_id}/businesses`
- `POST /api/merchants/{merchant_id}/businesses`
- `PUT /api/merchants/{merchant_id}/businesses/{business_id}`

### Turistas
- `POST /api/tourists/register`
- `GET /api/tourists/{tourist_id}`
- `PUT /api/tourists/{tourist_id}`
- `DELETE /api/tourists/{tourist_id}`

### OCR y Menú Universal AI
- `POST /api/vision/scan-menu`

### Mapa y POIs
- `GET /api/poi/nearby`

### Pagos (Stripe)
- `POST /api/stripe/connect/create`
- `GET /api/stripe/connect/status`
- `POST /api/payments/checkout`

---

## Variables de entorno

**Backend:**
- `SUPABASE_URL`
- `SUPABASE_KEY` (service role recomendado para RLS)
- `GEMINI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_FEE_PERCENT` (default 0.036)
- `STRIPE_FEE_FIXED_MXN` (default 3.0)
- `STRIPE_FEE_EXTRA_PERCENT` (default 0.0)

---

## Tablas principales (Supabase)

- `merchants` (comerciantes, incluye `stripe_account_id`)
- `businesses` (locales)
- `tourists` (turistas)
- `accounts` (login email/contraseña)
- `swipes` (interacciones)

---

## Stripe Connect Express (flujo)

1. Comerciante → **Conectar Stripe**
2. Stripe abre onboarding Express (datos mínimos + CLABE)
3. Comerciante queda listo para recibir pagos
4. Se generan **QRs de cobro** con comisión transparente

---

## Cómo correr local

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Backend**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

---

## Notas importantes

- **Apple/Google Pay no son gratis**: requieren un PSP como Stripe.
- La comisión se suma al turista y se muestra en el QR.
- Para RLS en Supabase, usar `SUPABASE_KEY` service role en entorno del backend.

---

Desplegado automáticamente en Hugging Face Spaces (Docker).
