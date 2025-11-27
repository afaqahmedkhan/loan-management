from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional

from ....application.interfaces.repositories import ILoanOfferRepository
from ....domain.entities.loan_offer import LoanOffer
from ....domain.value_objects.money import Money
from ....domain.value_objects.percentage import Percentage
from ..models.loan_offer_model import LoanOfferModel


class LoanOfferRepository(ILoanOfferRepository):
    """
    Repository implementation for Loan Offer
    """
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    def _to_domain(self, model: LoanOfferModel) -> LoanOffer:
        """
        Map ORM to domain
        """
        return LoanOffer(
            id=model.id,
            customer_id=model.customer_id,
            principal=Money(model.loan_amount, 'EUR'),
            interest_rate=Percentage(model.interest_rate),
            term_months=model.term_months,
            monthly_payment=Money(model.monthly_payment, 'EUR'),
            total_payment=Money(model.total_payment, 'EUR'),
            total_interest=Money(model.total_interest, 'EUR'),
            created_at=model.created_at
        )
    
    def _to_model(self, entity: LoanOffer) -> LoanOfferModel:
        """
        Map domain to ORM
        """
        return LoanOfferModel(
            id=entity.id,
            customer_id=entity.customer_id,
            loan_amount=entity.principal.amount,
            interest_rate=entity.interest_rate.value,
            term_months=entity.term_months,
            monthly_payment=entity.monthly_payment.amount,
            total_payment=entity.total_payment.amount,
            total_interest=entity.total_interest.amount,
            created_at=entity.created_at
        )
    
    async def create(self, loan_offer: LoanOffer) -> LoanOffer:
        """
        Create loan offer from domain entity
        """
        # Convert domain entity to ORM model
        model = self._to_model(loan_offer)
        
        # Add to session
        self.session.add(model)
        
        # Flush to get ID
        await self.session.flush()
        await self.session.refresh(model)
        
        # Return domain entity with ID
        return self._to_domain(model)
    
    async def get_by_id(self, offer_id: int) -> Optional[LoanOffer]:
        """Get loan offer by ID"""
        stmt = select(LoanOfferModel).where(LoanOfferModel.id == offer_id)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        return self._to_domain(model) if model else None
    
    async def get_by_customer_id(
        self,
        customer_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[LoanOffer]:
        """
        Get all loan offers for a customer
        """
        stmt = (
            select(LoanOfferModel)
            .where(LoanOfferModel.customer_id == customer_id)
            .order_by(LoanOfferModel.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        
        result = await self.session.execute(stmt)
        models = result.scalars().all()
        
        return [self._to_domain(model) for model in models]
    
    async def get_by_customer_id_count(self, customer_id: int) -> int:
        """Get count of loan offers for customer"""
        stmt = (
            select(func.count())
            .select_from(LoanOfferModel)
            .where(LoanOfferModel.customer_id == customer_id)
        )
        result = await self.session.execute(stmt)
        return result.scalar_one()
    
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[LoanOffer]:
        """Get all loan offers with pagination"""
        stmt = (
            select(LoanOfferModel)
            .order_by(LoanOfferModel.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        
        result = await self.session.execute(stmt)
        models = result.scalars().all()
        
        return [self._to_domain(model) for model in models]
    
    async def delete(self, offer_id: int) -> bool:
        """Delete loan offer"""
        stmt = select(LoanOfferModel).where(LoanOfferModel.id == offer_id)
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        
        if not model:
            return False
        
        await self.session.delete(model)
        await self.session.flush()
        
        return True