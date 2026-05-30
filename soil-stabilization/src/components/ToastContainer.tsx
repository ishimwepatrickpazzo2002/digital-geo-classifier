import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  };

  const borderColors = {
    success: 'border-l-green-500',
    error: 'border-l-red-500',
    info: 'border-l-blue-500',
    warning: 'border-l-amber-500',
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast-enter pointer-events-auto flex items-center gap-3 bg-white dark:bg-navy-800 border border-gray-100 dark:border-navy-700 border-l-4 ${borderColors[toast.type]} rounded-xl shadow-lg px-4 py-3 min-w-[280px] max-w-sm`}
        >
          {icons[toast.type]}
          <p className="flex-1 text-sm font-medium text-gray-800 dark:text-white">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
