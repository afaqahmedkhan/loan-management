from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from ..value_objects.money import Money
from ..value_objects.percentage import Percentage


@dataclass
class LoanOffer:
    customer_id: int
    principal: Money
    interest_rate: Percentage
    term_months: int
    monthly_payment: Money
    total_payment: Money
    total_interest: Money
    id: Optional[int] = None
    created_at: datetime = field(default_factory=datetime.fromtimestamp)
    
    @classmethod
    def create(
        cls,
        customer_id: int,
        principal: Money,
        interest_rate: Percentage,
        term_months: int,
        monthly_payment: Money,
        total_payment: Money,
        total_interest: Money
    ) -> 'LoanOffer':
    
        # Validate business rules
        if term_months <= 0:
            from ..exceptions import InvalidLoanParametersError
            raise InvalidLoanParametersError(
                f"Term must be positive, got {term_months}"
            )
        
        if principal.amount <= 0:
            from ..exceptions import InvalidLoanParametersError
            raise InvalidLoanParametersError(
                "Principal must be positive"
            )
        
        # Ensure all Money objects have same currency
        if not (principal.currency == monthly_payment.currency == 
                total_payment.currency == total_interest.currency):
            from ..exceptions import InvalidLoanParametersError
            raise InvalidLoanParametersError(
                "All money amounts must be in same currency"
            )
        
        return cls(
            id=None,
            customer_id=customer_id,
            principal=principal,
            interest_rate=interest_rate,
            term_months=term_months,
            monthly_payment=monthly_payment,
            total_payment=total_payment,
            total_interest=total_interest
        )
    
    def is_interest_free(self) -> bool:
        """Check if loan has 0% interest"""
        return self.interest_rate.value == 0
    
    def effective_annual_rate(self) -> Percentage:
        """
        Calculate effective annual rate (APR)
        
        Note: For simplicity, returning nominal rate
        In production, would calculate compound rate
        """
        return self.interest_rate
    
    def __eq__(self, other) -> bool:
        """Entities compared by ID"""
        if not isinstance(other, LoanOffer):
            return False
        if self.id is None or other.id is None:
            return False
        return self.id == other.id
    
    def __hash__(self) -> int:
        return hash(self.id) if self.id else hash(id(self))