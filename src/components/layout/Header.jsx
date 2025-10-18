import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onMenuClick }) => {
    const { user, isOwner, isStaff } = useAuth();

    const getPageTitle = () => {
        const path = window.location.pathname;

        if (path === '/dashboard') return isOwner ? 'Business Overview' : 'My Dashboard';
        if (path === '/tasks') return isOwner ? 'All Tasks' : 'My Tasks';
        if (path === '/staff') return 'Staff Management';
        if (path === '/profile') return 'Profile';

        return 'Compliance Tracker';
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center">
                    <button
                        type="button"
                        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onClick={onMenuClick}
                    >
                        <span className="sr-only">Open sidebar</span>
                        {/* Hamburger icon */}
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="ml-4 lg:ml-0">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {getPageTitle()}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {isOwner ? 'Business Owner' : 'Staff Member'} • {user?.businessName || 'Compliance Tracker'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Role badge */}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isOwner
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                        {isOwner ? 'Owner' : 'Staff'}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Header;