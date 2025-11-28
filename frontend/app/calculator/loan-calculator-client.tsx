"use client";

import { useState } from "react";
import { useDebouncedLoanCalculation } from "@/lib/hooks/use-loan-offers";
import { LOAN_CONSTRAINTS } from "@/types/loan-offer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calculator,
  TrendingUp,
  Wallet,
  Clock,
  DollarSign,
  Percent,
  Calendar,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function LoanCalculatorClient() {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [termMonths, setTermMonths] = useState(24);

  const { calculation, isCalculating } = useDebouncedLoanCalculation(
    {
      loan_amount: loanAmount,
      interest_rate: interestRate,
      term_months: termMonths,
    },
    500
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Loan Payment Calculator</CardTitle>
          </div>
          <CardDescription>
            Enter loan details to calculate monthly payments and total costs
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loan Parameters</CardTitle>
              <CardDescription>
                Adjust values to see calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Loan Amount
                  </Label>
                  <span className="text-lg font-semibold">
                    {formatCurrency(loanAmount)}
                  </span>
                </div>
                <Input
                  id="amount"
                  type="range"
                  min={LOAN_CONSTRAINTS.AMOUNT.MIN}
                  max={LOAN_CONSTRAINTS.AMOUNT.MAX}
                  step="1000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>€{LOAN_CONSTRAINTS.AMOUNT.MIN.toLocaleString()}</span>
                  <span>€{LOAN_CONSTRAINTS.AMOUNT.MAX.toLocaleString()}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rate" className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Interest Rate
                  </Label>
                  <span className="text-lg font-semibold">
                    {interestRate.toFixed(2)}%
                  </span>
                </div>
                <Input
                  id="rate"
                  type="range"
                  min={LOAN_CONSTRAINTS.INTEREST_RATE.MIN}
                  max={LOAN_CONSTRAINTS.INTEREST_RATE.MAX}
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{LOAN_CONSTRAINTS.INTEREST_RATE.MIN}%</span>
                  <span>{LOAN_CONSTRAINTS.INTEREST_RATE.MAX}%</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="term" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Loan Term
                  </Label>
                  <span className="text-lg font-semibold">
                    {termMonths} months
                  </span>
                </div>
                <Input
                  id="term"
                  type="range"
                  min={LOAN_CONSTRAINTS.TERM_MONTHS.MIN}
                  max={LOAN_CONSTRAINTS.TERM_MONTHS.MAX}
                  step="1"
                  value={termMonths}
                  onChange={(e) => setTermMonths(parseInt(e.target.value, 10))}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{LOAN_CONSTRAINTS.TERM_MONTHS.MIN} mo</span>
                  <span>{LOAN_CONSTRAINTS.TERM_MONTHS.MAX} mo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <p className="font-semibold">How to use:</p>
                <ul className="space-y-1 text-muted-foreground list-disc pl-5">
                  <li>Adjust the sliders to set loan parameters</li>
                  <li>See calculations update in real-time</li>
                  <li>Monthly payment includes principal + interest</li>
                  <li>Total interest shows cost of borrowing</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Calculation Results</CardTitle>
                {isCalculating && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <CardDescription>Your loan payment breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {isCalculating ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : calculation ? (
                <div className="space-y-6">
                  <div className="rounded-lg bg-primary/10 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="h-5 w-5 text-primary" />
                      <p className="text-sm font-medium text-primary">
                        Monthly Payment
                      </p>
                    </div>
                    <p className="text-4xl font-bold text-primary">
                      {formatCurrency(calculation.monthly_payment)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      for {termMonths} months
                    </p>
                  </div>

                  <Separator />

                  <div className="flex items-start justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                        <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total Payment</p>
                        <p className="text-xs text-muted-foreground">
                          Total amount you'll pay
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {formatCurrency(calculation.total_payment)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                        <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total Interest</p>
                        <p className="text-xs text-muted-foreground">
                          Cost of borrowing
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-600">
                        {formatCurrency(calculation.total_interest)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm font-semibold mb-3">
                      Payment Summary
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Loan Amount:
                        </span>
                        <span className="font-medium">
                          {formatCurrency(loanAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Interest Rate:
                        </span>
                        <span className="font-medium">
                          {interestRate.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Loan Term:
                        </span>
                        <span className="font-medium">{termMonths} months</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-base">
                        <span className="font-semibold">Monthly Payment:</span>
                        <span className="font-bold text-primary">
                          {formatCurrency(calculation.monthly_payment)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Adjust the sliders to see calculations
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
