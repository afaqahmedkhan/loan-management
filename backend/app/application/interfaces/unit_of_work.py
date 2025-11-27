from abc import ABC, abstractmethod
from .repositories import ICustomerRepository, ILoanOfferRepository


class IUnitOfWork(ABC):
    """
    Unit of Work interface
    """

    customers: ICustomerRepository
    loan_offers: ILoanOfferRepository

    @abstractmethod
    async def __aenter__(self):
        """
        Start transaction (async with begins here)
        """
        ...

    @abstractmethod
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """
        End transaction — rollback if exception occurs
        """
        ...

    @abstractmethod
    async def commit(self):
        """
        Commit transaction
        """
        ...

    @abstractmethod
    async def rollback(self):
        """
        Rollback transaction
        """
        ...
