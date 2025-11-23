'use client';
import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

/**
 * ThemeInitializer Component
 * Handles initial theme setup on mount only
 * This prevents flash of unstyled content (FOUC)
 */
export function ThemeInitializer() {
  const initialized = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (initialized.current) return;
    initialized.current = true;

    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Update store state
    useAppStore.setState({ theme: initialTheme });
    
    // Apply to DOM - remove any existing class first, then add if dark
    document.documentElement.classList.remove('dark', 'light');
    
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }
  }, []);

  return null;
}
