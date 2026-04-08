import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const useTodoStore = create((set, get) => ({
  todos: [],
  loading: false,
  error: null,

  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get('/todos');
      set({ todos: data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Could not fetch todos', 
        loading: false 
      });
    }
  },

  addTodo: async (title, priority = 'medium') => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.post('/todos', { title, priority });
      set((state) => ({ 
        todos: [data, ...state.todos], 
        loading: false 
      }));
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Could not add todo', 
        loading: false 
      });
      throw error;
    }
  },

  toggleTodo: async (id, isCompleted) => {
    try {
      const { data } = await axiosInstance.put(`/todos/${id}`, { isCompleted });
      set((state) => ({
        todos: state.todos.map((t) => (t._id === id ? data : t)),
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Could not update todo' });
    }
  },

  deleteTodo: async (id) => {
    try {
      await axiosInstance.delete(`/todos/${id}`);
      set((state) => ({
        todos: state.todos.filter((t) => t._id !== id),
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Could not delete todo' });
    }
  },

  updateTodoTitle: async (id, title) => {
    try {
      const { data } = await axiosInstance.put(`/todos/${id}`, { title });
      set((state) => ({
        todos: state.todos.map((t) => (t._id === id ? data : t)),
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Could not update title' });
    }
  }
}));

export default useTodoStore;
