import { Router } from "express";
import { authGuard } from "../middleware/auth";
import {
  handleListTodos,
  handleGetTodo,
  handleCreateTodo,
  handleUpdateTodo,
  handleDeleteTodo
} from "./todo.controller";

const router = Router();

// All routes require authentication
router.use(authGuard);

router.get("/", handleListTodos);
router.get("/:id", handleGetTodo);
router.post("/", handleCreateTodo);
router.patch("/:id", handleUpdateTodo);
router.delete("/:id", handleDeleteTodo);

export default router;