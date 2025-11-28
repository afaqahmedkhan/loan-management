import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CustomerEditClient from "./customer-edit-client";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customerId = parseInt(id, 10);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className=" flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/customers/${customerId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Customer</h1>
            <p className="text-sm text-muted-foreground">
              Update customer information
            </p>
          </div>
        </div>
      </header>

      <main className=" py-6 max-w-2xl">
        <CustomerEditClient customerId={customerId} />
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
    title: `Edit Customer ${id}`,
    description: "Update customer information",
  };
}
