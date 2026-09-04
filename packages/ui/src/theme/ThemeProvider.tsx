import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useUIStore, UITheme } from '@blockdevelop/core';

export type ResolvedTheme = 'dark' | 'light' | 'high-contrast';

export interface ThemeContextType {
  theme: UITheme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: UITheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: UITheme;
}

/**
 * Dynamic Theme Engine managing dark, light, high-contrast, and OS system themes.
 * Dynamically updates document.documentElement CSS classes and connects to useUIStore.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'dark',
}) => {
  const storeTheme = useUIStore((state) => state.theme);
  const setStoreTheme = useUIStore((state) => state.setTheme);

  const activeTheme: UITheme = storeTheme || defaultTheme;

  // Resolve system preference
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (activeTheme === 'system') {
      return getSystemTheme();
    }
    return activeTheme;
  }, [activeTheme]);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (targetTheme: ResolvedTheme) => {
      // Clear previous theme class names
      root.classList.remove('theme-dark', 'theme-light', 'theme-high-contrast', 'dark', 'light');

      // Add active theme classes
      root.classList.add(`theme-${targetTheme}`);

      if (targetTheme === 'dark' || targetTheme === 'high-contrast') {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }

      root.style.colorScheme = targetTheme === 'light' ? 'light' : 'dark';
    };

    if (activeTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };

      applyTheme(mediaQuery.matches ? 'dark' : 'light');

      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    applyTheme(activeTheme as ResolvedTheme);
    return undefined;
  }, [activeTheme]);

  const value = useMemo(
    () => ({
      theme: activeTheme,
      resolvedTheme,
      setTheme: setStoreTheme,
    }),
    [activeTheme, resolvedTheme, setStoreTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return context;
}
