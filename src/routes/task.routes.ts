import { Router } from "express";
import { TaskController } from "../controllers/task.controller";

const router = Router();
const taskController = new TaskController();

// Apply auth middleware inline for simplicity
router.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const token = authHeader.split(" ")[1];
    const jwt = require("jsonwebtoken");
    const { env } = require("../config/env");
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    (req as any).user = { userId: decoded.userId };
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
});

router.post("/", taskController.create);
router.get("/", taskController.list);
router.get("/:id", taskController.getById);
router.put("/:id", taskController.update);
router.delete("/:id", taskController.delete);

export default router;