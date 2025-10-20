import React, { useState, useEffect } from 'react'; // Temporary comment to force re-evaluation
import { tasksAPI, staffAPI } from '../../services/api';
import Loader from '../../components/ui/Loader';
import { useApiError } from '../../hooks/useApiError';
import { useToast } from '../../hooks/useToast';
import TaskTable from '../../components/tasks/TaskTable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import CreateTaskModal from '../../components/tasks/CreateTaskModal';
import ViewTaskModal from '../../components/tasks/ViewTaskModal';
import EditTaskModal from '../../components/tasks/EditTaskModal';
import DeleteConfirmationModal from '../../components/ui/DeleteConfirmationModal';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    overdue: false,
    assigned_to: '',
  });
  const { handleError, globalError } = useApiError();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [staffResponse] = await Promise.all([
        staffAPI.getAll(),
      ]);
      setStaff(staffResponse.data.staff);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const queryParams = { overdue: filters.overdue };
      if (filters.status) {
        queryParams.status = filters.status;
      }
      if (filters.assigned_to) {
        queryParams.assigned_to = filters.assigned_to;
      }
      const response = await tasksAPI.getAll(queryParams);
      setTasks(response.data.tasks);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTaskCreated = () => {
    // 
    loadTasks();
  };

  const handleTaskUpdated = () => {
    // setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    loadTasks();
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

  if (isLoading) {
    return <Loader />;
  }

  if (globalError && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-danger-500">{globalError}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-1">Manage all tasks and their statuses.</p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          Create Task
        </Button>
      </div>
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            label="Status"
            name="status"
            as="select"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </Input>

          <Input
            label="Assignee"
            name="assigned_to"
            as="select"
            value={filters.assigned_to}
            onChange={handleFilterChange}
          >
            <option value="">All Assignees</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Input>

          <div className="flex items-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="overdue"
                checked={filters.overdue}
                onChange={handleFilterChange}
                className="rounded"
              />
              <span>Overdue only</span>
            </label>
          </div>
        </div>
      </div>
      <TaskTable tasks={tasks} onViewTask={handleViewTask} onEditTask={handleEditTask} onDeleteTask={handleDeleteTask} />
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
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onTaskUpdated={handleTaskUpdated}
        task={selectedTask}
      />
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