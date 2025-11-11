import cors from "cors";

export const corsMiddleware = cors({
  origin: "http://localhost:5173", // your Vite dev server
  credentials: true                // allow cookies
});