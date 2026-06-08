import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Toast from '../components/Toast.jsx';

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, tasksRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/tasks'),
      ]);
      setUsers(usersRes.data.users || []);
      setTasks(tasksRes.data.tasks || []);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to load admin data';
      setToast({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-muted">You don&apos;t have permission to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {toast && <Toast type={toast.type} message={toast.message} />}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white font-heading mb-8">Admin Dashboard</h1>

        <div className="flex gap-4 mb-8 border-b border-surface-light">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted hover:text-white'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'tasks'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted hover:text-white'
            }`}
          >
            Tasks ({tasks.length})
          </button>
        </div>

        {loading ? (
          <p className="text-center text-muted py-8">Loading...</p>
        ) : activeTab === 'users' ? (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-light">
                  <th className="text-left px-4 py-3 font-semibold text-white">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-white">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-white">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-white">Tasks</th>
                  <th className="text-left px-4 py-3 font-semibold text-white">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-surface-light hover:bg-surface-light transition-colors">
                    <td className="px-4 py-3 text-white">{u.name}</td>
                    <td className="px-4 py-3 text-muted">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : 'badge-primary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white">{u._count?.tasks || 0}</td>
                    <td className="px-4 py-3 text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-light">
                  <th className="text-left px-4 py-3 font-semibold text-white">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-white">User</th>
                  <th className="text-left px-4 py-3 font-semibold text-white">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-white">Priority</th>
                  <th className="text-left px-4 py-3 font-semibold text-white">Created</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b border-surface-light hover:bg-surface-light transition-colors">
                    <td className="px-4 py-3 text-white">{task.title}</td>
                    <td className="px-4 py-3 text-muted">{task.user?.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${
                          task.status === 'DONE'
                            ? 'badge-success'
                            : task.status === 'IN_PROGRESS'
                              ? 'badge-warning'
                              : 'badge-primary'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${
                          task.priority === 'CRITICAL'
                            ? 'badge-danger'
                            : task.priority === 'HIGH'
                              ? 'badge-warning'
                              : 'badge-primary'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">{new Date(task.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
