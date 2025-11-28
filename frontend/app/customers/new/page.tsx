import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CustomerFormClient from "./customer-form-client";

export default function NewCustomerPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className=" flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">New Customer</h1>
            <p className="text-sm text-muted-foreground">
              Create a new customer profile
            </p>
          </div>
        </div>
      </header>

      <main className=" py-6 max-w-2xl">
        <CustomerFormClient />
      </main>
    </div>
  );
}

export const metadata = {
  title: "New Customer",
  description: "Create a new customer",
};
