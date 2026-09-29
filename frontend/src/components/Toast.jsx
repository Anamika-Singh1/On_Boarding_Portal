import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    className: 'bg-white border-emerald-200 text-emerald-800 dark:bg-slate-900 dark:border-emerald-500/30 dark:text-emerald-300',
    iconClassName: 'text-emerald-500',
  },
  error: {
    icon: XCircle,
    className: 'bg-white border-red-200 text-red-800 dark:bg-slate-900 dark:border-red-500/30 dark:text-red-300',
    iconClassName: 'text-red-500',
  },
  info: {
    icon: Info,
    className: 'bg-white border-blue-200 text-blue-800 dark:bg-slate-900 dark:border-blue-500/30 dark:text-blue-300',
    iconClassName: 'text-blue-500',
  },
};

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = VARIANTS[type] || VARIANTS.info;
  const Icon = config.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 right-5 z-[60] flex w-full max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-lg
        animate-[toast-in_0.2s_ease-out] ${config.className}`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${config.iconClassName}`} aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="shrink-0 rounded p-0.5 text-current opacity-60 hover:opacity-100"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

export default Toast;
