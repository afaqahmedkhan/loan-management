from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession,
    AsyncEngine
)
from sqlalchemy.orm import declarative_base
from typing import AsyncGenerator
from ...config import settings

Base = declarative_base()


class DatabaseConnection:
    """
    Database connection manager
    """
    _engine: AsyncEngine | None = None
    _sessionmaker: async_sessionmaker[AsyncSession] | None = None
    
    @classmethod
    def get_engine(cls) -> AsyncEngine:
        """
        Get or create database engine
        """
        if cls._engine is None:
            cls._engine = create_async_engine(
                settings.DATABASE_URL,
                echo=settings.DEBUG,  # Log SQL in debug mode
                pool_pre_ping=True,   # Verify connections
                pool_size=10,         # Base connection pool
                max_overflow=20,      # Additional connections
                pool_recycle=3600,    # Recycle after 1 hour
            )
        return cls._engine
    
    @classmethod
    def get_sessionmaker(cls) -> async_sessionmaker[AsyncSession]:
        """
        Get or create session factory

        """
        if cls._sessionmaker is None:
            engine = cls.get_engine()
            cls._sessionmaker = async_sessionmaker(
                engine,
                class_=AsyncSession,
                expire_on_commit=False,
                autocommit=False,
                autoflush=False,
            )
        return cls._sessionmaker
    
    @classmethod
    async def close(cls):
        """
        Close all database connections
        
        Called during application shutdown
        """
        if cls._engine:
            await cls._engine.dispose()
            cls._engine = None
            cls._sessionmaker = None


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Get database session for FastAPI dependency injection
    """
    sessionmaker = DatabaseConnection.get_sessionmaker()
    async with sessionmaker() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    """
    Initialize database (create tables)
    """
    engine = DatabaseConnection.get_engine()
    async with engine.begin() as conn:
        # Import models to register them
        from .models import CustomerModel, LoanOfferModel
        
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)


async def drop_db():
    """Drop all tables (for testing)"""
    engine = DatabaseConnection.get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)