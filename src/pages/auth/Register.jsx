import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApiError } from '../../hooks/useApiError'; // NEW
import { useToast } from '../../context/ToastContext'; // NEW
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        businessName: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const { register, isAuthenticated } = useAuth();
    const { errors, globalError, handleError, clearErrors, clearFieldError } = useApiError(); // NEW
    const { showSuccess } = useToast(); // NEW
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
        setIsLoading(true);
        clearErrors(); // Clear previous errors

        try {
            await register(formData);
            // Show success message
            showSuccess('Account created successfully! Welcome to Compliance Tracker.');
            // Navigation will happen automatically due to the useEffect above
        } catch (error) {
            // Use the new error handling system
            handleError(error);

            // The error is now automatically handled:
            // - Validation errors → stored in `errors` state (field-specific)
            // - Conflict errors (email exists) → stored in `globalError` state  
            // - Network errors → stored in `globalError` state

            console.error('Registration error:', error);
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
                    Create your business account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <Link
                        to="/login"
                        className="font-medium text-primary-600 hover:text-primary-500"
                    >
                        sign in to existing account
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
                            label="Full Name"
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isLoading}
                            error={errors.name} // NEW - field-specific error
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
                            error={errors.email} // NEW - field-specific error
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
                            error={errors.password} // NEW - field-specific error
                            helpText={!errors.password ? "Must be at least 6 characters long" : ""} // Only show help text if no error
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
                            error={errors.businessName} // NEW - field-specific error
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
                                {isLoading ? 'Creating account...' : 'Create account'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;