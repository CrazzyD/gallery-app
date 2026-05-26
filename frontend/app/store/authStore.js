import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://gallery-app-4cmf.onrender.com/api';

const authStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  // =====================
  // SET AUTH (ядро системы)
  // =====================
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

  // =====================
  // REGISTER
  // =====================
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

  // =====================
  // LOGIN
  // =====================
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

  // =====================
  // LOGOUT
  // =====================
  logout: () => {
    get().setAuth(null, null);
    set({ user: null, token: null });
  },

  // =====================
  // CHECK AUTH
  // =====================
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
    } catch (err) {
      get().logout();
    }
  },
}));

export default authStore;