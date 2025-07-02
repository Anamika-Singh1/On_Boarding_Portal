import React from 'react';

const Navigation = ({ currentPage, onPageChange, user, onLogout }) => {
  const navItems = [
    { label: 'Home', key: 'home' },
    { label: 'Onboarding', key: 'onboarding' },
    { label: 'Mentors', key: 'mentors' },
    { label: 'Interns', key: 'interns' }, // ✅ Added Interns here
    { label: 'Projects', key: 'projects' },
    { label: 'Events', key: 'events' },
    { label: 'Skills', key: 'skills' },
    { label: 'KT Videos', key: 'videos' },
    { label: 'Users', key: 'users' },
  ];

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="space-x-4">
        {navItems.map(({ label, key }) => (
          <button
            key={key}
            onClick={() => onPageChange(key)}
            className={`hover:underline ${currentPage === key ? 'font-bold' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div>
        <span className="mr-4">{user?.name}</span>
        <button onClick={onLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
      </div>
    </nav>
  );
};

export default Navigation;

