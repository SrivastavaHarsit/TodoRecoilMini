import { z } from "zod";

export const SignupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});

export const LoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8)
});

// TypeScript types inferred from schemas
export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;