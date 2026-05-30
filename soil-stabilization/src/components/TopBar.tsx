import { Menu, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  classification: 'Soil Classification',
  treatment: 'Treatment Suggestions',
  reports: 'Visualization & Reports',
  history: 'Analysis History',
  about: 'About the System',
};

export default function TopBar() {
  const { profile } = useAuth();
  const { currentPage, darkMode, toggleDarkMode, setSidebarOpen } = useApp();
  const initial = profile?.fullName?.charAt(0).toUpperCase() ?? 'U';

  return (
    <header className="h-16 bg-white dark:bg-navy-900 border-b border-gray-100 dark:border-navy-800 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-800 text-gray-500 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-bold text-gray-900 dark:text-white text-base">{PAGE_TITLES[currentPage] ?? 'Dashboard'}</h1>
          <p className="text-xs text-gray-400 hidden sm:block">Digital Geo Classifier · USCS Standard</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-navy-800 text-gray-500 dark:text-gray-400 transition-colors"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-navy-700">
          <div className="w-8 h-8 gradient-navy rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {initial}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 dark:text-white leading-none">{profile?.fullName?.split(' ')[0] ?? 'User'}</p>
            <p className="text-xs text-gray-400">Engineer</p>
          </div>
        </div>
      </div>
    </header>
  );
}
