// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Pages
import Landing           from './pages/Landing';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import StudentDashboard  from './pages/student/Dashboard';
import RoadmapPage       from './pages/student/Roadmap';
import MentorsPage       from './pages/student/Mentors';
import SeniorDashboard   from './pages/senior/Dashboard';
import AdminDashboard    from './pages/admin/Dashboard';
import EventsPage        from './pages/Events';
import MessagesPage      from './pages/Messages';
import ProfilePage       from './pages/Profile';

// Protected route wrapper (auth check + role check + app shell)
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '40px', color: 'var(--muted)' }}>Loading...</div>;
  if (!user)   return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return <Layout>{children}</Layout>;
};

const App = () => (
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/"         element={<Landing />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/student/roadmap" element={
          <ProtectedRoute roles={['student']}><RoadmapPage /></ProtectedRoute>
        } />
        <Route path="/roadmap" element={
          <ProtectedRoute roles={['student']}><RoadmapPage /></ProtectedRoute>
        } />
        <Route path="/student/mentors" element={
          <ProtectedRoute roles={['student']}><MentorsPage /></ProtectedRoute>
        } />

        {/* Shared Routes (all roles) */}
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
        <Route path="/events" element={
          <ProtectedRoute><EventsPage /></ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute><MessagesPage /></ProtectedRoute>
        } />

        {/* Senior Routes */}
        <Route path="/senior/dashboard" element={
          <ProtectedRoute roles={['senior']}><SeniorDashboard /></ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
        } />

        {/* Auto-redirect after login based on role */}
        <Route path="/app" element={<RoleRedirect />} />
        <Route path="*"    element={<Navigate to="/" />} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  </GoogleOAuthProvider>
);

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  const redirects = { student:'/student/dashboard', senior:'/senior/dashboard', admin:'/admin/dashboard' };
  return <Navigate to={redirects[user.role] || '/'} />;
};

export default App;
