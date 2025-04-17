import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DataT {
  token: string | null;
  setToken: (token: string | null) => void;
  logout(): unknown;
  user: UserT | null;
  setUser: (user: UserT) => void;
}
interface UserT {
  full_name?: string;
  username?: string;
  role?: string;
  user_id?: string;
}

export const useAuthStore = create<DataT>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: UserT) => set({ user }),
      token: null,
      setToken: (token: string | null) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-user", 
    }
  )
);
