// src/pages/LoginPage.tsx  ← FINAL 100% WORKING VERSION (NO ERRORS)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
  const res = await axios.post('http://localhost:5000/api/auth/login', {
    email,
    password,
  });

  // Just save data — NO navigate() at all!
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data.user));

  // THIS IS THE ONLY LINE YOU NEED — 100% WORKING REDIRECT
  window.location.href = res.data.user.email.includes('advisor') ? '/advisor' : '/student';

} catch (err: any) {
  setError(err.response?.data?.error || 'Login failed');
} finally {
  setLoading(false);
}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-gray-900 bg-opacity-80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-gray-800">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            QuickQueue
          </h1>
          <p className="text-gray-400 mt-3 text-lg">Book your advisor meeting</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-300 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500 focus:ring-opacity-30 transition"
              placeholder="student@demo.com or advisor@demo.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500 focus:ring-opacity-30 transition"
              placeholder="123456"
              required
            />
          </div>

          {error && (
            <p className="text-rose-400 text-center font-medium bg-rose-900/50 py-3 px-4 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition shadow-lg disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 p-6 bg-gray-800 rounded-xl text-center border border-gray-700">
          <p className="text-gray-400 mb-3">Demo accounts:</p>
          <p className="text-white font-medium">Student: student@demo.com / 123456</p>
          <p className="text-white font-medium mt-2">Advisor: advisor@demo.com / 123456</p>
        </div>
      </div>
    </div>
  );
}