import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const THEME_KEY = 'REACT_APP_THEME';

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'dark';
  });

  const isDark = theme === 'dark';

  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    const meta = document.getElementById('themeColorMeta');
    if (meta) {
      meta.content = t === 'dark' ? '#0a0a0f' : '#f0f2f8';
    }
  };

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === THEME_KEY && e.newValue) {
        setThemeState(e.newValue);
        applyTheme(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (t) => {
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
