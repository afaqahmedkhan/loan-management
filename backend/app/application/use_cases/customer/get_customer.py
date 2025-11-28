from dataclasses import dataclass
from typing import Optional

from ....domain.entities.customer import Customer
from ...dtos.customer_dto import CustomerResponseDTO, CustomerWithLoanOffersDTO
from ...interfaces.unit_of_work import IUnitOfWork
from ...exceptions import CustomerNotFoundError

def _customer_to_dto(customer: Customer) -> CustomerResponseDTO:
    """Helper to convert domain entity to DTO"""
    return CustomerResponseDTO(
        id=customer.id,
        first_name=customer.first_name,
        last_name=customer.last_name,
        email=str(customer.email),
        phone=customer.phone,
        address=customer.address,
        created_at=customer.created_at,
        updated_at=customer.updated_at
    )


@dataclass
class GetCustomerUseCase:
    """Use case for getting a single customer"""
    uow: IUnitOfWork
    
    async def execute(
        self,
        customer_id: int,
    ) -> CustomerResponseDTO:
        """
        Get customer by ID
        
        Args:
            customer_id: Customer ID
        
        Raises:
            CustomerNotFoundError: If customer doesn't exist
        """
        customer = await self.uow.customers.get_by_id(customer_id)
            
        if not customer:
            raise CustomerNotFoundError(
                f"Customer with ID {customer_id} not found"
            )
            
        return _customer_to_dto(customer)