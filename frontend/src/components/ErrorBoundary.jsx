import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Workspace rendering failed', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div role="alert" className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Let's get you back on track.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">This page couldn't be displayed. Reload the workspace to try again. Any unsaved changes may be lost.</p>
          <button onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Reload workspace</button>
        </div>
      </div>
    );
  }
}
