'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import authStore from './store/authStore';

export default function HomePage() {
  const { user, checkAuth, logout } = authStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  if (!mounted) return null;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        
        {/* TITLE */}
        <h1 style={styles.title}>Gallery</h1>
        <p style={styles.subtitle}>
          Share images, like posts, chat in real-time
        </p>

        {/* AUTH STATE */}
        {user ? (
          <>
            <p style={styles.welcome}>
              Welcome, <b>{user.username}</b>
            </p>

            <div style={styles.buttons}>
              <Link href="/gallery" style={styles.btnPrimary}>
                Go to Gallery
              </Link>

              <Link href="/upload" style={styles.btn}>
                Upload Image
              </Link>

              <button onClick={logout} style={styles.btnDanger}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={styles.welcome}>
              You are not logged in
            </p>

            <div style={styles.buttons}>
              <Link href="/login" style={styles.btnPrimary}>
                Login
              </Link>

              <Link href="/register" style={styles.btn}>
                Register
              </Link>

              <Link href="/gallery" style={styles.btn}>
                View Gallery
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
  },

  card: {
    width: '100%',
    maxWidth: 500,
    background: '#fff',
    borderRadius: 16,
    padding: 30,
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },

  title: {
    marginBottom: 10,
    fontSize: 32,
  },

  subtitle: {
    color: '#666',
    marginBottom: 20,
  },

  welcome: {
    marginBottom: 20,
    fontSize: 16,
  },

  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },

  btnPrimary: {
    padding: 12,
    background: '#4f46e5',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: 10,
    fontWeight: 'bold',
  },

  btn: {
    padding: 12,
    background: '#eee',
    color: '#000',
    textDecoration: 'none',
    borderRadius: 10,
  },

  btnDanger: {
    padding: 12,
    background: '#ff4d4f',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
  },
};