from dataclasses import dataclass

from ....domain.entities.customer import Customer
from ...dtos.customer_dto import CustomerUpdateDTO, CustomerResponseDTO
from ...interfaces.unit_of_work import IUnitOfWork
from ...exceptions import CustomerNotFoundError, CustomerAlreadyExistsError

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
            
        return _customer_to_dto(updated_customer)