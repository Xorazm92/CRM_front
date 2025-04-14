import axios from "axios";

export const instance = axios.create({
  baseURL: "http://13.233.2.40:4000/api/v1",
  // withCredentials: true,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Barear ${
    JSON.parse(localStorage.getItem("auth") || "").state.token
  }`;
  return config;
});
