import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tasks`;

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  fetchTasks: (token: string) => Promise<void>;
  addTask: (
    title: string,
    description?: string
  ) => Promise<{ success: boolean; message?: string }>;
  updateTask: (id: number, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: number, token: string) => Promise<void>;
  clearTasks: () => void; // ✅ added here
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],

  fetchTasks: async (token: string) => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ tasks: res.data });
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
      toast.error("❌ Failed to fetch tasks");
    }
  },

  addTask: async (title: string, description?: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { success: false, message: "Invalid token" };
      }

      const res = await axios.post(
        API_URL,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set({ tasks: [...get().tasks, res.data] });
      return { success: true };
    } catch (err: any) {
      console.error("Error adding task:", err);
      return {
        success: false,
        message: err.response?.data?.error || err.message,
      };
    }
  },

  updateTask: async (id: number, data: Partial<Task>) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.put(`${API_URL}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({
        tasks: get().tasks.map((task) => (task.id === id ? res.data : task)),
      });
      toast.success("✅ Task updated successfully!");
    } catch (err: any) {
      console.error("Error updating task:", err);
      toast.error(
        `❌ Failed to update task: ${err.response?.data?.error || err.message}`
      );
    }
  },

  deleteTask: async (id: number, token: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ tasks: get().tasks.filter((task) => task.id !== id) });
      toast.success("✅ Task deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting task:", err);
      toast.error(
        `❌ Failed to delete task: ${err.response?.data?.error || err.message}`
      );
    }
  },

  clearTasks: () => set({ tasks: [] }), // ✅ clear all tasks (useful for logout)
}));
