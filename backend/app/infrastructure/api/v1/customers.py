from fastapi import APIRouter, Depends, Query, status
from typing import List

from ....application.dtos.customer_dto import (
    CustomerCreateDTO,
    CustomerUpdateDTO,
    CustomerResponseDTO,
)
from ....application.use_cases.customer import (
    CreateCustomerUseCase,
    GetCustomerUseCase,
    ListCustomersUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
)
from ....shared.response_models import SuccessResponse, PaginatedResponse
from ..dependencies import (
    get_create_customer_use_case,
    get_get_customer_use_case,
    get_list_customers_use_case,
    get_update_customer_use_case,
    get_delete_customer_use_case,
)

router = APIRouter(prefix="/customers", tags=["customers"])


@router.post(
    "/",
    response_model=SuccessResponse[CustomerResponseDTO],
    status_code=status.HTTP_201_CREATED,
    summary="Create a new customer",
    description="Create a new customer with the provided information. Email must be unique.",
    responses={
        201: {"description": "Customer created successfully"},
        409: {"description": "Customer with this email already exists"},
        422: {"description": "Invalid request data"},
    }
)
async def create_customer(
    customer_data: CustomerCreateDTO,
    use_case: CreateCustomerUseCase = Depends(get_create_customer_use_case)
):
    """
    Create a new customer
    """
    customer = await use_case.execute(customer_data)
    return SuccessResponse(
        data=customer,
        message="Customer created successfully"
    )


@router.get(
    "/",
    response_model=PaginatedResponse[CustomerResponseDTO],
    summary="List all customers",
    description="Get paginated list of all customers",
    responses={
        200: {"description": "List of customers"}
    }
)
async def list_customers(
    skip: int = Query(0, ge=0, description="Number of records to skip (offset)"),
    limit: int = Query(50, ge=1, le=100, description="Number of records to return (max 100)"),
    use_case: ListCustomersUseCase = Depends(get_list_customers_use_case)
):
    """
    List customers with pagination
    """
    customers, total_count = await use_case.execute(skip, limit)
    
    return PaginatedResponse(
        data=customers,
        total=total_count,
        skip=skip,
        limit=limit,
        has_more=(skip + limit) < total_count
    )


@router.get(
    "/{customer_id}",
    response_model=SuccessResponse[CustomerResponseDTO],
    summary="Get customer by ID",
    description="Get a specific customer by their ID",
    responses={
        200: {"description": "Customer found"},
        404: {"description": "Customer not found"},
    }
)
async def get_customer(
    customer_id: int,
    use_case: GetCustomerUseCase = Depends(get_get_customer_use_case)
):
    """
    Get customer by ID
    """
    customer = await use_case.execute(customer_id)
    return SuccessResponse(data=customer)


@router.put(
    "/{customer_id}",
    response_model=SuccessResponse[CustomerResponseDTO],
    summary="Update customer",
    description="Update customer information. Only provided fields will be updated.",
    responses={
        200: {"description": "Customer updated successfully"},
        404: {"description": "Customer not found"},
        409: {"description": "Email already exists"},
    }
)
async def update_customer(
    customer_id: int,
    customer_data: CustomerUpdateDTO,
    use_case: UpdateCustomerUseCase = Depends(get_update_customer_use_case)
):
    """
    Update customer
    """
    customer = await use_case.execute(customer_id, customer_data)
    return SuccessResponse(
        data=customer,
        message="Customer updated successfully"
    )


@router.delete(
    "/{customer_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete customer",
    description="Delete a customer and all their loan offers",
    responses={
        204: {"description": "Customer deleted successfully"},
        404: {"description": "Customer not found"},
    }
)
async def delete_customer(
    customer_id: int,
    use_case: DeleteCustomerUseCase = Depends(get_delete_customer_use_case)
):
    """
    Delete customer
    """
    await use_case.execute(customer_id)
