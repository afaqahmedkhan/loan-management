from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, Any
from datetime import datetime

T = TypeVar('T')


class ErrorDetail(BaseModel):
    """
    Development error details
    """
    traceback: Optional[str] = None
    timestamp: datetime
    path: Optional[str] = None


class ErrorResponse(BaseModel):
    """
    Standardized error response
        
    Example:
    {
        "code": "CUSTOMER_NOT_FOUND",
        "message": "Customer with ID 123 not found",
        "_dev": {  // Only in DEBUG mode
            "traceback": "...",
            "timestamp": "2025-01-15T10:30:00",
            "path": "/api/v1/customers/123"
        }
    }
    """
    code: str
    message: str
    _dev: Optional[ErrorDetail] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "code": "CUSTOMER_NOT_FOUND",
                "message": "Customer with ID 123 not found"
            }
        }


class SuccessResponse(BaseModel, Generic[T]):
    """
    Standardized success response

    Example:
    {
        "data": { "id": 1, "email": "..." },
        "message": "Customer created successfully"
    }
    """
    data: T
    message: Optional[str] = None


class PaginatedResponse(BaseModel, Generic[T]):
    """
    Response for paginated data
    
    Example:
    {
        "data": [{...}, {...}],
        "total": 150,
        "skip": 20,
        "limit": 10,
        "has_more": true
    }
    """
    data: list[T]
    total: int
    skip: int
    limit: int
    has_more: bool
    
    class Config:
        json_schema_extra = {
            "example": {
                "data": [],
                "total": 150,
                "skip": 20,
                "limit": 10,
                "has_more": True
            }
        }