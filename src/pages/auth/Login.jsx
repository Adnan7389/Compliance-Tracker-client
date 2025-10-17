import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApiError } from '../../hooks/useApiError'; // NEW
import { useToast } from '../../context/ToastContext'; // NEW
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const { login, isAuthenticated } = useAuth();
    const { errors, globalError, handleError, clearErrors, clearFieldError } = useApiError(); // NEW
    const { showSuccess } = useToast(); // NEW
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    // Clear errors when component mounts
    useEffect(() => {
        clearErrors();
    }, [clearErrors]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear field-specific error when user starts typing
        if (errors[name]) {
            clearFieldError(name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        clearErrors(); // Clear previous errors

        try {
            await login(formData);
            // Show success message
            showSuccess('Welcome back! Successfully logged in.');
            // Navigation will happen automatically due to the useEffect above
        } catch (error) {
            // Use the new error handling system
            handleError(error);

            // The error is now automatically handled:
            // - Validation errors → stored in `errors` state (field-specific)
            // - Auth errors → stored in `globalError` state  
            // - Network errors → stored in `globalError` state
            // - 401 errors → automatically redirects to login via interceptor

            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthenticated) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <Link
                        to="/register"
                        className="font-medium text-primary-600 hover:text-primary-500"
                    >
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Global error message */}
                        {globalError && (
                            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded">
                                {globalError}
                            </div>
                        )}

                        <Input
                            label="Email address"
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                            error={errors.email} // NEW - field-specific error
                        />

                        <Input
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            error={errors.password} // NEW - field-specific error
                        />

                        <div>
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                loading={isLoading}
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Demo Accounts
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-3">
                            <div className="text-center text-sm text-gray-600">
                                <p>Owner: owner@example.com / password</p>
                                <p>Staff: staff@example.com / password</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;