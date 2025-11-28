from dataclasses import dataclass
from typing import List

from ....domain.entities.customer import Customer

from ...dtos.customer_dto import CustomerResponseDTO
from ...interfaces.unit_of_work import IUnitOfWork

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
class ListCustomersUseCase:
    """
    Use case for listing customers
    
    """
    uow: IUnitOfWork
    max_limit: int = 100
    
    async def execute(
        self,
        skip: int = 0,
        limit: int = 50
    ) -> tuple[List[CustomerResponseDTO], int]:
        """
        List customers with pagination
        """
        # Enforce max limit (security - prevent loading millions)
        limit = min(limit, self.max_limit)
        
        customers = await self.uow.customers.get_all(skip, limit)
            
        total_count = await self.uow.customers.get_all_count()
            
        customer_dtos = [_customer_to_dto(c) for c in customers]
            
        return customer_dtos, total_count