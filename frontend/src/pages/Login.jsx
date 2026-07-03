import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('srl_token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login', { username, password });
      localStorage.setItem('srl_token', response.data.token);
      localStorage.setItem('srl_user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.error || 
        'Invalid username or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] shadow-sm p-8">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-wider text-[#0F172A]">SRL GROUP</h1>
          <p className="text-xs font-semibold tracking-widest text-[#B30000] uppercase mt-1">
            Shree Ram Packers & Movers
          </p>
          <div className="h-[2px] w-12 bg-[#B30000] mx-auto mt-4"></div>
        </div>

        {/* Info Box */}
        <div className="mb-6 p-3 bg-slate-50 border-l-4 border-slate-700 text-xs text-slate-600">
          <p><strong>Default Credentials:</strong></p>
          <p>Username: <code className="font-mono bg-white px-1">admin</code> | Password: <code className="font-mono bg-white px-1">srladmin123</code></p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-[#B30000] text-xs text-[#B30000] font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              disabled={loading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#B30000] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:border-[#B30000] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-slate-400">
          SRL Group Enterprise Document Management System &copy; 2026
        </p>
      </div>
    </div>
  );
}

export default Login;
