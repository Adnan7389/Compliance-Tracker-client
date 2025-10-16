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
    helpText,
    ...props
}) => {
    return (
        <div>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-danger-500 ml-1">*</span>}
                </label>
            )}
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className="input disabled:bg-gray-100 disabled:cursor-not-allowed"
                {...props}
            />
            {helpText && (
                <p className="mt-1 text-sm text-gray-500">{helpText}</p>
            )}
        </div>
    );
};

export default Input;