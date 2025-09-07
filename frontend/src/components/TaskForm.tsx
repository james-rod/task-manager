"use client";

import { useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import "./TaskForm.css";
import { toast } from "react-hot-toast";

export default function TaskForm() {
  const { addTask } = useTaskStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      toast.error("❌ Title is required");
      return;
    }

    const result = await addTask(title, description);

    if (result.success) {
      toast.success("✅ Task added successfully!");
      setTitle("");
      setDescription("");
    } else {
      toast.error(`❌ Failed to add task: ${result.message}`);
    }
  };

  return (
    <div className="task-form-container">
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Save Task</button>
      </form>
    </div>
  );
}
