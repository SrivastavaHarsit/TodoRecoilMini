import jwt from "jsonwebtoken";
import { prisma } from "../prisma";
import { env } from "../env";
import { hashPassword, verifyPassword } from "../utils/passwords";
import type { SignupInput } from "./auth.schema";
import { hash, sign } from "crypto";


function signToken(userId: string): string {
    return jwt.sign(
        { sub: userId },
        env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

export async function signup(input: SignupInput) {
    const existingUser = await prisma.user.findUnique({
        where: { username: input.username }
    });

    if(existingUser) {
        throw Object.assign(new Error("Username already taken"), { status: 400 });
    }

    const hashedPassword = await hashPassword(input.password);

    // Create the user
    const user = await prisma.user.create({
        data : {
            username: input.username,
            password: hashedPassword,
            firstName: input.firstName,
            lastName: input.lastName
        },
        select: {
            id: true,
        }
    });

    return signToken(user.id);
}


export async function login(username: string, password: string) {
  // Find user by username
  const user = await prisma.user.findUnique({ 
    where: { username } 
  });
  
  if (!user) {
    throw Object.assign(
      new Error("Invalid credentials"), 
      { status: 401 } // HTTP 401 Unauthorized
    );
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password);
  
  if (!isValid) {
    throw Object.assign(
      new Error("Invalid credentials"), 
      { status: 401 }
    );
  }

  return signToken(user.id);
}