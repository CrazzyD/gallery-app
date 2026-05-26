'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import authStore from '../store/authStore';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = authStore();

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

      await login(email, password);

      router.push('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔐 Login</h1>

        {/* EMAIL */}
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="you@example.com"
          />
        </div>

        {/* PASSWORD */}
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

/* ========================= */

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
  },

  card: {
    width: 420,
    background: '#fff',
    padding: 30,
    borderRadius: 16,
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },

  title: {
    marginBottom: 20,
  },

  field: {
    textAlign: 'left',
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    display: 'block',
  },

  input: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    border: '1px solid #ddd',
    outline: 'none',
  },

  passwordBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },

  eyeBtn: {
    position: 'absolute',
    right: 10,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
    fontSize: 12,
  },

  button: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    border: 'none',
    background: '#4f46e5',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: 10,
  },

  error: {
    color: 'red',
    fontSize: 13,
    marginBottom: 10,
  },

  text: {
    marginTop: 12,
    fontSize: 14,
  },
};