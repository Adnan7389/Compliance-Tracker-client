import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useApiError } from '../../hooks/useApiError';
import { tasksAPI, staffAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { validateTask } from '../../utils/validation';

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    due_date: '',
    recurrence: 'none',
    assigned_to: '',
  });
  const [staff, setStaff] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const { errors: apiErrors, globalError, handleError, clearErrors: clearApiErrors } = useApiError();
  const [formErrors, setFormErrors] = useState({});
  const { showSuccess } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadStaff();
    }
  }, [isOpen]);

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
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (apiErrors[name]) {
      clearApiErrors();
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    clearApiErrors();
    setFormErrors({});

    const validationErrors = validateTask(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setIsCreating(true);
    try {
      const response = await tasksAPI.create(formData);
      showSuccess('Task created successfully!');
      onTaskCreated(response.data.task);
      handleClose();
    } catch (error) {
      handleError(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    clearApiErrors();
    setFormErrors({});
    setFormData({
      title: '',
      description: '',
      category: '',
      due_date: '',
      recurrence: 'none',
      assigned_to: '',
    });
    onClose();
  };

  const errors = { ...apiErrors, ...formErrors };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Task">
      <form onSubmit={handleCreateTask} className="space-y-4">
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
          required
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
          <option value="monthly">Monthly</option>
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

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={isCreating}>Create Task</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;