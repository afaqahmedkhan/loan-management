from dataclasses import dataclass

from ....domain.entities.loan_offer import LoanOffer
from ...dtos.loan_offer_dto import LoanOfferResponseDTO
from ...interfaces.unit_of_work import IUnitOfWork
from ...exceptions import LoanOfferNotFoundError

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
class GetLoanOfferUseCase:
    """Use case for getting a loan offer"""
    uow: IUnitOfWork
    
    async def execute(self, offer_id: int) -> LoanOfferResponseDTO:
        """Get loan offer by ID"""
        offer = await self.uow.loan_offers.get_by_id(offer_id)
        
        if not offer:
            raise LoanOfferNotFoundError(
                f"Loan offer with ID {offer_id} not found"
            )
        
        return _loan_offer_to_dto(offer)