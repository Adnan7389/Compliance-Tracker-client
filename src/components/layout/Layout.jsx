import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 text-2xl font-bold">Compliance Tracker</div>
        <nav className="mt-8">
          <a href="/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">Dashboard</a>
          <a href="/staff" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">Staff</a>
          <a href="/tasks" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">Tasks</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;