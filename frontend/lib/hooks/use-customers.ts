import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import * as customerApi from "@/lib/api/customers";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  ApiError,
} from "@/types/api";
import type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@/types/customer";

const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (params?: PaginationParams) =>
    [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: number) => [...customerKeys.details(), id] as const,
};

export function useCustomers(
  params?: PaginationParams
): UseQueryResult<PaginatedResponse<Customer>, ApiError> {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => customerApi.getCustomers(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCustomer(
  id: number
): UseQueryResult<ApiResponse<Customer>, ApiError> {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerApi.getCustomer(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateCustomer(): UseMutationResult<
  ApiResponse<Customer>,
  ApiError,
  CreateCustomerInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerApi.createCustomer,
    onMutate: async (newCustomer) => {
      await queryClient.cancelQueries({ queryKey: customerKeys.lists() });

      const previousCustomers = queryClient.getQueriesData({
        queryKey: customerKeys.lists(),
      });

      queryClient.setQueriesData<PaginatedResponse<Customer>>(
        { queryKey: customerKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: [
              {
                id: -Date.now(),
                ...newCustomer,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              } as Customer,
              ...old.data,
            ],
            total: old.total + 1,
          };
        }
      );

      return { previousCustomers };
    },
    onError: (err, newCustomer, context) => {
      if (context?.previousCustomers) {
        context.previousCustomers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

export function useUpdateCustomer(): UseMutationResult<
  ApiResponse<Customer>,
  ApiError,
  { id: number; data: UpdateCustomerInput }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => customerApi.updateCustomer(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: customerKeys.detail(id) });

      const previousCustomer = queryClient.getQueryData<ApiResponse<Customer>>(
        customerKeys.detail(id)
      );

      queryClient.setQueryData<ApiResponse<Customer>>(
        customerKeys.detail(id),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              ...data,
              updated_at: new Date().toISOString(),
            },
          };
        }
      );

      return { previousCustomer };
    },
    onError: (err, { id }, context) => {
      if (context?.previousCustomer) {
        queryClient.setQueryData(
          customerKeys.detail(id),
          context.previousCustomer
        );
      }
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

export function useDeleteCustomer(): UseMutationResult<
  ApiResponse<void>,
  ApiError,
  number
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => customerApi.deleteCustomer(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: customerKeys.lists() });

      const previousCustomers = queryClient.getQueriesData({
        queryKey: customerKeys.lists(),
      });

      queryClient.setQueriesData<PaginatedResponse<Customer>>(
        { queryKey: customerKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((customer) => customer.id !== id),
            total: old.total - 1,
          };
        }
      );

      return { previousCustomers };
    },
    onError: (err, id, context) => {
      if (context?.previousCustomers) {
        context.previousCustomers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}
