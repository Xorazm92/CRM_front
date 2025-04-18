
import axios from '../config/axios-instance';
import { AxiosError } from 'axios';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const handleApiError = (error: AxiosError) => {
  if (error.response) {
    throw new ApiError(
      error.response.status,
      error.response.data?.message || 'An error occurred'
    );
  }
  throw new Error('Network error');
};

export const api = {
  async get<T>(url: string) {
    try {
      const response = await axios.get<T>(url);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  },

  async post<T>(url: string, data: any) {
    try {
      const response = await axios.post<T>(url, data);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  },

  async put<T>(url: string, data: any) {
    try {
      const response = await axios.put<T>(url, data);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  },

  async delete<T>(url: string) {
    try {
      const response = await axios.delete<T>(url);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  }
};
