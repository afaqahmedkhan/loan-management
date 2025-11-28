"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCustomer, useUpdateCustomer } from "@/lib/hooks/use-customers";
import {
  updateCustomerSchema,
  type UpdateCustomerFormData,
} from "@/lib/validations/customer.schema";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function CustomerEditClient({
  customerId,
}: {
  customerId: number;
}) {
  const router = useRouter();
  const { data: customer, isLoading } = useCustomer(customerId);
  const updateCustomer = useUpdateCustomer();

  const form = useForm<UpdateCustomerFormData>({
    resolver: zodResolver(updateCustomerSchema),
    values: customer
      ? {
          first_name: customer.data.first_name,
          last_name: customer.data.last_name,
          email: customer.data.email,
          phone: customer.data.phone || "",
          address: customer.data.address || "",
        }
      : undefined,
    mode: "onChange",
  });

  const onSubmit = async (data: UpdateCustomerFormData) => {
    try {
      await updateCustomer.mutateAsync({ id: customerId, data });
      router.push(`/customers/${customerId}`);
    } catch (error) {
      console.error("Failed to update customer:", error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!customer) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Customer Not Found</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Customer Information</CardTitle>
        <CardDescription>Update the customer's details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {updateCustomer.error && (
              <div className="rounded-md bg-destructive/15 p-3">
                <p className="text-sm font-medium text-destructive">
                  {updateCustomer.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={updateCustomer.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateCustomer.isPending}
                className="flex-1"
              >
                {updateCustomer.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {updateCustomer.isPending ? "Updating..." : "Update Customer"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
