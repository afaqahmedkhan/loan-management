"use client";

import { useState } from "react";
import Link from "next/link";
import { useCustomers, useDeleteCustomer } from "@/lib/hooks/use-customers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Customer } from "@/types/customer";

export default function CustomerListClient() {
  const [page, setPage] = useState(0);
  const [deleteCustomerId, setDeleteCustomerId] = useState<number | null>(null);

  const pageSize = 10;

  const { data, isLoading, error } = useCustomers({
    skip: page * pageSize,
    limit: pageSize,
  });

  const deleteCustomer = useDeleteCustomer();

  const handleDelete = async () => {
    if (!deleteCustomerId) return;

    await deleteCustomer.mutateAsync(deleteCustomerId, {
      onSuccess: () => {
        setDeleteCustomerId(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">
            Error Loading Customers
          </CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Customers Found</CardTitle>
          <CardDescription>
            Get started by creating your first customer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/customers/new">Create Customer</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const totalPages = Math.ceil(data.total / pageSize);
  const hasNextPage = page < totalPages - 1;
  const hasPrevPage = page > 0;

  return (
    <>
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-3xl font-bold">{data.total}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Showing {page * pageSize + 1} -{" "}
                  {Math.min((page + 1) * pageSize, data.total)} of {data.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {data.data.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onDelete={() => setDeleteCustomerId(customer.id)}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p - 1)}
            disabled={!hasPrevPage}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNextPage}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog
        open={!!deleteCustomerId}
        onOpenChange={() => setDeleteCustomerId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCustomerId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteCustomer.isPending}
            >
              {deleteCustomer.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CustomerCard({
  customer,
  onDelete,
}: {
  customer: Customer;
  onDelete: () => void;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">
              {customer.first_name} {customer.last_name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Mail className="h-3 w-3" />
              {customer.email}
            </CardDescription>
          </div>
          <Badge>{`ID: ${customer.id}`}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          {customer.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              {customer.phone}
            </div>
          )}
          {customer.address && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {customer.address}
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          Created: {formatDate(customer.created_at)}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/customers/${customer.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/customers/${customer.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
