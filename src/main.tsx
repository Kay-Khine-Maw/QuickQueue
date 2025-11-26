// src/main.tsx  ← FINAL VERSION THAT WORKS 100%
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StudentBookingsPage from './pages/StudentBookingsPage';
import AdvisorDashboard from './pages/AdvisorDashboard';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Always show login first */}
        <Route path="/" element={<LoginPage />} />

        {/* Student Dashboard */}
        <Route
          path="/student"
          element={
            localStorage.getItem('token') && 
            !JSON.parse(localStorage.getItem('user') || '{}')?.email?.includes('advisor')
              ? <StudentBookingsPage />
              : <Navigate to="/" replace />
          }
        />

        {/* Advisor Dashboard */}
        <Route
          path="/advisor"
          element={
            localStorage.getItem('token') && 
            JSON.parse(localStorage.getItem('user') || '{}')?.email?.includes('advisor')
              ? <AdvisorDashboard />
              : <Navigate to="/" replace />
          }
        />

        {/* Any other URL → back to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);