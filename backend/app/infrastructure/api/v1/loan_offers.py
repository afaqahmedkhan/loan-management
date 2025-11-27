from fastapi import APIRouter, Depends, Query, status
from typing import List

from ....application.dtos.loan_offer_dto import (
    LoanOfferCreateDTO,
    LoanOfferResponseDTO,
    LoanCalculationDTO,
    LoanCalculationResponseDTO,
)
from ....application.use_cases.loan_offer import (
    CreateLoanOfferUseCase,
    CalculateLoanUseCase,
    ListCustomerLoanOffersUseCase,
)
from ....shared.response_models import SuccessResponse, PaginatedResponse
from ..dependencies import (
    get_create_loan_offer_use_case,
    get_calculate_loan_use_case,
    get_list_customer_loan_offers_use_case,
)

router = APIRouter(prefix="/loanoffers", tags=["loan-offers"])


@router.post(
    "/",
    response_model=SuccessResponse[LoanOfferResponseDTO],
    status_code=status.HTTP_201_CREATED,
    summary="Create a loan offer",
    description="Create a new loan offer. Monthly payment and totals are calculated automatically.",
    responses={
        201: {"description": "Loan offer created successfully"},
        404: {"description": "Customer not found"},
        422: {"description": "Invalid loan parameters"},
    }
)
async def create_loan_offer(
    loan_data: LoanOfferCreateDTO,
    use_case: CreateLoanOfferUseCase = Depends(get_create_loan_offer_use_case)
):
    """Create a new loan offer"""
    loan_offer = await use_case.execute(loan_data)
    return SuccessResponse(
        data=loan_offer,
        message="Loan offer created successfully"
    )


@router.post(
    "/calculate",
    response_model=SuccessResponse[LoanCalculationResponseDTO],
    summary="Calculate loan payments",
    description="Calculate monthly payment without creating an offer. Used for real-time UI feedback.",
    responses={
        200: {"description": "Calculation successful"},
        422: {"description": "Invalid parameters"},
    }
)
async def calculate_loan(
    calculation_data: LoanCalculationDTO,
    use_case: CalculateLoanUseCase = Depends(get_calculate_loan_use_case)
):
    """Real-time loan calculation for UI"""
    result = await use_case.execute(calculation_data)
    return SuccessResponse(data=result)


@router.get(
    "/customer/{customer_id}",
    response_model=PaginatedResponse[LoanOfferResponseDTO],
    summary="Get customer's loan offers",
    description="Get all loan offers for a specific customer with pagination",
    responses={
        200: {"description": "List of loan offers"},
        404: {"description": "Customer not found"},
    }
)
async def get_customer_loan_offers(
    customer_id: int,
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=100, description="Number of records to return"),
    use_case: ListCustomerLoanOffersUseCase = Depends(get_list_customer_loan_offers_use_case)
):
    """
    Get all loan offers for a customer
    
    """
    offers, total_count = await use_case.execute(customer_id, skip, limit)
    
    return PaginatedResponse(
        data=offers,
        total=total_count,
        skip=skip,
        limit=limit,
        has_more=(skip + limit) < total_count
    )