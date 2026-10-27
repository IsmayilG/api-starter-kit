import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

beforeAll(async () => {
  // Ensure test database is clean
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});