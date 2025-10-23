import React from 'react';
import TaskTableRow from './TaskTableRow';
import { FaTasks, FaExclamationTriangle } from 'react-icons/fa';

const TaskTable = ({ tasks, onViewTask, onEditTask, onDeleteTask, isStaff }) => {
  // Calculate some statistics for the header
  const overdueCount = tasks.filter(task => {
    const dueDate = new Date(task.due_date);
    const today = new Date();
    return dueDate < today && task.status !== 'completed';
  }).length;

  const completedCount = tasks.filter(task => task.status === 'completed').length;

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
      {/* Enhanced Table Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-xl">
              <FaTasks className="text-primary-600 text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isStaff ? 'My Tasks' : 'All Tasks'}
              </h3>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-gray-600">
                  {tasks.length} total tasks
                </span>
                {completedCount > 0 && (
                  <span className="text-sm text-emerald-600 font-medium">
                    {completedCount} completed
                  </span>
                )}
                {overdueCount > 0 && (
                  <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <FaExclamationTriangle className="text-sm" />
                    {overdueCount} overdue
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Status Summary */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span className="text-gray-600">Pending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">In Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-600">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        {tasks.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <FaTasks className="text-gray-400 text-2xl" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h4>
            <p className="text-gray-600 max-w-md mx-auto">
              {isStaff
                ? "You don't have any tasks assigned to you at the moment."
                : "No tasks match your current filters. Try adjusting your search criteria."
              }
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/80">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Task Details
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Assignee
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {tasks.map((task, index) => (
                <TaskTableRow
                  key={task.id}
                  task={task}
                  onViewTask={onViewTask}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                  isStaff={isStaff}
                  isLast={index === tasks.length - 1}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Table Footer */}
      {tasks.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </span>
            <span className="text-xs">
              Sorted by: <span className="font-medium text-gray-700">Due Date (Ascending)</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;