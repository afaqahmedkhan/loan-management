class DomainException(Exception):
    """Base exception for domain layer"""
    pass


class InvalidMoneyError(DomainException):
    """Raised when Money value object validation fails"""
    pass


class InvalidEmailError(DomainException):
    """Raised when Email validation fails"""
    pass


class InvalidPercentageError(DomainException):
    """Raised when Percentage validation fails"""
    pass


class InvalidLoanParametersError(DomainException):
    """Raised when loan parameters are invalid"""
    pass