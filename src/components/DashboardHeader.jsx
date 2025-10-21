import React from 'react';
import { FaChartBar, FaSync } from 'react-icons/fa';

const DashboardHeader = ({ isOwner }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
                {/* Main heading with gradient text for visual hierarchy */}
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {isOwner ? 'Business Overview' : 'My Dashboard'}
                </h1>
                {/* Descriptive subtitle with improved typography */}
                <p className="text-lg text-gray-600 mt-3 max-w-2xl leading-relaxed">
                    {isOwner
                        ? 'Monitor your business compliance performance and track key metrics in real-time'
                        : 'Stay on top of your assigned tasks, deadlines, and overall progress'
                    }
                </p>
            </div>

            {/* Last updated indicator with better visual treatment */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary-50 rounded-lg">
                        <FaSync className="text-primary-600 text-sm" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Last Updated
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                            Just now
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;