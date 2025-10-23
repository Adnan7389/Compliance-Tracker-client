import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">Compliance Tracker</div>
        <nav className="space-x-4">
          <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">How It Works</a>
          <a href="#testimonials" className="text-gray-600 hover:text-blue-600">Testimonials</a>
          <a href="/login" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Login</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;