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
            icon: <FaTasks className="text-white" />,
            color: "blue",
            description: "All assigned tasks",
            gradient: "from-blue-500 to-blue-600"
        },
        {
            title: "Pending",
            value: stats.pending_tasks,
            icon: <FaClock className="text-white" />,
            color: "amber",
            description: "Awaiting action",
            gradient: "from-amber-500 to-amber-600"
        },
        {
            title: "In Progress",
            value: stats.in_progress_tasks,
            icon: <FaUserCheck className="text-white" />,
            color: "purple",
            description: "Currently being worked on",
            gradient: "from-purple-500 to-purple-600"
        },
        {
            title: "Completed",
            value: stats.completed_tasks,
            icon: <FaCheckCircle className="text-white" />,
            color: "emerald",
            description: "Successfully finished",
            gradient: "from-emerald-500 to-emerald-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {statItems.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                    description={stat.description}
                    gradient={stat.gradient}
                />
            ))}

            {/* Overdue tasks - spans full width when present for emphasis */}
            {stats.overdue_tasks > 0 && (
                <div className="md:col-span-2 xl:col-span-4">
                    <StatCard
                        title="Overdue Tasks"
                        value={stats.overdue_tasks}
                        icon={<FaExclamationTriangle className="text-white" />}
                        color="red"
                        description="Tasks past their due date requiring immediate attention"
                        gradient="from-red-500 to-red-600"
                        urgent={true}
                    />
                </div>
            )}
        </div>
    );
};

export default StatsGrid;