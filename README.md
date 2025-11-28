# Bees & Bears Loan Platform

A loan offer platform 

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- Docker & Docker Compose installed
- Git

### Run Full Stack Application
```bash
# Clone the repository
git clone <your-repo-url>
cd loan-management

# Start all services (Database + Backend + Frontend)
docker-compose up --build

# Services will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000
# - API Docs: http://localhost:8000/docs
# - Database: localhost:5432
```


### Stop the Application
```bash
# Stop all services
docker-compose down

# Stop and remove all data (fresh start)
docker-compose down -v
```

### Development Mode (with hot reload)
```bash
# Use dev compose file for hot reloading
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Both backend and frontend will auto-reload on code changes
```

---

## 🛠️ Local Development (Without Docker)

### Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create database
createdb bees_bears

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run migrations
alembic upgrade head

# Start backend
uvicorn app.main:app --reload
```

Backend runs at: http://localhost:8000

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local if needed

# Start development server
npm run dev
```

Frontend runs at: http://localhost:3000


## 📚 API Documentation

**When running:** Visit http://localhost:8000/docs


### Backend `.env`
```env
DATABASE_URL=postgresql+asyncpg://beesuser:beespass@localhost:5432/bees_bears
DEBUG=true
ALLOWED_ORIGINS=["http://localhost:3000"]
MAX_PAGE_SIZE=100
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```
