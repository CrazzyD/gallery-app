'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import authStore from '../store/authStore';
import Link from 'next/link';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = authStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Fill all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });

      const { user, token } = res.data;

      setUser(user);
      setToken(token);

      router.push('/gallery');

    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔐 Login</h1>

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="you@example.com"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>

          <div style={styles.passwordBox}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p style={styles.text}>
          No account? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}