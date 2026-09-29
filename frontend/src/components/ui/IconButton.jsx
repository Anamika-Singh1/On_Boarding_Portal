import React from 'react';

const VARIANTS = {
  default: 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
  danger: 'text-red-500 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10',
  primary: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-500/10',
};

// Icon-only action button that always carries an accessible name via `label`,
// since icon buttons with no aria-label were a recurring a11y gap in the original app.
const IconButton = React.forwardRef(function IconButton(
  { icon: Icon, label, variant = 'default', className = '', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        ${VARIANTS[variant] || VARIANTS.default} ${className}`}
      {...props}
    >
      {React.createElement(Icon, { className: 'h-4 w-4', 'aria-hidden': true })}
    </button>
  );
});

export default IconButton;
