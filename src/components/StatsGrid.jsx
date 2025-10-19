import React from 'react';
import StatCard from './StatCard';
import {
    FaTasks,
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaUserCheck
} from 'react-icons/fa';

const StatsGrid = ({ stats }) => {
    const statItems = [
        {
            title: "Total Tasks",
            value: stats.total_tasks,
            icon: <FaTasks className="text-blue-500" />,
            color: "blue",
            description: "All assigned tasks"
        },
        {
            title: "Pending",
            value: stats.pending_tasks,
            icon: <FaClock className="text-yellow-500" />,
            color: "yellow",
            description: "Awaiting action"
        },
        {
            title: "In Progress",
            value: stats.in_progress_tasks,
            icon: <FaUserCheck className="text-purple-500" />,
            color: "purple",
            description: "Currently being worked on"
        },
        {
            title: "Completed",
            value: stats.completed_tasks,
            icon: <FaCheckCircle className="text-green-500" />,
            color: "green",
            description: "Successfully finished"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                    description={stat.description}
                />
            ))}

            {stats.overdue_tasks > 0 && (
                <StatCard
                    title="Overdue"
                    value={stats.overdue_tasks}
                    icon={<FaExclamationTriangle className="text-red-500" />}
                    color="red"
                    description="Past due date"
                    className="md:col-span-2 lg:col-span-4"
                />
            )}
        </div>
    );
};

export default StatsGrid;