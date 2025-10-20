import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useApiError } from '../../hooks/useApiError';
import { tasksAPI, staffAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';

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
    if (isOpen) {
      loadStaff();
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
    }
  }, [isOpen, task]);

  const loadStaff = async () => {
    try {
      const response = await staffAPI.getAll();
      setStaff(response.data.staff);
    } catch (error) {
      handleError(error);
    }
  };

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
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <form onSubmit={handleUpdateTask} className="space-y-4">
        {globalError && (
          <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded">
            {globalError}
          </div>
        )}

        <Input
          label="Title"
          name="title"
          required
          value={formData.title}
          onChange={handleInputChange}
          error={errors.title}
        />

        <Input
          label="Description"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          error={errors.description}
        />

        <Input
          label="Category"
          name="category"
          as="select"
          value={formData.category}
          onChange={handleInputChange}
          error={errors.category}
        >
          <option value="">Select Category</option>
          <option value="license">License</option>
          <option value="tax">Tax</option>
          <option value="safety">Safety</option>
          <option value="other">Other</option>
        </Input>

        <Input
          label="Due Date"
          name="due_date"
          type="date"
          required
          value={formData.due_date}
          onChange={handleInputChange}
          error={errors.due_date}
        />

        <Input
          label="Recurrence"
          name="recurrence"
          as="select"
          value={formData.recurrence}
          onChange={handleInputChange}
          error={errors.recurrence}
        >
          <option value="none">None</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </Input>

        <Input
          label="Assign To"
          name="assigned_to"
          as="select"
          required
          value={formData.assigned_to}
          onChange={handleInputChange}
          error={errors.assigned_to}
        >
          <option value="">Select Staff</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Input>

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

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={isUpdating}>Update Task</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;