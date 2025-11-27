from dataclasses import dataclass
from typing import List
from ...dtos.customer_dto import CustomerResponseDTO
from ...interfaces.unit_of_work import IUnitOfWork


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
        
        async with self.uow:
            customers = await self.uow.customers.get_all(skip, limit)
            
            total_count = await self.uow.customers.get_all_count()
            
            customer_dtos = [
                CustomerResponseDTO.model_validate(c)
                for c in customers
            ]
            
            return customer_dtos, total_count