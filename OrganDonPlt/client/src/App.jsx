import { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import GradientBackground from './components/GradientBackground';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import OrganRequestsPage from './pages/OrganRequests';
import TrackingPage from './pages/Tracking';
import AdminPage from './pages/Admin';
import HomePage from './pages/Home';
import DonorRegistrationPage from './pages/DonorRegistration';
import RecipientRegistrationPage from './pages/RecipientRegistration';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, ready, user } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950">
        <div className="glass-panel flex flex-col items-center gap-4 rounded-3xl px-10 py-12 text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand-500/40 border-t-brand-500" />
          <p className="text-sm text-white/70">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950">
      <GradientBackground />
      <div className="mx-auto flex min-h-screen max-w-full gap-0 lg:gap-6 px-2 sm:px-4 py-4 sm:py-6">
        {isAuthenticated ? (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        ) : null}
        <main className={`flex-1 w-full lg:w-auto ${isAuthenticated ? 'pb-8 sm:pb-12 lg:pb-16' : 'pb-0'}`}>
          {isAuthenticated ? (
            <>
              <TopBar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
              <div className="mt-4 sm:mt-6 space-y-6 sm:space-y-8 lg:space-y-10">
                <Routes>
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <ProtectedRoute roles={['admin']}>
                        <RegisterPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/organ-requests"
                    element={
                      <ProtectedRoute>
                        <OrganRequestsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tracking"
                    element={
                      <ProtectedRoute>
                        <TrackingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute roles={['admin', 'doctor']}>
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </>
          ) : (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/donor-registration" element={<DonorRegistrationPage />} />
              <Route path="/recipient-registration" element={<RecipientRegistrationPage />} />
              <Route path="/recipient-registration" element={<RecipientRegistrationPage />} />
              <Route
                path="/login"
                element={<LoginPage />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
