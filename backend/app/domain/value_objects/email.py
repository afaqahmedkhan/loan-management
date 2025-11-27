from dataclasses import dataclass
import re
from ..exceptions import InvalidEmailError


@dataclass(frozen=True)
class Email:
    value: str
    
    EMAIL_REGEX = re.compile(
        r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    )
    
    def __post_init__(self):
        if not self.value or not isinstance(self.value, str):
            raise InvalidEmailError("Email cannot be empty")
        
        if not self.EMAIL_REGEX.match(self.value):
            raise InvalidEmailError(f"Invalid email format: {self.value}")
        
        object.__setattr__(self, 'value', self.value.lower().strip())
    
    def __str__(self) -> str:
        return self.value
    
    def __repr__(self) -> str:
        return f"Email('{self.value}')"
    
    @property
    def domain(self) -> str:
        """Extract domain from email"""
        return self.value.split('@')[1]
    
    @property
    def local_part(self) -> str:
        """Extract local part (before @) from email"""
        return self.value.split('@')[0]