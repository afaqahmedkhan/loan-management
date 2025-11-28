"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCustomer } from "@/lib/hooks/use-customers";
import {
  createCustomerSchema,
  type CreateCustomerFormData,
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
import { Loader2 } from "lucide-react";

export default function CustomerFormClient() {
  const router = useRouter();
  const createCustomer = useCreateCustomer();

  const form = useForm<CreateCustomerFormData>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: CreateCustomerFormData) => {
    try {
      const customer = await createCustomer.mutateAsync(data);
      router.push(`/customers/${customer.data.id}`);
    } catch (error) {
      console.error("Failed to create customer:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
        <CardDescription>Enter the customer's details below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormDescription>Customer's legal first name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormDescription>Customer's legal last name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Primary email for contact</FormDescription>
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
                    <Input type="tel" placeholder="+49 123 456789" {...field} />
                  </FormControl>
                  <FormDescription>
                    Contact phone number (optional)
                  </FormDescription>
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
                    <Input
                      placeholder="123 Main St, Berlin, Germany"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Physical address (optional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {createCustomer.error && (
              <div className="rounded-md bg-destructive/15 p-3">
                <p className="text-sm font-medium text-destructive">
                  {createCustomer.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={createCustomer.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createCustomer.isPending}
                className="flex-1"
              >
                {createCustomer.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {createCustomer.isPending ? "Creating..." : "Create Customer"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
