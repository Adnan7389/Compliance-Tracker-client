import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Toast from './components/ui/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import StaffManagement from './pages/dashboard/StaffManagement';
import TaskManagement from './pages/dashboard/TaskManagement';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes with Layout */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Navigate to="/dashboard" replace />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/tasks" element={
                <ProtectedRoute>
                  <Layout>
                    <TaskManagement />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/staff" element={
                <ProtectedRoute requireOwner={true}>
                  <Layout>
                    <StaffManagement />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            <Toast />
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;