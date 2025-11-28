import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LoanCalculatorClient from "./loan-calculator-client";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className=" flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Loan Calculator</h1>
            <p className="text-sm text-muted-foreground">
              Calculate loan payments in real-time
            </p>
          </div>
        </div>
      </header>

      <main className=" py-6 max-w-4xl">
        <LoanCalculatorClient />
      </main>
    </div>
  );
}

export const metadata = {
  title: "Loan Calculator",
  description: "Calculate loan payments",
};
