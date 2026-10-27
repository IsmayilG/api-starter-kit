import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().uuid("Invalid task ID"),
  }),
});

export const getTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid task ID"),
  }),
});

export const deleteTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid task ID"),
  }),
});

export const taskQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().refine((val) => !val || /^\d+$/.test(val ?? ""), {
      message: "Page must be a number",
    }),
    limit: z.string().optional().refine((val) => !val || /^\d+$/.test(val ?? ""), {
      message: "Limit must be a number",
    }),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});