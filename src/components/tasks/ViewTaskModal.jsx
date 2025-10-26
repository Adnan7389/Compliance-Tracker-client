import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { documentsAPI, tasksAPI } from '../../services/api';
import { useApiError } from '../../hooks/useApiError';
import { useToast } from '../../hooks/useToast';
import {
  FaDownload,
  FaTrash,
  FaUpload,
  FaFile,
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaInfoCircle,
  FaClock,
  FaRedo,
  FaCheckCircle
} from 'react-icons/fa';

const ViewTaskModal = ({ isOpen, onClose, task }) => {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingDocument, setIsDeletingDocument] = useState(false);
  const [taskHistory, setTaskHistory] = useState([]);
  const { handleError, globalError, clearErrors } = useApiError();
  const { showSuccess, showError } = useToast();

  const loadDocuments = useCallback(async () => {
    if (!task) return;
    try {
      const response = await documentsAPI.getTaskDocuments(task.id);
      setDocuments(response.data.documents);
    } catch (error) {
      handleError(error);
    }
  }, [task, handleError]);

  const loadTaskHistory = useCallback(async () => {
    if (!task || task.recurrence === 'none') {
      setTaskHistory([]); // Clear history if not a recurring task
      return;
    }
    try {
      const response = await tasksAPI.getTaskHistory(task.id);
      setTaskHistory(response.data.history);
    } catch (error) {
      handleError(error);
    }
  }, [task, handleError]);

  useEffect(() => {
    if (isOpen && task) {
      loadDocuments();
      loadTaskHistory();
    }
  }, [isOpen, loadDocuments, loadTaskHistory]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadDocument = async () => {
    if (!selectedFile) {
      showError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    clearErrors();

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await documentsAPI.upload(task.id, formData);
      showSuccess('Document uploaded successfully!');
      setSelectedFile(null);
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      loadDocuments();
    } catch (error) {
      handleError(error);
      showError('Failed to upload document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadDocument = async (documentId, filename) => {
    try {
      const response = await documentsAPI.download(documentId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      handleError(error);
      showError('Failed to download document.');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    setIsDeletingDocument(true);
    try {
      await documentsAPI.delete(documentId);
      showSuccess('Document deleted successfully!');
      loadDocuments();
    } catch (error) {
      handleError(error);
      showError('Failed to delete document.');
    } finally {
      setIsDeletingDocument(false);
    }
  };

  if (!task) return null;

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'text-amber-700',
        bg: 'bg-amber-100',
        border: 'border-amber-200',
        icon: '⏳',
        label: 'Pending'
      },
      in_progress: {
        color: 'text-blue-700',
        bg: 'bg-blue-100',
        border: 'border-blue-200',
        icon: '🔄',
        label: 'In Progress'
      },
      completed: {
        color: 'text-emerald-700',
        bg: 'bg-emerald-100',
        border: 'border-emerald-200',
        icon: '✅',
        label: 'Completed'
      }
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const iconConfig = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      xls: '📊',
      xlsx: '📊',
      ppt: '📽️',
      pptx: '📽️',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      txt: '📃',
      zip: '📦',
      default: '📎'
    };
    return iconConfig[ext] || iconConfig.default;
  };

  const statusConfig = getStatusConfig(task.status);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      size="lg"
      icon={<FaInfoCircle className="text-primary-600" />}
    >
      <div className="space-y-6">
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

        {/* Task Header */}
        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h2>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                <span>{statusConfig.icon}</span>
                {statusConfig.label}
              </span>
              {task.recurrence !== 'none' && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700 border border-purple-200">
                  <FaRedo className="text-xs" />
                  {task.recurrence}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Task Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {task.description || 'No description provided'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaTag className="text-gray-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Category</h4>
                <p className="text-sm text-gray-600 capitalize">{task.category}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-gray-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Due Date</h4>
                <p className="text-sm text-gray-600">{formatDate(task.due_date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaUser className="text-gray-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Assigned To</h4>
                <p className="text-sm text-gray-600">{task.assigned_to_name}</p>
                {task.assigned_to_email && (
                  <p className="text-xs text-gray-500">{task.assigned_to_email}</p>
                )}
              </div>
            </div>

            {task.completed_at && (
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Completed At</h4>
                  <p className="text-sm text-gray-600">{formatDate(task.completed_at)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Documents Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaFile className="text-primary-500" />
              Documents ({documents.length})
            </h3>
          </div>

          {/* Documents List */}
          <div className="space-y-3">
            {documents.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                <FaFile className="text-gray-400 text-3xl mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No documents uploaded for this task</p>
                <p className="text-gray-400 text-xs mt-1">Upload relevant files using the form below</p>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-2xl">{getFileIcon(doc.filename)}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {doc.filename}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {doc.file_size ? `${(doc.file_size / 1024 / 1024).toFixed(2)} MB` : 'Size unknown'}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
                            Uploaded {doc.created_at ? formatDate(doc.created_at) : 'recently'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="icon"
                        size="sm"
                        onClick={() => handleDownloadDocument(doc.id, doc.filename)}
                        className="text-gray-400 hover:text-primary-600 hover:bg-primary-50"
                        title="Download document"
                      >
                        <FaDownload className="text-sm" />
                      </Button>
                      <Button
                        variant="icon"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id)}
                        loading={isDeletingDocument}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete document"
                      >
                        <FaTrash className="text-sm" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FaUpload className="text-primary-500" />
              Upload New Document
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-colors duration-200"
                />
                {selectedFile && (
                  <p className="text-xs text-gray-600 mt-2">
                    Selected: <span className="font-medium">{selectedFile.name}</span>
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              <Button
                onClick={handleUploadDocument}
                loading={isUploading}
                disabled={!selectedFile}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <FaUpload className="text-sm" />
                Upload
              </Button>
            </div>
          </div>
        </div>

        {/* Task History Section */}
        {task.recurrence !== 'none' && taskHistory.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <FaClock className="text-primary-500" />
              Task History ({taskHistory.length})
            </h3>
            <div className="space-y-3">
              {taskHistory.map((historyItem) => (
                <div
                  key={historyItem.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-xl"
                >
                  <div className="flex-1 mb-2 sm:mb-0">
                    <p className="text-sm font-medium text-gray-900">
                      Completed by: <span className="font-semibold">{historyItem.completed_by_name}</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      On: {formatDate(historyItem.completed_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Previous Due: {formatDate(historyItem.previous_due_date)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Next Due: {formatDate(historyItem.next_due_date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onClose}
            className="min-w-24"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewTaskModal;