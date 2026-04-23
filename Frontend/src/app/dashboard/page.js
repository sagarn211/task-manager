'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import { taskAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await taskAPI.getTasks();
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = [...tasks];

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter((task) => task.priority === filterPriority);
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'priority') {
        const pMap = { high: 3, medium: 2, low: 1 };
        return pMap[b.priority] - pMap[a.priority];
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

    setFilteredTasks(filtered);
  }, [tasks, filterStatus, filterPriority, searchQuery, sortBy]);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, []);

  // Stats calculation
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
  };

  // Handle create/update
  const handleSubmit = async (formData) => {
    try {
      setError(null);
      if (editingTask) {
        await taskAPI.updateTask(editingTask._id, formData);
        setTasks((prev) =>
          prev.map((task) =>
            task._id === editingTask._id ? { ...task, ...formData } : task
          )
        );
        setEditingTask(null);
      } else {
        const response = await taskAPI.createTask(formData);
        setTasks((prev) => [response.data, ...prev]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
      console.error('Error:', err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await taskAPI.deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white mb-2">
                Good morning, {user?.name.split(' ')[0]}
              </h1>
              <p className="text-muted text-sm font-medium">
                You have <span className="text-primary-600 dark:text-primary-400 font-bold">{stats.pending} tasks</span> requiring your attention today.
              </p>
            </div>
          </header>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'All Tasks', value: stats.total, trend: 'Total volume' },
              { label: 'Active', value: stats.inProgress, trend: 'In Progress' },
              { label: 'Pending', value: stats.pending, trend: 'Awaiting start' },
              { label: 'Completed', value: stats.completed, trend: 'Successfully finished' },
            ].map((stat) => (
              <div key={stat.label} className="card-premium p-6 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4">{stat.label}</span>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{stat.value}</span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Action Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                    {editingTask ? 'Modify Task' : 'Quick Create'}
                  </h2>
                  {editingTask && (
                    <button onClick={() => setEditingTask(null)} className="text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-600">
                      Dismiss
                    </button>
                  )}
                </div>
                <TaskForm 
                  key={editingTask?._id || 'new'} 
                  onSubmit={handleSubmit} 
                  initialValues={editingTask} 
                  isLoading={isLoading} 
                />
              </div>
            </aside>

            {/* Task Management */}
            <main className="lg:col-span-8 space-y-6">
              {/* Filter Toolbar */}
              <div className="card-premium p-2 flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by title or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-premium !border-none !ring-0 !bg-transparent pl-10 h-10"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-1">
                  <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden md:block mx-1" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-transparent text-[11px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg outline-none cursor-pointer text-muted hover:text-foreground"
                  >
                    <option value="all">Status: All</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-[11px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg outline-none cursor-pointer text-muted hover:text-foreground"
                  >
                    <option value="newest">Sort: Newest</option>
                    <option value="oldest">Sort: Oldest</option>
                    <option value="priority">Sort: Priority</option>
                    <option value="dueDate">Sort: Due Date</option>
                  </select>
                </div>
              </div>

              {/* Viewport */}
              <div className="min-h-[400px]">
                {isLoading ? (
                  <div className="py-24 text-center">
                    <div className="w-10 h-10 border-2 border-slate-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted text-sm font-medium">Syncing database...</p>
                  </div>
                ) : filteredTasks.length > 0 ? (
                  <div className="space-y-3">
                    <TaskList
                      tasks={filteredTasks}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isLoading={isLoading}
                    />
                  </div>
                ) : (
                  <div className="card-premium py-24 text-center border-dashed border-2">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No tasks identified</h3>
                    <p className="text-muted text-sm max-w-xs mx-auto">
                      {searchQuery ? 'We couldn\'t find any matches for your current filters.' : 'Your workspace is currently empty. Create a task to begin.'}
                    </p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
