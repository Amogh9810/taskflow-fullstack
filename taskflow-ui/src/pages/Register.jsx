import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import Toast from '../components/Toast.jsx';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [passwordFeedback, setPasswordFeedback] = useState([]);
  const navigate = useNavigate();
  const { login } = useAuth();

  const checkPasswordRequirements = (password) => {
    const feedback = [];
    if (password.length < 8) feedback.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) feedback.push('One uppercase letter');
    if (!/[0-9]/.test(password)) feedback.push('One number');
    setPasswordFeedback(feedback);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      checkPasswordRequirements(value);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const registerResponse = await api.post('/auth/register', formData);
      const { user } = registerResponse.data;

      // Auto-login after registration
      const loginResponse = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const { token } = loginResponse.data;
      login(token, user);
      setToast({ type: 'success', message: 'Registration successful!' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      setToast({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = passwordFeedback.length === 0 && formData.password.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {toast && <Toast type={toast.type} message={toast.message} />}
      <div className="card w-full max-w-md">
        <h1 className="text-3xl font-bold text-white font-heading mb-2">Create Account</h1>
        <p className="text-muted mb-6">Join TaskFlow to start managing tasks</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
              required
            />
            {formData.password && (
              <div className="mt-2 text-sm">
                {isPasswordValid ? (
                  <p className="text-success">Password meets all requirements</p>
                ) : (
                  <p className="text-warning mb-1">Password needs:</p>
                )}
                <ul className="list-disc list-inside text-muted space-y-1">
                  {passwordFeedback.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {error && <div className="bg-danger bg-opacity-10 border border-danger rounded-lg p-3 text-danger text-sm">{error}</div>}

          <button type="submit" disabled={loading || !isPasswordValid} className="btn btn-primary w-full">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-muted text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
