import { useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import * as loanOfferApi from "@/lib/api/loan-offers";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  ApiError,
} from "@/types/api";
import type {
  LoanOffer,
  CreateLoanOfferInput,
  CalculateLoanInput,
  LoanCalculationResult,
} from "@/types/loan-offer";
import { debounce } from "@/lib/utils";

const loanOfferKeys = {
  all: ["loan-offers"] as const,
  customerOffers: (customerId: number, params?: PaginationParams) =>
    [...loanOfferKeys.all, "customer", customerId, params] as const,
  calculation: (params: CalculateLoanInput) =>
    [...loanOfferKeys.all, "calculation", params] as const,
};

export function useCustomerLoanOffers(
  customerId: number,
  params?: PaginationParams
): UseQueryResult<PaginatedResponse<LoanOffer>, ApiError> {
  return useQuery({
    queryKey: loanOfferKeys.customerOffers(customerId, params),
    queryFn: () => loanOfferApi.getCustomerLoanOffers(customerId, params),
    enabled: !!customerId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useLoanCalculation(
  params: CalculateLoanInput
): UseQueryResult<ApiResponse<LoanCalculationResult>, ApiError> {
  return useQuery({
    queryKey: loanOfferKeys.calculation(params),
    queryFn: () => loanOfferApi.calculateLoan(params),
    enabled: !!(
      params.loan_amount &&
      params.interest_rate &&
      params.term_months
    ),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useDebouncedLoanCalculation(
  initialParams: CalculateLoanInput,
  debounceMs: number = 500
) {
  const [displayParams, setDisplayParams] =
    useState<CalculateLoanInput>(initialParams);
  const [debouncedParams, setDebouncedParams] =
    useState<CalculateLoanInput>(initialParams);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedParams(displayParams);
    }, debounceMs);

    handler();

    return () => {
    };
  }, [displayParams, debounceMs]);

  const { data, isLoading, error } = useLoanCalculation(debouncedParams);

  const isCalculating =
    displayParams.loan_amount !== debouncedParams.loan_amount ||
    displayParams.interest_rate !== debouncedParams.interest_rate ||
    displayParams.term_months !== debouncedParams.term_months ||
    isLoading;

  return {
    params: displayParams,
    calculation: data?.data,
    isCalculating,
    error,
    updateParams: setDisplayParams,
  };
}

export function useCreateLoanOffer(): UseMutationResult<
  ApiResponse<LoanOffer>,
  ApiError,
  CreateLoanOfferInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loanOfferApi.createLoanOffer,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: loanOfferKeys.customerOffers(variables.customer_id),
      });
    },
  });
}

export function useGenerateLoanComparison(): UseMutationResult<
  ApiResponse<LoanOffer[]>,
  ApiError,
  {
    customerId: number;
    baseAmount: number;
    interestRate: number;
    termOptions: number[];
  }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, baseAmount, interestRate, termOptions }) =>
      loanOfferApi.generateLoanComparison(
        customerId,
        baseAmount,
        interestRate,
        termOptions
      ),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: loanOfferKeys.customerOffers(variables.customerId),
      });
    },
  });
}
