import { z } from "zod";

export const userSchmaValidation = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  gender: z.string().toUpperCase(),
});

export const userLoginValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const userRTokenCreds = z.object({
  name: z.string(),
  email: z.string().email(),
});

const taskStatus = z.enum(["PENDING", "COMPLETED"]);

// Due date schema should allow optional values and only validate if provided
const dateSchema = z
  .string()
  .optional()
  .refine((date) => {
    if (!date) return true; // Allow empty dueDate
    return /^\d{4}-\d{2}-\d{2}$/.test(date) || /^\d{2}-\d{2}-\d{4}$/.test(date);
  }, "Invalid date format, Use YYYY-MM-DD or DD-MM-YYYY format")
  .transform((date) => {
    if (!date) return date; // Keep it optional
    if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
      const [day, month, year] = date.split("-");
      return `${year}-${month}-${day}`;
    }
    return date;
  })
  .refine((date) => {
    if (!date) return true; // Skip validation if dueDate is not provided
    const parsedDate = new Date(date + "T00:00:00.000Z");
    return !isNaN(parsedDate.getTime()) && parsedDate.getTime() >= Date.now();
  }, "Due date must be in the future");

export const taskSchema = z.object({
  title: z.string(),
  description: z.string(),
  dueDate: dateSchema, // Already optional in schema
  status: taskStatus.optional(),
  email: z.string().email(),
});

// Ensure validation allows empty dueDate
export const validateDueDate = (dueDate?: string) => {
  if (!dueDate) return null; // Allow missing dueDate
  const result = dateSchema.safeParse(dueDate);
  return result.success ? result.data : null;
};
