import React from 'react';

const Card = ({ children, className = '', padding = 'md', hover = false, ...props }) => {
  const paddingClass = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }[padding] ?? 'p-6';

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none
        ${hover ? 'transition-shadow duration-150 hover:shadow-md' : ''}
        ${paddingClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, description, actions, className = '' }) => (
  <div className={`flex flex-wrap items-start justify-between gap-3 ${className}`}>
    <div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export default Card;
