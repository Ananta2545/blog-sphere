'use client';
import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
export function ThemeInitializer() {
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    useAppStore.setState({ theme: initialTheme });
    document.documentElement.classList.remove('dark', 'light');
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }
  }, []);
  return null;
}
