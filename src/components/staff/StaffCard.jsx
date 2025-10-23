import React, { useState } from 'react';
import { staffAPI } from '../../services/api';
import { useApiError } from '../../hooks/useApiError';
import { useToast } from '../../hooks/useToast';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import {
    FaUser,
    FaEnvelope,
    FaCalendar,
    FaIdCard,
    FaTasks,
    FaCheckCircle,
    FaClock,
    FaEye,
    FaEdit,
    FaTrash
} from 'react-icons/fa';

const StaffCard = ({ staffMember, onStaffUpdated, isLast = false }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
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

    const getRoleColor = (role) => {
        const roleColors = {
            admin: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
            manager: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
            user: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
            supervisor: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
        };
        return roleColors[role] || roleColors.user;
    };

    const getStatusColor = (status) => {
        const statusColors = {
            active: { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-400' },
            inactive: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-400' },
            pending: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-400' },
        };
        return statusColors[status] || statusColors.active;
    };

    const roleColor = getRoleColor(staffMember.role);
    const statusColor = getStatusColor(staffMember.status);

    return (
        <>
            <div className={`
                group flex items-center justify-between p-6 transition-all duration-200
                hover:bg-gray-50 hover:shadow-sm cursor-pointer
                border-b border-gray-100
                ${isLast ? 'border-b-0' : ''}
            `}>
                {/* Staff Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Avatar with status indicator */}
                    <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                                {getInitials(staffMember.name)}
                            </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${statusColor.dot}`}></div>
                    </div>

                    {/* Staff Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary-700 transition-colors">
                                {staffMember.name}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusColor.dot}`}></div>
                                {staffMember.status || 'Active'}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <FaEnvelope className="text-gray-400 text-xs" />
                                <span className="truncate">{staffMember.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <FaCalendar className="text-gray-400 text-xs" />
                                <span>Joined {staffMember.created_at ? formatDate(staffMember.created_at) : 'N/A'}</span>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        {staffMember.task_stats && (
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <FaTasks className="text-gray-400" />
                                    <span>{staffMember.task_stats.total || 0} tasks</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-emerald-500">
                                    <FaCheckCircle className="text-emerald-400" />
                                    <span>{staffMember.task_stats.completed || 0} completed</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-amber-500">
                                    <FaClock className="text-amber-400" />
                                    <span>{staffMember.task_stats.pending || 0} pending</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions and Role */}
                <div className="flex items-center gap-4">
                    {/* Role Badge */}
                    <div className={`px-3 py-2 rounded-lg border text-sm font-medium ${roleColor.bg} ${roleColor.text} ${roleColor.border}`}>
                        {staffMember.role?.charAt(0).toUpperCase() + staffMember.role?.slice(1) || 'User'}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleViewDetails}
                            loading={isLoading}
                            className="flex items-center gap-2"
                        >
                            <FaEye className="text-sm" />
                            Details
                        </Button>

                        {/* Actions Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                </svg>
                            </button>

                            {isActionsMenuOpen && (
                                <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                        <FaEdit className="text-gray-400" />
                                        Edit Staff
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                        <FaEnvelope className="text-gray-400" />
                                        Send Message
                                    </button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                                        <FaTrash className="text-red-400" />
                                        Remove Staff
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Staff Details Modal */}
            <Modal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setStaffDetails(null);
                }}
                title="Staff Member Details"
                size="lg"
            >
                {staffDetails && (
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-sm">
                                    <span className="text-white font-semibold text-lg">
                                        {getInitials(staffDetails.name)}
                                    </span>
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(staffDetails.status).dot}`}></div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                    {staffDetails.name}
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <FaEnvelope className="text-gray-400 text-sm" />
                                        <span>{staffDetails.email}</span>
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(staffDetails.role).bg} ${getRoleColor(staffDetails.role).text} ${getRoleColor(staffDetails.role).border}`}>
                                        {staffDetails.role}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        {staffDetails.task_stats && (
                            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{staffDetails.task_stats.total || 0}</div>
                                    <div className="text-xs text-gray-600">Total Tasks</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-emerald-600">{staffDetails.task_stats.completed || 0}</div>
                                    <div className="text-xs text-gray-600">Completed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-amber-600">{staffDetails.task_stats.pending || 0}</div>
                                    <div className="text-xs text-gray-600">Pending</div>
                                </div>
                            </div>
                        )}

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <FaUser className="text-gray-400" />
                                    Role
                                </label>
                                <p className="text-sm text-gray-900 capitalize font-medium">{staffDetails.role}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <FaCalendar className="text-gray-400" />
                                    Member Since
                                </label>
                                <p className="text-sm text-gray-900 font-medium">
                                    {staffDetails.created_at ? formatDate(staffDetails.created_at) : 'N/A'}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <FaIdCard className="text-gray-400" />
                                    Staff ID
                                </label>
                                <p className="text-sm text-gray-900 font-mono font-medium">{staffDetails.id}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <div className={`w-2 h-2 rounded-full ${getStatusColor(staffDetails.status).dot}`}></div>
                                    Status
                                </label>
                                <p className="text-sm text-gray-900 capitalize font-medium">{staffDetails.status || 'Active'}</p>
                            </div>
                        </div>

                        {/* Recent Activity Preview */}
                        <div className="pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h4>
                            <div className="text-sm text-gray-500 italic">
                                {staffDetails.recent_activity?.length > 0
                                    ? `${staffDetails.recent_activity.length} activities in the last 7 days`
                                    : 'No recent activity'
                                }
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                            <Button
                                variant="secondary"
                                onClick={() => setIsDetailsModalOpen(false)}
                            >
                                Close
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    // Navigate to edit or send message
                                    setIsDetailsModalOpen(false);
                                }}
                            >
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Close dropdown when clicking outside */}
            {isActionsMenuOpen && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setIsActionsMenuOpen(false)}
                />
            )}
        </>
    );
};

export default StaffCard;