import React from 'react';
import { FaChartBar, FaFilter } from 'react-icons/fa';
import {
    BarChart,
    Bar,
    Cell,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';

const TaskDistributionChart = ({ data, className = '' }) => {
    // Predefined color palette for consistent theming
    const colorPalette = [
        'rgb(59, 130, 246)',  // blue-500
        'rgb(16, 185, 129)',  // emerald-500
        'rgb(245, 158, 11)',  // amber-500
        'rgb(139, 92, 246)',  // purple-500
        'rgb(14, 165, 233)',  // sky-500
        'rgb(99, 102, 241)',  // indigo-500
        'rgb(236, 72, 153)',  // pink-500
        'rgb(249, 115, 22)',  // orange-500
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-900 mb-1">{label}</p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium text-primary-600">
                            {payload[0].value}
                        </span> tasks
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`bg-white rounded-2xl shadow-soft border border-gray-100 p-6 ${className}`}>
            {/* Enhanced header with actions and better typography */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 rounded-xl">
                        <FaChartBar className="text-primary-600 text-lg" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Task Distribution
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Tasks categorized by type and status
                        </p>
                    </div>
                </div>

                {/* Chart controls */}
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                        <FaFilter className="text-sm" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Enhanced chart container */}
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 20, bottom: 60 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f3f4f6"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="category"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            fontSize={12}
                            tick={{ fill: '#6b7280' }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis
                            fontSize={12}
                            tick={{ fill: '#6b7280' }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e7eb' }}
                            width={40}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="top"
                            height={36}
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => (
                                <span className="text-sm text-gray-600">{value}</span>
                            )}
                        />
                        <Bar
                            dataKey="count"
                            radius={[6, 6, 0, 0]}
                            name="Task Count"
                            barSize={32}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colorPalette[index % colorPalette.length]}
                                    className="transition-opacity duration-200 hover:opacity-80"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Chart summary footer */}
            {data && data.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                            Total categories: <span className="font-semibold text-gray-700">{data.length}</span>
                        </span>
                        <span className="text-gray-500">
                            Total tasks: <span className="font-semibold text-gray-700">
                                {data.reduce((sum, item) => sum + item.count, 0)}
                            </span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDistributionChart;