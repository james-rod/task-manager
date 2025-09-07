import { create } from "zustand";

type User = {
  id: number;
  name: string;
  email: string;
  token: string;
};

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Load user from localStorage if it exists
  const storedUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;

  return {
    user: storedUser ? JSON.parse(storedUser) : null,

    setUser: (user) => {
      localStorage.setItem("user", JSON.stringify(user));
      set({ user });
    },

    logout: () => {
      localStorage.removeItem("user");
      set({ user: null });
    },
  };
});
