from pydantic import BaseModel, Field, field_validator, ConfigDict
from decimal import Decimal
from datetime import datetime
from typing import Optional


class LoanOfferCreateDTO(BaseModel):
    """
    DTO for creating loan offer
    """
    customer_id: int = Field(..., gt=0, description="Customer ID")
    loan_amount: Decimal = Field(
        ...,
        gt=0,
        le=Decimal('1000000'),
        description="Loan amount in EUR (max 1,000,000)"
    )
    interest_rate: Decimal = Field(
        ...,
        ge=0,
        le=100,
        description="Annual interest rate as percentage (0-100)"
    )
    term_months: int = Field(
        ...,
        gt=0,
        le=360,
        description="Loan term in months (max 30 years)"
    )
    
    @field_validator('loan_amount', 'interest_rate')
    @classmethod
    def round_to_two_decimals(cls, v: Decimal) -> Decimal:
        """
        Ensure 2 decimal precision
        """
        from decimal import ROUND_HALF_UP
        return v.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    @field_validator('loan_amount')
    @classmethod
    def validate_loan_amount(cls, v: Decimal) -> Decimal:
        """Business rule: minimum loan amount"""
        if v < Decimal('1000'):
            raise ValueError('Minimum loan amount is €1,000')
        return v
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "customer_id": 1,
                "loan_amount": 10000.00,
                "interest_rate": 5.5,
                "term_months": 24
            }
        }
    )


class LoanOfferResponseDTO(BaseModel):
    """
    Complete loan offer response
    """
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    customer_id: int
    loan_amount: Decimal
    interest_rate: Decimal
    term_months: int
    monthly_payment: Decimal
    total_payment: Decimal
    total_interest: Decimal
    created_at: datetime


class LoanCalculationDTO(BaseModel):
    """
    DTO for real-time calculation (no persistence)
    """
    loan_amount: Decimal = Field(..., gt=0, le=Decimal('1000000'))
    interest_rate: Decimal = Field(..., ge=0, le=100)
    term_months: int = Field(..., gt=0, le=360)
    
    @field_validator('loan_amount', 'interest_rate')
    @classmethod
    def round_to_two_decimals(cls, v: Decimal) -> Decimal:
        from decimal import ROUND_HALF_UP
        return v.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


class LoanCalculationResponseDTO(BaseModel):
    """Response for calculation"""
    monthly_payment: Decimal
    total_payment: Decimal
    total_interest: Decimal
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "monthly_payment": 856.07,
                "total_payment": 10272.84,
                "total_interest": 272.84
            }
        }
    )