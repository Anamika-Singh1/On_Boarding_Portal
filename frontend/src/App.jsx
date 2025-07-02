import React, { useState, useEffect, createContext } from "react";
import Navigation from "./components/Navigation";
import Toast from "./components/Toast";

// Pages
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import OnBoarding from "./pages/OnBoarding";
import Mentor from "./pages/Mentor";
import Intern from "./pages/Intern"; // ✅ Added Intern Page
import ProjectsPage from "./pages/ProjectsPages";
import EventsPage from "./pages/EventsPage";
import PipelineSkillsPage from "./pages/PipelineSkillsPage";
import VideosPage from "./pages/VideosPage";
import UsersPage from "./pages/UserPage";
import ResetPassword from "./pages/ResetPassword";

// Contexts
const AuthContext = createContext();
const ThemeContext = createContext();

// Initial mock data
const initialData = {
  users: [
    { id: 1, name: 'Deepika Ma’am', email: 'deepika@aiensured.com', role: 'manager' },
    { id: 2, name: 'Chandan Intern', email: 'chandan@aiensured.com', role: 'intern' }
  ],
  videos: [
    { id: 1, title: 'Company Introduction', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: 2, title: 'Team Overview', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
  ],
  onboardingEssentials: [
    {
      id: 1,
      heading: 'Company Policies',
      subTopics: ['HR Guidelines', 'Code of Conduct', 'Security Protocols'],
      learningLink: 'https://example.com/policies'
    },
    {
      id: 2,
      heading: 'Technical Setup',
      subTopics: ['Development Environment', 'Tools Installation', 'Access Credentials'],
      learningLink: 'https://example.com/tech-setup'
    }
  ],
  mentors: [
    {
      id: 1,
      name: 'Anamika',
      field: 'AI/ML Engineering',
      project: 'Computer Vision Pipeline',
      skills: ['Python', 'TensorFlow', 'OpenCV'],
      internsAssigned: 3
    },
    {
      id: 2,
      name: 'Chandan',
      field: 'Data Science',
      project: 'Analytics',
      skills: ['Python', 'R', 'SQL'],
      internsAssigned: 2
    }
  ],
  projects: [
    {
      id: 1,
      name: 'AI Assistant Development',
      description: 'Building an intelligent chatbot for customer support',
      teamMembers: ['John Doe', 'Jane Smith', 'Mike Johnson']
    },
    {
      id: 2,
      name: 'Data Pipeline Optimization',
      description: 'Improving data processing efficiency by 40%',
      teamMembers: ['Sarah Wilson', 'Tom Brown']
    }
  ],
  events: [
    {
      id: 1,
      name: 'Welcome Orientation',
      description: 'Introduction session for new interns',
      status: 'upcoming',
      teamMembers: ['HR Team', 'Tech Leads'],
      date: '2025-06-15'
    },
    {
      id: 2,
      name: 'Q1 Review Meeting',
      description: 'Quarterly performance review and planning',
      status: 'past',
      teamMembers: ['All Teams'],
      date: '2025-03-30'
    }
  ],
  pipelineSkills: [
    {
      id: 1,
      pipelineName: 'Data Engineering Pipeline',
      requiredSkills: ['Python', 'Apache Airflow', 'Docker', 'AWS']
    },
    {
      id: 2,
      pipelineName: 'ML Model Deployment',
      requiredSkills: ['MLflow', 'Kubernetes', 'FastAPI', 'MongoDB']
    }
  ]
};

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
    fetch("/api/events")
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
            <LoginPage onLogin={setUser} />
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
      case "interns": // ✅ Added case for interns
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
