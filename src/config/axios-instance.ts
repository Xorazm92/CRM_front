import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:5000/",
  // withCredentials: true,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Barear ${
    JSON.parse(localStorage.getItem("auth") || "").state.token
  }`;
  return config;
});
