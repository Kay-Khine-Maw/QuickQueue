// src/pages/AdvisorDashboard.tsx
// PURE UI ONLY — NO BACKEND — JUST TO SEE THE BEAUTIFUL DESIGN

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, XCircle, LogOut } from 'lucide-react';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function AdvisorDashboard() {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Fake data — just to see the design
  const fakeBookings = [
    {
      id: 1,
      studentName: "Ali Khan",
      date: "2025-12-05",
      time: "10:30",
      reason: "Need urgent help with React + TypeScript final project",
      status: "pending" as const
    },
    {
      id: 2,
      studentName: "Ayesha Ahmed",
      date: "2025-12-03",
      time: "15:00",
      reason: "Final year project proposal review and feedback",
      status: "approved" as const
    },
    {
      id: 3,
      studentName: "Omar Farooq",
      date: "2025-12-07",
      time: "14:30",
      reason: "Database design consultation for capstone",
      status: "pending" as const
    },
    {
      id: 4,
      studentName: "Fatima Zahra",
      date: "2025-11-28",
      time: "11:00",
      reason: "Already discussed — follow-up meeting",
      status: "rejected" as const
    }
  ];

  const filteredBookings = filter === 'all' 
    ? fakeBookings 
    : fakeBookings.filter(b => b.status === filter);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 to-pink-900 text-white p-8">
      <div className="max-w-6xl mx-auto">

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
              className={`fixed top-8 right-8 z-50 px-8 py-5 rounded-2xl font-bold text-lg shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
              {toast.type === 'success' ? <CheckCircle /> : <XCircle />}
              {toast.type === 'success' ? 'Check' : 'XCircle'} {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Advisor Portal
          </h1>
          <button className="flex items-center gap-3 bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold text-lg transition">
            <LogOut /> Logout
          </button>
        </div>

        <h2 className="text-4xl font-bold text-center mb-12">
          Welcome back, <span className="text-cyan-300">Dr. Sarah Johnson</span>
        </h2>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-10 flex-wrap justify-center">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition ${filter === tab ? 'bg-purple-600 shadow-lg' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({fakeBookings.filter(b => tab === 'all' || b.status === tab).length})
            </button>
          ))}
        </div>

        {/* Beautiful Booking Cards */}
        <div className="grid gap-6">
          {filteredBookings.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-purple-400 transition-all duration-300 shadow-2xl"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-purple-600/30 rounded-2xl">
                    <User size={48} className="text-purple-300" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-purple-300">{b.studentName}</p>
                    <p className="text-xl text-gray-300 mt-2 flex items-center gap-3">
                      <Calendar size={22} /> {b.date} <span className="mx-2">•</span> <Clock size={22} /> {b.time}
                    </p>
                    <p className="text-lg text-gray-300 mt-4 italic leading-relaxed max-w-2xl">"{b.reason}"</p>
                  </div>
                </div>

                <div className="text-right">
                  {b.status === 'pending' ? (
                    <div className="flex gap-4">
                      <button onClick={() => showToast('Approved!', 'success')}
                        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold text-lg transition shadow-lg">
                        Approve
                      </button>
                      <button onClick={() => showToast('Rejected', 'success')}
                        className="px-8 py-4 bg-rose-600 hover:bg-rose-700 rounded-xl font-bold text-lg transition shadow-lg">
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`px-10 py-4 rounded-xl font-black text-xl ${b.status === 'approved' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                      {b.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}