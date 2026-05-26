import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const authStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  setAuth: (user, token) => {
    set({ user, token });

    if (token) {
      Cookies.set('token', token, { expires: 7 });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      Cookies.remove('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });

      get().setAuth(res.data.user, res.data.token);

      set({ isLoading: false });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.error || 'Registration failed',
        isLoading: false,
      });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      get().setAuth(res.data.user, res.data.token);

      set({ isLoading: false });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.error || 'Login failed',
        isLoading: false,
      });
      throw err;
    }
  },

  logout: () => {
    get().setAuth(null, null);
  },

  checkAuth: async () => {
    const token = Cookies.get('token');
    if (!token) return;

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const res = await axios.get(`${API_URL}/auth/me`);

      set({
        user: res.data,
        token,
      });
    } catch {
      get().logout();
    }
  },
}));

export default authStore;