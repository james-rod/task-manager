import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/store/useAuthStore";
import { useTaskStore } from "@/store/useTaskStore";

type DecodedToken = {
  exp: number;
};

export const checkTokenExpiration = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Get Zustand state outside React
  const { logout } = useAuthStore.getState();
  const { clearTasks } = useTaskStore.getState();

  if (user?.token) {
    try {
      const decoded = jwtDecode<DecodedToken>(user.token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        logout(); // Log out user
        clearTasks(); // Clear tasks from store
        console.warn("⛔ Token expired. User logged out and tasks cleared.");
      }
    } catch (error: unknown) {
      console.error("⚠️ Invalid token:", error);
      logout();
      clearTasks();
    }
  }
};
