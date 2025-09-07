import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/store/useAuthStore";

type DecodedToken = {
  exp: number;
};

export const checkTokenExpiration = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Get Zustand state outside React
  const { logout } = useAuthStore.getState();

  if (user?.token) {
    try {
      const decoded = jwtDecode<DecodedToken>(user.token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        logout(); // Log out if token expired
        console.warn("⛔ Token expired. User logged out.");
      }
    } catch (error: any) {
      console.error("⚠️ Invalid token:", error);
      logout();
    }
  }
};
