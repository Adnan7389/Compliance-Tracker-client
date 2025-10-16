import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <p className="mt-4 text-lg">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-8 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;