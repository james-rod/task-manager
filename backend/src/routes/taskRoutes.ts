import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, getTasks);

router.post("/", authenticate, createTask);

router.put("/:id", authenticate, updateTask);

router.delete("/:id", authenticate, deleteTask);

export default router; // ✅ default export
