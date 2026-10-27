import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import { ResponseUtil } from "../utils/response.util";
import { AuthRequest } from "../middlewares/rbac.middleware";

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description } = req.body;
      const user = (req as AuthRequest).user;
      if (!user) {
        res.status(401).json(ResponseUtil.error("Unauthorized"));
        return;
      }
      const userId = user.userId;
      const task = await this.taskService.createTask({ title, description, userId });
      res.status(201).json(ResponseUtil.success(task, "Task created successfully"));
    } catch (error: any) {
      res.status(400).json(ResponseUtil.error(error.message || "Failed to create task"));
    }
  };

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as AuthRequest).user;
      if (!user) {
        res.status(401).json(ResponseUtil.error("Unauthorized"));
        return;
      }
      const userId = user.userId;
      const page = parseInt((req.query.page as string) || "1", 10);
      const limit = parseInt((req.query.limit as string) || "10", 10);
      const result = await this.taskService.getAllTasks(userId, page, limit);
      res.status(200).json(ResponseUtil.success(result.tasks, "Tasks retrieved", result.meta));
    } catch (error: any) {
      res.status(500).json(ResponseUtil.error(error.message || "Failed to fetch tasks"));
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = (req as AuthRequest).user;
      if (!user) {
        res.status(401).json(ResponseUtil.error("Unauthorized"));
        return;
      }
      const userId = user.userId;
      const task = await this.taskService.getTaskById(id!, userId);
      res.status(200).json(ResponseUtil.success(task, "Task retrieved"));
    } catch (error: any) {
      res.status(404).json(ResponseUtil.error(error.message || "Task not found"));
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = (req as AuthRequest).user;
      if (!user) {
        res.status(401).json(ResponseUtil.error("Unauthorized"));
        return;
      }
      const userId = user.userId;
      const task = await this.taskService.updateTask(id!, userId, req.body);
      res.status(200).json(ResponseUtil.success(task, "Task updated"));
    } catch (error: any) {
      res.status(404).json(ResponseUtil.error(error.message || "Task not found"));
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = (req as AuthRequest).user;
      if (!user) {
        res.status(401).json(ResponseUtil.error("Unauthorized"));
        return;
      }
      const userId = user.userId;
      await this.taskService.deleteTask(id!, userId);
      res.status(200).json(ResponseUtil.success(null, "Task deleted"));
    } catch (error: any) {
      res.status(404).json(ResponseUtil.error(error.message || "Task not found"));
    }
  };
}