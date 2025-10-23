import React from 'react';
import { FaEye, FaEdit, FaTrash, FaCalendar, FaUser, FaTag, FaExclamationTriangle } from 'react-icons/fa';
import Button from '../ui/Button';

const TaskTableRow = ({ task, onViewTask, onEditTask, onDeleteTask, isStaff, isLast = false }) => {
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = () => {
    const daysUntilDue = getDaysUntilDue(task.due_date);
    return daysUntilDue < 0 && task.status !== 'completed';
  };

  const isDueSoon = () => {
    const daysUntilDue = getDaysUntilDue(task.due_date);
    return daysUntilDue <= 3 && daysUntilDue >= 0 && task.status !== 'completed';
  };

  const statusConfig = getStatusConfig(task.status);
  const overdue = isOverdue();
  const dueSoon = isDueSoon();

  return (
    <tr className={`group hover:bg-gray-50 transition-all duration-200 ${isLast ? '' : 'border-b border-gray-100'}`}>
      {/* Task Details */}
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          {/* Priority Indicator */}
          <div className={`w-1 h-14 rounded-full mt-1 ${overdue ? 'bg-red-500' :
              dueSoon ? 'bg-amber-500' :
                'bg-gray-200'
            }`}></div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors truncate">
                {task.title}
              </h4>
              {overdue && (
                <FaExclamationTriangle className="text-red-500 text-xs flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <FaTag className="text-gray-400" />
                <span className="capitalize">{task.category}</span>
              </div>
              {task.description && (
                <span className="truncate max-w-xs">{task.description}</span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-2">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
            <span>{statusConfig.icon}</span>
            {statusConfig.label}
          </span>

          {/* Progress for in-progress tasks */}
          {task.status === 'in_progress' && task.progress !== undefined && (
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
          )}
        </div>
      </td>

      {/* Due Date */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <FaCalendar className={`text-sm ${overdue ? 'text-red-500' :
              dueSoon ? 'text-amber-500' :
                'text-gray-400'
            }`} />
          <div className="text-sm">
            <div className={`font-medium ${overdue ? 'text-red-700' :
                dueSoon ? 'text-amber-700' :
                  'text-gray-900'
              }`}>
              {formatDate(task.due_date)}
            </div>
            {overdue && (
              <div className="text-xs text-red-600 font-medium">Overdue</div>
            )}
            {dueSoon && !overdue && (
              <div className="text-xs text-amber-600 font-medium">Due soon</div>
            )}
          </div>
        </div>
      </td>

      {/* Assignee */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <FaUser className="text-gray-400 text-sm" />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {task.assigned_to_name || 'Unassigned'}
            </div>
            {task.assigned_to_email && (
              <div className="text-xs text-gray-500 truncate max-w-[120px]">
                {task.assigned_to_email}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="icon"
            size="sm"
            onClick={() => onViewTask(task)}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            title="View details"
          >
            <FaEye className="text-sm" />
          </Button>

          <Button
            variant="icon"
            size="sm"
            onClick={() => onEditTask(task)}
            className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
            title="Edit task"
          >
            <FaEdit className="text-sm" />
          </Button>

          {!isStaff && (
            <Button
              variant="icon"
              size="sm"
              onClick={() => onDeleteTask(task)}
              className="text-gray-400 hover:text-red-600 hover:bg-red-50"
              title="Delete task"
            >
              <FaTrash className="text-sm" />
            </Button>
          )}
        </div>

        {/* Fallback visible actions for accessibility */}
        <div className="flex items-center justify-end gap-1 group-hover:hidden">
          <Button
            variant="icon"
            size="sm"
            onClick={() => onViewTask(task)}
            className="text-gray-400"
            title="View details"
          >
            <FaEye className="text-sm" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default TaskTableRow;