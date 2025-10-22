import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useApiError } from '../../hooks/useApiError';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaRocket } from 'react-icons/fa';

import { validateEmail, validatePassword, validateRequired } from '../../utils/validation';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        businessName: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const { register, isAuthenticated } = useAuth();
    const { errors, globalError, handleError, clearErrors, clearFieldError } = useApiError();
    const { showSuccess } = useToast();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

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
        clearErrors();

        const validationErrors = {};
        const nameError = validateRequired(formData.name, 'Name');
        if (nameError) validationErrors.name = nameError;

        const emailError = validateEmail(formData.email);
        if (emailError) validationErrors.email = emailError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) validationErrors.password = passwordError;

        const businessNameError = validateRequired(formData.businessName, 'Business Name');
        if (businessNameError) validationErrors.businessName = businessNameError;

        if (Object.keys(validationErrors).length > 0) {
            const errorDetails = Object.entries(validationErrors).map(([field, message]) => ({ field, message }));
            handleError({ type: 'VALIDATION_ERROR', details: errorDetails });
            return;
        }

        setIsLoading(true);

        try {
            await register(formData);
            showSuccess('Account created successfully! Welcome to Compliance Tracker.');
        } catch (error) {
            handleError(error);
            console.error('Registration error:', error);
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
            {/* Left Section - Branding and Illustration */}
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
                            Streamline Your Business
                            <span className="block text-primary-600">Compliance</span>
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed">
                            Join thousands of businesses managing their compliance requirements with ease and confidence.
                        </p>

                        {/* Features List */}
                        <div className="space-y-4 mt-8">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700">Automated deadline tracking</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700">Team collaboration tools</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700">Real-time progress monitoring</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Registration Form */}
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
                                Create Account
                            </h2>
                            <p className="text-gray-600 mt-3">
                                Join us today and streamline your compliance management
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

                            <div className="grid grid-cols-1 gap-6">
                                <Input
                                    label="Full Name"
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    error={errors.name}
                                    icon={<FaUser className="text-gray-400" />}
                                    placeholder="Enter your full name"
                                />

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
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    error={errors.password}
                                    icon={<FaLock className="text-gray-400" />}
                                    placeholder="Create a secure password"
                                    helpText={!errors.password ? "Must be at least 6 characters long" : ""}
                                />

                                <Input
                                    label="Business Name"
                                    id="businessName"
                                    name="businessName"
                                    type="text"
                                    autoComplete="organization"
                                    required
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    error={errors.businessName}
                                    icon={<FaBuilding className="text-gray-400" />}
                                    placeholder="Enter your business name"
                                />
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
                                            Creating account...
                                        </span>
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-4">
                                    Trusted by businesses worldwide
                                </p>
                                <div className="flex justify-center items-center gap-6 opacity-60">
                                    <div className="w-16 h-8 bg-gray-200 rounded-lg"></div>
                                    <div className="w-16 h-8 bg-gray-200 rounded-lg"></div>
                                    <div className="w-16 h-8 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;