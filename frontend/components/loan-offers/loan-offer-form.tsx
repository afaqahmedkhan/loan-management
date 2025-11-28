"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebouncedLoanCalculation } from "@/lib/hooks/use-loan-offers";
import { useCreateLoanOffer } from "@/lib/hooks/use-loan-offers";
import {
  createLoanOfferSchema,
  type CreateLoanOfferFormData,
} from "@/lib/validations/loan-offer.schema";
import { LOAN_CONSTRAINTS } from "@/types/loan-offer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Calculator, TrendingUp, Wallet, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface LoanOfferFormProps {
  customerId: number;
  onSuccess?: () => void;
}

export default function LoanOfferForm({
  customerId,
  onSuccess,
}: LoanOfferFormProps) {
  const createOffer = useCreateLoanOffer();

  const form = useForm<CreateLoanOfferFormData>({
    resolver: zodResolver(createLoanOfferSchema),
    defaultValues: {
      customer_id: customerId,
      loan_amount: 10000,
      interest_rate: 5.5,
      term_months: 24,
    },
    mode: "onChange",
  });

  const { params, calculation, isCalculating, updateParams } =
    useDebouncedLoanCalculation(
      {
        loan_amount: form.watch("loan_amount") || 0,
        interest_rate: form.watch("interest_rate") || 0,
        term_months: form.watch("term_months") || 0,
      },
      500
    );

  const onSubmit = async (data: CreateLoanOfferFormData) => {
    try {
      await createOffer.mutateAsync(data);
      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error("Failed to create loan offer:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Create Loan Offer</CardTitle>
        </div>
        <CardDescription>
          Enter loan parameters to see live calculations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="loan_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Amount (€)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={LOAN_CONSTRAINTS.AMOUNT.MIN}
                          max={LOAN_CONSTRAINTS.AMOUNT.MAX}
                          step="100"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        €{LOAN_CONSTRAINTS.AMOUNT.MIN.toLocaleString()} - €
                        {LOAN_CONSTRAINTS.AMOUNT.MAX.toLocaleString()}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interest_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={LOAN_CONSTRAINTS.INTEREST_RATE.MIN}
                          max={LOAN_CONSTRAINTS.INTEREST_RATE.MAX}
                          step="0.1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        {LOAN_CONSTRAINTS.INTEREST_RATE.MIN}% -{" "}
                        {LOAN_CONSTRAINTS.INTEREST_RATE.MAX}%
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="term_months"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Term (Months)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={LOAN_CONSTRAINTS.TERM_MONTHS.MIN}
                          max={LOAN_CONSTRAINTS.TERM_MONTHS.MAX}
                          step="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        {LOAN_CONSTRAINTS.TERM_MONTHS.MIN} -{" "}
                        {LOAN_CONSTRAINTS.TERM_MONTHS.MAX} months
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {createOffer.error && (
                  <div className="rounded-md bg-destructive/15 p-3">
                    <p className="text-sm font-medium text-destructive">
                      {createOffer.error.message}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    createOffer.isPending || isCalculating || !calculation
                  }
                >
                  {createOffer.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Offer...
                    </>
                  ) : (
                    <>Create Loan Offer</>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Loan Calculation
                {isCalculating && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </h3>

              {!calculation && !isCalculating ? (
                <p className="text-sm text-muted-foreground">
                  Enter loan details to see calculations
                </p>
              ) : isCalculating ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : calculation ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-primary/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">Monthly Payment</p>
                    </div>
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrency(calculation.monthly_payment)}
                    </p>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total Payment</span>
                    </div>
                    <span className="text-lg font-semibold">
                      {formatCurrency(calculation.total_payment)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Total Interest
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-amber-600">
                      {formatCurrency(calculation.total_interest)}
                    </span>
                  </div>

                  <Separator />

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      • Pay {formatCurrency(calculation.monthly_payment)} per
                      month
                    </p>
                    <p>• For {params.term_months} months</p>
                    <p>• At {params.interest_rate}% interest</p>
                  </div>
                </div>
              ) : null}
            </div>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> Adjust the loan amount, interest
                  rate, or term to see how monthly payments change in real-time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
