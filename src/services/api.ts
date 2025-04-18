import axios, { AxiosError } from 'axios';
import { message } from 'antd';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
});


api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    message.error(errorMessage);
    return Promise.reject(error);
  }
);

export default api;