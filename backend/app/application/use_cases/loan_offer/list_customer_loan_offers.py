from dataclasses import dataclass
from typing import List

from ....domain.entities.loan_offer import LoanOffer
from ...dtos.loan_offer_dto import LoanOfferResponseDTO
from ...interfaces.unit_of_work import IUnitOfWork
from ...exceptions import CustomerNotFoundError

def _loan_offer_to_dto(offer: LoanOffer) -> LoanOfferResponseDTO:
    """Helper to convert domain entity to DTO"""
    return LoanOfferResponseDTO(
        id=offer.id,
        customer_id=offer.customer_id,
        loan_amount=offer.principal.amount,  
        interest_rate=offer.interest_rate.value, 
        term_months=offer.term_months,
        monthly_payment=offer.monthly_payment.amount, 
        total_payment=offer.total_payment.amount,
        total_interest=offer.total_interest.amount,
        created_at=offer.created_at
    )

@dataclass
class ListCustomerLoanOffersUseCase:
    """Use case for listing loan offers for a customer"""
    uow: IUnitOfWork
    max_limit: int = 100
    
    async def execute(
        self,
        customer_id: int,
        skip: int = 0,
        limit: int = 50
    ) -> tuple[List[LoanOfferResponseDTO], int]:
        """
        Get all loan offers for a customer
        """
        limit = min(limit, self.max_limit)
        
        # Verify customer exists
        customer = await self.uow.customers.get_by_id(customer_id)
        if not customer:
            raise CustomerNotFoundError(
                f"Customer with ID {customer_id} not found"
            )
            
        # Get loan offers
        offers = await self.uow.loan_offers.get_by_customer_id(
            customer_id,
            skip,
            limit
        )
            
        # Get count
        total_count = await self.uow.loan_offers.get_by_customer_id_count(
            customer_id
        )
            
        # Convert to DTOs
        offer_dtos = [_loan_offer_to_dto(o) for o in offers]
                        
        return offer_dtos, total_count