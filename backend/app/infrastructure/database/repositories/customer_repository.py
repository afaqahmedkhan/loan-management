from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List, Optional

from ....application.interfaces.repositories import ICustomerRepository
from ....application.dtos.customer_dto import CustomerCreateDTO, CustomerUpdateDTO
from ....domain.entities.customer import Customer
from ....domain.value_objects.email import Email
from ..models.customer_model import CustomerModel
from datetime import datetime


class CustomerRepository(ICustomerRepository):
    """
    Repository implementation for Customer
    - Mapping: ORM - Domain Entity
    - Query construction
    """
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    def _to_domain(self, model: CustomerModel) -> Customer:
        """
        Map ORM model to domain entity
        """
        return Customer(
            id=model.id,
            first_name=model.first_name,
            last_name=model.last_name,
            email=Email(model.email),
            phone=model.phone,
            address=model.address,
            created_at=model.created_at,
            updated_at=model.updated_at
        )
    
    async def create(self, customer_data: CustomerCreateDTO) -> Customer:
        """
        Create customer from DTO
        """
        # Create ORM model from DTO
        model = CustomerModel(
            first_name=customer_data.first_name,
            last_name=customer_data.last_name,
            email=customer_data.email,  
            phone=customer_data.phone,
            address=customer_data.address,
        )        
        # Add to session
        self.session.add(model)
        
        # Flush to get ID (without committing transaction)
        await self.session.flush()
        
        # Refresh to get all database-generated values
        await self.session.refresh(model)
        
        # Map to domain entity
        return self._to_domain(model)
    
    async def get_by_id(self, customer_id: int) -> Optional[Customer]:
        """
        Get customer by ID
        """
        # Build query
        stmt = select(CustomerModel).where(CustomerModel.id == customer_id)
        
        # Execute query
        result = await self.session.execute(stmt)
        
        # Get result
        model = result.scalar_one_or_none()
        
        # Map to domain if found
        return self._to_domain(model) if model else None
    
    async def get_by_email(self, email: str) -> Optional[Customer]:
        """Get customer by email"""
        stmt = select(CustomerModel).where(CustomerModel.email == email)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        return self._to_domain(model) if model else None
    
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Customer]:
        """
        Get all customers with pagination
        """
        stmt = (
            select(CustomerModel)
            .order_by(CustomerModel.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        
        result = await self.session.execute(stmt)
        models = result.scalars().all()
        
        # Map all to domain entities
        return [self._to_domain(model) for model in models]
    
    async def get_all_count(self) -> int:
        """
        Get total count of customers
        """
        stmt = select(func.count()).select_from(CustomerModel)
        result = await self.session.execute(stmt)
        return result.scalar_one()
    
    async def update(
        self,
        customer_id: int,
        customer_data: CustomerUpdateDTO
    ) -> Optional[Customer]:
        """
        Update customer

        """
        # Get existing customer
        stmt = select(CustomerModel).where(CustomerModel.id == customer_id)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        
        if not model:
            return None
        
        # Update only provided fields
        update_data = customer_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(model, field, value)
        
        # Update timestamp
        model.updated_at = datetime.utcnow()
        
        # Flush changes
        await self.session.flush()
        await self.session.refresh(model)
        
        return self._to_domain(model)
    
    async def delete(self, customer_id: int) -> bool:
        """
        Delete customer
        
        Returns True if deleted, False if not found
        """
        stmt = select(CustomerModel).where(CustomerModel.id == customer_id)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        
        if not model:
            return False
        
        await self.session.delete(model)
        await self.session.flush()
        
        return True
    
    async def exists_by_email(self, email: str) -> bool:
        """Check if customer with email exists"""
        stmt = select(func.count()).select_from(CustomerModel).where(CustomerModel.email == email)
        result = await self.session.execute(stmt)
        count = result.scalar()
        return count > 0