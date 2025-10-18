import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Loader from './ui/Loader';

const ProtectedRoute = ({
    children,
    requireOwner = false,
    requireStaff = false
}) => {
    const { isAuthenticated, isOwner, isStaff, loading } = useAuth();
    const { showError } = useToast();
    const location = useLocation();

    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        // Redirect to login with return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based permissions
    if (requireOwner && !isOwner) {
        showError('Access denied. Owner privileges required.');
        return <Navigate to="/dashboard" replace />;
    }

    if (requireStaff && !isStaff) {
        showError('Access denied. Staff privileges required.');
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;