import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-surface border-b border-surface-light sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold font-heading">T</span>
            </div>
            <span className="text-xl font-bold text-white font-heading">TaskFlow</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex gap-4">
              <Link to="/dashboard" className="text-muted hover:text-white transition-colors">
                Dashboard
              </Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="text-muted hover:text-white transition-colors">
                  Admin
                </Link>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-surface-light rounded-lg hover:bg-primary hover:bg-opacity-10 transition-colors"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-muted">{user?.role}</p>
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-surface-light rounded-lg shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-surface-light">
                    <p className="text-sm text-white font-medium">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-muted hover:text-white hover:bg-surface-light transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
