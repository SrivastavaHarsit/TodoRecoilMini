import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import { corsMiddleware } from "./middleware/cors";
import { errorMiddleware } from "./middleware/error";
import authRoutes from "./auth/auth.routes";
import todoRoutes from "./todos/todo.routes";

const app = express();

app.use(helmet());

app.use(express.json());

app.use(cookieParser());

app.use(corsMiddleware);

app.use(morgan("dev"));



app.get("/health", (_req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString() 
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/todos", todoRoutes);

app.use(errorMiddleware);

export default app;