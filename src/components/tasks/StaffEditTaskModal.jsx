import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useApiError } from '../../hooks/useApiError';
import { tasksAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Task Status">
      <form onSubmit={handleUpdateTask} className="space-y-4">
        {globalError && (
          <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded">
            {globalError}
          </div>
        )}

        <Input
          label="Status"
          name="status"
          as="select"
          required
          value={formData.status}
          onChange={handleInputChange}
          error={errors.status}>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </Input>

        {formData.status === 'completed' && (
          <Input
            label="Completed At"
            name="completed_at"
            type="date"
            value={formData.completed_at}
            onChange={handleInputChange}
            error={errors.completed_at}
          />
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={isUpdating}>Update Task</Button>
        </div>
      </form>
    </Modal>
  );
};

export default StaffEditTaskModal;