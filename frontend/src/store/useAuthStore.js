import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../api/axiosInstance';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      // Qeydiyyat
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post('/auth/register', userData);
          set({ loading: false });
          return response.data;
        } catch (error) {
          const message = error.response?.data?.message || 'An error occurred during registration';
          set({ loading: false, error: message });
          throw new Error(message);
        }
      },

      // Giriş
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post('/auth/login', credentials);
          const { token, ...user } = response.data;
          set({ user, token, loading: false });
          return response.data;
        } catch (error) {
          const message = error.response?.data?.message || 'An error occurred during login';
          set({ loading: false, error: message });
          throw new Error(message);
        }
      },

      // Google ilə giriş
      googleLogin: async (idToken) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post('/auth/google', { idToken });
          const { token, ...user } = response.data;
          set({ user, token, loading: false });
          return response.data;
        } catch (error) {
          const message = error.response?.data?.message || 'Google login failed';
          set({ loading: false, error: message });
          throw new Error(message);
        }
      },

      // Çıxış
      logout: () => {
        set({ user: null, token: null, error: null });
      },

      // Xətanı təmizləmək üçün
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // localStorage-da saxlanılacaq açar
    }
  )
);

export default useAuthStore;
