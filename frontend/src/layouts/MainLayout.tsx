import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Search Scores', path: '/search' },
    { name: 'Reports', path: '/top-group-a' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-blue-600 text-white h-16 flex items-center justify-center flex-shrink-0 shadow-sm relative z-10">
        <h1 className="text-2xl font-bold font-sans tracking-wide">G-Scores</h1>
      </header>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col z-0">
          <div className="pt-6 pb-2 px-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans">Menu</h2>
          </div>
          <nav className="flex-1 px-4 space-y-1 mt-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-black font-semibold'
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-50 overflow-auto z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
