import React, { useState, useEffect } from 'react';
import { useApiError } from '../../hooks/useApiError';
import { useAuth } from '../../hooks/useAuth';
import { dashboardAPI } from '../../services/api';
import Loader from '../../components/ui/Loader';

// Dashboard Components
import DashboardHeader from '../../components/DashboardHeader';
import StatsGrid from '../../components/StatsGrid';
import TaskDistributionChart from '../../components/TaskDistributionChart';
import RecentActivity from '../../components/RecentActivity';
import UpcomingDeadlines from '../../components/UpcomingDeadlines';
import CompletionProgress from '../../components/CompletionProgress';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOwner } = useAuth();
  const { handleError } = useApiError();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await dashboardAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load dashboard</h3>
          <p className="text-gray-600 mb-4">We couldn't load your dashboard data at this time.</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { stats, recent_activity, task_distribution, upcoming_deadlines } = dashboardData;

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <DashboardHeader isOwner={isOwner} />

      {/* Key Metrics Grid */}
      <StatsGrid stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Charts and Deadlines */}
        <div className="xl:col-span-2 space-y-8">
          <TaskDistributionChart
            data={task_distribution}
            className="w-full"
          />
          <UpcomingDeadlines
            tasks={upcoming_deadlines}
            className="w-full"
          />
        </div>

        {/* Right Column - Activity and Progress */}
        <div className="space-y-8">
          <RecentActivity activities={recent_activity} />
          <CompletionProgress stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;