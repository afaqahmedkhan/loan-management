import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import CustomerListClient from "./customer-list-client";

export default function CustomersPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className=" flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Customers</h1>
              <p className="text-sm text-muted-foreground">
                Manage your customer database
              </p>
            </div>
          </div>

          <Button asChild>
            <Link href="/customers/new">
              <Plus className="mr-2 h-4 w-4" />
              New Customer
            </Link>
          </Button>
        </div>
      </header>

      <main className=" py-6">
        <CustomerListClient />
      </main>
    </div>
  );
}

export const metadata = {
  title: "Customers",
  description: "Manage your customers",
};
