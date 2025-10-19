import React from 'react';

const DeadlineItem = ({ task }) => {
    const getDaysUntilDue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysUntilDue = getDaysUntilDue(task.due_date);

    const getUrgencyColor = (days) => {
        if (days < 0) return 'text-red-600 bg-red-100';
        if (days <= 1) return 'text-red-600 bg-red-100';
        if (days <= 3) return 'text-orange-600 bg-orange-100';
        if (days <= 7) return 'text-yellow-600 bg-yellow-100';
        return 'text-green-600 bg-green-100';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                    {task.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                    Due: {formatDate(task.due_date)}
                </p>
            </div>
            <div className="flex-shrink-0 ml-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(daysUntilDue)}`}>
                    {daysUntilDue < 0 ? 'Overdue' : `${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`}
                </span>
            </div>
        </div>
    );
};

export default DeadlineItem;