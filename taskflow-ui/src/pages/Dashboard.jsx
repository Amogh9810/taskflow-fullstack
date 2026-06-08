import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskModal from '../components/TaskModal.jsx';
import Toast from '../components/Toast.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ status: '', page: 1, limit: 10 });
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const fetchTasks = async (filtersToUse = filters) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filtersToUse.status) params.append('status', filtersToUse.status);
      params.append('page', filtersToUse.page);
      params.append('limit', filtersToUse.limit);

      const response = await api.get(`/tasks?${params.toString()}`);
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to load tasks';
      setError(errorMessage);
      setToast({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (formData) => {
  try {
    const payload = {
      ...formData,
      dueDate: formData.dueDate
        ? new Date(formData.dueDate).toISOString()
        : null,
    };

    await api.post('/tasks', payload);

    setToast({ type: 'success', message: 'Task created successfully!' });
    setIsModalOpen(false);
    setEditingTask(null);
    fetchTasks();
  } catch (err) {
    const errorMessage = err.response?.data?.error || 'Failed to create task';
    setToast({ type: 'error', message: errorMessage });
  }
};

  const handleUpdateTask = async (formData) => {
    try {
      await api.patch(`/tasks/${editingTask.id}`, formData);
      setToast({ type: 'success', message: 'Task updated successfully!' });
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update task';
      setToast({ type: 'error', message: errorMessage });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      setToast({ type: 'success', message: 'Task deleted successfully!' });
      fetchTasks();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete task';
      setToast({ type: 'error', message: errorMessage });
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)));
      setToast({ type: 'success', message: 'Task status updated!' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update task status' });
    }
  };

  const handleFilterChange = (status) => {
    setFilters({ ...filters, status, page: 1 });
    fetchTasks({ ...filters, status, page: 1 });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (editingTask) {
      handleUpdateTask(formData);
    } else {
      handleCreateTask(formData);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {toast && <Toast type={toast.type} message={toast.message} />}
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white font-heading">My Tasks</h1>
            <p className="text-muted mt-2">Welcome back, {user?.name}!</p>
          </div>
          <button onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }} className="btn btn-primary">
            + New Task
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleFilterChange('')}
            className={`btn px-4 py-2 ${!filters.status ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Tasks
          </button>
          <button
            onClick={() => handleFilterChange('TODO')}
            className={`btn px-4 py-2 ${filters.status === 'TODO' ? 'btn-primary' : 'btn-secondary'}`}
          >
            To Do
          </button>
          <button
            onClick={() => handleFilterChange('IN_PROGRESS')}
            className={`btn px-4 py-2 ${filters.status === 'IN_PROGRESS' ? 'btn-primary' : 'btn-secondary'}`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleFilterChange('DONE')}
            className={`btn px-4 py-2 ${filters.status === 'DONE' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Done
          </button>
        </div>

        {loading && <p className="text-center text-muted py-8">Loading tasks...</p>}
        {error && <p className="text-center text-danger py-8">{error}</p>}

        {!loading && tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted text-lg">No tasks found</p>
            <button
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              className="btn btn-primary mt-4"
            >
              Create your first task
            </button>
          </div>
        )}

        {!loading && tasks.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => {
                    const newPage = Math.max(1, filters.page - 1);
                    setFilters({ ...filters, page: newPage });
                    fetchTasks({ ...filters, page: newPage });
                  }}
                  disabled={filters.page === 1}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-white flex items-center px-4">
                  Page {filters.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => {
                    const newPage = Math.min(pagination.pages, filters.page + 1);
                    setFilters({ ...filters, page: newPage });
                    fetchTasks({ ...filters, page: newPage });
                  }}
                  disabled={filters.page === pagination.pages}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingTask}
      />
    </div>
  );
}
