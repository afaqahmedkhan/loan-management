from dataclasses import dataclass
from decimal import Decimal
from ...dtos.loan_offer_dto import LoanOfferCreateDTO, LoanOfferResponseDTO
from ...interfaces.unit_of_work import IUnitOfWork
from ....domain.services.loan_calculator import LoanCalculator
from ....domain.value_objects.money import Money
from ....domain.value_objects.percentage import Percentage
from ....domain.entities.loan_offer import LoanOffer
from ...exceptions import CustomerNotFoundError


@dataclass
class CreateLoanOfferUseCase:
    """
    Use case for creating loan offer
    """
    uow: IUnitOfWork
    
    async def execute(self, data: LoanOfferCreateDTO) -> LoanOfferResponseDTO:
        """
        Create loan offer with automatic calculation
        """
        async with self.uow:
            # 1. Verify customer exists
            customer = await self.uow.customers.get_by_id(data.customer_id)
            if not customer:
                raise CustomerNotFoundError(
                    f"Customer with ID {data.customer_id} not found"
                )
            
            # 2. Convert DTO values to domain value objects
            principal = Money(data.loan_amount, 'EUR')
            rate = Percentage(data.interest_rate)
            
            # 3. Calculate loan payments using domain service
            calculations = LoanCalculator.calculate_all(
                principal=principal,
                annual_interest_rate=rate,
                term_months=data.term_months
            )
            
            # 4. Create domain entity using factory method
            loan_offer = LoanOffer.create(
                customer_id=data.customer_id,
                principal=principal,
                interest_rate=rate,
                term_months=data.term_months,
                monthly_payment=calculations['monthly_payment'],
                total_payment=calculations['total_payment'],
                total_interest=calculations['total_interest']
            )
            
            # 5. Persist domain entity
            created_offer = await self.uow.loan_offers.create(loan_offer)
            
            await self.uow.commit()
            
            # 6. Return DTO
            return LoanOfferResponseDTO.model_validate(created_offer)