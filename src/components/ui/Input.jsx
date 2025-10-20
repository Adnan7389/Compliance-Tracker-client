import React from 'react';

const Input = ({
    label,
    id,
    name,
    type = 'text',
    value,
    onChange,
    required = false,
    disabled = false,
    error,
    helpText,
    as = 'input', // New prop to specify the element type
    children, // To capture <option> elements for select
    ...props
}) => {
    const commonProps = {
        id: id || name,
        name,
        value,
        onChange,
        required,
        disabled,
        className: `input disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''
            }`,
        ...props,
    };

    const renderElement = () => {
        switch (as) {
            case 'select':
                return (
                    <select {...commonProps}>
                        {children}
                    </select>
                );
            case 'textarea':
                return (
                    <textarea {...commonProps} />
                );
            case 'input':
            default:
                return (
                    <input type={type} {...commonProps} />
                );
        }
    };

    return (
        <div>
            {label && (
                <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-danger-500 ml-1">*</span>}
                </label>
            )}
            {renderElement()}
            {error && (
                <p className="mt-1 text-sm text-danger-600">{error}</p>
            )}
            {helpText && !error && (
                <p className="mt-1 text-sm text-gray-500">{helpText}</p>
            )}
        </div>
    );
};

export default Input;