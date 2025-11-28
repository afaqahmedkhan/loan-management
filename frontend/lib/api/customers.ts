import { api } from "./client";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api";
import type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@/types/customer";

export async function getCustomers(
  params?: PaginationParams
): Promise<PaginatedResponse<Customer>> {
  return api.get<PaginatedResponse<Customer>>("/customers", { params });
}

export async function getCustomer(id: number): Promise<ApiResponse<Customer>> {
  return api.get<ApiResponse<Customer>>(`/customers/${id}`);
}

export async function createCustomer(
  data: CreateCustomerInput
): Promise<ApiResponse<Customer>> {
  return api.post<ApiResponse<Customer>>("/customers", data);
}

export async function updateCustomer(
  id: number,
  data: UpdateCustomerInput
): Promise<ApiResponse<Customer>> {
  return api.put<ApiResponse<Customer>>(`/customers/${id}`, data);
}

export async function deleteCustomer(id: number): Promise<ApiResponse<void>> {
  return api.delete<ApiResponse<void>>(`/customers/${id}`);
}

export async function searchCustomers(
  query: string
): Promise<PaginatedResponse<Customer>> {
  return api.get<PaginatedResponse<Customer>>("/customers/search", {
    params: { q: query },
  });
}
