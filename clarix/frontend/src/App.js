// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Landing        from './pages/Landing';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import StudentDashboard from './pages/student/Dashboard';
import RoadmapPage    from './pages/student/Roadmap';
import MentorsPage    from './pages/student/Mentors';
import SeniorDashboard from './pages/senior/Dashboard';
import AdminDashboard  from './pages/admin/Dashboard';

// Protected route wrapper
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user)   return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const App = () => (
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
        <Route path="/student/mentors" element={
          <ProtectedRoute roles={['student']}><MentorsPage /></ProtectedRoute>
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
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  const redirects = { student:'/student/dashboard', senior:'/senior/dashboard', admin:'/admin/dashboard' };
  return <Navigate to={redirects[user.role] || '/'} />;
};

export default App;
