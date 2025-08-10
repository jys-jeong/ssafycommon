// store/auth.ts
import { create } from "zustand";

type User = {
  id: number;
  email: string;
  name: string;
};

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isBootstrapping: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  bootstrap: () => void; // ✅ 추가
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isBootstrapping: true,

  setAuth: (user, token) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, accessToken: token });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    set({ user: null, accessToken: null });
  },

  bootstrap: () => {
    const token = localStorage.getItem("accessToken");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, accessToken: token, isBootstrapping: false });
        return;
      } catch (err) {
        console.error("유저 복원 실패:", err);
      }
    }
    set({ isBootstrapping: false });
  },
}));
