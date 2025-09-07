"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useTaskStore, Task } from "@/store/useTaskStore";
import "./Dashboard.css";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { tasks, fetchTasks, updateTask, deleteTask, clearTasks } =
    useTaskStore();
  const [hydrated, setHydrated] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && user) {
      const token = localStorage.getItem("token");
      if (token) fetchTasks(token);
    } else if (hydrated && !user) {
      // ✅ Clear tasks when no user
      clearTasks();
    }
  }, [hydrated, user, fetchTasks, clearTasks]);

  if (!hydrated) return null;

  // ✅ Don't render anything if user is not logged in
  if (!user) {
    return (
      <div className="dashboard-container">
        <h1>Please log in to view your dashboard.</h1>
      </div>
    );
  }

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setEditDescription(task.description || "");
  };

  const handleSave = async (taskId: number) => {
    await updateTask(taskId, { description: editDescription });
    setEditingId(null);
    setEditDescription("");
  };

  const token = localStorage.getItem("token");

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.name}</h1>

      {/* ➕ Add Task button */}
      <Link href="/tasks/new" className="add-task-btn">
        ➕ Add Task
      </Link>

      <ul className="task-list">
        {tasks.length === 0 && <p>No tasks yet.</p>}
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-content">
              <h3>{task.title}</h3>
              {editingId === task.id ? (
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              ) : (
                <p>{task.description}</p>
              )}
            </div>
            <div className="task-actions">
              {editingId === task.id ? (
                <button onClick={() => handleSave(task.id)}>Save</button>
              ) : (
                <button onClick={() => handleEdit(task)}>Edit</button>
              )}
              <button onClick={() => token && deleteTask(task.id, token)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
