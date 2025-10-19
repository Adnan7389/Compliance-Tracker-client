import React from 'react';
import { FaClock } from 'react-icons/fa';
import ActivityItem from './ActivityItem';

const RecentActivity = ({ activities, className = '' }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                <FaClock className="mr-2 text-primary-500" />
                Recent Activity
            </h3>
            <div className="space-y-4">
                {activities.slice(0, 5).map((activity, index) => (
                    <ActivityItem key={index} activity={activity} />
                ))}
                {activities.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;