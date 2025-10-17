import { useState, useCallback } from 'react';
import {
    isNetworkError,
    isValidationError,
    isAuthError,
    isPermissionError
} from '../services/api';

export const useApiError = () => {
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');

    const handleError = useCallback((error, formContext = null) => {
        console.error('API Error:', error);

        // Clear previous errors
        setErrors({});
        setGlobalError('');

        if (isValidationError(error) && error.details) {
            // Handle field-specific validation errors
            const fieldErrors = {};

            if (Array.isArray(error.details)) {
                error.details.forEach(detail => {
                    if (detail.field && detail.message) {
                        fieldErrors[detail.field] = detail.message;
                    }
                });
            }

            setErrors(fieldErrors);

            // If we have a form context (like from react-hook-form), set errors there too
            if (formContext && formContext.setError) {
                Object.keys(fieldErrors).forEach(fieldName => {
                    formContext.setError(fieldName, {
                        type: 'server',
                        message: fieldErrors[fieldName]
                    });
                });
            }

        } else if (isNetworkError(error)) {
            setGlobalError('Network error. Please check your internet connection.');

        } else if (isAuthError(error)) {
            setGlobalError('Session expired. Please log in again.');
            // Auth errors are handled globally by interceptor

        } else if (isPermissionError(error)) {
            setGlobalError('You do not have permission to perform this action.');

        } else {
            setGlobalError(error.message || 'An unexpected error occurred');
        }

        // Return error for further handling if needed
        return error;
    }, []);

    const clearErrors = useCallback(() => {
        setErrors({});
        setGlobalError('');
    }, []);

    const clearFieldError = useCallback((fieldName) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    }, []);

    return {
        errors,
        globalError,
        handleError,
        clearErrors,
        clearFieldError,
        hasErrors: Object.keys(errors).length > 0 || !!globalError,
    };
};