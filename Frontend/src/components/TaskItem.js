'use client';

import { useState } from 'react';

const statusStyles = {
  pending: 'bg-amber-100/10 text-amber-600 dark:text-amber-400 border border-amber-200/20',
  'in-progress': 'bg-blue-100/10 text-blue-600 dark:text-blue-400 border border-blue-200/20',
  completed: 'bg-emerald-100/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/20',
};

const priorityStyles = {
  low: 'bg-slate-300 dark:bg-slate-700',
  medium: 'bg-amber-400',
  high: 'bg-rose-500',
};

export default function TaskItem({ task, onEdit, onDelete, isLoading = false }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await onDelete(task._id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className="card-premium p-5 group relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 relative z-10">
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${priorityStyles[task.priority]}`} />
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              {task.title}
            </h3>
            <span className={`badge-premium px-2.5 py-1 ${statusStyles[task.status]}`}>
              {task.status.replace('-', ' ')}
            </span>
          </div>

          {task.description && (
            <p className="text-muted text-sm leading-relaxed max-w-2xl line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted">
            <div className="flex items-center gap-2">
              <span className="opacity-50">Category</span>
              <span className="text-slate-700 dark:text-slate-300">{task.category}</span>
            </div>
            
            {formattedDate && (
              <div className="flex items-center gap-2">
                <span className="opacity-50">Due</span>
                <span className="text-slate-700 dark:text-slate-300">{formattedDate}</span>
              </div>
            )}

            {task.user && (
              <div className="flex items-center gap-2">
                <span className="opacity-50">Owner</span>
                <span className="text-slate-700 dark:text-slate-300">{task.user.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex sm:flex-col gap-2 w-full sm:w-auto md:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <button
            onClick={() => onEdit(task)}
            className="flex-1 sm:flex-none btn-premium-secondary !py-2 !px-4 text-[11px] font-bold uppercase tracking-widest"
            disabled={isLoading || isDeleting}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading || isDeleting}
            className="flex-1 sm:flex-none btn-premium-danger !py-2 !px-4 text-[11px] font-bold uppercase tracking-widest"
          >
            {isDeleting ? '...' : 'Remove'}
          </button>
        </div>
      </div>
      
      {/* Subtle priority glow */}
      <div className={`absolute top-0 left-0 w-1 h-full opacity-30 ${priorityStyles[task.priority]}`} />
    </div>
  );
}
