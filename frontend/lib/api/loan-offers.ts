import { api } from "./client";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api";
import type {
  LoanOffer,
  CreateLoanOfferInput,
  CalculateLoanInput,
  LoanCalculationResult,
} from "@/types/loan-offer";

export async function createLoanOffer(
  data: CreateLoanOfferInput
): Promise<ApiResponse<LoanOffer>> {
  return api.post<ApiResponse<LoanOffer>>("/loanoffers", data);
}

export async function calculateLoan(
  data: CalculateLoanInput
): Promise<ApiResponse<LoanCalculationResult>> {
  return api.post<ApiResponse<LoanCalculationResult>>(
    "/loanoffers/calculate",
    data
  );
}

export async function getCustomerLoanOffers(
  customerId: number,
  params?: PaginationParams
): Promise<PaginatedResponse<LoanOffer>> {
  return api.get<PaginatedResponse<LoanOffer>>(
    `/loanoffers/customer/${customerId}`,
    {
      params,
    }
  );
}

export async function createBatchLoanOffers(
  offers: CreateLoanOfferInput[]
): Promise<ApiResponse<LoanOffer[]>> {
  return api.post<ApiResponse<LoanOffer[]>>("/loanoffers/batch", { offers });
}

export async function generateLoanComparison(
  customerId: number,
  baseAmount: number,
  interestRate: number,
  termOptions: number[]
): Promise<ApiResponse<LoanOffer[]>> {
  const offers = termOptions.map((term) => ({
    customer_id: customerId,
    loan_amount: baseAmount,
    interest_rate: interestRate,
    term_months: term,
  }));

  return createBatchLoanOffers(offers);
}
