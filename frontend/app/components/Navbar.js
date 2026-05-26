'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import authStore from '../store/authStore';

export default function Navbar() {
  const { user, logout, checkAuth } = authStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px 20px',
        background: '#fff',
        borderBottom: '1px solid #eee',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ fontWeight: 'bold' }}>GalleryApp</div>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Link href="/gallery">Home</Link>

        {user ? (
          <>
            <Link href="/upload">Upload</Link>
            <span style={{ color: '#555' }}>👤 {user.username}</span>
            <button
              onClick={logout}
              style={{
                padding: '6px 10px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                background: '#ff4d4f',
                color: '#fff',
              }}
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}