"""
Application layer exceptions

Strategy:
- Domain exceptions: Business rule violations (400)
- Application exceptions: Workflow errors (404, 409)
- Infrastructure exceptions: Technical errors (500)
"""


class ApplicationException(Exception):
    pass


class CustomerNotFoundError(ApplicationException):
    pass


class CustomerAlreadyExistsError(ApplicationException):
    pass


class LoanOfferNotFoundError(ApplicationException):
    pass


class ValidationError(ApplicationException):
    pass


class UnauthorizedError(ApplicationException):
    pass


class ForbiddenError(ApplicationException):
    pass