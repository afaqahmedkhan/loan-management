from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from ..value_objects.email import Email


@dataclass
class Customer:
    first_name: str
    last_name: str
    email: Email
    id: Optional[int] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"
    
    def update_contact_info(
        self,
        phone: Optional[str] = None,
        address: Optional[str] = None
    ) -> None:
       
        if phone is not None:
            self.phone = phone
        if address is not None:
            self.address = address
        self.updated_at = datetime.utcnow
    
    def __eq__(self, other) -> bool:
        if not isinstance(other, Customer):
            return False
        if self.id is None or other.id is None:
            return False
        return self.id == other.id
    
    def __hash__(self) -> int:
        return hash(self.id) if self.id else hash(id(self))