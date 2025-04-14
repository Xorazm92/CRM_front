import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DataT {
  user: UserT;
  token: string | null;
  setUser: (user: UserT) => void;
  setToken: (token: string) => void;
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
      user: {},
      token: null,
      setUser: (user: UserT) => set({ user: user }),
      setToken: (token: string) => set({ token }),
    }),
    {
      name: "auth",
    }
  )
);
