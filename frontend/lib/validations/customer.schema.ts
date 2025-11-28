import { z } from "zod";

export const createCustomerSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s\-']+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s\-']+$/,
      "Last name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase()
    .trim(),

  phone: z
    .string()
    .regex(/^[\d\s\+\-\(\)]+$/, "Invalid phone number format")
    .min(6, "Phone number must be at least 6 characters")
    .max(20, "Phone number must be less than 20 characters")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .max(200, "Address must be less than 200 characters")
    .optional()
    .or(z.literal("")),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerFormData = z.infer<typeof updateCustomerSchema>;

export function validateCustomerEmail(email: string): boolean {
  return createCustomerSchema.shape.email.safeParse(email).success;
}

export function validateCustomerPhone(phone: string): boolean {
  if (!phone) return true;
  return createCustomerSchema.shape.phone.safeParse(phone).success;
}
