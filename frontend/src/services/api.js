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
    // Login request ला जुना access token attach करू नका
    if (config.url === "/accounts/login/") {
      return config;
    }

    const accessToken = localStorage.getItem("access");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// =========================================================
// RESPONSE INTERCEPTOR
// Handle API errors
// =========================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response) {
      console.error(
        "API Error:",
        error.response.status,
        error.response.data
      );
    } else {
      console.error(
        "Network Error:",
        error.message
      );
    }

    return Promise.reject(error);
  }
);

export default api;