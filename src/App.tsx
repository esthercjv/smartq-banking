import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Landmark, Lock } from 'lucide-react';
import { supabase } from './supabaseClient';

// Common screens
import LoginScreen from './components/LoginScreen';
import StaffLoginScreen from './components/StaffLoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';

// Core Role-Protected Dashboards & Shared UI
import CustomerDashboard from './components/CustomerDashboard';
import QueueRegistration from './components/QueueRegistration';
import StatusMonitoring from './components/StatusMonitoring';
import QueueControlCenter from './components/QueueControlCenter';
import AdminDashboard from './components/AdminDashboard';
import MyProfile from './components/MyProfile';

// Secondary admin/manager sub-pages
import {
  AnalyticsScreen,
  ReportsScreen,
  CounterManagementScreen,
  ServiceManagementScreen,
  UserManagementScreen,
  WaitTimePredictionScreen,
  SystemDataScreen,
  SystemIntegrationScreen
} from './components/AdminSubPages';

// ─── Protected Route ────────────────────────────────────────────────────────
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        setAllowed(false);
        setChecking(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error || !profile) {
        setAllowed(false);
        setChecking(false);
        return;
      }

      const role = profile.role as string;

      if (!allowedRoles || allowedRoles.includes(role)) {
        setAllowed(true);
      } else {
        setAllowed(false);
      }

      setChecking(false);
    };

    verify();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0A1F44] flex items-center justify-center">
        <div className="text-white/50 text-sm font-medium animate-pulse">Verifying session...</div>
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
// ─── Auth Layout ─────────────────────────────────────────────────────────────
interface AuthLayoutProps {
  children: React.ReactNode;
  isStaff?: boolean;
}

function AuthLayout({ children, isStaff }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#0A1F44] flex relative overflow-hidden font-sans">
      {/* Subtle Geometric Overlay */}
      <div className="absolute inset-0 geometric-overlay pointer-events-none" />

      {/* Left Branding Section */}
      <div className="hidden md:flex md:w-[400px] bg-[#0C2755] flex-col justify-between p-12 shrink-0 border-r border-white/5 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-secondary-container rounded-xl flex items-center justify-center shadow-lg">
              <Landmark className="w-6 h-6 text-[#0A1F44]" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Smart<span className="text-secondary-container">Q</span>
            </span>
          </div>

          {isStaff ? (
            <>
              <div className="w-10 h-10 bg-secondary-container rounded-xl flex items-center justify-center shadow-lg mb-6">
                <Lock className="w-5 h-5 text-[#0A1F44]" />
              </div>
              <h1 className="text-4xl font-extrabold text-white leading-tight mb-2">
                Staff Portal
              </h1>
              <span className="text-[#fed977] text-xs font-bold uppercase tracking-wider block mb-5">
                Authorized Personnel Only
              </span>
              <p className="text-blue-100/60 font-light text-sm leading-relaxed">
                This portal is restricted to authorized SmartQ Banking employees only. Unauthorized access is strictly prohibited.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-extrabold text-white leading-tight mb-5">
                Advanced Banking <br />
                <span className="text-secondary-container">Queue Management</span>
              </h1>
              <p className="text-blue-100/60 font-light text-sm leading-relaxed">
                Enhance operational efficiency and customer satisfaction with our real-time queue orchestration platform.
              </p>
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs text-blue-100/40 uppercase font-semibold tracking-wider">
            <span className="w-5 h-5 rounded-full border border-blue-100/20 flex items-center justify-center text-[10px] text-secondary-container">✓</span>
            <span>ISO 27001 Certified Security</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-blue-100/40 uppercase font-semibold tracking-wider">
            <span className="w-5 h-5 rounded-full border border-blue-100/20 flex items-center justify-center text-[10px] text-secondary-container">✓</span>
            <span>Real-time Analytics Dashboard</span>
          </div>
        </div>
      </div>

      {/* Right Form Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 self-center h-full min-h-screen">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        {children}
        <div className="absolute bottom-6 text-blue-100/25 text-[10px] uppercase tracking-[0.2em] font-bold select-none text-center">
          SmartQ Banking Suite v4.2.1-Enterprise
        </div>
      </div>
    </div>
  );
}

// ─── App Routes ───────────────────────────────────────────────────────────────
function AppRoutes() {
  const navigate = useNavigate();
  return (
    <Routes>
      {/* Entrance paths */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginScreen />
          </AuthLayout>
        }
      />

      <Route
        path="/staff-login"
        element={
          <AuthLayout isStaff={true}>
            <StaffLoginScreen />
          </AuthLayout>
        }
      />

      <Route
        path="/register"
        element={
          <AuthLayout>
            <RegisterScreen onNavigate={(p) => navigate(p)} />
          </AuthLayout>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <AuthLayout>
            <ForgotPasswordScreen onNavigate={(p) => navigate(p)} />
          </AuthLayout>
        }
      />

     {/* Customer-only routes */}
<Route
  path="/customer-dashboard"
  element={
    <ProtectedRoute allowedRoles={['customer']}>
      <CustomerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/queue-registration"
  element={
    <ProtectedRoute allowedRoles={['customer']}>
      <QueueRegistration />
    </ProtectedRoute>
  }
/>

<Route
  path="/status-monitoring"
  element={
    <ProtectedRoute allowedRoles={['customer', 'staff', 'manager', 'admin']}>
      <StatusMonitoring />
    </ProtectedRoute>
  }
/>

{/* Wait Time Prediction */}
<Route
  path="/wait-time-prediction"
  element={
    <ProtectedRoute allowedRoles={['customer', 'staff', 'manager', 'admin']}>
      <WaitTimePredictionScreen />
    </ProtectedRoute>
  }
/>

{/* Staff-only routes */}
<Route
  path="/queue-control-center"
  element={
    <ProtectedRoute allowedRoles={['staff']}>
      <QueueControlCenter />
    </ProtectedRoute>
  }
/>

{/* Manager + Admin routes */}
<Route
  path="/admin-dashboard"
  element={
    <ProtectedRoute allowedRoles={['manager', 'admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/analytics"
  element={
    <ProtectedRoute allowedRoles={['manager', 'admin', 'staff']}>
      <AnalyticsScreen />
    </ProtectedRoute>
  }
/>

<Route
  path="/reports"
  element={
    <ProtectedRoute allowedRoles={['manager', 'admin']}>
      <ReportsScreen />
    </ProtectedRoute>
  }
/>

<Route
  path="/counter-management"
  element={
    <ProtectedRoute allowedRoles={['manager', 'admin']}>
      <CounterManagementScreen />
    </ProtectedRoute>
  }
/>

<Route
  path="/service-management"
  element={
    <ProtectedRoute allowedRoles={['manager', 'admin']}>
      <ServiceManagementScreen />
    </ProtectedRoute>
  }
/>

<Route
  path="/user-management"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <UserManagementScreen />
    </ProtectedRoute>
  }
/>

<Route
  path="/system-data-management"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <SystemDataScreen />
    </ProtectedRoute>
  }
/>

<Route
  path="/system-integration"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <SystemIntegrationScreen />
    </ProtectedRoute>
  }
/>
      {/* Shared route */}
      <Route path="/my-profile" element={
        <ProtectedRoute>
          <MyProfile />
        </ProtectedRoute>
      } />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}