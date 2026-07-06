import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BusinessStateProvider } from './contexts/BusinessContext';
import { AuthStateProvider, useAuthState } from './contexts/AuthContext';
import { ThemeStateProvider } from './contexts/ThemeContext';
import { AnimatePresence } from 'framer-motion';

// Pages & Layout imports
import { LandingPage } from './pages/LandingPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardView } from './pages/DashboardView';
import { ReportsView } from './pages/ReportsView';
import { SettingsView } from './pages/SettingsView';
import { SimulationView } from './pages/SimulationView';
import { AnalyticsCenterView } from './pages/AnalyticsCenterView';
import { LoginView } from './pages/LoginView';

// Components imports
import { BusinessWorld } from './components/BusinessWorld';
import { SimulationPanel } from './components/SimulationPanel';

import { AICEO } from './components/AICEO';
import { CustomCursor } from './components/CustomCursor';

// Initialize TanStack React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthState();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  return (
    <>
      <CustomCursor />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public landing marketing page */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginView />} />
          
          {/* Secured/App workspace routes wrapped in the modular Sidebar/Header Layout */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardView />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/business-world" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <BusinessWorld />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/simulation" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SimulationView />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AnalyticsCenterView />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ai-ceo" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AICEO />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ReportsView />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SettingsView />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* Fallback redirector */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeStateProvider>
        <AuthStateProvider>
          <BusinessStateProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </BusinessStateProvider>
        </AuthStateProvider>
      </ThemeStateProvider>
    </QueryClientProvider>
  );
}
