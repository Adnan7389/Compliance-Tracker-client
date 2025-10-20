import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { documentsAPI } from '../../services/api';
import { useApiError } from '../../hooks/useApiError';
import { useToast } from '../../hooks/useToast';
import { FaDownload, FaTrash, FaUpload } from 'react-icons/fa';

const ViewTaskModal = ({ isOpen, onClose, task }) => {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingDocument, setIsDeletingDocument] = useState(false);
  const { handleError, globalError, clearErrors } = useApiError();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (isOpen && task) {
      loadDocuments();
    }
  }, [isOpen, task]);

  const loadDocuments = async () => {
    try {
      const response = await documentsAPI.getTaskDocuments(task.id);
      setDocuments(response.data.documents);
    } catch (error) {
      handleError(error);
    }
  };

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
      loadDocuments(); // Refresh document list
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
      loadDocuments(); // Refresh document list
    } catch (error) {
      handleError(error);
      showError('Failed to delete document.');
    } finally {
      setIsDeletingDocument(false);
    }
  };

  if (!task) return null;

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'in_progress':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">In Progress</span>;
      case 'completed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.title}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Task Details</h3>
          <div className="mt-2 space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">Description:</span> {task.description}</p>
            <p><span className="font-medium">Category:</span> {task.category}</p>
            <p><span className="font-medium">Status:</span> {getStatusChip(task.status)}</p>
            <p><span className="font-medium">Due Date:</span> {formatDate(task.due_date)}</p>
            <p><span className="font-medium">Recurrence:</span> {task.recurrence}</p>
            <p><span className="font-medium">Assigned To:</span> {task.assigned_to_name}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Documents</h3>
          {globalError && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded mb-4">
              {globalError}
            </div>
          )}
          <div className="space-y-2">
            {documents.length === 0 ? (
              <p className="text-sm text-gray-500">No documents uploaded for this task.</p>
            ) : (
              <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                {documents.map((doc) => (
                  <li key={doc.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <FaUpload className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="ml-2 flex-1 w-0 truncate">{doc.filename}</span>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                      <Button
                        variant="icon"
                        size="sm"
                        onClick={() => handleDownloadDocument(doc.id, doc.filename)}
                      >
                        <FaDownload />
                      </Button>
                      <Button
                        variant="icon"
                        size="sm"
                        className="text-danger-500"
                        onClick={() => handleDeleteDocument(doc.id)}
                        loading={isDeletingDocument}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
            <Button onClick={handleUploadDocument} loading={isUploading} disabled={!selectedFile}>
              Upload
            </Button>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewTaskModal;