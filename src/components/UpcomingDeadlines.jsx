import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import DeadlineItem from './DeadlineItem';

const UpcomingDeadlines = ({ tasks, className = '' }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                <FaCalendarAlt className="mr-2 text-primary-500" />
                Upcoming Deadlines
            </h3>
            <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                    <DeadlineItem key={task.task_id} task={task} />
                ))}
                {tasks.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No upcoming deadlines</p>
                )}
            </div>
        </div>
    );
};

export default UpcomingDeadlines;