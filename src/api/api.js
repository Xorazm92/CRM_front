// Barcha API chaqiruvlari uchun asosiy fayl
// Backend bazaviy URL manzilini shu yerda o'zgartiring
export const BASE_URL = "http://localhost:3000/api/v1";

export async function apiRequest(endpoint, method = "GET", data = null, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }
  if (data) {
    options.body = JSON.stringify(data);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "API xatoligi");
  }
  return response.json();
}

// Misol uchun: 
// const token = localStorage.getItem('token');
// apiRequest('/users', 'GET', null, token);
