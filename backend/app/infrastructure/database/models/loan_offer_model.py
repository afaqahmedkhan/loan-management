from sqlalchemy import ForeignKey, Numeric, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from decimal import Decimal
from ..connection import Base
from .customer_model import CustomerModel


class LoanOfferModel(Base):
    """
    SQLAlchemy ORM Model for Loan Offer
    
    """
    __tablename__ = "loan_offers"
    
    # Primary key
    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
        comment="Loan offer unique identifier"
    )
    
    # Foreign key to customer
    customer_id: Mapped[int] = mapped_column(
        ForeignKey("customers.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Reference to customer"
    )
    
    # Loan parameters
    loan_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        comment="Principal loan amount in EUR"
    )
    
    interest_rate: Mapped[Decimal] = mapped_column(
        Numeric(5, 2),
        nullable=False,
        comment="Annual interest rate as percentage (e.g., 5.50)"
    )
    
    term_months: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        comment="Loan term in months"
    )
    
    # Calculated fields (stored for historical accuracy)
    monthly_payment: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        comment="Calculated monthly payment"
    )
    
    total_payment: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        comment="Total amount to be paid"
    )
    
    total_interest: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        comment="Total interest to be paid"
    )
    
    # Timestamp
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="Record creation timestamp"
    )
    
    # Relationship to customer
    customer: Mapped[CustomerModel] = relationship(
        "CustomerModel",
        back_populates="loan_offers"
    )
    
    def __repr__(self) -> str:
        return f"<LoanOfferModel(id={self.id}, customer_id={self.customer_id}, amount={self.loan_amount})>"