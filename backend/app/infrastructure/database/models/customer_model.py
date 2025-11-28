from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from typing import TYPE_CHECKING, List
from ..connection import Base

if TYPE_CHECKING:
    from .loan_offer_model import LoanOfferModel


class CustomerModel(Base):
    """
    SQLAlchemy ORM Model for Customer
    """
    __tablename__ = "customers"
    
    # Primary key
    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
        comment="Customer unique identifier"
    )
    
    # Customer information
    first_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="Customer's first name"
    )
    
    last_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        comment="Customer's last name"
    )
    
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
        comment="Customer's email address (unique)"
    )
    
    phone: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
        comment="Customer's phone number"
    )
    
    address: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
        comment="Customer's address"
    )
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="Record creation timestamp"
    )
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="Record last update timestamp"
    )
    
    # Relationships
    loan_offers: Mapped[List["LoanOfferModel"]] = relationship(
        "LoanOfferModel",
        back_populates="customer",
        cascade="all, delete-orphan",
        lazy="selectin"  # Eager loading to prevent N+1
    )
    
    def __repr__(self) -> str:
        return f"<CustomerModel(id={self.id}, email='{self.email}')>"