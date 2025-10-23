import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useApiError } from '../../hooks/useApiError';
import { tasksAPI, staffAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { validateTask } from '../../utils/validation';
import { FaTasks, FaCalendarAlt, FaUser, FaTag, FaRedo } from 'react-icons/fa';

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
    const loadStaff = async () => {
      try {
        const response = await staffAPI.getAll();
        setStaff(response.data.staff);
      } catch (error) {
        handleError(error);
      }
    };

    if (isOpen) {
      loadStaff();
    }
  }, [isOpen, handleError]);

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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Task"
      size="lg"
      icon={<FaTasks className="text-primary-600" />}
    >
      <form onSubmit={handleCreateTask} className="space-y-6">
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
            placeholder="Enter a clear and descriptive task title"
            icon={<FaTasks className="text-gray-400" />}
          />

          {/* Description */}
          <Input
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleInputChange}
            error={errors.description}
            placeholder="Provide detailed instructions or context for this task"
            rows={4}
          />

          {/* Category and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Category"
              name="category"
              as="select"
              required
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
              label="Due Date"
              name="due_date"
              type="date"
              required
              value={formData.due_date}
              onChange={handleInputChange}
              error={errors.due_date}
              icon={<FaCalendarAlt className="text-gray-400" />}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Recurrence and Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Recurrence"
              name="recurrence"
              as="select"
              value={formData.recurrence}
              onChange={handleInputChange}
              error={errors.recurrence}
              icon={<FaRedo className="text-gray-400" />}
              helpText="Set if this task repeats regularly"
            >
              <option value="none">No Recurrence</option>
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
              icon={<FaUser className="text-gray-400" />}
              helpText="Select staff member responsible"
            >
              <option value="">Select Staff Member</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role})
                </option>
              ))}
            </Input>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isCreating}
            className="min-w-32"
          >
            {isCreating ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;