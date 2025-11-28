from sqlalchemy.ext.asyncio import AsyncSession

from ...application.interfaces.unit_of_work import IUnitOfWork
from ...application.interfaces.repositories import (
    ICustomerRepository,
    ILoanOfferRepository
)
from .repositories.customer_repository import CustomerRepository
from .repositories.loan_offer_repository import LoanOfferRepository


class UnitOfWork(IUnitOfWork):
    """
    Unit of Work implementation
    """
    
    def __init__(self, session: AsyncSession):
        self._session = session
        
        self.customers: ICustomerRepository = CustomerRepository(session)
        self.loan_offers: ILoanOfferRepository = LoanOfferRepository(session)
    
    async def __aenter__(self):

        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """
        Exit async context manager
        """
        if exc_type is not None:
            await self.rollback()
        return False
    
    async def commit(self):
        """
        Commit transaction
        """
        await self._session.commit()
    
    async def rollback(self):
        """
        Rollback transaction
        """
        await self._session.rollback()