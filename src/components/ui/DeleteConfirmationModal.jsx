import React from 'react';
import Modal from './Modal';
import Button from './Button';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemType, itemName, isDeleting }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Delete ${itemType}`}>
      <div className="p-4">
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete the {itemType} "<span className="font-semibold">{itemName}</span>"?
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} loading={isDeleting}>Delete</Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;