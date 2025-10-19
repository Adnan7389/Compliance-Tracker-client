import React, { useState, useEffect } from 'react';
import { useApiError } from '../../hooks/useApiError';
import { useToast } from '../../hooks/useToast';
import { staffAPI } from '../../services/api';
import StaffCard from '../../components/staff/StaffCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';

import { validateEmail, validatePassword, validateRequired } from '../../utils/validation';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { errors, globalError, handleError, clearErrors } = useApiError();
  const { showSuccess, showError } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Load staff on component mount
  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setIsLoading(true);
      const response = await staffAPI.getAll();
      setStaff(response.data.staff);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    clearErrors();

    const validationErrors = {};
    const nameError = validateRequired(formData.name, 'Name');
    if (nameError) validationErrors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) validationErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) validationErrors.password = passwordError;

    if (Object.keys(validationErrors).length > 0) {
      const errorDetails = Object.entries(validationErrors).map(([field, message]) => ({ field, message }));
      handleError({ type: 'VALIDATION_ERROR', details: errorDetails });
      return;
    }

    setIsCreating(true);

    try {
      const response = await staffAPI.create(formData);
      setStaff(prev => [response.data.staff, ...prev]);
      showSuccess('Staff member created successfully!');
      setIsCreateModalOpen(false);
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      handleError(error);
      if (globalError) {
        showError(globalError);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      clearErrors(); // Clear all errors or use clearFieldError if you have it
    }
  };

  // NEW: Reset form when modal closes
  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    clearErrors();
    setFormData({ name: '', email: '', password: '' });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">
            Manage staff members and their access to the system
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
        >
          Add Staff Member
        </Button>
      </div>

      {/* Global Error - Show only if there's a global error AND no field errors */}
      {globalError && !Object.keys(errors).length && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded mb-6">
          {globalError}
        </div>
      )}

      {/* Staff List */}
      <div className="bg-white shadow rounded-lg">
        {staff.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first staff member.</p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="primary"
            >
              Add First Staff Member
            </Button>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Staff Members ({staff.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {staff.map((staffMember) => (
                <StaffCard
                  key={staffMember.id}
                  staffMember={staffMember}
                  onStaffUpdated={loadStaff}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Staff Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose} // UPDATED: Use the new handler
        title="Add New Staff Member"
      >
        <form onSubmit={handleCreateStaff} className="space-y-4">
          {/* Show global error inside modal if exists */}
          {globalError && Object.keys(errors).length === 0 && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded">
              {globalError}
            </div>
          )}

          <Input
            label="Full Name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            placeholder="Enter staff member's full name"
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email} // This should now show "Email already registered"
            placeholder="Enter staff member's email"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            placeholder="Set initial password"
            helpText="Must be at least 6 characters long"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleModalClose} // UPDATED: Use the new handler
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isCreating} // UPDATED: Use creating state
            >
              Create Staff Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StaffManagement;