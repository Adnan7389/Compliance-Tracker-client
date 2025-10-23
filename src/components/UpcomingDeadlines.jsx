import React from 'react';
import { FaCalendarAlt, FaPlus, FaExclamationTriangle } from 'react-icons/fa';
import DeadlineItem from './DeadlineItem';

const UpcomingDeadlines = ({ tasks, className = '' }) => {
    // Count urgent deadlines (within 3 days)
    const urgentCount = tasks.filter(task => {
        const daysUntil = Math.ceil((new Date(task.due_date) - new Date()) / (1000 * 60 * 60 * 24));
        return daysUntil <= 3 && daysUntil >= 0;
    }).length;

    return (
        <div className={`bg-white rounded-2xl shadow-soft border border-gray-100 p-6 ${className}`}>
            {/* Enhanced header with urgency indicator */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-xl">
                        <FaCalendarAlt className="text-red-600 text-lg" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Upcoming Deadlines
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Tasks requiring immediate attention
                        </p>
                    </div>
                </div>

                {/* Action buttons and urgency badge */}
                <div className="flex items-center gap-3">
                    {urgentCount > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
                            <FaExclamationTriangle className="text-red-500 text-sm" />
                            <span className="text-sm font-medium text-red-700">
                                {urgentCount} urgent
                            </span>
                        </div>
                    )}

                </div>
            </div>

            {/* Enhanced tasks list with priority indicators */}
            <div className="space-y-3">
                {tasks.slice(0, 6).map((task, index) => (
                    <DeadlineItem
                        key={task.task_id}
                        task={task}
                        isLast={index === Math.min(5, tasks.length - 1)}
                    />
                ))}

                {tasks.length === 0 && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaCalendarAlt className="text-gray-400 text-xl" />
                        </div>
                        <h4 className="text-gray-900 font-medium mb-2">No upcoming deadlines</h4>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto mb-4">
                            All tasks are up to date or no deadlines are scheduled
                        </p>
                    </div>
                )}
            </div>

            {/* Enhanced footer with quick actions */}
            {tasks.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-gray-700">
                                {Math.min(6, tasks.length)} of {tasks.length}
                            </span> deadlines
                        </div>
                        {tasks.length > 6 && (
                            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
                                View all deadlines →
                            </button>
                        )}
                    </div>

                    {/* Quick filter options */}
                    {tasks.length > 3 && (
                        <div className="flex items-center gap-2 mt-3">
                            <span className="text-xs text-gray-500 font-medium">Filter:</span>
                            <button className="text-xs px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors duration-200">
                                This week
                            </button>
                            <button className="text-xs px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors duration-200">
                                Urgent
                            </button>
                            <button className="text-xs px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors duration-200">
                                All
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UpcomingDeadlines;