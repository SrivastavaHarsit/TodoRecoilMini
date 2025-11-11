import { Request, Response } from "express";
import { CreateTodoSchema, UpdateTodoSchema, TodoQuerySchema } from "./todo.schema";
import * as todoService from "./todo.service";

export async function handleListTodos(req: Request, res: Response) {
  // Validate query parameters
  const query = TodoQuerySchema.parse(req.query);
  
  const result = await todoService.listTodos(req.userId!, {
    search: query.search,
    status: query.status,
    page: query.page,
    pageSize: query.pageSize
  });
  
  return res.json(result);
}

export async function handleGetTodo(req: Request, res: Response) {
  const todo = await todoService.getTodo(req.userId!, req.params.id);
  return res.json(todo);
}

export async function handleCreateTodo(req: Request, res: Response) {
  const input = CreateTodoSchema.parse(req.body);
  const todo = await todoService.createTodo(req.userId!, input);
  return res.status(201).json(todo);
}

export async function handleUpdateTodo(req: Request, res: Response) {
  const input = UpdateTodoSchema.parse(req.body);
  const todo = await todoService.updateTodo(req.userId!, req.params.id, input);
  return res.json(todo);
}

export async function handleDeleteTodo(req: Request, res: Response) {
  await todoService.deleteTodo(req.userId!, req.params.id);
  return res.json({ ok: true, message: "Todo deleted" });
}