import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
  const { isOwner, isStaff } = useAuth();

  return (
    <div>
      {isOwner && <OwnerDashboard />}
      {isStaff && <StaffDashboard />}
    </div>
  );
};

const OwnerDashboard = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Business Overview</h1>
    {/* Owner-specific dashboard content */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-2">Total Tasks</h3>
        <p className="text-3xl font-bold text-primary-600">45</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-2">Active Staff</h3>
        <p className="text-3xl font-bold text-primary-600">8</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-2">Completion Rate</h3>
        <p className="text-3xl font-bold text-primary-600">78%</p>
      </div>
    </div>
  </div>
);

const StaffDashboard = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
    {/* Staff-specific dashboard content */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-2">My Tasks</h3>
        <p className="text-3xl font-bold text-primary-600">12</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-2">Overdue</h3>
        <p className="text-3xl font-bold text-danger-600">2</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-2">Completion Rate</h3>
        <p className="text-3xl font-bold text-primary-600">85%</p>
      </div>
    </div>
  </div>
);

export default Dashboard;