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
    return <Loader />;
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const { stats, recent_activity, task_distribution, upcoming_deadlines } = dashboardData;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DashboardHeader isOwner={isOwner} />

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TaskDistributionChart
          data={task_distribution}
          className="lg:col-span-2"
        />
        <RecentActivity activities={recent_activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UpcomingDeadlines
          tasks={upcoming_deadlines}
          className="lg:col-span-2"
        />
        <CompletionProgress stats={stats} />
      </div>
    </div>
  );
};

export default Dashboard;