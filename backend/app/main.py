from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from contextlib import asynccontextmanager

from .config import settings
from .infrastructure.database.connection import init_db, DatabaseConnection
from .infrastructure.api.v1 import customers, loan_offers
from .infrastructure.api.error_handlers import (
    domain_exception_handler,
    customer_not_found_handler,
    customer_exists_handler,
    loan_offer_not_found_handler,
    validation_exception_handler,
    integrity_error_handler,
    sqlalchemy_error_handler,
    application_exception_handler,
    generic_exception_handler,
)
from .application.exceptions import (
    CustomerNotFoundError,
    CustomerAlreadyExistsError,
    LoanOfferNotFoundError,
    ApplicationException,
)
from .domain.exceptions import DomainException


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager
    """
    # Startup
    print("Starting Bees & Bears Loan Platform...")
    await init_db()
    print("Database initialized")
    
    yield
    
    # Shutdown
    print("Shutting down...")
    await DatabaseConnection.close()
    print("Database connections closed")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
    Loan offer platform for green technologies.
    
    ## Features
    * Create and manage customers
    * Generate loan offers with automatic payment calculation
    * Real-time loan calculation
    * RESTful API with OpenAPI documentation
    
    ## Business Logic
    * Amortization formula for accurate monthly payments
    * Support for 0% interest loans
    * Comprehensive validation
    """,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Order matters: specific to general
app.add_exception_handler(CustomerNotFoundError, customer_not_found_handler)
app.add_exception_handler(CustomerAlreadyExistsError, customer_exists_handler)
app.add_exception_handler(LoanOfferNotFoundError, loan_offer_not_found_handler)
app.add_exception_handler(DomainException, domain_exception_handler)
app.add_exception_handler(ApplicationException, application_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_error_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Include routers
app.include_router(customers.router, prefix=settings.API_V1_PREFIX)
app.include_router(loan_offers.router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["root"])
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Bees & Bears Loan Platform API",
        "docs": "/docs",
        "version": settings.VERSION
    }


@app.get("/health", tags=["health"])
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "version": settings.VERSION
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )