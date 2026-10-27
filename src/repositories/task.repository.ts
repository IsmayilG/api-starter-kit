import { prisma } from "../config/db";
import { Task, User } from "@prisma/client";

export class TaskRepository {
  async create(data: {
    title: string;
    description?: string;
    userId: string;
  }): Promise<Task> {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        userId: data.userId,
      },
    });
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    return prisma.task.findFirst({ where: { id, userId } });
  }

  async findAllByUser(userId: string, skip = 0, take = 10): Promise<Task[]> {
    return prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  }

  async countByUser(userId: string): Promise<number> {
    return prisma.task.count({ where: { userId } });
  }

  async update(
    id: string,
    userId: string,
    data: { title?: string; description?: string; completed?: boolean }
  ): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data,
      include: { user: true },
    });
  }

  async delete(id: string, userId: string): Promise<Task> {
    return prisma.task.delete({ where: { id } });
  }
}