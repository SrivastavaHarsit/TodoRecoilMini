import { prisma } from "../prisma";
import type { CreateTodoInput, UpdateTodoInput } from "./todo.schema";

/**
 * Options for listing todos
 */
interface ListTodosOptions {
  search?: string;
  status?: "all" | "completed" | "incomplete";
  page?: number;
  pageSize?: number;
}

/**
 * List todos for a specific user with filtering and pagination
 * 
 * @param userId - The authenticated user's ID
 * @param options - Search, filter, and pagination options
 * @returns Object with items, total count, and pagination info
 */
export async function listTodos(userId: string, options: ListTodosOptions = {}) {
  const { 
    search = "", 
    status = "all", 
    page = 1, 
    pageSize = 50 
  } = options;

  // Build Prisma where clause
  const where: any = { userId }; // CRITICAL: Always filter by userId!

  // Filter by completion status
  if (status === "completed") {
    where.done = true;
  } else if (status === "incomplete") {
    where.done = false;
  }

  // Search in title OR description (case-insensitive)
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } }
    ];
  }

  // Fetch todos and total count in parallel (faster!)
  const [items, total] = await Promise.all([
    prisma.todo.findMany({
      where,
      orderBy: [
        { createdAt: "desc" }, // Newest first
        { id: "desc" }         // Then by ID for stability
      ],
      skip: (page - 1) * pageSize, // Offset pagination
      take: pageSize                // Limit results
    }),
    prisma.todo.count({ where })
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total // Are there more pages?
  };
}

/**
 * Get a single todo by ID
 * 
 * @throws Error with status 404 if todo not found or doesn't belong to user
 */
export async function getTodo(userId: string, todoId: string) {
  // findFirst returns null if not found (doesn't throw)
  const todo = await prisma.todo.findFirst({
    where: { 
      id: todoId,
      userId // CRITICAL: Ensure user owns this todo!
    }
  });

  if (!todo) {
    throw Object.assign(
      new Error("Todo not found"),
      { status: 404 }
    );
  }

  return todo;
}

/**
 * Create a new todo for the authenticated user
 */
export async function createTodo(userId: string, data: CreateTodoInput) {
  return prisma.todo.create({
    data: {
      title: data.title,
      description: data.description || "",
      userId // Automatically associate with current user
    }
  });
}

/**
 * Update an existing todo
 * 
 * @throws Error with status 404 if todo not found or doesn't belong to user
 */
export async function updateTodo(
  userId: string, 
  todoId: string, 
  data: UpdateTodoInput
) {
  // First verify ownership
  await getTodo(userId, todoId);

  // Update the todo
  return prisma.todo.update({
    where: { id: todoId },
    data
  });
}

/**
 * Delete a todo
 * 
 * @throws Error with status 404 if todo not found or doesn't belong to user
 */
export async function deleteTodo(userId: string, todoId: string) {
  // Verify ownership first
  await getTodo(userId, todoId);

  await prisma.todo.delete({
    where: { id: todoId }
  });
}

/**
 * Prisma query methods used here:
 * 
 * findMany() - Get multiple records
 * findFirst() - Get one record (returns null if not found)
 * count() - Get total count
 * create() - Insert new record
 * update() - Modify existing record
 * delete() - Remove record
 * 
 * All methods return fully typed objects!
 */

/**
 * Security note:
 * EVERY query MUST filter by userId to prevent users from accessing
 * each other's data. This is implemented by:
 * 1. Always including userId in where clause
 * 2. Verifying ownership before update/delete operations
 */