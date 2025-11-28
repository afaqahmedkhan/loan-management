export interface LoanOffer {
  id: number;
  customer_id: number;
  loan_amount: number;
  interest_rate: number;
  term_months: number;
  monthly_payment: number;
  total_payment: number;
  total_interest: number;
  created_at: string;
}

export interface CreateLoanOfferInput {
  customer_id: number;
  loan_amount: number;
  interest_rate: number;
  term_months: number;
}

export interface CalculateLoanInput {
  loan_amount: number;
  interest_rate: number;
  term_months: number;
}

export interface LoanCalculationResult {
  monthly_payment: number;
  total_payment: number;
  total_interest: number;
}

export const LOAN_CONSTRAINTS = {
  AMOUNT: {
    MIN: 1000,
    MAX: 1_000_000,
  },
  INTEREST_RATE: {
    MIN: 0,
    MAX: 100,
  },
  TERM_MONTHS: {
    MIN: 1,
    MAX: 360,
  },
} as const;

export function formatLoanAmount(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function formatInterestRate(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

export function calculateEffectiveRate(
  principal: number,
  monthlyPayment: number,
  termMonths: number
): number {
  const totalPaid = monthlyPayment * termMonths;
  const interestPaid = totalPaid - principal;
  return (interestPaid / principal) * 100;
}
