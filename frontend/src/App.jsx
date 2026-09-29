import { API_BASE_URL as configuredApiBaseUrl } from './utils/api';
import React, { useState, useEffect, createContext, lazy, Suspense } from "react";
import ErrorBoundary from './components/ErrorBoundary';
import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell";
import Toast from "./components/Toast";

// Pages
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import OnBoarding from "./pages/OnBoarding";
import Mentor from "./pages/Mentor";
import Intern from "./pages/Intern";
const ProjectsPage = lazy(() => import('./pages/ProjectsPages'));
import EventsPage from "./pages/EventsPage";
import PipelineSkillsPage from "./pages/PipelineSkillsPage";
import VideosPage from "./pages/VideosPage";
import UsersPage from "./pages/UserPage";
import ResetPassword from "./pages/ResetPassword";

// Contexts
export const AuthContext = createContext();
export const ThemeContext = createContext();

// Set up API base URL from environment
const API_BASE_URL = configuredApiBaseUrl;

export default function App() {
  // Restore a logged-in session on refresh: LoginPage already persists
  // token/user to localStorage, but nothing previously read it back.
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [data, setData] = useState({
    users: [],
    videos: [],
    onboardingEssentials: [],
    mentors: [],
    interns: [],
    projects: [],
    events: [],
    pipelineSkills: [],
  });
  const [toast, setToast] = useState(null);

  const toggleTheme = () =>
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      return next;
    });
  const updateData = (type, newData) => setData((prev) => ({ ...prev, [type]: newData }));
  const showToast = (message, type) => setToast({ message, type });

  const handleLogin = (loggedInUser) => setUser(loggedInUser);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/events`)
      .then(async (res) => {
        const events = await res.json();
        if (!res.ok || !Array.isArray(events)) throw new Error(events?.message || "Unable to load events");
        return events;
      })
      .then((events) => {
        setData((prev) => ({ ...prev, events }));
      })
      .catch((err) => console.error("Fetch events failed", err));
  }, []);

  const pageProps = { user, data, updateData, showToast };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className={theme}>
          <ErrorBoundary>
          <Suspense fallback={<div role="status" className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">Loading workspace…</div>}>
          <Routes>
            <Route
              path="/reset-password/:token"
              element={<ResetPassword apiBaseUrl={API_BASE_URL} />}
            />
            {!user ? (
              <Route
                path="*"
                element={<LoginPage onLogin={handleLogin} apiBaseUrl={API_BASE_URL} showToast={showToast} />}
              />
            ) : (
              <Route
                element={
                  <AppShell user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
                }
              >
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<HomePage {...pageProps} />} />
                <Route path="/onboarding" element={<OnBoarding {...pageProps} />} />
                <Route path="/mentors" element={<Mentor {...pageProps} />} />
                <Route path="/interns" element={<Intern {...pageProps} />} />
                <Route path="/projects" element={<ProjectsPage {...pageProps} />} />
                <Route path="/events" element={<EventsPage {...pageProps} />} />
                <Route path="/skills" element={<PipelineSkillsPage {...pageProps} />} />
                <Route path="/videos" element={<VideosPage {...pageProps} />} />
                <Route path="/users" element={<UsersPage {...pageProps} />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            )}
          </Routes>
          </Suspense>
          </ErrorBoundary>
          {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}
