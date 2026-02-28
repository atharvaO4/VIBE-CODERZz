// src/services/api.js
// Central API service — all backend calls go through here
import axios from 'axios';

const api = axios.create({ 
  // This points to your live Railway backend URL
  baseURL: 'https://vibe-coderzz-production.up.railway.app/api' 
});

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('clarix_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── AUTH ────────────────────────────────
export const register = (data)       => api.post('/auth/register', data);
export const login    = (data)       => api.post('/auth/login', data);
export const getMe    = ()           => api.get('/auth/me');

// ── ROADMAP ─────────────────────────────
export const getRoadmap        = ()           => api.get('/roadmap');
export const toggleTask        = (taskId)     => api.patch(`/roadmap/task/${taskId}`);
export const regenerateRoadmap = ()           => api.post('/roadmap/regenerate');

// ── MENTORS ─────────────────────────────
export const getSeniors        = ()                     => api.get('/mentors');
export const sendMentorRequest = (seniorId, message)    => api.post('/mentors/request', { seniorId, message });
export const getMyRequests     = ()                     => api.get('/mentors/my-requests');
export const getIncomingReqs   = ()                     => api.get('/mentors/incoming');
export const updateRequest     = (id, status)           => api.patch(`/mentors/request/${id}`, { status });

// ── EVENTS ──────────────────────────────
export const getEvents    = ()     => api.get('/events');
export const createEvent  = (data) => api.post('/events', data);
export const deleteEvent  = (id)   => api.delete(`/events/${id}`);

// ── MESSAGES ────────────────────────────
export const getMessages  = (userId)       => api.get(`/messages/${userId}`);
export const sendMessage  = (to, text)     => api.post('/messages', { to, text });

// ── USERS ───────────────────────────────
export const updateProfile = (data)  => api.put('/users/me', data);
export const getAllUsers    = ()      => api.get('/users');

export default api;