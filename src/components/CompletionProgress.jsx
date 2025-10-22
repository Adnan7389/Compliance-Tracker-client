import React, { useState, useEffect } from 'react';
import { FaChartPie, FaCheckDouble } from 'react-icons/fa';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from 'recharts';

const CompletionProgress = ({ stats, className = '' }) => {
    const [isClient, setIsClient] = useState(false);
    const [chartDimensions, setChartDimensions] = useState({ width: 280, height: 200 });

    useEffect(() => {
        setIsClient(true);
        updateChartDimensions();
        window.addEventListener('resize', updateChartDimensions);

        return () => window.removeEventListener('resize', updateChartDimensions);
    }, []);

    const updateChartDimensions = () => {
        // Responsive dimensions based on screen size
        const isLargeScreen = window.innerWidth >= 1024;
        const width = isLargeScreen ? 200 : 180;
        const height = isLargeScreen ? 200 : 180;
        setChartDimensions({ width, height });
    };

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

    // Custom legend that doesn't interfere with layout
    const CustomLegend = () => (
        <div className="flex flex-wrap justify-center gap-3 mt-4">
            {completionData.map((entry, index) => {
                const percentage = Math.round((entry.value / totalTasks) * 100);
                return (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-sm text-gray-600">{entry.name}</span>
                        <span className="text-xs text-gray-500">({percentage}%)</span>
                    </div>
                );
            })}
        </div>
    );

    if (!isClient) {
        return (
            <div className={`bg-white rounded-2xl shadow-soft border border-gray-100 p-6 ${className}`}>
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
                <div className="h-48 flex items-center justify-center">
                    <div className="text-gray-500">Loading chart...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-2xl shadow-soft border border-gray-100 p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 rounded-xl">
                        <FaChartPie className="text-primary-600 text-lg" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Progress Overview
                        </h3>
                        <p className="text-sm text-gray-500">
                            Task completion distribution
                        </p>
                    </div>
                </div>
            </div>

            {/* Main content - Simplified layout */}
            <div className="flex flex-col items-center">
                {/* Chart and completion rate in single centered container */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-4">
                    {/* Pie Chart Container */}
                    <div className="relative">
                        <PieChart
                            width={chartDimensions.width}
                            height={chartDimensions.height}
                        >
                            <Pie
                                data={completionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={chartDimensions.width * 0.3}
                                outerRadius={chartDimensions.width * 0.45}
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
                        </PieChart>

                        {/* Completion Rate Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                    {completionRate}%
                                </div>
                                <div className="text-xs text-gray-500 font-medium">
                                    Complete
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats breakdown - Only show on larger screens */}
                    <div className="hidden lg:block flex-shrink-0">
                        <div className="space-y-3 min-w-[140px]">
                            {completionData.map((item, index) => {
                                return (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: item.color }}
                                            ></div>
                                            <span className="text-sm text-gray-600 whitespace-nowrap">
                                                {item.name}
                                            </span>
                                        </div>
                                        <div className="text-right ml-2">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {item.value}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Legend for mobile and additional stats */}
                <div className="w-full">
                    {/* Mobile stats breakdown */}
                    <div className="lg:hidden mb-4">
                        <div className="grid grid-cols-2 gap-3">
                            {completionData.map((item, index) => {
                                const percentage = Math.round((item.value / totalTasks) * 100);
                                return (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2 h-2 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: item.color }}
                                            ></div>
                                            <span className="text-xs text-gray-600">
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-900">
                                            {item.value} ({percentage}%)
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Total tasks summary */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Total Tasks</div>
                        <div className="text-lg font-bold text-gray-900">{totalTasks}</div>
                    </div>
                </div>
            </div>

            {/* Motivational message */}
            {completionRate >= 80 && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
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