
import { instance } from "../config/axios-instance";
import { message } from "antd";

export const login = async (username: string, password: string) => {
  try {
    const { data } = await instance.post("/auth/login", { username, password });
    return data;
  } catch (error: any) {
    message.error(error?.response?.data?.message || "Xatolik yuz berdi");
    throw error;
  }
};

export const confirmPassword = async (password: string) => {
  try {
    const { data } = await instance.post("/auth/confirmPassword", { password });
    return data;
  } catch (error: any) {
    message.error(error?.response?.data?.message || "Xatolik yuz berdi");
    throw error;
  }
};
