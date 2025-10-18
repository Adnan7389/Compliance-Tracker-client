import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
    const { user, isOwner, isStaff, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const navItemClass = (path) =>
        `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive(path)
            ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`;

    const iconClass = (path) =>
        `mr-3 flex-shrink-0 h-6 w-6 ${isActive(path) ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
        }`;

    // Owner Navigation Items
    const ownerNavItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/tasks', label: 'Tasks', icon: '✅' },
        { path: '/staff', label: 'Staff Management', icon: '👥' },
    ];

    // Staff Navigation Items  
    const staffNavItems = [
        { path: '/dashboard', label: 'My Dashboard', icon: '📊' },
        { path: '/tasks', label: 'My Tasks', icon: '✅' },
    ];

    // Common Navigation Items (both roles)
    const commonNavItems = [
        { path: '/profile', label: 'Profile', icon: '👤' },
    ];

    const navItems = [
        ...(isOwner ? ownerNavItems : []),
        ...(isStaff ? staffNavItems : []),
        ...commonNavItems,
    ];

    return (
        <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
            {/* User Info */}
            <div className="flex items-center px-4 py-4 border-b border-gray-200">
                <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={navItemClass(item.path)}
                    >
                        <span className={iconClass(item.path)}>{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Logout */}
            <div className="px-4 py-4 border-t border-gray-200">
                <button
                    onClick={logout}
                    className="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                    <span className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500">
                        🚪
                    </span>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;