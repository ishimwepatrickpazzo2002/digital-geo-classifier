import React, { createContext, useContext, useState, useCallback } from 'react';

type Page = 'dashboard' | 'classification' | 'treatment' | 'reports' | 'about' | 'history';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  lastAnalysisId: string | null;
  setLastAnalysisId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastAnalysisId, setLastAnalysisId] = useState<string | null>(null);

  function toggleDarkMode() {
    setDarkMode(d => {
      const next = !d;
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return next;
    });
  }

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage,
      darkMode, toggleDarkMode,
      toasts, addToast, removeToast,
      sidebarOpen, setSidebarOpen,
      lastAnalysisId, setLastAnalysisId,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
