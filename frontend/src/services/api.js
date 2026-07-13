import axios from 'axios';

// Dynamically retrieve the API URL from Vite environment variables (fallback to Render URL)
export const API_URL = import.meta.env.VITE_API_URL || "https://saheli-smart-pcos-care-nmpx.onrender.com";
export const BASE_URL = `${API_URL}/api`;

// 1. Create a centralized Axios instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to automatically attach authorization header based on role/route
axiosInstance.interceptors.request.use(
  (config) => {
    const urlPath = config.url || '';
    let token = null;

    if (urlPath.includes('/admin')) {
      token = localStorage.getItem("adminToken");
      if (token) {
        config.headers['x-auth-token'] = token;
      }
    } else if (urlPath.includes('/doctor') || urlPath.includes('/doctors')) {
      token = localStorage.getItem("doctorToken");
    } else {
      token = localStorage.getItem("token") || localStorage.getItem("doctorToken") || localStorage.getItem("adminToken");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Export the existing apiCall utility using dynamic URLs
export const apiCall = async (endpoint, method = "GET", body = null) => {
  // Select active token based on endpoint name or fallback to first available
  let token = null;
  const headers = {
    "Content-Type": "application/json"
  };

  if (endpoint.includes('/admin')) {
    token = localStorage.getItem("adminToken");
    if (token) {
      headers['x-auth-token'] = token;
    }
  } else if (endpoint.includes('/doctor') || endpoint.includes('/doctors')) {
    token = localStorage.getItem("doctorToken");
  } else {
    token = localStorage.getItem("token") || localStorage.getItem("doctorToken") || localStorage.getItem("adminToken");
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};