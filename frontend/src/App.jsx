import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import CreateReport from './pages/CreateReport/CreateReport';
import Login from './pages/Login/Login';
import Reports from './pages/Reports/Reports';
import TenderAnalysis from './pages/Analytics/TenderAnalysis';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  // If roles are specified and user's role isn't in the list, redirect to their main page
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'JE' ? '/create-report' : '/'} />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard only for SSE */}
          <Route index element={
            <ProtectedRoute roles={['SSE']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Create Report for both */}
          <Route path="create-report" element={<CreateReport />} />

          {/* Restricted SSE Sections */}
          <Route path="reports" element={
            <ProtectedRoute roles={['SSE']}>
              <Reports />
            </ProtectedRoute>
          } />

          <Route path="analytics" element={
            <ProtectedRoute roles={['SSE']}>
              <TenderAnalysis />
            </ProtectedRoute>
          } />

          <Route path="team" element={
            <ProtectedRoute roles={['SSE']}>
              <div>Team Page (Coming Soon)</div>
            </ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
