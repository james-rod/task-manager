import React, { useState } from "react";
import { Task, useTaskStore } from "../store/useTaskStore";
import { useAuthStore } from "../store/useAuthStore"; // import auth store

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { updateTask, deleteTask } = useTaskStore();
  const { user } = useAuthStore(); // get logged-in user
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleToggleComplete = async () => {
    await updateTask(task.id, { completed: !task.completed });
  };

  const handleSaveEdit = async () => {
    if (!title.trim()) return;
    await updateTask(task.id, { title, description });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await deleteTask(task.id, token);
    } else {
      console.error("❌ No token found, cannot delete task");
    }
  };

  return (
    <div className="border p-3 rounded-md shadow-sm flex flex-col space-y-2">
      {isEditing ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-1 rounded"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-1 rounded"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSaveEdit}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h3
            className={`text-lg font-semibold ${
              task.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {task.title}
          </h3>
          <p className="text-gray-600">{task.description}</p>

          {user && ( // Only render buttons if user is logged in
            <div className="flex justify-between mt-2">
              <button
                onClick={handleToggleComplete}
                className={`px-3 py-1 rounded ${
                  task.completed ? "bg-yellow-500" : "bg-green-500"
                } text-white`}
              >
                {task.completed ? "Undo" : "Complete"}
              </button>
              <div className="space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
