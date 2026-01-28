import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { ReportProvider } from './context/ReportContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ReportProvider>
        <App />
      </ReportProvider>
    </AuthProvider>
  </StrictMode>,
);
