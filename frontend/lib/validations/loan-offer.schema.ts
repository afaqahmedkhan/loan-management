import { z } from "zod";
import { LOAN_CONSTRAINTS } from "@/types/loan-offer";

export const loanAmountSchema = z
  .number({
    required_error: "Loan amount is required",
    invalid_type_error: "Loan amount must be a number",
  })
  .min(
    LOAN_CONSTRAINTS.AMOUNT.MIN,
    `Minimum loan amount is €${LOAN_CONSTRAINTS.AMOUNT.MIN}`
  )
  .max(
    LOAN_CONSTRAINTS.AMOUNT.MAX,
    `Maximum loan amount is €${LOAN_CONSTRAINTS.AMOUNT.MAX}`
  )
  .positive("Loan amount must be positive");

export const interestRateSchema = z
  .number({
    required_error: "Interest rate is required",
    invalid_type_error: "Interest rate must be a number",
  })
  .min(LOAN_CONSTRAINTS.INTEREST_RATE.MIN, "Interest rate cannot be negative")
  .max(
    LOAN_CONSTRAINTS.INTEREST_RATE.MAX,
    `Maximum interest rate is ${LOAN_CONSTRAINTS.INTEREST_RATE.MAX}%`
  )
  .refine(
    (val) => {
      const decimalPlaces = (val.toString().split(".")[1] || "").length;
      return decimalPlaces <= 2;
    },
    { message: "Interest rate can have at most 2 decimal places" }
  );

export const termMonthsSchema = z
  .number({
    required_error: "Loan term is required",
    invalid_type_error: "Loan term must be a number",
  })
  .int("Loan term must be a whole number")
  .min(
    LOAN_CONSTRAINTS.TERM_MONTHS.MIN,
    `Minimum loan term is ${LOAN_CONSTRAINTS.TERM_MONTHS.MIN} month`
  )
  .max(
    LOAN_CONSTRAINTS.TERM_MONTHS.MAX,
    `Maximum loan term is ${LOAN_CONSTRAINTS.TERM_MONTHS.MAX} months`
  );

export const createLoanOfferSchema = z.object({
  customer_id: z.number().int().positive("Customer ID must be positive"),
  loan_amount: loanAmountSchema,
  interest_rate: interestRateSchema,
  term_months: termMonthsSchema,
});

export const calculateLoanSchema = z.object({
  loan_amount: loanAmountSchema,
  interest_rate: interestRateSchema,
  term_months: termMonthsSchema,
});

export const normalizedCreateLoanOfferSchema = createLoanOfferSchema.transform(
  (data) => ({
    ...data,
    loan_amount: Math.round(data.loan_amount * 100) / 100,
    interest_rate: Math.round(data.interest_rate * 100) / 100,
  })
);

export type CreateLoanOfferFormData = z.infer<typeof createLoanOfferSchema>;
export type CalculateLoanFormData = z.infer<typeof calculateLoanSchema>;

export function validateLoanAmount(amount: number): boolean {
  return loanAmountSchema.safeParse(amount).success;
}

export function validateInterestRate(rate: number): boolean {
  return interestRateSchema.safeParse(rate).success;
}

export function validateTermMonths(term: number): boolean {
  return termMonthsSchema.safeParse(term).success;
}
