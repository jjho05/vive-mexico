# Dockerfile para Hugging Face Spaces (Frontend + Backend)

# Etapa 1: Build del Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Etapa 2: Runtime del Backend y Servidor de Archivos
FROM python:3.11-slim
WORKDIR /app

# Instalar dependencias del sistema para OpenCV y OCR
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglx0 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el backend
COPY backend/ ./backend

# Copiar el frontend compilado (Next.js export)
# Nota: Para HF Spaces, a veces es más fácil servir el frontend vía FastAPI
COPY --from=frontend-builder /app/frontend/out ./static

# Exponer el puerto que usa HF Spaces (7860)
EXPOSE 7860

# Comando para iniciar la app
# Serving static files with FastAPI for a single-container deployment
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
