import React from 'react';
import { FaListAlt } from 'react-icons/fa';
import {
    BarChart,
    Bar,
    Cell,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';

const TaskDistributionChart = ({ data, className = '' }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FaListAlt className="mr-2 text-primary-500" />
                    Task Distribution by Category
                </h3>
            </div>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis
                            dataKey="category"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            fontSize={12}
                        />
                        <YAxis fontSize={12} />
                        <Tooltip
                            formatter={(value) => [`${value} tasks`, 'Count']}
                            contentStyle={{
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        <Bar
                            dataKey="count"
                            radius={[4, 4, 0, 0]}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={`hsl(${index * 45}, 70%, 50%)`}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TaskDistributionChart;