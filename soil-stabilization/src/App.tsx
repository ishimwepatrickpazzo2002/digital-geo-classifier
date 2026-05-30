import { useAuth } from './contexts/AuthContext';
import { useApp } from './contexts/AppContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ClassificationPage from './pages/ClassificationPage';
import TreatmentPage from './pages/TreatmentPage';
import ReportsPage from './pages/ReportsPage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ToastContainer from './components/ToastContainer';

function AppShell() {
  const { currentPage } = useApp();

  const pages: Record<string, React.ReactNode> = {
    dashboard: <DashboardPage />,
    classification: <ClassificationPage />,
    treatment: <TreatmentPage />,
    reports: <ReportsPage />,
    history: <HistoryPage />,
    about: <AboutPage />,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-navy-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {pages[currentPage] ?? <DashboardPage />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-navy-200 border-t-navy-600 rounded-full animate-spin mx-auto mb-4" style={{ borderWidth: '3px' }} />
          <p className="text-navy-700 font-semibold">Loading Digital Geo Classifier...</p>
          <p className="text-gray-400 text-sm mt-1">Initializing classification engine</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {user ? <AppShell /> : <AuthPage />}
      <ToastContainer />
    </>
  );
}
