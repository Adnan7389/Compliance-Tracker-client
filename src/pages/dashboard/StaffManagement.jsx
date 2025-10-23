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
import { FaUsers, FaUserPlus, FaSearch, FaFilter } from 'react-icons/fa';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
      clearErrors();
    }
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    clearErrors();
    setFormData({ name: '', email: '', password: '' });
  };

  // Filter staff based on search term
  const filteredStaff = staff.filter(staffMember =>
    staffMember.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <FaUsers className="text-primary-600 text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Staff Management
            </h1>
            <p className="text-lg text-gray-600 mt-2 max-w-2xl">
              Manage staff members and their access to the compliance system
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="primary"
          size="lg"
          className="whitespace-nowrap"
        >
          <FaUserPlus className="mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Global Error Display */}
      {globalError && !Object.keys(errors).length && (
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

      {/* Search and Filter Bar */}
      {staff.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search staff by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white shadow-sm"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-gray-700 font-medium">
            <FaFilter className="text-gray-400" />
            Filter
          </button>
        </div>
      )}

      {/* Staff List Section */}
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        {filteredStaff.length === 0 ? (
          <div className="text-center py-16 px-6">
            {searchTerm ? (
              // No search results state
              <>
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <FaSearch className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No matching staff members</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  No staff members found matching "<span className="font-medium">{searchTerm}</span>". Try adjusting your search terms.
                </p>
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="secondary"
                >
                  Clear Search
                </Button>
              </>
            ) : (
              // Empty state
              <>
                <div className="w-20 h-20 mx-auto mb-6 bg-primary-50 rounded-2xl flex items-center justify-center">
                  <FaUsers className="text-primary-500 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No staff members yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Get started by adding your first staff member to manage compliance tasks and assignments.
                </p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  variant="primary"
                  size="lg"
                >
                  <FaUserPlus className="mr-2" />
                  Add First Staff Member
                </Button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* List Header */}
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Staff Members
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredStaff.length} of {staff.length} staff members
                    {searchTerm && (
                      <span className="text-primary-600 font-medium">
                        {' '}matching "{searchTerm}"
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Sorted by: <span className="font-medium text-gray-700">Recently Added</span>
                </div>
              </div>
            </div>

            {/* Staff List */}
            <div className="divide-y divide-gray-100">
              {filteredStaff.map((staffMember, index) => (
                <StaffCard
                  key={staffMember.id}
                  staffMember={staffMember}
                  onStaffUpdated={loadStaff}
                  isLast={index === filteredStaff.length - 1}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Enhanced Create Staff Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        title="Add New Staff Member"
        size="lg"
      >
        <form onSubmit={handleCreateStaff} className="space-y-6">
          {/* Global error in modal */}
          {globalError && Object.keys(errors).length === 0 && (
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
            <Input
              label="Full Name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              placeholder="Enter staff member's full name"
              icon={<FaUsers className="text-gray-400" />}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="Enter staff member's email"
              icon={<svg className="text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>}
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
              icon={<svg className="text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>}
            />
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleModalClose}
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
              {isCreating ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StaffManagement;