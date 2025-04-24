import axios from "axios";
import Cookie from "js-cookie";
import createAuthRefreshInterceptor from "axios-auth-refresh";

export const instance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  // withCredentials: true,
});

instance.interceptors.request.use((config) => {
  if (config.url !== "/auth/refresh") {
    const accessToken = Cookie.get("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }
  return config;
});

const refreshAuthLogic = async (failedRequest) => {
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
    console.error("Error refreshing access token:", err);
    window.location.href = "/login";
    return Promise.reject(err);
  }
};

createAuthRefreshInterceptor(instance, refreshAuthLogic, {
  statusCodes: [401],
});

export default instance;
