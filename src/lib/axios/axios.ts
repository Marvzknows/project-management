import axios from "axios";

// Create axios instance with base configuration
export const axiosInstance = axios.create({
  baseURL: process.env.BETTER_AUTH_URL || "/api",
  //   timeout: 10000, 10 secss
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // For BetterAuth cookies
});

// Request interceptor - adds auth token if available
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // BetterAuth typically uses cookies, but if you need to add a token:
//     // const token = getToken(); // your token retrieval logic
//     // if (token) {
//     //   config.headers.Authorization = `Bearer ${token}`;
//     // }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login or refresh token
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);
