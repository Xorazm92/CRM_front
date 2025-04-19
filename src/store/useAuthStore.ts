
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  full_name: string; 
  username: string;
  role: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      setError: (error) => set({ error }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        error: null
      }),
    }),
    {
      name: "auth-storage",
    }
  )
);
