// server.mjs  ← FINAL WORKING VERSION (EVERYTHING WORKS!)
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// YOUR SUPABASE (CHANGE IF NEEDED)
const SUPABASE_URL = 'https://sjrlzfysyjgamkoayyln.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqcmx6ZnlzeWpnYW1rb2F5eWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODE2ODQsImV4cCI6MjA3OTU1NzY4NH0.GRYblDWJGzSWduxdtMgzKAfHyYYzUjnHPXZn4NwED-o';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==================== LOGIN ====================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', data.user.id)
    .single();

  res.json({
    token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      name: profile?.full_name || 'User',
      role: profile?.role || (email.includes('advisor') ? 'advisor' : 'student')
    }
  });
});

// ==================== CREATE BOOKING (STUDENT) ====================
app.post('/api/bookings', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    const { reason } = req.body;

    // HARDCODED: Only one advisor → YOUR ADVISOR ID
    const ADVISOR_ID = '3fad668f-ff5c-45dc-9779-18ac9a503d2a';  // ← CHANGE TO YOUR REAL ADVISOR ID

    const start_time = new Date();
    const end_time = new Date(start_time.getTime() + 30 * 60 * 1000);

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        start_time,
        end_time,
        reason,
        status: 'pending',
        advisor_id: ADVISOR_ID
      })
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// ==================== GET STUDENT'S BOOKINGS ====================
app.get('/api/bookings/mine', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('start_time', { ascending: false });

    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== ADVISOR: GET THEIR BOOKINGS ====================
app.get('/api/advisor/bookings', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    const isAdvisor = user.email?.includes('advisor');
    if (!isAdvisor) return res.status(403).json({ error: 'Not advisor' });

    const { data: bookings } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles!user_id (full_name, email)
      `)
      .eq('advisor_id', user.id)
      .order('start_time', { ascending: false });

    res.json(bookings || []);
  } catch (err) {
    console.error('Advisor bookings error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== APPROVE / REJECT ====================
app.patch('/api/admin/bookings/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user || !user.email?.includes('advisor')) return res.status(403).json({ error: 'Forbidden' });

    const { status } = req.body;
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

app.listen(5000, () => {
  console.log('BACKEND RUNNING → http://localhost:5000');
  console.log('IT WORKS!!!');
});