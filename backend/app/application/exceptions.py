"""
Application layer exceptions

Strategy:
- Domain exceptions: Business rule violations (400)
- Application exceptions: Workflow errors (404, 409)
- Infrastructure exceptions: Technical errors (500)
"""


class ApplicationException(Exception):
    """Base application exception"""
    pass


class CustomerNotFoundError(ApplicationException):
    """
    Customer not found (404)
    
    Colleague's advice: "Proper exception handling with custom codes"
    """
    pass


class CustomerAlreadyExistsError(ApplicationException):
    """
    Customer with email already exists (409 Conflict)
    """
    pass


class LoanOfferNotFoundError(ApplicationException):
    """Loan offer not found (404)"""
    pass


class ValidationError(ApplicationException):
    """General validation error (422)"""
    pass


class UnauthorizedError(ApplicationException):
    """Unauthorized access (401)"""
    pass


class ForbiddenError(ApplicationException):
    """Forbidden action (403)"""
    pass