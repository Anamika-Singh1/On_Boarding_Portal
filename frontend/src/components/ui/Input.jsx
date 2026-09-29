import React, { useId } from 'react';

const baseFieldClass = (hasError) =>
  `w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400
   focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white
   dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-offset-slate-900
   transition-colors
   ${hasError
     ? 'border-red-400 focus:ring-red-500 dark:border-red-500'
     : 'border-slate-300 focus:ring-blue-500 dark:border-slate-700'}`;

const Input = React.forwardRef(function Input(
  { label, id, error, hint, required, className = '', containerClassName = '', ...props },
  ref
) {
  const autoId = useId();
  const fieldId = id || autoId;
  const errorId = error ? `${fieldId}-error` : undefined;
  const hintId = hint ? `${fieldId}-hint` : undefined;

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={fieldId}
        required={required}
        aria-invalid={!!error}
        aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
        className={`${baseFieldClass(!!error)} ${className}`}
        {...props}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

export default Input;
export { baseFieldClass };
