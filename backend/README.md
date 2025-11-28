# Bees & Bears Loan Platform

A loan offer platform

## Quick Start (Docker - Recommended)

### Prerequisites
- Docker & Docker Compose installed
- Git

### Run the Application
```bash
# Clone the repository
git clone <your-repo-url>
cd beesandbears

# Start everything with Docker
docker-compose up --build

# Backend will be available at:
# - API: http://localhost:8000
# - Swagger Docs: http://localhost:8000/docs
```

That's it! The database will be created and migrations run automatically.

### Stop the Application
```bash
docker-compose down

# To remove volumes (delete data):
docker-compose down -v
```

---

## 🛠️ Local Development (Without Docker)

### Prerequisites
- Python 3.12+
- PostgreSQL 16+

### Setup
```bash
# 1. Clone repository
git clone <your-repo-url>
cd beesandbears/backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create PostgreSQL database
createdb bees_bears

# 5. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 6. Run migrations
alembic upgrade head

# 7. Start server
uvicorn app.main:app --reload
```

Visit http://localhost:8000/docs for API documentation.