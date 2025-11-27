from dataclasses import dataclass
from ...interfaces.unit_of_work import IUnitOfWork
from ...exceptions import CustomerNotFoundError


@dataclass
class DeleteCustomerUseCase:
    """Use case for deleting customer"""
    uow: IUnitOfWork
    
    async def execute(self, customer_id: int) -> None:
        """
        Delete customer (Hard delete could be updated for maintaining history)
        """
        async with self.uow:
            deleted = await self.uow.customers.delete(customer_id)
            
            if not deleted:
                raise CustomerNotFoundError(
                    f"Customer with ID {customer_id} not found"
                )
            
            await self.uow.commit()