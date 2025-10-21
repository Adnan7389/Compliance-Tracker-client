import React from 'react';
import {
    FaTasks,
    FaCheckCircle,
    FaUserCheck,
    FaListAlt,
    FaClock,
    FaUser,
    FaFileAlt
} from 'react-icons/fa';

const ActivityItem = ({ activity, isLast = false }) => {
    const getActivityConfig = () => {
        const activityType = activity.activity_type || activity.type;

        const configs = {
            'task_created': {
                icon: <FaTasks className="text-white" />,
                bg: 'bg-blue-500',
                badge: 'bg-blue-100 text-blue-800 border-blue-200',
                label: 'Task Created'
            },
            'task_completed': {
                icon: <FaCheckCircle className="text-white" />,
                bg: 'bg-emerald-500',
                badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                label: 'Task Completed'
            },
            'task_updated': {
                icon: <FaUserCheck className="text-white" />,
                bg: 'bg-purple-500',
                badge: 'bg-purple-100 text-purple-800 border-purple-200',
                label: 'Task Updated'
            },
            'task_assigned': {
                icon: <FaUser className="text-white" />,
                bg: 'bg-indigo-500',
                badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                label: 'Task Assigned'
            },
            'document_uploaded': {
                icon: <FaFileAlt className="text-white" />,
                bg: 'bg-amber-500',
                badge: 'bg-amber-100 text-amber-800 border-amber-200',
                label: 'Document Uploaded'
            },
            'default': {
                icon: <FaClock className="text-white" />,
                bg: 'bg-gray-500',
                badge: 'bg-gray-100 text-gray-800 border-gray-200',
                label: 'Activity'
            }
        };

        return configs[activityType] || configs.default;
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;

        // For older activities, show the date
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getPriorityLevel = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / 3600000);

        if (diffHours < 1) return 'high'; // Less than 1 hour
        if (diffHours < 24) return 'medium'; // Less than 1 day
        return 'low'; // Older than 1 day
    };

    const activityConfig = getActivityConfig();
    const priority = getPriorityLevel(activity.activity_timestamp || activity.timestamp);
    const displayTime = formatTime(activity.activity_timestamp || activity.timestamp);

    return (
        <div className={`
            group flex items-start gap-4 p-4 transition-all duration-200
            hover:bg-gray-50 hover:shadow-sm rounded-xl cursor-pointer
            border-b border-gray-100
            ${isLast ? 'border-b-0' : ''}
            ${priority === 'high' ? 'bg-blue-50/30' : ''}
        `}>
            {/* Activity Icon with colored background */}
            <div className={`
                flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                shadow-sm transition-all duration-200 group-hover:scale-110
                ${activityConfig.bg}
            `}>
                {activityConfig.icon}
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                    {/* Activity Title */}
                    <h4 className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-primary-700 transition-colors">
                        {activity.title || activity.description || 'Activity completed'}
                    </h4>

                    {/* Time with priority indicator */}
                    <div className={`
                        flex-shrink-0 px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200
                        ${priority === 'high' ? 'bg-blue-100 text-blue-700' :
                            priority === 'medium' ? 'bg-gray-100 text-gray-700' :
                                'bg-gray-50 text-gray-500'}
                    `}>
                        {displayTime}
                    </div>
                </div>

                {/* Activity Metadata */}
                <div className="flex items-center flex-wrap gap-2">
                    {/* Activity Type Badge */}
                    <span className={`
                        inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border
                        transition-all duration-200 group-hover:shadow-sm
                        ${activityConfig.badge}
                    `}>
                        {activityConfig.label}
                    </span>

                    {/* Assigned User */}
                    {activity.assigned_to_name && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg border border-gray-200">
                            <FaUser className="text-gray-500 text-xs" />
                            <span className="text-xs text-gray-700 font-medium">
                                {activity.assigned_to_name}
                            </span>
                        </div>
                    )}

                    {/* Task Category */}
                    {activity.category && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-white text-gray-600 border border-gray-200 rounded-lg">
                            {activity.category}
                        </span>
                    )}
                </div>

                {/* Additional Context */}
                {(activity.details || activity.comments) && (
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-2">
                        {activity.details || activity.comments}
                    </p>
                )}

                {/* Progress Indicator for Task Updates */}
                {activity.progress !== undefined && (
                    <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span className="font-medium">{activity.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className="h-1.5 rounded-full bg-primary-500 transition-all duration-500"
                                style={{ width: `${activity.progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Action Indicator */}
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            </div>
        </div>
    );
};

export default ActivityItem;