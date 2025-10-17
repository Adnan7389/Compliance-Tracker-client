import React from 'react';
import { useToast } from '../../context/ToastContext';

const Toast = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    const getToastStyles = (type) => {
        const baseStyles = 'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto transition-all duration-300';

        switch (type) {
            case 'success':
                return `${baseStyles} bg-success-50 border border-success-200 text-success-800`;
            case 'error':
                return `${baseStyles} bg-danger-50 border border-danger-200 text-danger-800`;
            case 'warning':
                return `${baseStyles} bg-warning-50 border border-warning-200 text-warning-800`;
            case 'info':
                return `${baseStyles} bg-primary-50 border border-primary-200 text-primary-800`;
            default:
                return `${baseStyles} bg-gray-50 border border-gray-200 text-gray-800`;
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={getToastStyles(toast.type)}
                    role="alert"
                >
                    <div className="flex items-start p-4">
                        <div className="flex-1">
                            <p className="text-sm font-medium">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            ×
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Toast;