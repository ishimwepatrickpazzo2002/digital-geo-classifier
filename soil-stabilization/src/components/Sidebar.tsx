import { LayoutDashboard, Layers, Leaf, FileText, Info, LogOut, FlaskConical, X, History } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'classification', label: 'Soil Classification', icon: Layers },
  { id: 'treatment', label: 'Treatment Suggestions', icon: Leaf },
  { id: 'reports', label: 'Visualization & Reports', icon: FileText },
  { id: 'history', label: 'Analysis History', icon: History },
  { id: 'about', label: 'About System', icon: Info },
] as const;

export default function Sidebar() {
  const { signOut, profile } = useAuth();
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen } = useApp();

  const initial = profile?.fullName?.charAt(0).toUpperCase() ?? 'U';

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-40 flex flex-col bg-white dark:bg-navy-900 border-r border-gray-100 dark:border-navy-800
        w-64 shadow-xl transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:shadow-none lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gradient-navy rounded-xl flex items-center justify-center shadow-glow-navy">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-navy-800 dark:text-white text-sm leading-none">Geo Classifier</p>
              <p className="text-gray-400 text-xs mt-0.5">USCS System</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Accuracy badge */}
        <div className="mx-4 mt-4 bg-navy-50 dark:bg-navy-800 rounded-xl px-4 py-3 flex items-center gap-3 border border-navy-100 dark:border-navy-700">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
          <div>
            <p className="text-xs font-semibold text-navy-700 dark:text-navy-200">System Active</p>
            <p className="text-xs text-gray-500 dark:text-navy-400">Accuracy: 96%</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3">Navigation</p>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setCurrentPage(id); setSidebarOpen(false); }}
              className={`sidebar-item w-full text-left ${currentPage === id ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{label}</span>
              {currentPage === id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-gray-100 dark:border-navy-800 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 gradient-steel rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{profile?.fullName ?? 'User'}</p>
              <p className="text-xs text-gray-400 truncate">{profile?.email ?? ''}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
