import { create } from 'zustand';
import axios from 'axios';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://gallery-app-4cmf.onrender.com/api';

// ✅ Безопасные хелперы — не падают на сервере
const cookieGet = (key) => {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
  return match ? match[2] : null;
};

const cookieSet = (key, value, days = 7) => {
  if (typeof window === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${key}=${value}; expires=${expires}; path=/`;
};

const cookieRemove = (key) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

const authStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  setAuth: (user, token) => {
    set({ user, token });
    if (token) {
      cookieSet('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      cookieRemove('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        username, email, password,
      });
      get().setAuth(res.data.user, res.data.token);
      set({ isLoading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.error || 'Registration failed', isLoading: false });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      get().setAuth(res.data.user, res.data.token);
      set({ isLoading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.error || 'Login failed', isLoading: false });
      throw err;
    }
  },

  logout: () => {
    get().setAuth(null, null);
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    const token = cookieGet('token'); // ✅ безопасно
    if (!token) return;
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get(`${API_URL}/auth/me`);
      set({ user: res.data, token });
    } catch {
      get().logout();
    }
  },
}));

export default authStore;