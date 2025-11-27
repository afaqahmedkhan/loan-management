from abc import ABC, abstractmethod
from typing import List, Optional
from ..dtos.customer_dto import CustomerCreateDTO, CustomerUpdateDTO
from ...domain.entities.customer import Customer
from ...domain.entities.loan_offer import LoanOffer


class ICustomerRepository(ABC):
    """
    Customer Repository interface 
    """
    
    @abstractmethod
    async def create(self, customer_data: CustomerCreateDTO) -> Customer:
        """
        Create a new customer
        
        Args:
            customer_data: DTO with customer information
        
        Returns:
            Customer domain entity with generated ID
        """
        pass
    
    @abstractmethod
    async def get_by_id(self, customer_id: int) -> Optional[Customer]:
        """
        Get customer by ID
        
        Returns:
            Customer entity if found, None otherwise
        """
        pass
    
    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[Customer]:
        """
        Get customer by email
        
        """
        pass
    
    @abstractmethod
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Customer]:
        """
        Get all customers with pagination
        
        Args:
            skip: Number of records to skip (offset)
            limit: Maximum number of records to return
        """
        pass
    
    @abstractmethod
    async def get_all_count(self) -> int:
        """
        Get total count of customers
        """
        pass
    
    @abstractmethod
    async def update(
        self,
        customer_id: int,
        customer_data: CustomerUpdateDTO
    ) -> Optional[Customer]:
        """
        Update customer
        
        Returns:
            Updated customer if found, None otherwise
        """
        pass
    
    @abstractmethod
    async def delete(self, customer_id: int) -> bool:
        """
        Delete customer
        
        Returns:
            True if deleted, False if not found
        """
        pass
    
    @abstractmethod
    async def exists_by_email(self, email: str) -> bool:
        """
        Check if customer with email exists
        """
        pass


class ILoanOfferRepository(ABC):
    """Loan offer repository interface"""
    
    @abstractmethod
    async def create(self, loan_offer: LoanOffer) -> LoanOffer:
        """
        Create loan offer
        """
        pass
    
    @abstractmethod
    async def get_by_id(self, offer_id: int) -> Optional[LoanOffer]:
        """Get loan offer by ID"""
        pass
    
    @abstractmethod
    async def get_by_customer_id(
        self,
        customer_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[LoanOffer]:
        """
        Get all loan offers for a customer
        
        """
        pass
    
    @abstractmethod
    async def get_by_customer_id_count(self, customer_id: int) -> int:
        """Get count of loan offers for customer"""
        pass
    
    @abstractmethod
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[LoanOffer]:
        """Get all loan offers with pagination"""
        pass
    
    @abstractmethod
    async def delete(self, offer_id: int) -> bool:
        """Delete loan offer"""
        pass