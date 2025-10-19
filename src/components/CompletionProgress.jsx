import React from 'react';
import { FaChartBar } from 'react-icons/fa';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';

const CompletionProgress = ({ stats, className = '' }) => {
    const completionData = [
        { name: 'Completed', value: stats.completed_tasks, color: '#10b981' },
        { name: 'In Progress', value: stats.in_progress_tasks, color: '#8b5cf6' },
        { name: 'Pending', value: stats.pending_tasks, color: '#f59e0b' },
    ];

    const completionRate = Math.round((stats.completed_tasks / stats.total_tasks) * 100) || 0;

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                <FaChartBar className="mr-2 text-primary-500" />
                Completion Progress
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={completionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {completionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => [`${value} tasks`, 'Count']}
                            contentStyle={{
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
                <p className="text-2xl font-bold text-gray-900">
                    {completionRate}%
                </p>
                <p className="text-sm text-gray-500">Overall Completion Rate</p>
            </div>
        </div>
    );
};

export default CompletionProgress;