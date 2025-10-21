import React from 'react';
import { FaExclamationTriangle, FaCalendarDay, FaCheckCircle } from 'react-icons/fa';

const DeadlineItem = ({ task, isLast = false }) => {
    const getDaysUntilDue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysUntilDue = getDaysUntilDue(task.due_date);

    const getUrgencyConfig = (days) => {
        if (days < 0) return {
            color: 'text-red-700',
            bg: 'bg-red-100',
            border: 'border-red-200',
            icon: <FaExclamationTriangle className="text-red-500" />,
            label: 'Overdue',
            priority: 'high'
        };
        if (days <= 1) return {
            color: 'text-red-700',
            bg: 'bg-red-100',
            border: 'border-red-200',
            icon: <FaExclamationTriangle className="text-red-500" />,
            label: `${days} day`,
            priority: 'high'
        };
        if (days <= 3) return {
            color: 'text-orange-700',
            bg: 'bg-orange-100',
            border: 'border-orange-200',
            icon: <FaExclamationTriangle className="text-orange-500" />,
            label: `${days} days`,
            priority: 'medium'
        };
        if (days <= 7) return {
            color: 'text-amber-700',
            bg: 'bg-amber-100',
            border: 'border-amber-200',
            icon: <FaCalendarDay className="text-amber-500" />,
            label: `${days} days`,
            priority: 'low'
        };
        return {
            color: 'text-emerald-700',
            bg: 'bg-emerald-100',
            border: 'border-emerald-200',
            icon: <FaCheckCircle className="text-emerald-500" />,
            label: `${days} days`,
            priority: 'very-low'
        };
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const urgencyConfig = getUrgencyConfig(daysUntilDue);

    return (
        <div className={`
            group flex items-center gap-4 p-4 rounded-xl transition-all duration-200
            hover:shadow-md hover:scale-[1.02] cursor-pointer
            ${urgencyConfig.border} border
            ${urgencyConfig.priority === 'high' ? 'bg-red-50/50' : 'bg-white'}
            ${!isLast ? 'mb-2' : ''}
        `}>
            {/* Priority indicator bar */}
            <div className={`
                w-1 h-12 rounded-full transition-all duration-200
                ${urgencyConfig.priority === 'high' ? 'bg-red-500' :
                    urgencyConfig.priority === 'medium' ? 'bg-orange-500' :
                        urgencyConfig.priority === 'low' ? 'bg-amber-500' : 'bg-emerald-500'}
            `}></div>

            {/* Task content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary-700 transition-colors">
                            {task.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 font-medium">
                                Due: {formatDate(task.due_date)}
                            </span>
                            <span className="text-xs text-gray-400">
                                at {formatTime(task.due_date)}
                            </span>
                        </div>
                        {task.category && (
                            <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                                {task.category}
                            </span>
                        )}
                    </div>

                    {/* Urgency badge with icon */}
                    <div className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200
                        ${urgencyConfig.bg} ${urgencyConfig.border}
                        group-hover:shadow-sm
                    `}>
                        <div className="flex items-center gap-1.5">
                            {urgencyConfig.icon}
                            <span className={`text-sm font-semibold ${urgencyConfig.color}`}>
                                {urgencyConfig.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress indicator for task completion */}
                {task.progress !== undefined && (
                    <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className="h-1.5 rounded-full bg-primary-500 transition-all duration-500"
                                style={{ width: `${task.progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeadlineItem;