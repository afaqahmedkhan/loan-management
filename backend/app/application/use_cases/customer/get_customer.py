from dataclasses import dataclass
from typing import Optional
from ...dtos.customer_dto import CustomerResponseDTO, CustomerWithLoanOffersDTO
from ...interfaces.unit_of_work import IUnitOfWork
from ...exceptions import CustomerNotFoundError


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
        async with self.uow:
            customer = await self.uow.customers.get_by_id(customer_id)
            
            if not customer:
                raise CustomerNotFoundError(
                    f"Customer with ID {customer_id} not found"
                )
            
            return CustomerResponseDTO.model_validate(customer)