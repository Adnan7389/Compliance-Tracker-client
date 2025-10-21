import React from 'react';

const StatCard = ({
    title,
    value,
    icon,
    color,
    description,
    gradient,
    urgent = false,
    className = ''
}) => {
    // Enhanced color system with gradients and consistent theming
    const colorConfig = {
        blue: {
            bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
            iconBg: 'from-blue-500 to-blue-600',
            border: 'border-blue-100',
            text: 'text-blue-700'
        },
        emerald: {
            bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50',
            iconBg: 'from-emerald-500 to-emerald-600',
            border: 'border-emerald-100',
            text: 'text-emerald-700'
        },
        amber: {
            bg: 'bg-gradient-to-br from-amber-50 to-amber-100/50',
            iconBg: 'from-amber-500 to-amber-600',
            border: 'border-amber-100',
            text: 'text-amber-700'
        },
        purple: {
            bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50',
            iconBg: 'from-purple-500 to-purple-600',
            border: 'border-purple-100',
            text: 'text-purple-700'
        },
        red: {
            bg: 'bg-gradient-to-br from-red-50 to-red-100/50',
            iconBg: 'from-red-500 to-red-600',
            border: 'border-red-100',
            text: 'text-red-700'
        }
    };

    const config = colorConfig[color] || colorConfig.blue;

    return (
        <div className={`
            relative rounded-2xl border-2 p-6 transition-all duration-300 
            hover:shadow-lg hover:scale-[1.02] hover:border-opacity-50
            focus:outline-none focus:ring-4 focus:ring-primary-100
            ${config.bg} ${config.border} ${className}
            ${urgent ? 'animate-pulse border-red-200' : ''}
        `}>
            {/* Urgent indicator for overdue tasks */}
            {urgent && (
                <div className="absolute -top-2 -right-2">
                    <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        Urgent
                    </div>
                </div>
            )}

            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    {/* Title with improved typography */}
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        {title}
                    </p>

                    {/* Value with emphasis */}
                    <p className="text-4xl font-bold text-gray-900 mb-2 leading-none">
                        {value}
                    </p>

                    {/* Description with contextual color */}
                    {description && (
                        <p className={`text-xs font-medium ${config.text} mt-2`}>
                            {description}
                        </p>
                    )}
                </div>

                {/* Enhanced icon container with gradient */}
                <div className={`
                    flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br 
                    ${gradient || config.iconBg} 
                    flex items-center justify-center shadow-md
                `}>
                    <div className="text-xl text-white">
                        {icon}
                    </div>
                </div>
            </div>

            {/* Progress indicator for completion context */}
            {(title === "Completed" || title === "Total Tasks") && (
                <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>
                            {title === "Completed" ? `${Math.round((value / 100) * 100)}%` : 'All tasks'}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`
                                h-2 rounded-full transition-all duration-500 ease-out
                                ${config.iconBg.replace('from-', 'bg-').replace(' to-', ' ')}
                            `}
                            style={{
                                width: title === "Completed" ? `${Math.round((value / 100) * 100)}%` : '100%',
                                opacity: title === "Completed" ? 1 : 0.3
                            }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatCard;