from dataclasses import dataclass
from ...dtos.loan_offer_dto import (
    LoanCalculationDTO,
    LoanCalculationResponseDTO
)
from ....domain.services.loan_calculator import LoanCalculator
from ....domain.value_objects.money import Money
from ....domain.value_objects.percentage import Percentage


@dataclass
class CalculateLoanUseCase:
    """
    Use case for real-time loan calculation
    """
    
    async def execute(self, data: LoanCalculationDTO) -> LoanCalculationResponseDTO:
        """
        Calculate loan without persisting
        """
        # Convert to domain value objects
        principal = Money(data.loan_amount, 'EUR')
        rate = Percentage(data.interest_rate)
        
        # Calculate using domain service
        calculations = LoanCalculator.calculate_all(
            principal=principal,
            annual_interest_rate=rate,
            term_months=data.term_months
        )
        
        # Return response DTO
        return LoanCalculationResponseDTO(
            monthly_payment=calculations['monthly_payment'].amount,
            total_payment=calculations['total_payment'].amount,
            total_interest=calculations['total_interest'].amount
        )