import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env";

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function authGuard(req: Request, res: Response, next: NextFunction) {
  // Read JWT from HTTP-only cookie
  const token = req.cookies?.auth;
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, env.JWT_SECRET) as { sub: string };
    
    // Attach userId to request object for use in controllers
    req.userId = decoded.sub;
    
    next(); // Continue to next middleware/controller
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
}