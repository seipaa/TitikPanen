# AgroMesh AI - Regional Harvest Intelligence Platform

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for local backend development)

### Running with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **MinIO Console**: http://localhost:9001
- **API Docs**: http://localhost:8000/docs

### Default Credentials
- MinIO: minioadmin / minioadmin

### Local Development

**Backend:**
```bash
cd apps/backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd apps/web
npm install
npm run dev
```

### Environment Variables
Copy `.env.example` to `.env` in `apps/backend/` and configure:
- `SECRET_KEY`: JWT secret key
- `MINIO_ENDPOINT`: MinIO server address
- `AI_API_URL`: Your AI service endpoint

## Architecture
```
ESP32-CAM → FastAPI → AI Inference + BMKG Weather
                ↓
        Harvest Intelligence Engine
                ↓
         Next.js Dashboard
```

## Features
- JWT Authentication
- Role-based access (Farmer, Cooperative, Food Authority)
- Regional map with color-coded markers
- Harvest recommendations
- Weather integration (BMKG)
- Disease detection alerts
- Analytics dashboards