import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Loader from './ui/Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, isOwner, isStaff, loading } = useAuth();
    const { showError } = useToast();

    const userRole = isOwner ? 'owner' : isStaff ? 'staff' : null;

    // If allowedRoles is not provided, we assume any authenticated user is authorized.
    // Otherwise, we check if the user's role is included in the allowedRoles array.
    const isAuthorized = !allowedRoles || (userRole && allowedRoles.includes(userRole));

    useEffect(() => {
        if (!loading && isAuthenticated && !isAuthorized) {
            showError('Access denied. You do not have permission to view this page.');
            navigate('/dashboard', { replace: true });
        }
    }, [loading, isAuthenticated, isAuthorized, showError, navigate]);

    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return isAuthorized ? children : null; // Return null while redirecting
};

export default ProtectedRoute;