import axios from "axios";

const axiosInstance = axios.create({
  // Vercel-də bu VITE_API_URL dəyişəni istifadə olunacaq, 
  // Lokalda isə default olaraq localhost:5000-ə baxacaq.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Hər sorğuda (request) token-i avtomatik əlavə etmək üçün interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem("auth-storage");
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error("Auth data parse error:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
