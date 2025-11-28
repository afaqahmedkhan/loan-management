import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import CustomerDetailClient from "./customer-detail-client";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customerId = parseInt(id, 10);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className=" flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/customers">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Customer Details</h1>
              <p className="text-sm text-muted-foreground">
                View customer information and loan offers
              </p>
            </div>
          </div>

          <Button asChild>
            <Link href={`/customers/${customerId}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Customer
            </Link>
          </Button>
        </div>
      </header>

      <main className=" py-6">
        <CustomerDetailClient customerId={customerId} />
      </main>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return {
    title: `Customer ${id}`,
    description: "Customer details and loan offers",
  };
}
