from dataclasses import dataclass
from ...dtos.customer_dto import CustomerUpdateDTO, CustomerResponseDTO
from ...interfaces.unit_of_work import IUnitOfWork
from ...exceptions import CustomerNotFoundError, CustomerAlreadyExistsError


@dataclass
class UpdateCustomerUseCase:
    """Use case for updating customer"""
    uow: IUnitOfWork
    
    async def execute(
        self,
        customer_id: int,
        data: CustomerUpdateDTO
    ) -> CustomerResponseDTO:
        """
        Update customer
        """
        async with self.uow:
            existing = await self.uow.customers.get_by_id(customer_id)
            if not existing:
                raise CustomerNotFoundError(
                    f"Customer with ID {customer_id} not found"
                )
            
            if data.email and data.email != existing.email.value:
                if await self.uow.customers.exists_by_email(data.email):
                    raise CustomerAlreadyExistsError(
                        f"Customer with email {data.email} already exists"
                    )
            
            updated_customer = await self.uow.customers.update(customer_id, data)
            
            await self.uow.commit()
            
            return CustomerResponseDTO.model_validate(updated_customer)