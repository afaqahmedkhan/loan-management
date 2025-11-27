from dataclasses import dataclass
from ...dtos.customer_dto import CustomerCreateDTO, CustomerResponseDTO
from ...interfaces.unit_of_work import IUnitOfWork
from ...exceptions import CustomerAlreadyExistsError


@dataclass
class CreateCustomerUseCase:
    """
    Use Case for creating a customer
    
   
    """
    uow: IUnitOfWork
    
    async def execute(self, data: CustomerCreateDTO) -> CustomerResponseDTO:
        """
        Execute the use case        
        """
        async with self.uow:
            if await self.uow.customers.exists_by_email(data.email):
                raise CustomerAlreadyExistsError(
                    f"Customer with email {data.email} already exists"
                )
            
            customer = await self.uow.customers.create(data)
            
            await self.uow.commit()
            
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