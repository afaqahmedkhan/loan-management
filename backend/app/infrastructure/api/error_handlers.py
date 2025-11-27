from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
import traceback
from datetime import datetime

from ...application.exceptions import (
    CustomerNotFoundError,
    CustomerAlreadyExistsError,
    LoanOfferNotFoundError,
    ApplicationException,
)
from ...domain.exceptions import (
    DomainException,
    InvalidMoneyError,
    InvalidEmailError,
    InvalidPercentageError,
    InvalidLoanParametersError,
)
from ...shared.response_models import ErrorResponse, ErrorDetail
from ...config import settings


async def domain_exception_handler(request: Request, exc: DomainException):
    """
    Handle domain exceptions
    """
    # Determine specific error code
    error_code_map = {
        InvalidMoneyError: "INVALID_MONEY",
        InvalidEmailError: "INVALID_EMAIL",
        InvalidPercentageError: "INVALID_PERCENTAGE",
        InvalidLoanParametersError: "INVALID_LOAN_PARAMETERS",
    }
    
    error_code = error_code_map.get(type(exc), "DOMAIN_ERROR")
    
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=ErrorResponse(
            code=error_code,
            message=str(exc),
            _dev=ErrorDetail(
                traceback=traceback.format_exc() if settings.DEBUG else None,
                timestamp=datetime.fromtimestamp(),
                path=str(request.url.path)
            ) if settings.DEBUG else None
        ).model_dump(exclude_none=True)
    )


async def customer_not_found_handler(request: Request, exc: CustomerNotFoundError):
    """
    Handle customer not found
    """
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content=ErrorResponse(
            code="CUSTOMER_NOT_FOUND",
            message=str(exc),
            _dev=ErrorDetail(
                timestamp=datetime.fromtimestamp(),
                path=str(request.url.path)
            ) if settings.DEBUG else None
        ).model_dump(exclude_none=True)
    )


async def customer_exists_handler(request: Request, exc: CustomerAlreadyExistsError):
    """
    Handle duplicate customer
    
    409 Conflict = Resource already exists
    """
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content=ErrorResponse(
            code="CUSTOMER_ALREADY_EXISTS",
            message=str(exc)
        ).model_dump(exclude_none=True)
    )


async def loan_offer_not_found_handler(request: Request, exc: LoanOfferNotFoundError):
    """Handle loan offer not found"""
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content=ErrorResponse(
            code="LOAN_OFFER_NOT_FOUND",
            message=str(exc)
        ).model_dump(exclude_none=True)
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle Pydantic validation errors

    """
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ErrorResponse(
            code="VALIDATION_ERROR",
            message="Invalid request data. Please check your input.",
            _dev=ErrorDetail(
                traceback=str(exc.errors()) if settings.DEBUG else None,
                timestamp=datetime.fromtimestamp(),
                path=str(request.url.path)
            ) if settings.DEBUG else None
        ).model_dump(exclude_none=True)
    )


async def integrity_error_handler(request: Request, exc: IntegrityError):
    """
    Handle database integrity errors    
    """
    error_message = "Data integrity constraint violated"
    
    error_str = str(exc.orig) if hasattr(exc, 'orig') else str(exc)
    
    if 'unique constraint' in error_str.lower():
        error_message = "A record with this value already exists"
    elif 'foreign key' in error_str.lower():
        error_message = "Referenced record does not exist"
    elif 'not null' in error_str.lower():
        error_message = "Required field cannot be empty"
    
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content=ErrorResponse(
            code="DATABASE_INTEGRITY_ERROR",
            message=error_message,
            _dev=ErrorDetail(
                traceback=str(exc) if settings.DEBUG else None,
                timestamp=datetime.fromtimestamp(),
                path=str(request.url.path)
            ) if settings.DEBUG else None
        ).model_dump(exclude_none=True)
    )


async def sqlalchemy_error_handler(request: Request, exc: SQLAlchemyError):
    """Handle general SQLAlchemy errors"""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            code="DATABASE_ERROR",
            message="A database error occurred",
            _dev=ErrorDetail(
                traceback=str(exc) if settings.DEBUG else None,
                timestamp=datetime.fromtimestamp(),
                path=str(request.url.path)
            ) if settings.DEBUG else None
        ).model_dump(exclude_none=True)
    )


async def application_exception_handler(request: Request, exc: ApplicationException):
    """Handle general application exceptions"""
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=ErrorResponse(
            code="APPLICATION_ERROR",
            message=str(exc),
            _dev=ErrorDetail(
                traceback=traceback.format_exc() if settings.DEBUG else None,
                timestamp=datetime.fromtimestamp(),
                path=str(request.url.path)
            ) if settings.DEBUG else None
        ).model_dump(exclude_none=True)
    )


async def generic_exception_handler(request: Request, exc: Exception):
    """
    Catch-all for unexpected errors
    """
    # Log the error (in production, use proper logging)
    print(f"Unhandled exception: {exc}")
    if settings.DEBUG:
        print(traceback.format_exc())
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            code="INTERNAL_SERVER_ERROR",
            message="An unexpected error occurred. Please try again later.",
            _dev=ErrorDetail(
                traceback=traceback.format_exc() if settings.DEBUG else None,
                timestamp=datetime.fromtimestamp(),
                path=str(request.url.path)
            ) if settings.DEBUG else None
        ).model_dump(exclude_none=True)
    )