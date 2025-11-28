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

### Screenshots

<img width="400" height="400" alt="Screenshot 2025-11-28 at 21 35 41" src="https://github.com/user-attachments/assets/0560f98b-18f4-4013-bb94-52d9872ecf52" />
<img width="400" height="400" alt="Screenshot 2025-11-28 at 21 35 53" src="https://github.com/user-attachments/assets/8cdb935d-ab8a-4fb4-aaf5-22a2ee2c306f" />
<img width="400" height="400" alt="Screenshot 2025-11-28 at 21 36 17" src="https://github.com/user-attachments/assets/cebedf99-9e27-476c-8e20-177429d08874" />

