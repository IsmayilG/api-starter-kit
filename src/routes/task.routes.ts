import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authenticate, authorize } from "../middlewares/rbac.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
  getTaskSchema,
  deleteTaskSchema,
  taskQuerySchema,
} from "../utils/validation-schemas.util";

const router = Router();
const taskController = new TaskController();

// All task routes require authentication
router.use(authenticate);

router.post("/", validate(createTaskSchema), taskController.create);
router.get("/", validate(taskQuerySchema), taskController.list);
router.get("/:id", validate(getTaskSchema), taskController.getById);
router.put("/:id", validate(updateTaskSchema), taskController.update);
router.delete("/:id", validate(deleteTaskSchema), taskController.delete);

// Admin-only route example
router.get("/admin/all", authorize("ADMIN"), (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin-only endpoint accessed",
  });
});

export default router;