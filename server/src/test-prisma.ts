// server/src/test-prisma.ts

import { prisma } from "./prisma";

async function main() {
  console.log("Testing Prisma connection...");
  
  // Create a test user
  const user = await prisma.user.create({
    data: {
      username: "testuser",
      password: "hashed_password_here",
      firstName: "Test",
      lastName: "User",
    },
  });
  
  console.log("Created user:", user);
  
  // Create a todo for this user
  const todo = await prisma.todo.create({
    data: {
      title: "Learn Prisma",
      description: "Understand how Prisma ORM works",
      userId: user.id,
    },
  });
  
  console.log("Created todo:", todo);
  
  // Fetch user with their todos
  const userWithTodos = await prisma.user.findUnique({
    where: { id: user.id },
    include: { todos: true },
  });
  
  console.log("User with todos:", userWithTodos);
  
  // Cleanup
//   await prisma.user.delete({ where: { id: user.id } });
//   console.log("Cleaned up test data");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());