import type { Request, Response } from "express";
import prisma from "../prisma/client.js";
import type { AuthRequest } from "../middleware/auth.js";

// ==========================
// Get Tasks for Logged-in User
// ==========================

export async function getTasks(
  req: AuthRequest,
  res: Response
): Promise<Response> {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user!.id }, // ✅ only fetch user's tasks
    });
    return res.json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch tasks" });
  }
}

// ==========================
// Create a Task for Logged-in User
// ==========================

export async function createTask(
  req: AuthRequest,
  res: Response
): Promise<Response> {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    // ✅ Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId: req.user.id, // tie task to the logged-in user
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error("Failed to create task:", error);
    return res.status(500).json({ error: "Failed to create task" });
  }
}

// ==========================
// Update Task (Check Ownership)
// ==========================

export async function updateTask(
  req: AuthRequest,
  res: Response
): Promise<Response> {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  if (isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  try {
    // Check ownership first
    const task = await prisma.task.findUnique({ where: { id: Number(id) } });
    if (!task || task.userId !== req.user!.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this task" });
    }

    // Build data object conditionally
    const data: any = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (completed !== undefined) data.completed = completed;

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data,
    });

    return res.json(updatedTask);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }
    console.error(error);
    return res.status(500).json({ error: "Failed to update task" });
  }
}

// ==========================
// Delete Task (Check Ownership)
// ==========================

export async function deleteTask(
  req: AuthRequest,
  res: Response
): Promise<Response> {
  const { id } = req.params;

  try {
    // Check ownership first
    const task = await prisma.task.findUnique({ where: { id: Number(id) } });
    if (!task || task.userId !== req.user!.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this task" });
    }

    await prisma.task.delete({ where: { id: Number(id) } });

    return res.json({ message: "Task Deleted Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete task" });
  }
}
