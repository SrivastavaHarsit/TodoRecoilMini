import { z } from "zod";

export const CreateTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional().default("")
});

export const UpdateTodoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  done: z.boolean().optional()
}).refine(
  data => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
);

export const TodoQuerySchema = z.object({
  search: z.string().optional().default(""),
  status: z.enum(["all", "completed", "incomplete"]).optional().default("all"),
  page: z.string().optional().default("1").transform(Number),
  pageSize: z.string().optional().default("50").transform(Number)
});

export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>;
export type TodoQueryInput = z.infer<typeof TodoQuerySchema>;