from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP
from ..exceptions import InvalidPercentageError


@dataclass(frozen=True)
class Percentage:
    value: Decimal
    
    def __post_init__(self):
        if not isinstance(self.value, Decimal):
            raise InvalidPercentageError(
                f"Percentage must be Decimal, got {type(self.value).__name__}"
            )
        
        if self.value < 0:
            raise InvalidPercentageError(
                f"Percentage cannot be negative: {self.value}"
            )
        
        if self.value > 100:
            raise InvalidPercentageError(
                f"Percentage cannot exceed 100: {self.value}"
            )
        
        object.__setattr__(
            self,
            'value',
            self.value.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        )
    
    def to_decimal(self) -> Decimal:
        return self.value / Decimal('100')
    
    def to_monthly_rate(self) -> Decimal:
        """
        Annual rate needs to be divided by 12 for monthly payments
        """
        return self.to_decimal() / Decimal('12')
    
    def __str__(self) -> str:
        return f"{self.value}%"
    
    def __repr__(self) -> str:
        return f"Percentage(Decimal('{self.value}'))"
    
    def __eq__(self, other) -> bool:
        if not isinstance(other, Percentage):
            return False
        return self.value == other.value