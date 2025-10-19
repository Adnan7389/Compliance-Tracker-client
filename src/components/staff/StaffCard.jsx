import React, { useState } from 'react';
import { staffAPI } from '../../services/api';
import { useApiError } from '../../hooks/useApiError';
import { useToast } from '../../hooks/useToast';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const StaffCard = ({ staffMember, onStaffUpdated }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [staffDetails, setStaffDetails] = useState(null);
    const { handleError } = useApiError();
    const { showSuccess, showError } = useToast();

    const loadStaffDetails = async () => {
        try {
            setIsLoading(true);
            const response = await staffAPI.getById(staffMember.id);
            setStaffDetails(response.data.staff);
            setIsDetailsModalOpen(true);
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetails = async () => {
        await loadStaffDetails();
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
            <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold text-sm">
                                {getInitials(staffMember.name)}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {staffMember.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                            {staffMember.email}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {staffMember.role}
                    </span>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleViewDetails}
                        loading={isLoading}
                    >
                        View Details
                    </Button>
                </div>
            </div>

            {/* Staff Details Modal */}
            <Modal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setStaffDetails(null);
                }}
                title="Staff Member Details"
            >
                {staffDetails && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-600 font-semibold text-lg">
                                    {getInitials(staffDetails.name)}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {staffDetails.name}
                                </h3>
                                <p className="text-gray-500">{staffDetails.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <p className="mt-1 text-sm text-gray-900 capitalize">{staffDetails.role}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {staffDetails.created_at ? formatDate(staffDetails.created_at) : 'N/A'}
                                </p>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Staff ID</label>
                                <p className="mt-1 text-sm text-gray-900 font-mono">{staffDetails.id}</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-200">
                            <Button
                                variant="secondary"
                                onClick={() => setIsDetailsModalOpen(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default StaffCard;