import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const AppShell = ({ user, onLogout, theme, toggleTheme }) => (
  <div className="min-h-screen bg-slate-50 transition-colors dark:bg-slate-950">
    <Navigation user={user} onLogout={onLogout} theme={theme} toggleTheme={toggleTheme} />
    <main id="main-content" tabIndex={-1} className="min-w-0 px-4 py-8 sm:px-8 lg:ml-60 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
      <Outlet />
      </div>
    </main>
  </div>
);

export default AppShell;
