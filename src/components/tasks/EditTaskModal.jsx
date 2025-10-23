import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useApiError } from '../../hooks/useApiError';
import { tasksAPI, staffAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { FaEdit, FaCalendarAlt, FaUser, FaTag, FaRedo, FaCheckCircle } from 'react-icons/fa';

const EditTaskModal = ({ isOpen, onClose, onTaskUpdated, task }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    due_date: '',
    recurrence: 'none',
    assigned_to: '',
    status: ''
  });
  const [staff, setStaff] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const { errors, globalError, handleError, clearErrors } = useApiError();
  const { showSuccess } = useToast();

  useEffect(() => {
    if (!isOpen) return;

    const fetchStaff = async () => {
      try {
        const response = await staffAPI.getAll();
        setStaff(response.data.staff);
      } catch (error) {
        handleError(error);
      }
    };

    fetchStaff();

    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || '',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
        recurrence: task.recurrence || 'none',
        assigned_to: task.assigned_to || '',
        status: task.status || ''
      });
    }
  }, [isOpen, task, handleError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      clearErrors();
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    clearErrors();
    setIsUpdating(true);

    try {
      const response = await tasksAPI.update(task.id, formData);
      showSuccess('Task updated successfully!');
      onTaskUpdated(response.data.task);
      onClose();
    } catch (error) {
      handleError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-amber-600 bg-amber-100 border-amber-200',
      in_progress: 'text-blue-600 bg-blue-100 border-blue-200',
      completed: 'text-emerald-600 bg-emerald-100 border-emerald-200'
    };
    return colors[status] || colors.pending;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Task"
      size="lg"
      icon={<FaEdit className="text-primary-600" />}
    >
      <form onSubmit={handleUpdateTask} className="space-y-6">
        {/* Global Error */}
        {globalError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-red-800 font-medium text-sm">{globalError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {/* Task Title */}
          <Input
            label="Task Title"
            name="title"
            required
            value={formData.title}
            onChange={handleInputChange}
            error={errors.title}
            placeholder="Enter task title"
            icon={<FaEdit className="text-gray-400" />}
          />

          {/* Description */}
          <Input
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleInputChange}
            error={errors.description}
            placeholder="Task description and instructions"
            rows={4}
          />

          {/* Category and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Category"
              name="category"
              as="select"
              value={formData.category}
              onChange={handleInputChange}
              error={errors.category}
              icon={<FaTag className="text-gray-400" />}
            >
              <option value="">Select Category</option>
              <option value="license">License & Permits</option>
              <option value="tax">Tax Compliance</option>
              <option value="safety">Safety & Regulations</option>
              <option value="other">Other</option>
            </Input>

            <Input
              label="Status"
              name="status"
              as="select"
              required
              value={formData.status}
              onChange={handleInputChange}
              error={errors.status}
              icon={<FaCheckCircle className="text-gray-400" />}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </Input>
          </div>

          {/* Due Date and Recurrence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Due Date"
              name="due_date"
              type="date"
              required
              value={formData.due_date}
              onChange={handleInputChange}
              error={errors.due_date}
              icon={<FaCalendarAlt className="text-gray-400" />}
            />

            <Input
              label="Recurrence"
              name="recurrence"
              as="select"
              value={formData.recurrence}
              onChange={handleInputChange}
              error={errors.recurrence}
              icon={<FaRedo className="text-gray-400" />}
            >
              <option value="none">No Recurrence</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </Input>
          </div>

          {/* Assignment */}
          <Input
            label="Assign To"
            name="assigned_to"
            as="select"
            required
            value={formData.assigned_to}
            onChange={handleInputChange}
            error={errors.assigned_to}
            icon={<FaUser className="text-gray-400" />}
            helpText="Reassign task to different staff member"
          >
            <option value="">Select Staff Member</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.role})
              </option>
            ))}
          </Input>
        </div>

        {/* Current Status Display */}
        {task && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Current Status</h4>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
                {task.status?.replace('_', ' ')}
              </span>
              <span className="text-sm text-gray-600">
                Assigned to: <strong>{staff.find(s => s.id === task.assigned_to)?.name || 'Unassigned'}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isUpdating}
            className="min-w-32"
          >
            {isUpdating ? 'Updating...' : 'Update Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;