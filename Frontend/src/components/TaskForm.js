'use client';

import { useState } from 'react';
import { taskSchema, getValidationErrors } from '@/utils/validations';

export default function TaskForm({ onSubmit, initialValues = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    status: initialValues?.status || 'pending',
    priority: initialValues?.priority || 'medium',
    dueDate: initialValues?.dueDate ? new Date(initialValues.dueDate).toISOString().split('T')[0] : '',
    category: initialValues?.category || 'Work',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = taskSchema.safeParse(formData);
    if (!validation.success) {
      const validationErrors = getValidationErrors(validation.error);
      setErrors(validationErrors);
      return;
    }

    try {
      await onSubmit(formData);
      if (!initialValues) {
        setFormData({
          title: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          dueDate: '',
          category: 'Work',
        });
      }
      setErrors({});
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-premium p-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2 ml-1">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Design System Audit"
            className={`input-premium ${errors.title ? 'border-rose-500 ring-rose-500/10' : ''}`}
          />
          {errors.title && <p className="text-rose-500 text-[10px] mt-2 ml-1 font-bold uppercase tracking-wider">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2 ml-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the objective..."
            rows="3"
            className="input-premium resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2 ml-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-premium cursor-pointer"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2 ml-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="input-premium text-sm cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2 ml-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-premium cursor-pointer"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2 ml-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input-premium cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-premium-primary w-full py-3.5 shadow-lg shadow-primary-500/20"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="uppercase tracking-widest text-[11px] font-bold">Syncing...</span>
            </span>
          ) : (
            <span className="uppercase tracking-widest text-[11px] font-bold">
              {initialValues ? 'Update Task' : 'Confirm & Create'}
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
