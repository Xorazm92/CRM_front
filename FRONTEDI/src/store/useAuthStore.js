import { create } from "zustand";
import Cookie from "js-cookie";

export const useAuthStore = create((set) => ({
  user: Cookie.get("user") ? (() => { let u = JSON.parse(Cookie.get("user")); if (u && u.role) u.role = u.role.toLowerCase(); return u; })() : null,
  token: Cookie.get("accessToken") || null,
  isLogged: !!Cookie.get("accessToken"),
  loading: false,
  setLoading: (loading) => set({ loading }),
  logIn: ({ user, token }) => {
    if (user && user.role) user.role = user.role.toLowerCase();
    Cookie.set("user", JSON.stringify(user), { expires: 1 / 24 });
    Cookie.set("accessToken", token, { expires: 1 / 24 });
    set({ user, token, isLogged: true, loading: false });
  },
  logOut: () => {
    Cookie.remove("user");
    Cookie.remove("accessToken");
    set({ user: null, token: null, isLogged: false, loading: false });
  },
  syncFromCookies: () => {
    let user = Cookie.get("user") ? JSON.parse(Cookie.get("user")) : null;
    if (user && user.role) user.role = user.role.toLowerCase();
    set({
      user,
      token: Cookie.get("accessToken") || null,
      isLogged: !!Cookie.get("accessToken"),
      loading: false,
    });
  },
}));
