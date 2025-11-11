import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

/**
 * Global error handling middleware
 * 
 * MUST be registered LAST in app.ts (after all routes)
 * 
 * Catches errors from:
 * - Async controllers (when using express-async-errors)
 * - Thrown errors with .status property
 * - Zod validation errors
 * - Any unhandled errors
 */
export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Log error for debugging (in production, use proper logging)
  console.error("❌ Error:", err);

  // Handle Zod validation errors specially
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues.map(e => ({
        field: e.path.join("."),  // e.g., "username" or "todos.0.title"
        message: e.message
      }))
    });
  }

  // Handle custom errors with status property
  // Services throw errors like: throw Object.assign(new Error("..."), { status: 404 })
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  return res.status(status).json({ error: message });
}