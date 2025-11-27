from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from datetime import datetime
from typing import Optional

from .loan_offer_dto import LoanOfferResponseDTO


class CustomerCreateDTO(BaseModel):
    """
    DTO for creating customer
    """
    first_name: str = Field(..., min_length=1, max_length=100, description="Customer's first name")
    last_name: str = Field(..., min_length=1, max_length=100, description="Customer's last name")
    email: EmailStr = Field(..., description="Customer's email address")
    phone: Optional[str] = Field(None, pattern=r'^\+?[\d\s\-\(\)]+$', description="Customer's phone number")
    address: Optional[str] = Field(None, max_length=500, description="Customer's address")
    
    @field_validator('first_name', 'last_name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        """
        Custom validator for names
        """
        v = v.strip()
        if not v:
            raise ValueError('Name cannot be empty or just whitespace')
        return v
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        """Normalize phone number"""
        if v:
            v = v.strip()
            return v if v else None
        return v
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "first_name": "Max",
                "last_name": "Mustermann",
                "email": "max.mustermann@example.com",
                "phone": "+49 123 456789",
                "address": "Musterstraße 1, 10115 Berlin"
            }
        }
    )


class CustomerUpdateDTO(BaseModel):
    """
    Partial update DTO
    """
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, pattern=r'^\+?[\d\s\-\(\)]+$')
    address: Optional[str] = Field(None, max_length=500)


class CustomerResponseDTO(BaseModel):
    """
    DTO for customer responses
    """
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class CustomerWithLoanOffersDTO(CustomerResponseDTO):
    """
    Extended response with relationships
    """
    loan_offers: list["LoanOfferResponseDTO"] = []