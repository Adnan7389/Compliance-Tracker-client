import React, { useState, useCallback, useMemo } from 'react';
import { ToastContext } from './toast';

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random();
        const toast = { id, message, type, duration };

        setToasts(prev => [...prev, toast]);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, [removeToast]);

    const showSuccess = useCallback((message, duration) =>
        addToast(message, 'success', duration), [addToast]);

    const showError = useCallback((message, duration) =>
        addToast(message, 'error', duration), [addToast]);

    const showWarning = useCallback((message, duration) =>
        addToast(message, 'warning', duration), [addToast]);

    const showInfo = useCallback((message, duration) =>
        addToast(message, 'info', duration), [addToast]);

    const value = useMemo(() => ({
        toasts,
        addToast,
        removeToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    }), [toasts, addToast, removeToast, showSuccess, showError, showWarning, showInfo]);

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
};