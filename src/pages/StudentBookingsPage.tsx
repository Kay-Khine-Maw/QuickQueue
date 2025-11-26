// src/pages/StudentBookingsPage.tsx
// FULLY WORKING: Book + View + Edit + Delete + Advisor Dropdown

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Clock, User, CheckCircle, XCircle, LogOut, Edit2, Trash2 } from 'lucide-react';

const TIME_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30'];

const ADVISORS = [
  { id: '1', name: 'Dr. Sarah Johnson', department: 'Computer Science' },
  { id: '2', name: 'Prof. Michael Chen', department: 'Data Science' },
  { id: '3', name: 'Dr. Lisa Wong', department: 'Cybersecurity' },
];

export default function StudentBookingsPage() {
  const [activeTab, setActiveTab] = useState<'book' | 'my'>('book');
  
  // Fake bookings with full data
  const [bookings, setBookings] = useState([
    { id: 1, advisorId: '1', advisorName: 'Dr. Sarah Johnson', date: '2025-12-05', time: '10:30', reason: 'Need help with React project', status: 'pending' },
    { id: 2, advisorId: '2', advisorName: 'Prof. Michael Chen', date: '2025-12-07', time: '15:00', reason: 'Final project proposal review', status: 'approved' },
    { id: 3, advisorId: '3', advisorName: 'Dr. Lisa Wong', date: '2025-12-03', time: '11:00', reason: 'Database design consultation', status: 'rejected' },
  ]);

  // Form states
  const [selectedAdvisor, setSelectedAdvisor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  
  // Edit modal states
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [editAdvisor, setEditAdvisor] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editReason, setEditReason] = useState('');

  const [toast, setToast] = useState<{msg: string; type: 'success'|'error'} | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdvisor || !selectedDate || !selectedTime || !reason.trim()) {
      showToast('Fill all fields', 'error');
      return;
    }

    const newBooking = {
      id: Date.now(),
      advisorId: selectedAdvisor,
      advisorName: ADVISORS.find(a => a.id === selectedAdvisor)?.name || '',
      date: selectedDate,
      time: selectedTime,
      reason: reason.trim(),
      status: 'pending' as const
    };

    setBookings(prev => [newBooking, ...prev]);
    setSelectedAdvisor(''); setSelectedDate(''); setSelectedTime(''); setReason('');
    showToast('Booking created!');
  };

  const handleDelete = (id: number) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    showToast('Booking deleted');
  };

  const openEdit = (booking: any) => {
    setEditingBooking(booking);
    setEditAdvisor(booking.advisorId);
    setEditDate(booking.date);
    setEditTime(booking.time);
    setEditReason(booking.reason);
  };

  const handleEdit = () => {
    if (!editAdvisor || !editDate || !editTime || !editReason.trim()) {
      showToast('Fill all fields', 'error');
      return;
    }

    setBookings(prev => prev.map(b => 
      b.id === editingBooking.id 
        ? { ...b, advisorId: editAdvisor, advisorName: ADVISORS.find(a => a.id === editAdvisor)?.name || '', date: editDate, time: editTime, reason: editReason }
        : b
    ));

    setEditingBooking(null);
    showToast('Booking updated!');
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
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            QuickQueue
          </h1>
          <button className="flex items-center gap-3 bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold text-lg transition">
            <LogOut /> Logout
          </button>
        </div>

        <h2 className="text-4xl font-bold text-center mb-12">
          Welcome back, <span className="text-cyan-300">Ali Khan</span>
        </h2>

        {/* Tabs */}
        <div className="flex gap-4 mb-10 flex-wrap justify-center">
          <button onClick={() => setActiveTab('book')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition ${activeTab === 'book' ? 'bg-purple-600 shadow-lg' : 'bg-white/10 hover:bg-white/20'}`}>
            Book Session
          </button>
          <button onClick={() => setActiveTab('my')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition ${activeTab === 'my' ? 'bg-purple-600 shadow-lg' : 'bg-white/10 hover:bg-white/20'}`}>
            My Bookings ({bookings.length})
          </button>
        </div>

        {/* BOOK FORM */}
        {activeTab === 'book' && (
          <motion.div className="bg-black/40 backdrop-blur-xl rounded-2xl p-10 border border-white/20 shadow-2xl">
            <h2 className="text-4xl font-black text-center mb-10">Book a Session</h2>

            <form onSubmit={handleBook} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xl font-bold mb-3 block">Select Advisor</label>
                  <select value={selectedAdvisor} onChange={e => setSelectedAdvisor(e.target.value)}
                    className="w-full px-6 py-4 bg-black/50 rounded-xl text-lg" required>
                    <option value="">Choose Advisor</option>
                    {ADVISORS.map(a => (
                      <option key={a.id} value={a.id}>{a.name} • {a.department}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xl font-bold mb-3 block">Date</label>
                  <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')} required
                    className="w-full px-6 py-4 bg-black/50 rounded-xl text-lg" />
                </div>

                <div>
                  <label className="text-xl font-bold mb-3 block">Time</label>
                  <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)}
                    className="w-full px-6 py-4 bg-black/50 rounded-xl text-lg" required>
                    <option value="">Choose Time</option>
                    {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xl font-bold mb-3 block">Reason</label>
                  <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4} required
                    placeholder="What do you need help with?"
                    className="w-full px-6 py-4 bg-black/50 rounded-xl text-lg resize-none" />
                </div>
              </div>

              <button type="submit"
                className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-3xl font-black rounded-2xl transition">
                Book Session
              </button>
            </form>
          </motion.div>
        )}

        {/* MY BOOKINGS */}
        {activeTab === 'my' && (
          <div className="grid gap-6">
            {bookings.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl font-bold text-gray-400">No bookings yet</p>
              </div>
            ) : (
              bookings.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-purple-400 transition-all duration-300 shadow-2xl"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-purple-600/30 rounded-2xl">
                        <User size={48} className="text-purple-300" />
                      </div>
                      <div>
                        <p className="text-3xl font-black text-purple-300">{b.advisorName}</p>
                        <p className="text-xl text-gray-300 mt-2 flex items-center gap-3">
                          <Calendar size={22} /> {b.date} <span className="mx-2">•</span> <Clock size={22} /> {b.time}
                        </p>
                        <p className="text-lg text-gray-300 mt-4 italic leading-relaxed">"{b.reason}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-10 py-4 rounded-xl font-black text-xl ${b.status === 'approved' ? 'bg-emerald-600' : b.status === 'rejected' ? 'bg-rose-600' : 'bg-amber-600'}`}>
                        {b.status.toUpperCase()}
                      </span>

                      <div className="flex gap-3">
                        <button onClick={() => openEdit(b)}
                          className="p-4 bg-blue-600 hover:bg-blue-700 rounded-xl transition">
                          <Edit2 size={20} />
                        </button>
                        <button onClick={() => handleDelete(b.id)}
                          className="p-4 bg-rose-600 hover:bg-rose-700 rounded-xl transition">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* EDIT MODAL */}
        <AnimatePresence>
          {editingBooking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50 p-8">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-10 max-w-2xl w-full border border-white/30 shadow-2xl">
                <h3 className="text-4xl font-black text-center mb-8">Edit Booking</h3>

                <div className="space-y-6">
                  <select value={editAdvisor} onChange={e => setEditAdvisor(e.target.value)}
                    className="w-full px-6 py-4 bg-black/50 rounded-xl text-lg">
                    {ADVISORS.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>

                  <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
                    className="w-full px-6 py-4 bg-black/50 rounded-xl text-lg" />

                  <select value={editTime} onChange={e => setEditTime(e.target.value)}
                    className="w-full px-6 py-4 bg-black/50 rounded-xl text-lg">
                    {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                  </select>

                  <textarea value={editReason} onChange={e => setEditReason(e.target.value)} rows={4}
                    className="w-full px-6 py-4 bg-black/50 rounded-xl text-lg resize-none" />
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={handleEdit}
                    className="flex-1 py-5 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-black text-xl transition">
                    Save Changes
                  </button>
                  <button onClick={() => setEditingBooking(null)}
                    className="flex-1 py-5 bg-gray-600 hover:bg-gray-700 rounded-xl font-black text-xl transition">
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}