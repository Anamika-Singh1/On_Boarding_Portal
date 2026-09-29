import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Circle } from 'lucide-react';

// Icons are included (not color alone) so status is legible without relying on color perception.
const VARIANTS = {
  success: {
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20',
    icon: CheckCircle2,
  },
  pending: {
    className: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-400/20',
    icon: Clock,
  },
  info: {
    className: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-400/20',
    icon: Circle,
  },
  warning: {
    className: 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-400/20',
    icon: AlertTriangle,
  },
  danger: {
    className: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-400/20',
    icon: XCircle,
  },
  neutral: {
    className: 'bg-slate-100 text-slate-600 ring-slate-500/10 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-500/20',
    icon: Circle,
  },
};

const Badge = ({ children, variant = 'neutral', withIcon = true, className = '' }) => {
  const config = VARIANTS[variant] || VARIANTS.neutral;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.className} ${className}`}
    >
      {withIcon && <Icon className="h-3 w-3" aria-hidden="true" />}
      {children}
    </span>
  );
};

export default Badge;
