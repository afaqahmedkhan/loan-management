export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerInput {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface UpdateCustomerInput extends Partial<CreateCustomerInput> {}

export function getCustomerFullName(customer: Customer): string {
  return `${customer.first_name} ${customer.last_name}`;
}

export function hasContactInfo(customer: Customer): boolean {
  return !!(customer.phone || customer.address);
}
