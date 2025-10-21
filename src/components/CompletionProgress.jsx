import React from 'react';
import { FaChartPie, FaTarget, FaCheckDouble } from 'react-icons/fa';
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
        {
            name: 'Completed',
            value: stats.completed_tasks,
            color: '#10b981',
            bgColor: 'bg-emerald-500',
            textColor: 'text-emerald-700'
        },
        {
            name: 'In Progress',
            value: stats.in_progress_tasks,
            color: '#8b5cf6',
            bgColor: 'bg-purple-500',
            textColor: 'text-purple-700'
        },
        {
            name: 'Pending',
            value: stats.pending_tasks,
            color: '#f59e0b',
            bgColor: 'bg-amber-500',
            textColor: 'text-amber-700'
        },
    ].filter(item => item.value > 0);

    const totalTasks = stats.total_tasks || 1;
    const completionRate = Math.round((stats.completed_tasks / totalTasks) * 100);
    const inProgressRate = Math.round((stats.in_progress_tasks / totalTasks) * 100);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const percentage = Math.round((data.value / totalTasks) * 100);
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-900">{data.name}</p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">{data.value}</span> tasks
                        <span className="ml-2 text-primary-600">({percentage}%)</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }) => (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
            {payload.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{entry.value}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className={`bg-white rounded-2xl shadow-soft border border-gray-100 p-6 ${className}`}>
            {/* Enhanced header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 rounded-xl">
                        <FaChartPie className="text-primary-600 text-lg" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Progress Overview
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Task completion distribution
                        </p>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Pie Chart */}
                <div className="flex-1 h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={completionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                                startAngle={90}
                                endAngle={450}
                            >
                                {completionData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        strokeWidth={2}
                                        stroke="#fff"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={<CustomLegend />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Stats Summary */}
                <div className="flex-shrink-0 w-full lg:w-48">
                    {/* Completion Rate Circle */}
                    <div className="text-center mb-6">
                        <div className="relative inline-flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                                <span className="text-2xl font-bold text-gray-900">
                                    {completionRate}%
                                </span>
                            </div>
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-pulse"></div>
                        </div>
                        <p className="text-sm font-medium text-gray-700 mt-2">Completion Rate</p>
                    </div>

                    {/* Progress Breakdown */}
                    <div className="space-y-3">
                        {completionData.map((item, index) => {
                            const percentage = Math.round((item.value / totalTasks) * 100);
                            return (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${item.bgColor}`}></div>
                                        <span className="text-sm text-gray-600">{item.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {item.value}
                                        </span>
                                        <span className="text-xs text-gray-500 ml-1">
                                            ({percentage}%)
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Total Tasks</span>
                            <span className="font-semibold text-gray-900">{totalTasks}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                            <span className="text-gray-500">In Progress</span>
                            <span className="font-semibold text-purple-600">{inProgressRate}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Motivational message based on completion rate */}
            {completionRate >= 80 && (
                <div className="mt-6 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2 text-emerald-700">
                        <FaCheckDouble className="text-emerald-500" />
                        <span className="text-sm font-medium">Excellent progress! Keep it up!</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompletionProgress;