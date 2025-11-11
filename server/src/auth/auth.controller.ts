import { Request, Response } from "express";
import { SignupSchema, LoginSchema } from "./auth.schema";
import { signup, login } from "./auth.service";

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true,    // Cannot be accessed by JavaScript (XSS protection)
  sameSite: "lax" as const, // CSRF protection
  secure: false,     // Set to true in production (requires HTTPS)
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
};

export async function handleSignup(req: Request, res: Response) {
  // Validate request body (throws if invalid)
  const input = SignupSchema.parse(req.body);
  
  // Create user and get JWT token
  const token = await signup(input);
  
  // Set HTTP-only cookie
  res.cookie("auth", token, COOKIE_OPTIONS);
  
  return res.status(201).json({ 
    ok: true,
    message: "User created successfully" 
  });
}

export async function handleLogin(req: Request, res: Response) {
  const input = LoginSchema.parse(req.body);
  
  const token = await login(input.username, input.password);
  
  res.cookie("auth", token, COOKIE_OPTIONS);
  
  return res.json({ 
    ok: true,
    message: "Logged in successfully" 
  });
}

export async function handleLogout(_req: Request, res: Response) {
  // Clear the auth cookie
  res.clearCookie("auth");
  
  return res.json({ 
    ok: true,
    message: "Logged out successfully" 
  });
}