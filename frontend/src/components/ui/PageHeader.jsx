import React from 'react';

const PageHeader = ({ title, description, actions }) => (
  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/70 pb-6 dark:border-slate-800">
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
