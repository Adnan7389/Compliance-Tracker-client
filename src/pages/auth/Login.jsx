import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useApiError } from '../../hooks/useApiError';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';
import { FaEnvelope, FaLock, FaRocket, FaUser } from 'react-icons/fa';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const { login, isAuthenticated } = useAuth();
    const { errors, globalError, handleError, clearErrors, clearFieldError } = useApiError();
    const { showSuccess } = useToast();
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
        clearErrors();

        try {
            await login(formData);
            showSuccess('Welcome back! Successfully logged in.');
        } catch (error) {
            handleError(error);
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex items-center justify-center p-4">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-100 flex">
            {/* Left Section - Branding and Benefits */}
            <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 lg:py-12 xl:px-24">
                <div className="max-w-md mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <FaRocket className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Compliance Tracker
                            </h1>
                            <p className="text-sm text-gray-600">Business Compliance Management</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                            Welcome Back to
                            <span className="block text-primary-600">Your Dashboard</span>
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed">
                            Continue managing your business compliance with our powerful tracking and monitoring tools.
                        </p>

                        {/* Security Features */}
                        <div className="space-y-4 mt-8">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FaLock className="text-primary-600 text-sm" />
                                </div>
                                <div>
                                    <p className="text-gray-800 font-medium">Enterprise-grade Security</p>
                                    <p className="text-sm text-gray-600">Your data is protected with bank-level encryption</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FaUser className="text-primary-600 text-sm" />
                                </div>
                                <div>
                                    <p className="text-gray-800 font-medium">Role-based Access</p>
                                    <p className="text-sm text-gray-600">Control what your team can see and do</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 lg:flex-none lg:max-w-2xl xl:max-w-3xl">
                <div className="mx-auto w-full max-w-md lg:max-w-lg">
                    {/* Mobile Branding */}
                    <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                            <FaRocket className="text-white text-lg" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Compliance Tracker</h1>
                            <p className="text-xs text-gray-600">Business Compliance Management</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 lg:p-10">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Welcome Back
                            </h2>
                            <p className="text-gray-600 mt-3">
                                Sign in to your account to continue
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Global error message */}
                            {globalError && (
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        </div>
                                        <p className="text-red-700 text-sm font-medium">{globalError}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-5">
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
                                    error={errors.email}
                                    icon={<FaEnvelope className="text-gray-400" />}
                                    placeholder="Enter your email address"
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
                                    error={errors.password}
                                    icon={<FaLock className="text-gray-400" />}
                                    placeholder="Enter your password"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    loading={isLoading}
                                    disabled={isLoading}
                                    className="w-full py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader className="w-4 h-4" />
                                            Signing in...
                                        </span>
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200"
                                >
                                    Create one here
                                </Link>
                            </p>
                        </div>

                        {/* Demo Accounts Section */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="text-center">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-3 bg-white text-sm text-gray-500 font-medium">
                                            Demo Accounts
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3 bg-gray-50 rounded-2xl p-4">
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Try out the platform:</p>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                                                <span className="font-medium">Owner Account:</span>
                                                <span>owner@example.com / password</span>
                                            </div>
                                            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                                                <span className="font-medium">Staff Account:</span>
                                                <span>staff@example.com / password</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;