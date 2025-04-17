import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://your-backend-url.com/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Token interceptor
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { instance };