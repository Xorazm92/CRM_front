import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Cookie from "js-cookie";
import createAuthRefreshInterceptor from "axios-auth-refresh";

export const instance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3030/api/v1",
  // withCredentials: true,
});

instance.interceptors.request.use((config: AxiosRequestConfig) => {
  if (config.url !== "/auth/refresh") {
    const accessToken = Cookie.get("accessToken");
    if (accessToken) {
      if (!config.headers) config.headers = {};
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }
  return config;
});

const refreshAuthLogic = async (failedRequest: any): Promise<void> => {
  try {
    const response = await instance.post("/auth/refresh", {
      refreshToken: Cookie.get("refreshToken"),
    });
    const newAccessToken = response.data.accessToken;
    Cookie.set("accessToken", newAccessToken);
    failedRequest.response.config.headers[
      "Authorization"
    ] = `Bearer ${newAccessToken}`;
    return Promise.resolve();
  } catch (err) {
    Cookie.remove("accessToken");
    Cookie.remove("refreshToken");
    return Promise.reject(err);
  }
};

createAuthRefreshInterceptor(instance, refreshAuthLogic);

export default instance;
