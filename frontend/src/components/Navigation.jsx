import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // For hamburger icon

const Navigation = ({ currentPage, onPageChange, user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", key: "home" },
    { label: "Onboarding", key: "onboarding" },
    { label: "Mentors", key: "mentors" },
    { label: "Interns", key: "interns" },
    { label: "Projects", key: "projects" },
    { label: "Events", key: "events" },
    { label: "Skills", key: "skills" },
    { label: "KT Videos", key: "videos" },
    { label: "Users", key: "users" },
  ];

  const handleNavClick = (key) => {
    onPageChange(key);
    setMenuOpen(false); // Close mobile menu
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Brand */}
        <div className="text-lg font-semibold">Onboarding Portal</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {navItems.map(({ label, key }) => (
            <button
              key={key}
              onClick={() => handleNavClick(key)}
              className={`transition px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === key
                  ? "bg-white text-blue-600 font-bold"
                  : "hover:bg-blue-500"
              }`}
            >
              {label}
            </button>
          ))}
          <div className="ml-4 flex items-center space-x-3">
            <span className="text-sm">{user?.name}</span>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-3 space-y-2">
          {navItems.map(({ label, key }) => (
            <button
              key={key}
              onClick={() => handleNavClick(key)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                currentPage === key
                  ? "bg-white text-blue-700 font-semibold"
                  : "hover:bg-blue-500 text-white"
              }`}
            >
              {label}
            </button>
          ))}
          <div className="pt-3 border-t border-blue-500 mt-2 flex justify-between items-center">
            <span className="text-sm">{user?.name}</span>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;