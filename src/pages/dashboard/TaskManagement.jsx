import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { tasksAPI, staffAPI, isPermissionError } from '../../services/api';
import Loader from '../../components/ui/Loader';
import { useApiError } from '../../hooks/useApiError';
import { useToast } from '../../hooks/useToast';
import TaskTable from '../../components/tasks/TaskTable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import CreateTaskModal from '../../components/tasks/CreateTaskModal';
import ViewTaskModal from '../../components/tasks/ViewTaskModal';
import EditTaskModal from '../../components/tasks/EditTaskModal';
import StaffEditTaskModal from '../../components/tasks/StaffEditTaskModal';
import DeleteConfirmationModal from '../../components/ui/DeleteConfirmationModal';
import { FaTasks, FaPlus, FaFilter, FaSearch, FaSync } from 'react-icons/fa';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    overdue: false,
    assigned_to: '',
  });
  const { handleError, globalError } = useApiError();
  const { showSuccess, showError } = useToast();
  const { user, isStaff } = useAuth();

  useEffect(() => {
    const loadInitialData = async () => {
      if (isStaff) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const staffResponse = await staffAPI.getAll();
        setStaff(staffResponse.data.staff);
      } catch (error) {
        if (!isPermissionError(error)) {
          handleError(error);
        } else {
          console.warn('Permission denied to fetch staff list.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadInitialData();
    }
  }, [handleError, isStaff, user]);

  const loadTasks = useCallback(async () => {
    try {
      const queryParams = { overdue: filters.overdue };
      if (filters.status) {
        queryParams.status = filters.status;
      }
      if (isStaff) {
        queryParams.assigned_to = user.id;
      } else if (filters.assigned_to) {
        queryParams.assigned_to = filters.assigned_to;
      }
      const response = await tasksAPI.getAll(queryParams);
      setTasks(response.data.tasks);
    } catch (error) {
      handleError(error);
    }
  }, [filters, handleError, isStaff, user]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleRefreshTasks = async () => {
    setIsRefreshing(true);
    await loadTasks();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTaskCreated = () => {
    loadTasks();
    showSuccess('Task created successfully!');
  };

  const handleTaskUpdated = () => {
    loadTasks();
    showSuccess('Task updated successfully!');
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      await tasksAPI.delete(taskToDelete.id);
      showSuccess('Task deleted successfully!');
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      handleError(error);
      showError('Failed to delete task.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task =>
    task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-50 rounded-2xl">
            <FaTasks className="text-primary-600 text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Task Management
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              {isStaff ? 'Manage your assigned tasks and track progress' : 'Manage all tasks and their statuses across your team'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleRefreshTasks}
            loading={isRefreshing}
            className="flex items-center gap-2"
          >
            <FaSync className={`text-sm ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {!isStaff && (
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2"
            >
              <FaPlus className="text-sm" />
              Create Task
            </Button>
          )}
        </div>
      </div>

      {/* Global Error Display */}
      {globalError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-red-800 font-medium">{globalError}</p>
          </div>
        </div>
      )}

      {/* Search and Filters Section */}
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6">
          {/* Search Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Tasks
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white shadow-sm"
              />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            <Input
              label="Status"
              name="status"
              as="select"
              value={filters.status}
              onChange={handleFilterChange}
              icon={<FaFilter className="text-gray-400" />}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </Input>

            {!isStaff && (
              <Input
                label="Assignee"
                name="assigned_to"
                as="select"
                value={filters.assigned_to}
                onChange={handleFilterChange}
                disabled={staff.length === 0}
                icon={<svg className="text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>}
              >
                <option value="">All Assignees</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Input>
            )}

            {/* Overdue Filter */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Filters
              </label>
              <label className="inline-flex items-center gap-3 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                <input
                  type="checkbox"
                  name="overdue"
                  checked={filters.overdue}
                  onChange={handleFilterChange}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                />
                <span className="text-sm text-gray-700 font-medium">Overdue only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          {filters.status && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
              Status: {filters.status.replace('_', ' ')}
            </span>
          )}
          {filters.assigned_to && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              Assignee: {staff.find(s => s.id === filters.assigned_to)?.name}
            </span>
          )}
          {filters.overdue && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
              Overdue Only
            </span>
          )}
          {(filters.status || filters.assigned_to || filters.overdue) && (
            <button
              onClick={() => setFilters({ status: '', overdue: false, assigned_to: '' })}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Task Table Section */}
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isStaff ? 'My Tasks' : 'All Tasks'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {filteredTasks.length} of {tasks.length} tasks
                {searchTerm && (
                  <span className="text-primary-600 font-medium">
                    {' '}matching "{searchTerm}"
                  </span>
                )}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Sorted by: <span className="font-medium text-gray-700">Due Date</span>
            </div>
          </div>
        </div>

        <TaskTable
          tasks={filteredTasks}
          onViewTask={handleViewTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          isStaff={isStaff}
        />
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />

      <ViewTaskModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        task={selectedTask}
      />

      {isStaff ? (
        <StaffEditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onTaskUpdated={handleTaskUpdated}
          task={selectedTask}
        />
      ) : (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onTaskUpdated={handleTaskUpdated}
          task={selectedTask}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteTask}
        itemType="task"
        itemName={taskToDelete?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default TaskManagement;