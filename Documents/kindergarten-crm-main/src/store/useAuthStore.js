import { create } from "zustand";
import Cookie from "js-cookie";

export const useAuthStore = create((set) => ({
  user: Cookie.get("user") ? JSON.parse(Cookie.get("user")) : null,
  token: Cookie.get("accessToken") || null,
  isLogged: !!Cookie.get("accessToken"),
  logIn: ({ user, token }) => {
    Cookie.set("user", JSON.stringify(user), { expires: 1 / 24 });
    Cookie.set("accessToken", token, { expires: 1 / 24 });
    set({ user, token, isLogged: true });
  },
  logOut: () => {
    Cookie.remove("user");
    Cookie.remove("accessToken");
    set({ user: null, token: null, isLogged: false });
  },
}));
