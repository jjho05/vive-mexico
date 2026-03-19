# Vive México — Fase 1 (Ideación) / Phase 1 (Ideation)

**Track:** Fundación Coppel - Cancha justa en el mundial para los negocios turísticos locales  
**Objetivo particular:** Desarrollar una herramienta que dé visibilidad, atracción de clientes y conexión a los micro y pequeños negocios del sector turístico que atenderán a los millones de turistas mexicanos y de otros países que vendrán a México a presenciar el mundial de fútbol en el marco del programa Vive México diseñado e implementado por Impact Hub CDMX y apoyado por Fundación Coppel y Coppel Emprende.

---

## 1) Identificación del problema del track / Problem Identification

**ES — Problema principal (1 frase)**  
Los micro‑negocios turísticos locales pierden ventas porque los turistas no los encuentran, no entienden sus menús y no pueden pagar fácil con métodos internacionales.

**EN — Main problem (1 sentence)**  
Local tourism micro‑businesses lose sales because tourists can’t find them, can’t understand menus, and can’t pay easily with international methods.

**ES — Contexto y por qué importa**  
Durante el Mundial 2026 llegará un volumen extraordinario de visitantes. Hoy la mayoría se concentra en zonas y servicios “turísticos tradicionales”, dejando fuera a negocios locales auténticos. La falta de visibilidad digital, barreras de idioma y fricción en pagos limita su captación de clientes.

**EN — Context and why it matters**  
The 2026 World Cup will bring an extraordinary visitor influx. Most demand concentrates on traditional tourist zones, leaving authentic local businesses out. Limited digital visibility, language barriers, and payment friction reduce their customer capture.

**ES — Alcance**  
Vive México resuelve descubrimiento, comprensión del menú y pago internacional en una sola experiencia para turistas, y da visibilidad y captación a micro‑negocios.

**EN — Scope**  
Vive México solves discovery, menu understanding, and international payment in a single experience for tourists, while giving visibility and customer capture to micro‑businesses.

**ES — Evidencia rápida (datos públicos)**  
- En 2024 México recibió **45 millones de turistas internacionales**.  
- El **ingreso de divisas por visitantes internacionales** fue de **USD 32,956.3 millones** en 2024.  

**EN — Quick evidence (public data)**  
- In 2024 Mexico received **45 million international tourists**.  
- **International visitor spending** reached **USD 32,956.3 million** in 2024.  

**Fuentes / Sources:**  
1) SECTUR (11-Feb-2025) — “El turismo mexicano rebasa expectativas…”  
https://www.gob.mx/sectur/articulos/el-turismo-mexicano-rebasa-expectativas-con-el-ingreso-de-mas-de-32-mmdd-en-divisas-por-visitantes-internacionales-en-2024-7-4-mas-que-2023  

---

## 2) Usuario objetivo y escenario de uso / Target User & Use Case

**ES — Usuarios objetivo**  
1. Turistas nacionales e internacionales.  
2. Comerciantes locales (micro y pequeños negocios).  
3. Asociaciones/municipios (interesados en analítica B2B).

**EN — Target users**  
1. Domestic and international tourists.  
2. Local merchants (micro and small businesses).  
3. Local associations/municipalities (interested in B2B analytics).

**ES — Dolor principal**  
Turistas: no encuentran opciones auténticas, menús no entendibles, y pagos limitados.  
Comerciantes: poca visibilidad digital, baja conversión, pagos complicados.

**EN — Main pain points**  
Tourists: can’t find authentic options, menus are not understandable, payments are limited.  
Merchants: low digital visibility, low conversion, and complicated payments.

**ES — Escenario de uso (paso a paso)**  
1. Turista abre Vive México y permite ubicación.  
2. Ve mapa con locales cercanos y lugares relevantes.  
3. Escanea menú (OCR + traducción) y ve precios convertidos.  
4. Selecciona local, paga con QR en su moneda (comisión transparente).  
5. Comerciante recibe pago en MXN y ve su panel básico.

**EN — Use case (step-by-step)**  
1. Tourist opens Vive México and allows location.  
2. Sees a map with nearby local businesses and relevant places.  
3. Scans a menu (OCR + translation) and sees converted prices.  
4. Chooses a business and pays via QR in their currency (transparent fee).  
5. Merchant receives payment in MXN and sees basic dashboard.

**ES — Criterios de éxito (usuario)**  
- Encuentra un local auténtico en <5 minutos.  
- Entiende el menú sin pedir ayuda.  
- Puede pagar sin fricción en su moneda.  

**EN — Success criteria (user)**  
- Finds an authentic place in <5 minutes.  
- Understands the menu without assistance.  
- Pays frictionlessly in their currency.

---

## 3) Propuesta de solución (alto nivel) / Solution Proposal (High-Level)

**ES — ¿Qué es?**  
Una super‑app web móvil (PWA) para turismo local auténtico en el Mundial 2026.

**EN — What is it?**  
A mobile‑first web super‑app (PWA) for authentic local tourism during the 2026 World Cup.

**ES — ¿Qué hace?**  
- Descubrimiento local con mapa y búsqueda.  
- Menú Universal AI (OCR + traducción).  
- Pagos internacionales con QR (Stripe Connect).  
- Panel de datos para asociaciones.

**EN — What does it do?**  
- Local discovery with map and search.  
- Universal AI Menu (OCR + translation).  
- International QR payments (Stripe Connect).  
- Data dashboard for associations.

**ES — Resultado**  
Mayor visibilidad de micro‑negocios, aumento de ventas y mejor experiencia del turista.

**EN — Outcome**  
Higher visibility for micro‑businesses, increased sales, and better tourist experience.

**ES — Diferenciador**  
Integra descubrimiento + menú + pago en una misma experiencia con datos locales, evitando soluciones dispersas.

**EN — Differentiator**  
Combines discovery + menu + payment in a single experience with local data, avoiding fragmented solutions.

---

## 4) Justificación tecnológica / Technology Justification

**ES — Componentes principales y por qué**  
- **Frontend (Next.js + React):** experiencia móvil rápida, SSR/estático, escalable y fácil de iterar.  
- **Backend (FastAPI):** APIs rápidas, tipadas y fáciles de mantener.  
- **Supabase (DB + Auth):** reduce tiempo de implementación y permite RLS.  
- **Gemini OCR:** extracción confiable de texto en menús físicos.  
- **Leaflet + OSM:** mapas gratuitos sin licencias costosas.  
- **Stripe Connect Express:** pagos internacionales con onboarding simple.

**EN — Main components and why**  
- **Frontend (Next.js + React):** fast mobile UX, SSR/static options, scalable and easy to iterate.  
- **Backend (FastAPI):** fast, typed, maintainable APIs.  
- **Supabase (DB + Auth):** faster build time and RLS support.  
- **Gemini OCR:** reliable extraction from physical menus.  
- **Leaflet + OSM:** free maps with no costly licenses.  
- **Stripe Connect Express:** international payments with simplified onboarding.

**ES — Datos**  
Datos públicos (Wikipedia/OSM) + datos generados por el uso (locales, menús, pagos).  

**EN — Data**  
Public data (Wikipedia/OSM) + usage‑generated data (businesses, menus, payments).

**ES — IA / ML (si aplica)**  
OCR y extracción de menú con Gemini. Entradas: imagen; salida: texto estructurado.  
Evaluación: precisión OCR, tasa de menús detectados y nivel de corrección posterior.

**EN — AI / ML (if applicable)**  
Menu OCR and extraction with Gemini. Input: image; output: structured text.  
Evaluation: OCR accuracy, menu detection rate, post‑correction needed.

---

## 5) Arquitectura o flujo técnico / Technical Architecture or Flow

**Diagrama ASCII / ASCII Diagram**

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

**ES — Flujo de datos (entrada → procesamiento → salida)**  
Entrada: ubicación, imagen de menú, selección del local.  
Procesamiento: OCR + traducción + búsqueda local + conversión de moneda.  
Salida: menú entendible, rutas auténticas, pago en moneda del turista.

**EN — Data flow (input → processing → output)**  
Input: location, menu image, selected business.  
Processing: OCR + translation + local search + currency conversion.  
Output: understandable menu, authentic routes, payment in tourist currency.

**ES — Consideraciones**  
Latencia baja en mapas y OCR; trazabilidad de pagos; seguridad básica en auth y pagos.

**EN — Considerations**  
Low latency for maps and OCR; payment traceability; basic security in auth and payments.

---

## 6) Viabilidad cuantitativa (hackathon) / Quantitative Feasibility (Hackathon)

**ES — MVP funcional (demo)**  
- Registro de turista y comerciante.  
- Mapa con locales y POIs.  
- OCR de menú con traducción.  
- QR de pago con Stripe Connect Express.

**EN — MVP functional (demo)**  
- Tourist and merchant registration.  
- Map with businesses and POIs.  
- Menu OCR + translation.  
- QR payment via Stripe Connect Express.

**ES — Estimación de esfuerzo**  
- Frontend UX y mapas: media.  
- Backend APIs y OCR: media.  
- Stripe Connect + QR: alta.  
- QA y demo: media.

**EN — Effort estimate**  
- Frontend UX & maps: medium.  
- Backend APIs & OCR: medium.  
- Stripe Connect + QR: high.  
- QA & demo: medium.

**ES — Dependencias y riesgos**  
- APIs externas (OCR, mapas, pagos).  
- Permisos de ubicación.  
- Onboarding de Stripe.

**EN — Dependencies & risks**  
- External APIs (OCR, maps, payments).  
- Location permissions.  
- Stripe onboarding.

**ES — Mitigación**  
Fallback con OCR local, POIs simulados, o pagos simulados si Stripe no está listo.

**EN — Mitigation**  
Fallback with local OCR, simulated POIs, or simulated payments if Stripe is not ready.

---

## 7) Impacto y sostenibilidad (medible) / Impact & Sustainability (Measurable)

**ES — KPIs propuestos**  
1) # turistas activos mensuales.  
2) # escaneos de menú por negocio.  
3) % de pagos completados vs iniciados.  
4) Ingreso adicional estimado a micro‑negocios.  
5) Tiempo promedio para encontrar un local auténtico.

**EN — Proposed KPIs**  
1) # monthly active tourists.  
2) # menu scans per business.  
3) % completed payments vs initiated.  
4) Estimated additional revenue for micro‑businesses.  
5) Average time to find an authentic place.

**ES — Supuesto cuantitativo inicial**  
Si capturamos 0.1% de los turistas internacionales 2024 como usuarios activos, el piloto alcanzaría ~45,000 usuarios.  

**EN — Initial quantitative assumption**  
If we capture 0.1% of 2024 international tourists as active users, the pilot reaches ~45,000 users.

**ES — Sostenibilidad**  
Costos bajos por uso de OSM/Wikipedia, costos variables por OCR y pagos; posibilidad de modelo freemium/afiliación con municipios.

**EN — Sustainability**  
Low costs with OSM/Wikipedia, variable costs for OCR and payments; possible freemium or municipal partnerships.

---

## 8) Equipo: integrantes, roles y responsabilidades / Team

**ES — Equipo (por definir)**  
| Rol | Responsabilidades | Entregables |
|---|---|---|
| Product/PM | Definición de MVP y roadmap | Pitch + backlog |
| Frontend | UI/UX, mapa, flows | App web |
| Backend | APIs, OCR, pagos | Servicios y endpoints |
| Data/IA | OCR, métricas, analítica | Pipeline de datos |
| UX/UI | Diseño móvil | Prototipo visual |

**EN — Team (TBD)**  
| Role | Responsibilities | Deliverables |
|---|---|---|
| Product/PM | MVP definition and roadmap | Pitch + backlog |
| Frontend | UI/UX, maps, flows | Web app |
| Backend | APIs, OCR, payments | Services and endpoints |
| Data/AI | OCR, metrics, analytics | Data pipeline |
| UX/UI | Mobile design | Visual prototype |

---

## 9) Entregables Fase 1 / Phase 1 Deliverables

**ES**  
- Documento Fase 1 (PDF + MD).  
- Diagrama ASCII de arquitectura.  
- Tabla de KPIs y supuestos.  
- Tabla de roles.

**EN**  
- Phase 1 document (PDF + MD).  
- ASCII architecture diagram.  
- KPI table and assumptions.  
- Roles table.

---

## Roadmap / Improvements

**ES — Corto plazo (hackathon)**  
- Estabilidad y UX crítica (auth, mapa, OCR).  
- Flujo de pago QR completo.  
- Onboarding simple para comerciante.

**EN — Short term (hackathon)**  
- Stability and critical UX (auth, map, OCR).  
- End‑to‑end QR payment flow.  
- Simple merchant onboarding.

**ES — Medio plazo**  
- Panel B2B (OlaData Hub) con métricas agregadas.  
- Recomendaciones mejoradas (LocalScore 2.0).  
- Antifraude básico en pagos.

**EN — Mid term**  
- B2B dashboard (OlaData Hub) with aggregated metrics.  
- Improved recommendations (LocalScore 2.0).  
- Basic payment anti‑fraud.

**ES — Largo plazo**  
- Integraciones con gobiernos/municipios.  
- Observabilidad y escalabilidad a nivel nacional.  
- Programas de fidelidad y alianzas.

**EN — Long term**  
- Integrations with municipalities and government.  
- Observability and national‑scale readiness.  
- Loyalty programs and partnerships.

---

## Referencias / References

1) Secretaría de Turismo (SECTUR) — Turismo internacional 2024  
https://www.gob.mx/sectur
