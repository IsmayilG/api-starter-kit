import { Request, Response } from "express";
import { TaskService } from "../services/task.service";

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description } = req.body;
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const task = await this.taskService.createTask({ title, description, userId });
      res.status(201).json({ success: true, data: task });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || "Failed to create task" });
    }
  };

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const tasks = await this.taskService.getAllTasks(userId);
      res.status(200).json({ success: true, data: tasks });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Failed to fetch tasks" });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;
      const task = await this.taskService.getTaskById(id, userId);
      res.status(200).json({ success: true, data: task });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message || "Task not found" });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;
      const task = await this.taskService.updateTask(id, userId, req.body);
      res.status(200).json({ success: true, data: task });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message || "Task not found" });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;
      await this.taskService.deleteTask(id, userId);
      res.status(200).json({ success: true, message: "Task deleted" });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message || "Task not found" });
    }
  };
}