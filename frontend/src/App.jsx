import React, { useState, useEffect, createContext } from "react";
import Navigation from "./components/Navigation";
import Toast from "./components/Toast";

// Pages
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import OnBoarding from "./pages/OnBoarding";
import Mentor from "./pages/Mentor";
import Intern from "./pages/Intern";
import ProjectsPage from "./pages/ProjectsPages";
import EventsPage from "./pages/EventsPage";
import PipelineSkillsPage from "./pages/PipelineSkillsPage";
import VideosPage from "./pages/VideosPage";
import UsersPage from "./pages/UserPage";
import ResetPassword from "./pages/ResetPassword";

// Contexts
const AuthContext = createContext();
const ThemeContext = createContext();

// 🔧 Set up API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [theme, setTheme] = useState("light");
  const [data, setData] = useState(initialData);
  const [toast, setToast] = useState(null);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  const updateData = (type, newData) => setData((prev) => ({ ...prev, [type]: newData }));
  const showToast = (message, type) => setToast({ message, type });
  const handleLogout = () => {
    setUser(null);
    setCurrentPage("home");
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/events`)
      .then((res) => res.json())
      .then((events) => {
        setData((prev) => ({ ...prev, events }));
      })
      .catch((err) => console.error("Fetch events failed", err));
  }, []);

  if (!user) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className={theme}>
          {window.location.pathname.startsWith("/reset-password") ? (
            <ResetPassword />
          ) : (
            <LoginPage onLogin={setUser} apiBaseUrl={API_BASE_URL} />
          )}
        </div>
      </ThemeContext.Provider>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage user={user} data={data} updateData={updateData} showToast={showToast} />;
      case "onboarding":
        return <OnBoarding user={user} data={data} updateData={updateData} showToast={showToast} />;
      case "mentors":
        return <Mentor user={user} data={data} updateData={updateData} showToast={showToast} />;
      case "interns":
        return <Intern user={user} data={data} updateData={updateData} showToast={showToast} />;
      case "projects":
        return <ProjectsPage user={user} data={data} updateData={updateData} showToast={showToast} />;
      case "events":
        return <EventsPage user={user} data={data} updateData={updateData} showToast={showToast} />;
      case "skills":
        return <PipelineSkillsPage user={user} data={data} updateData={updateData} showToast={showToast} />;
      case "videos":
        return <VideosPage user={user} data={data} updateData={updateData} showToast={showToast} />;
      case "users":
        return <UsersPage user={user} data={data} updateData={updateData} showToast={showToast} />;
      default:
        return <HomePage user={user} data={data} updateData={updateData} showToast={showToast} />;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className={theme}>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Navigation
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              user={user}
              onLogout={handleLogout}
            />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {renderPage()}
            </main>
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
          </div>
        </div>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}
