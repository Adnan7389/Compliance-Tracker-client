import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useApiError } from '../../hooks/useApiError';
import { tasksAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { FaCheckCircle, FaCalendarCheck, FaInfoCircle } from 'react-icons/fa';

const StaffEditTaskModal = ({ isOpen, onClose, onTaskUpdated, task }) => {
  const [formData, setFormData] = useState({
    status: '',
    completed_at: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const { errors, globalError, handleError, clearErrors } = useApiError();
  const { showSuccess } = useToast();

  useEffect(() => {
    if (isOpen && task) {
      setFormData({
        status: task.status || '',
        completed_at: task.completed_at ? new Date(task.completed_at).toISOString().split('T')[0] : '',
      });
    }
  }, [isOpen, task]);

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
      title="Update Task Progress"
      size="md"
      icon={<FaCheckCircle className="text-primary-600" />}
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

        {/* Task Information */}
        {task && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 text-sm mb-1">{task.title}</h4>
                <p className="text-blue-700 text-sm">
                  Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Not set'}
                </p>
                <p className="text-blue-600 text-xs mt-1">
                  Current status: <span className={`font-medium ${getStatusColor(task.status).split(' ')[0]}`}>
                    {task.status?.replace('_', ' ')}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Status Selection */}
          <Input
            label="Update Status"
            name="status"
            as="select"
            required
            value={formData.status}
            onChange={handleInputChange}
            error={errors.status}
            icon={<FaCheckCircle className="text-gray-400" />}
            helpText="Select the current progress of this task"
          >
            <option value="pending">Pending - Not yet started</option>
            <option value="in_progress">In Progress - Currently working on</option>
            <option value="completed">Completed - Task is finished</option>
          </Input>

          {/* Completion Date - Only show when status is completed */}
          {formData.status === 'completed' && (
            <Input
              label="Completion Date"
              name="completed_at"
              type="date"
              value={formData.completed_at}
              onChange={handleInputChange}
              error={errors.completed_at}
              icon={<FaCalendarCheck className="text-gray-400" />}
              helpText="Date when the task was actually completed"
              max={new Date().toISOString().split('T')[0]}
            />
          )}
        </div>

        {/* Help Text */}
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-amber-800 text-sm">
            <strong>Note:</strong> As a staff member, you can only update the status and completion date of tasks assigned to you.
          </p>
        </div>

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
            {isUpdating ? 'Updating...' : 'Update Status'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StaffEditTaskModal;