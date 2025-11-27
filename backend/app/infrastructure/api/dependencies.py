from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator

from ..database.connection import get_session
from ..database.unit_of_work import UnitOfWork
from ...application.interfaces.unit_of_work import IUnitOfWork
from ...application.use_cases.customer import (
    CreateCustomerUseCase,
    GetCustomerUseCase,
    ListCustomersUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
)
from ...application.use_cases.loan_offer import (
    CreateLoanOfferUseCase,
    CalculateLoanUseCase,
    GetLoanOfferUseCase,
    ListCustomerLoanOffersUseCase,
)
from ...config import settings


async def get_uow(
    session: AsyncSession = Depends(get_session)
) -> AsyncGenerator[IUnitOfWork, None]:
    """
    Dependency for Unit of Work
    
    Usage:
    @router.post("/customers")
    async def create_customer(
        uow: IUnitOfWork = Depends(get_uow)
    ):
        ...
    """
    uow = UnitOfWork(session)
    try:
        yield uow
    finally:
        await uow._session.close()


# Customer Use Case Dependencies
def get_create_customer_use_case(
    uow: IUnitOfWork = Depends(get_uow)
) -> CreateCustomerUseCase:
    """
    Dependency for CreateCustomerUseCase
    """
    return CreateCustomerUseCase(uow)


def get_get_customer_use_case(
    uow: IUnitOfWork = Depends(get_uow)
) -> GetCustomerUseCase:
    return GetCustomerUseCase(uow)


def get_list_customers_use_case(
    uow: IUnitOfWork = Depends(get_uow)
) -> ListCustomersUseCase:
    return ListCustomersUseCase(uow, max_limit=settings.MAX_PAGE_SIZE)


def get_update_customer_use_case(
    uow: IUnitOfWork = Depends(get_uow)
) -> UpdateCustomerUseCase:
    return UpdateCustomerUseCase(uow)


def get_delete_customer_use_case(
    uow: IUnitOfWork = Depends(get_uow)
) -> DeleteCustomerUseCase:
    return DeleteCustomerUseCase(uow)


# Loan Offer Use Case Dependencies
def get_create_loan_offer_use_case(
    uow: IUnitOfWork = Depends(get_uow)
) -> CreateLoanOfferUseCase:
    return CreateLoanOfferUseCase(uow)


def get_calculate_loan_use_case() -> CalculateLoanUseCase:
    """
    No database needed for calculation
    """
    return CalculateLoanUseCase()


def get_get_loan_offer_use_case(
    uow: IUnitOfWork = Depends(get_uow)
) -> GetLoanOfferUseCase:
    return GetLoanOfferUseCase(uow)


def get_list_customer_loan_offers_use_case(
    uow: IUnitOfWork = Depends(get_uow)
) -> ListCustomerLoanOffersUseCase:
    return ListCustomerLoanOffersUseCase(uow, max_limit=settings.MAX_PAGE_SIZE)