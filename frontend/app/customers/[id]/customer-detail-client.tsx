"use client";

import { useState } from "react";
import Link from "next/link";
import { useCustomer } from "@/lib/hooks/use-customers";
import { useCustomerLoanOffers } from "@/lib/hooks/use-loan-offers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Calendar, FileText, Plus } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import LoanOfferForm from "@/components/loan-offers/loan-offer-form";

export default function CustomerDetailClient({
  customerId,
}: {
  customerId: number;
}) {
  const [showLoanForm, setShowLoanForm] = useState(false);

  const {
    data: customer,
    isLoading: loadingCustomer,
    error: customerError,
  } = useCustomer(customerId);
  const { data: loanOffers, isLoading: loadingOffers } =
    useCustomerLoanOffers(customerId);

  if (loadingCustomer) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (customerError || !customer) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Customer Not Found</CardTitle>
          <CardDescription>
            {customerError?.message || "This customer does not exist"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/customers">Back to Customers</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">
                {customer.data.first_name} {customer.data.last_name}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Customer ID: {customer.data.id}
              </CardDescription>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  {customer.data.email}
                </p>
              </div>
            </div>

            {customer.data.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.data.phone}
                  </p>
                </div>
              </div>
            )}

            {customer.data.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.data.address}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Customer Since</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(customer.data.created_at, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Loan Offers</h2>
            <p className="text-sm text-muted-foreground">
              View and create loan offers for this customer
            </p>
          </div>
          <Button onClick={() => setShowLoanForm(!showLoanForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {showLoanForm ? "Hide Form" : "New Offer"}
          </Button>
        </div>

        {showLoanForm && (
          <LoanOfferForm
            customerId={customerId}
            onSuccess={() => setShowLoanForm(false)}
          />
        )}

        {loadingOffers ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : loanOffers && loanOffers.data.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {loanOffers.data.map((offer) => (
              <Card
                key={offer.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">
                      {formatCurrency(offer.loan_amount)}
                    </CardTitle>
                    <Badge>{offer.term_months} months</Badge>
                  </div>
                  <CardDescription>{offer.interest_rate}% APR</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Monthly Payment:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(offer.monthly_payment)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Payment:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(offer.total_payment)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Interest:
                      </span>
                      <span className="font-semibold text-amber-600">
                        {formatCurrency(offer.total_interest)}
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-xs text-muted-foreground">
                    Created: {formatDate(offer.created_at)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-center">No Loan Offers Yet</CardTitle>
              <CardDescription className="text-center">
                Create the first loan offer for this customer
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => setShowLoanForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Loan Offer
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
