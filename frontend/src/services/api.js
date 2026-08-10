import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================================================
// REQUEST INTERCEPTOR
// Automatically attach JWT access token
// =========================================================

api.interceptors.request.use(
  (config) => {
    const accessToken =
      localStorage.getItem("access");

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =========================================================
// RESPONSE INTERCEPTOR
// Handle unauthorized requests
// =========================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn(
        "Unauthorized request. Access token may be expired."
      );
    }

    return Promise.reject(error);
  }
);

export default api;
