from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP
from typing import Union
from ..exceptions import InvalidMoneyError

@dataclass(frozen=True)
class Money:
    """
    Value Object for Money
    """
    amount: Decimal
    currency: str = "EUR"

    def __post_init__(self):
        if not isinstance(self.amount, Decimal):
            raise InvalidMoneyError(
                f"Amount must be Decimal, got {type(self.amount).__name__}"
            )
        
        valid_currencies = ['EUR', 'USD', 'GBP']
        if self.currency not in valid_currencies:
            raise InvalidMoneyError(
                f"Invalid currency: {self.currency}. Must be one of {valid_currencies}"
            )
        
        object.__setattr__(
            self, 
            'amount', 
            self.amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        )

    def add(self, other: 'Money') -> 'Money':
        if self.currency != other.currency:
            raise InvalidMoneyError(
                f"Cannot add different currencies: {self.currency} and {other.currency}"
            )
        return Money(self.amount + other.amount, self.currency) 
    
    def subtract(self, other: 'Money') -> 'Money':
        if self.currency != other.currency:
            raise InvalidMoneyError(
                f"Cannot subtract different currencies: {self.currency} and {other.currency}"
            )
        return Money(self.amount - other.amount, self.currency)
    
    def multiply(self, factor: Union[Decimal, int, float]) -> 'Money':
        if isinstance(factor, float):
            factor = Decimal(str(factor))
        elif isinstance(factor, int):
            factor = Decimal(factor)
        
        return Money(self.amount * factor, self.currency)
    
    def divide(self, divisor: Union[Decimal, int, float]) -> 'Money':
        if isinstance(divisor, float):
            divisor = Decimal(str(divisor))
        elif isinstance(divisor, int):
            divisor = Decimal(divisor)
        
        if divisor == 0:
            raise InvalidMoneyError("Cannot divide by zero")
        
        return Money(self.amount / divisor, self.currency)
    
    def __str__(self) -> str:
        return f"{self.currency} {self.amount:.2f}"
    
    def __eq__(self, other) -> bool:
        if not isinstance(other, Money):
            return False
        return self.amount == other.amount and self.currency == other.currency
    def __lt__(self, other: 'Money') -> bool:
        if self.currency != other.currency:
            raise InvalidMoneyError("Cannot compare different currencies")
        return self.amount < other.amount
    
    def __le__(self, other: 'Money') -> bool:
        if self.currency != other.currency:
            raise InvalidMoneyError("Cannot compare different currencies")
        return self.amount <= other.amount
    
    def __gt__(self, other: 'Money') -> bool:
        if self.currency != other.currency:
            raise InvalidMoneyError("Cannot compare different currencies")
        return self.amount > other.amount
    
    def __ge__(self, other: 'Money') -> bool:
        if self.currency != other.currency:
            raise InvalidMoneyError("Cannot compare different currencies")
        return self.amount >= other.amount


