import React from 'react';
import {
    FaTasks,
    FaCheckCircle,
    FaUserCheck,
    FaListAlt,
    FaClock
} from 'react-icons/fa';

const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
        const activityType = activity.activity_type || activity.type;

        switch (activityType) {
            case 'task_created':
                return <FaTasks className="text-blue-500" />;
            case 'task_completed':
                return <FaCheckCircle className="text-green-500" />;
            case 'task_updated':
                return <FaUserCheck className="text-purple-500" />;
            case 'document_uploaded':
                return <FaListAlt className="text-orange-500" />;
            default:
                return <FaClock className="text-gray-500" />;
        }
    };

    const getActivityColor = (type) => {
        const activityType = activity.activity_type || activity.type;

        switch (activityType) {
            case 'task_created': return 'bg-blue-100 text-blue-800';
            case 'task_completed': return 'bg-green-100 text-green-800';
            case 'task_updated': return 'bg-purple-100 text-purple-800';
            case 'document_uploaded': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatActivityType = (type) => {
        const activityType = activity.activity_type || activity.type;
        return activityType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 mt-1">
                {getActivityIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActivityColor()}`}>
                        {formatActivityType()}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formatTime(activity.activity_timestamp || activity.timestamp)}
                    </span>
                </div>
                <p className="text-sm text-gray-700 truncate">
                    {activity.title || 'Activity completed'}
                </p>
                {activity.assigned_to_name && (
                    <p className="text-xs text-gray-500 mt-1">
                        Assigned to: {activity.assigned_to_name}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ActivityItem;