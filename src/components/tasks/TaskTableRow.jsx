import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Button from '../ui/Button';

const TaskTableRow = ({ task, onViewTask, onEditTask, onDeleteTask, isStaff }) => {
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{task.title}</div>
        <div className="text-sm text-gray-500">{task.category}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusChip(task.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(task.due_date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{task.assigned_to_name}</div>
        <div className="text-sm text-gray-500">{task.assigned_to_email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <Button variant="icon" size="sm" onClick={() => onViewTask(task)}>
            <FaEye />
          </Button>
          <Button variant="icon" size="sm" onClick={() => onEditTask(task)}>
            <FaEdit />
          </Button>
          {!isStaff && (
            <Button variant="icon" size="sm" className="text-danger-500" onClick={() => onDeleteTask(task)}>
              <FaTrash />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TaskTableRow;