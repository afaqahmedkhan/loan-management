from dataclasses import dataclass
from ...dtos.loan_offer_dto import LoanOfferResponseDTO
from ...interfaces.unit_of_work import IUnitOfWork
from ...exceptions import LoanOfferNotFoundError


@dataclass
class GetLoanOfferUseCase:
    """Use case for getting a loan offer"""
    uow: IUnitOfWork
    
    async def execute(self, offer_id: int) -> LoanOfferResponseDTO:
        """Get loan offer by ID"""
        async with self.uow:
            offer = await self.uow.loan_offers.get_by_id(offer_id)
            
            if not offer:
                raise LoanOfferNotFoundError(
                    f"Loan offer with ID {offer_id} not found"
                )
            
            return LoanOfferResponseDTO.model_validate(offer)