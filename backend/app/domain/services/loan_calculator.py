from decimal import Decimal, ROUND_HALF_UP
from typing import Dict
from ..value_objects.money import Money
from ..value_objects.percentage import Percentage
from ..exceptions import InvalidLoanParametersError


class LoanCalculator:
    """
    Domain Service for loan calculations
    """
    
    @staticmethod
    def calculate_monthly_payment(
        principal: Money,
        annual_interest_rate: Percentage,
        term_months: int
    ) -> Money:
        """
        Calculate monthly payment using amortization formula
        
        Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
        
        Where:
        - M = Monthly payment
        - P = Principal (loan amount)
        - r = Monthly interest rate (annual rate / 12)
        - n = Number of payments (months)
        
        Special case: 0% interest
        - M = P / n (simple division)
        
        """
        # Validate inputs
        if term_months <= 0:
            raise InvalidLoanParametersError(
                f"Term must be positive, got {term_months}"
            )
        
        if principal.amount <= 0:
            raise InvalidLoanParametersError(
                "Principal must be positive"
            )
        
        # Special case: 0% interest
        # Just divide principal by number of months
        if annual_interest_rate.value == 0:
            monthly_amount = principal.amount / Decimal(term_months)
            return Money(monthly_amount, principal.currency)
        
        # Convert annual percentage to monthly decimal rate
        # Example: 6% annual = Decimal('6') -> 0.06/12 = 0.005
        monthly_rate = annual_interest_rate.to_monthly_rate()
        
        # Apply amortization formula     
        # Calculate (1 + r)^n
        one_plus_r = Decimal('1') + monthly_rate
        power_term = one_plus_r ** term_months
        
        # Calculate numerator: r(1+r)^n
        numerator = monthly_rate * power_term
        
        # Calculate denominator: (1+r)^n - 1
        denominator = power_term - Decimal('1')
        
        # Calculate monthly payment: P * [numerator / denominator]
        monthly_amount = principal.amount * (numerator / denominator)
        
        # Round to 2 decimal places (cents)
        monthly_amount = monthly_amount.quantize(
            Decimal('0.01'),
            rounding=ROUND_HALF_UP
        )
        
        return Money(monthly_amount, principal.currency)
    
    @staticmethod
    def calculate_total_payment(
        monthly_payment: Money,
        term_months: int
    ) -> Money:
        """
        Calculate total amount paid over loan term
        monthly payment * number of months
        """
        if term_months <= 0:
            raise InvalidLoanParametersError("Term must be positive")
        
        total_amount = monthly_payment.amount * Decimal(term_months)
        return Money(total_amount, monthly_payment.currency)
    
    @staticmethod
    def calculate_total_interest(
        total_payment: Money,
        principal: Money
    ) -> Money:
        """
        Calculate total interest paid
        
        Total interest = Total paid - Principal borrowed
        """
        if total_payment.currency != principal.currency:
            raise InvalidLoanParametersError(
                "Total payment and principal must be in same currency"
            )
        
        interest_amount = total_payment.amount - principal.amount
        return Money(interest_amount, principal.currency)
    
    @staticmethod
    def calculate_all(
        principal: Money,
        annual_interest_rate: Percentage,
        term_months: int
    ) -> Dict[str, Money]:
        """
        Calculate all loan metrics at once
        
        Returns:
            Dictionary with:
            - 'monthly_payment': Monthly payment amount
            - 'total_payment': Total amount paid over term
            - 'total_interest': Total interest paid
        """
        # Calculate monthly payment
        monthly_payment = LoanCalculator.calculate_monthly_payment(
            principal,
            annual_interest_rate,
            term_months
        )
        
        # Calculate total payment
        total_payment = LoanCalculator.calculate_total_payment(
            monthly_payment,
            term_months
        )
        
        # Calculate total interest
        total_interest = LoanCalculator.calculate_total_interest(
            total_payment,
            principal
        )
        
        return {
            'monthly_payment': monthly_payment,
            'total_payment': total_payment,
            'total_interest': total_interest
        }