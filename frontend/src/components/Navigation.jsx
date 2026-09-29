import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, LayoutDashboard, ListChecks, Users, GraduationCap, FolderKanban, CalendarDays, Layers, PlayCircle, UserCog, Sun, Moon, LogOut, Search, ArrowUpRight } from 'lucide-react';
import Modal from './Modal';

const groups = [
  { label: 'Workspace', items: [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Onboarding', to: '/onboarding', icon: ListChecks },
    { label: 'Projects', to: '/projects', icon: FolderKanban },
    { label: 'Events', to: '/events', icon: CalendarDays },
  ] },
  { label: 'People', items: [
    { label: 'Mentors', to: '/mentors', icon: Users },
    { label: 'Interns', to: '/interns', icon: GraduationCap },
    { label: 'Users', to: '/users', icon: UserCog },
  ] },
  { label: 'Learning', items: [
    { label: 'Skills', to: '/skills', icon: Layers },
    { label: 'Training videos', to: '/videos', icon: PlayCircle },
  ] },
];
const pages = groups.flatMap((group) => group.items);

export default function Navigation({ user, onLogout, theme, toggleTheme }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const current = pages.find((page) => page.to === pathname);
  const results = pages.filter((page) => page.label.toLowerCase().includes(query.trim().toLowerCase()));
  const initials = (user?.name || 'You').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  useEffect(() => {
    const shortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);
  const closeMenus = () => { setMenuOpen(false); setSearchOpen(false); setQuery(''); };
  const links = (
    <nav aria-label="Main navigation" className="space-y-6">
      {groups.map((group) => <div key={group.label}>
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{group.label}</p>
        <div className="space-y-1">{group.items.map((item) => <NavLink key={item.to} to={item.to} onClick={closeMenus} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}`}>
          {React.createElement(item.icon, { size: 18, 'aria-hidden': true })}{item.label}
        </NavLink>)}</div>
      </div>)}
    </nav>
  );
  return <>
    <a href="#main-content" className="sr-only fixed left-4 top-4 z-[60] rounded-lg bg-blue-600 p-3 text-white focus:not-sr-only">Skip to content</a>
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950 lg:flex">
      <NavLink to="/dashboard" className="flex h-20 shrink-0 items-center gap-3 px-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">op.</span>
        <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Onboarding<span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">AiEnsured workspace</span></span>
      </NavLink>
      <div className="scrollbar-hidden flex-1 overflow-y-auto px-4 py-5">{links}</div>
      <div className="m-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
        <GraduationCap size={22} className="text-blue-600 dark:text-blue-400" />
        <p className="mt-3 text-sm font-semibold dark:text-white">Make your next step count.</p>
        <NavLink to="/onboarding" className="mt-2 flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">Explore onboarding <ArrowUpRight size={14} /></NavLink>
      </div>
      <div className="flex items-center gap-3 border-t border-slate-100 p-5 dark:border-slate-800">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{initials}</span>
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold dark:text-white">{user?.name}</p><p className="text-xs capitalize text-slate-400">{user?.role}</p></div>
        <button onClick={onLogout} aria-label="Log out" title="Log out" className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><LogOut size={17} /></button>
      </div>
    </aside>
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-3 border-b border-slate-200/70 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:px-8 lg:ml-60">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={() => setMenuOpen(true)} aria-label="Open navigation" className="rounded-lg p-2 text-slate-500 lg:hidden"><Menu size={22} /></button>
        <p className="truncate text-sm"><span className="hidden text-slate-400 sm:inline">Workspace <span className="mx-3 text-slate-300">/</span></span><span className="font-medium text-slate-700 dark:text-slate-200">{current?.label || 'Overview'}</span></p>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button onClick={() => { setQuery(''); setSearchOpen(true); }} aria-label="Search pages" className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900"><Search size={17} /><span className="hidden sm:inline">Search workspace</span><kbd className="hidden rounded border border-slate-200 px-1.5 text-[10px] dark:border-slate-700 md:inline">Ctrl K</kbd></button>
        <button onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
        <span className="hidden h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 sm:flex">{initials}</span>
      </div>
    </header>
    <Modal isOpen={menuOpen} onClose={() => setMenuOpen(false)} title="Your workspace">
      {links}<button onClick={onLogout} className="mt-5 flex items-center gap-2 rounded-lg p-3 text-sm text-red-600"><LogOut size={16} /> Log out</button>
    </Modal>
    <Modal isOpen={searchOpen} onClose={() => setSearchOpen(false)} title="Go to a page" size="lg">
      <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700"><Search size={18} className="text-slate-400" /><input aria-label="Search workspace pages" placeholder="Try mentors, projects, or skills…" value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm dark:text-white" /></label>
      <div className="mt-3 space-y-1">{results.map((item) => <NavLink key={item.to} to={item.to} onClick={closeMenus} className="flex items-center gap-3 rounded-xl p-3 text-sm font-medium hover:bg-blue-50 dark:text-white dark:hover:bg-slate-800">{React.createElement(item.icon, { size: 18, className: 'text-blue-500' })}{item.label}<ArrowUpRight size={15} className="ml-auto text-slate-400" /></NavLink>)}
        {results.length === 0 && <p role="status" className="py-8 text-center text-sm text-slate-500">No pages found. Try another keyword.</p>}
      </div>
      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-slate-800">Ctrl / Cmd + K to search · Esc to close</p>
    </Modal>
  </>;
}
