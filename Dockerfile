# Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Build Backend
FROM python:3.9-slim
WORKDIR /app

# Copy backend requirements
COPY backend/requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY backend/ backend/
COPY data/ data/

# Copy built frontend assets to backend/static
COPY --from=frontend-builder /app/frontend/dist backend/static

# Set working directory to backend
WORKDIR /app/backend

# Command
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
