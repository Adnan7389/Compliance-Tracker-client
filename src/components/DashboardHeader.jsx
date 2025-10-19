import React from 'react';
import { FaChartBar } from 'react-icons/fa';

const DashboardHeader = ({ isOwner }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    {isOwner ? 'Business Overview' : 'My Dashboard'}
                </h1>
                <p className="text-gray-600 mt-2">
                    {isOwner
                        ? 'Track your business compliance performance'
                        : 'Monitor your assigned tasks and progress'
                    }
                </p>
            </div>
            <div className="mt-4 sm:mt-0">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FaChartBar className="text-primary-500" />
                    <span>Last updated: Just now</span>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;