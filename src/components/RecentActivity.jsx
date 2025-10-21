import React from 'react';
import { FaClock, FaHistory, FaEye } from 'react-icons/fa';
import ActivityItem from './ActivityItem';

const RecentActivity = ({ activities, className = '' }) => {
    return (
        <div className={`bg-white rounded-2xl shadow-soft border border-gray-100 p-6 ${className}`}>
            {/* Enhanced header with view all action */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-xl">
                        <FaClock className="text-amber-600 text-lg" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Recent Activity
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Latest updates and actions
                        </p>
                    </div>
                </div>

                {/* View all button */}
                {activities.length > 5 && (
                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors duration-200 font-medium">
                        <FaEye className="text-sm" />
                        View All
                    </button>
                )}
            </div>

            {/* Activity list with enhanced empty state */}
            <div className="space-y-4">
                {activities.slice(0, 5).map((activity, index) => (
                    <ActivityItem
                        key={index}
                        activity={activity}
                        isLast={index === Math.min(4, activities.length - 1)}
                    />
                ))}

                {activities.length === 0 && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaHistory className="text-gray-400 text-xl" />
                        </div>
                        <h4 className="text-gray-900 font-medium mb-2">No recent activity</h4>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto">
                            Activity will appear here as tasks are updated and completed
                        </p>
                    </div>
                )}
            </div>

            {/* Activity summary footer */}
            {activities.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                            Showing <span className="font-semibold text-gray-700">
                                {Math.min(5, activities.length)} of {activities.length}
                            </span> activities
                        </span>
                        <span className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
                            Load more
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecentActivity;