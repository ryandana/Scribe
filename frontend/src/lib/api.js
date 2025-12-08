import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Include cookies in requests
  headers: {
    // "Content-Type": "application/json", // Let axios set this automatically
  },
});

// Handle errors consistently
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customErr = new Error(
      error?.response?.data?.message || error?.message || "Request failed"
    );
    customErr.status = error?.response?.status;
    customErr.data = error?.response?.data;
    throw customErr;
  }
);

export async function post(path, body) {
  return axiosInstance.post(path, body);
}

export async function get(path) {
  return axiosInstance.get(path);
}

export async function put(path, body) {
  return axiosInstance.put(path, body);
}

const api = { post, get, put };

export default api;
