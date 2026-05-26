'use client';

import { useEffect } from 'react';
import authStore from '@/app/store/authStore';

export default function AuthProvider({ children }) {
  useEffect(() => {
    authStore.getState().checkAuth();
  }, []);

  return children;
}