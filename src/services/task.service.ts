import { TaskRepository } from "../repositories/task.repository";

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async createTask(data: {
    title: string;
    description?: string;
    userId: string;
  }) {
    return this.taskRepository.create(data);
  }

  async getTaskById(id: string, userId: string) {
    const task = await this.taskRepository.findById(id, userId);
    if (!task) {
      throw new Error("Task not found");
    }
    return task;
  }

  async getAllTasks(userId: string) {
    return this.taskRepository.findAllByUser(userId);
  }

  async updateTask(id: string, userId: string, data: {
    title?: string;
    description?: string;
    completed?: boolean;
  }) {
    const existing = await this.taskRepository.findById(id, userId);
    if (!existing) {
      throw new Error("Task not found");
    }
    return this.taskRepository.update(id, userId, data);
  }

  async deleteTask(id: string, userId: string) {
    const existing = await this.taskRepository.findById(id, userId);
    if (!existing) {
      throw new Error("Task not found");
    }
    return this.taskRepository.delete(id, userId);
  }
}