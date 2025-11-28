import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  FileText,
  Calculator,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
      <header className="border-b bg-card/50 backdrop-blur-xl supports-backdrop-filter:bg-card/30">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text ">
              Loan Offer Platform
            </h1>
          </div>

          <nav className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/customers">Customers</Link>
            </Button>
            <Button
              asChild
              className="bg-linear-to-r from-primary to-accent hover:opacity-90"
            >
              <Link href="/customers/new">
                New Customer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Loan Management
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text ">
                Loan Offer Platform
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Manage customers and create personalized loan offers with
              real-time calculations
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-linear-to-r from-primary to-accent hover:opacity-90 shadow-lg"
            >
              <Link href="/customers">
                View Customers
                <Users className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-2">
              <Link href="/calculator">
                Try Calculator
                <Calculator className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-primary/20 bg-linear-to-br from-card to-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Customer Management</CardTitle>
              </div>
              <CardDescription>
                Manage your customer database with ease
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Create, view, edit, and manage customer information all in one
                place.
              </p>
              <Button
                variant="ghost"
                className="w-full justify-between group"
                asChild
              >
                <Link href="/customers">
                  Manage Customers
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-accent/20 bg-linear-to-br from-card to-accent/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Calculator className="h-5 w-5 text-accent" />
                </div>
                <CardTitle>Loan Calculator</CardTitle>
              </div>
              <CardDescription>
                Real-time loan payment calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Calculate monthly payments, total interest, and payment
                schedules instantly.
              </p>
              <Button
                variant="ghost"
                className="w-full justify-between group"
                asChild
              >
                <Link href="/calculator">
                  Try Calculator
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-primary/20 bg-linear-to-br from-card to-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Loan Offers</CardTitle>
              </div>
              <CardDescription>Create and manage loan offers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Generate personalized loan offers for your customers with custom
                terms.
              </p>
              <Button
                variant="ghost"
                className="w-full justify-between group"
                asChild
              >
                <Link href="/customers">
                  View Offers
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="text-2xl">Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Button
                variant="outline"
                className="h-auto flex-col gap-3 p-6 border-2 hover:border-primary hover:bg-primary/5 transition-all"
                asChild
              >
                <Link href="/customers/new">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg">
                      Add New Customer
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Create a new customer profile
                    </div>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-3 p-6 border-2 hover:border-accent hover:bg-accent/5 transition-all"
                asChild
              >
                <Link href="/calculator">
                  <div className="p-3 rounded-full bg-accent/10">
                    <Calculator className="h-8 w-8 text-accent" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg">Calculate Loan</div>
                    <div className="text-sm text-muted-foreground">
                      Use our loan calculator
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t bg-card/50 backdrop-blur-xl">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Built with Next.js 16, TanStack Query, and shadcn/ui
            </p>
            <div className="flex gap-2">
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                Modern
              </div>
              <div className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                Fast
              </div>
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                Secure
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export const metadata = {
  title: "Home",
  description: "Manage customers and create personalized loan offers",
};
