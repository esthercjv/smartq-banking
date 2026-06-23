import { supabase } from '../supabaseClient';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Landmark, 
  LogOut, 
  Settings as SettingsIcon,
  LayoutDashboard,
  Activity,
  Bell,
  TrendingUp,
  FileText,
  Users2,
  Sliders,
  Cpu,
  Database,
  Link,
  Download,
  Terminal,
  ShieldCheck,
  Timer,
  UserCheck,
  Clock,
  Sparkles,
  Trash2,
  Star,
  Users,
  TrendingDown,
  Play,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Briefcase,
  Calendar,
  Plus,
  Edit,
  User,
  UserX,
  AlertTriangle,
  X,
  Layout,
  Check,
  Save,
  Info,
  RefreshCw,
  Eye,
  EyeOff,
  Brain
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
}

export function AdminSidebar({ activeItem }: SidebarProps) {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('customer');

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;
      if (!session) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role) {
        setUserRole(profile.role);
      }
    });
  }, []);

  const isAdmin = userRole === 'admin';

  const handleLogout = async () => {
  await supabase.auth.signOut();
  localStorage.clear();
  navigate('/login');
};

  if (userRole === 'customer') {
    return (
      <aside className="fixed left-0 top-0 h-full w-[250px] bg-primary-container shadow-lg flex flex-col p-4 z-50 text-white font-sans">
        <div className="mb-8 px-2 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center shadow-lg">
              <Landmark className="w-6 h-6 text-[#0A1F44]" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Smart<span className="text-secondary-container">Q</span>
            </span>
          </div>
          <p className="text-on-primary-container text-[10px] font-semibold mt-1 tracking-wider opacity-60 uppercase">
            Enterprise Queue Management
          </p>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          <button 
            type="button"
            onClick={() => navigate('/customer-dashboard')}
            className={`flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left transition-all active:scale-[0.98] cursor-pointer ${
              activeItem === 'customer-dashboard' ? 'text-on-secondary-container bg-secondary-container shadow-md font-semibold' : 'text-blue-100/60 hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </button>

          <button 
            type="button"
            onClick={() => navigate('/queue-registration')}
            className={`flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left transition-all active:scale-[0.98] cursor-pointer ${
              activeItem === 'queue-registration' ? 'text-on-secondary-container bg-secondary-container shadow-md font-semibold' : 'text-blue-100/60 hover:bg-white/5'
            }`}
          >
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>Queue Registration</span>
          </button>

          <button 
            type="button"
            onClick={() => navigate('/status-monitoring')}
            className={`flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left transition-all active:scale-[0.98] cursor-pointer ${
              activeItem === 'status-monitoring' ? 'text-on-secondary-container bg-secondary-container shadow-md font-semibold' : 'text-blue-100/60 hover:bg-white/5'
            }`}
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span>Status Monitoring</span>
          </button>

          <button 
            type="button"
            onClick={() => navigate('/wait-time-prediction')}
            className={`flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left transition-all active:scale-[0.98] cursor-pointer ${
              activeItem === 'wait-time-prediction' ? 'text-on-secondary-container bg-secondary-container shadow-md font-semibold hover:text-on-secondary-container' : 'text-blue-100/60 hover:bg-white/5'
            }`}
          >
            <Timer className="w-4 h-4 shrink-0" />
            <span>Wait Time Prediction</span>
          </button>

          <div className="mt-auto border-t border-on-primary-container/20 pt-4 flex flex-col gap-2">
            <button 
              type="button"
              onClick={() => navigate('/my-profile')}
              className={`flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left transition-colors cursor-pointer ${
                activeItem === 'my-profile' ? 'text-on-secondary-container bg-secondary-container shadow-md font-semibold' : 'text-blue-100/60 hover:bg-white/5'
              }`}
            >
              <SettingsIcon className="w-4 h-4 shrink-0" />
              <span>My Profile</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-error-container hover:bg-error text-on-error-container hover:text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Portal</span>
            </button>
          </div>
        </nav>
      </aside>
    );
  }

  if (userRole === 'staff') {
    return (
      <aside className="fixed left-0 top-0 h-full w-[250px] bg-primary-container shadow-lg flex flex-col p-4 z-50 text-white font-sans">
        <div className="mb-8 px-2 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center shadow-lg">
              <Landmark className="w-6 h-6 text-[#0A1F44]" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Smart<span className="text-secondary-container">Q</span>
            </span>
          </div>
          <p className="text-on-primary-container text-[10px] font-semibold mt-1 tracking-wider opacity-60 uppercase">
            Agent Terminal
          </p>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          <button 
            type="button"
            onClick={() => navigate('/queue-control-center')}
            className={`flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left transition-all active:scale-[0.98] cursor-pointer ${
              activeItem === 'queue-control-center' ? 'text-on-secondary-container bg-secondary-container shadow-md font-semibold' : 'text-blue-100/60 hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Queue Control Center</span>
          </button>

          <button 
            type="button"
            onClick={() => navigate('/status-monitoring')}
            className={`flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left transition-all active:scale-[0.98] cursor-pointer ${
              activeItem === 'status-monitoring' ? 'text-on-secondary-container bg-secondary-container shadow-md font-semibold' : 'text-blue-100/60 hover:bg-white/5'
            }`}
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span>Status Monitoring</span>
          </button>

          <button 
            type="button"
            onClick={() => navigate('/analytics')}
            className={`flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left transition-all active:scale-[0.98] cursor-pointer ${
              activeItem === 'analytics' ? 'text-on-secondary-container bg-secondary-container shadow-md font-semibold' : 'text-blue-100/60 hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span>Analytics</span>
          </button>

          <button 
            type="button"
            onClick={() => navigate('/wait-time-prediction')}
            className={`flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left transition-all active:scale-[0.98] cursor-pointer ${
              activeItem === 'wait-time-prediction' ? 'text-on-secondary-container bg-secondary-container shadow-md font-semibold hover:text-on-secondary-container' : 'text-blue-100/60 hover:bg-white/5'
            }`}
          >
            <Timer className="w-4 h-4 shrink-0" />
            <span>Wait Time Prediction</span>
          </button>

          <div className="mt-auto border-t border-on-primary-container/20 pt-4 flex flex-col gap-2">
            <button 
              type="button"
              onClick={() => navigate('/my-profile')}
              className={`flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left transition-colors cursor-pointer ${
                activeItem === 'my-profile' ? 'text-on-secondary-container bg-secondary-container shadow-md font-semibold' : 'text-blue-100/60 hover:bg-white/5'
              }`}
            >
              <SettingsIcon className="w-4 h-4 shrink-0" />
              <span>My Profile</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-error-container hover:bg-error text-on-error-container hover:text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Close Terminal</span>
            </button>
          </div>
        </nav>
      </aside>
    );
  }

  // manager or admin
  return (
    <aside className="fixed left-0 top-0 h-full w-[250px] bg-primary-container shadow-lg flex flex-col p-4 z-50 text-white font-sans">
      <div className="mb-8 px-2 flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center shadow-lg">
            <Landmark className="w-6 h-6 text-[#0A1F44]" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Smart<span className="text-secondary-container">Q</span>
          </span>
        </div>
        <p className="text-on-primary-container text-[10px] font-semibold mt-1 tracking-wider opacity-60 uppercase">
          {isAdmin ? 'Admin Panel' : 'Manager Panel'}
        </p>
      </div>

      <nav className="flex flex-col gap-1 flex-grow overflow-y-auto pr-1">
        <button 
          onClick={() => navigate('/admin-dashboard')}
          className={`flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all ${
            activeItem === 'dashboard' ? 'text-on-secondary-container bg-secondary-container shadow-sm font-semibold' : 'text-blue-100/60 hover:bg-white/5'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span>Admin Dashboard</span>
        </button>

        <button 
          onClick={() => navigate('/status-monitoring')}
          className="flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all text-blue-100/60 hover:bg-white/5"
        >
          <Activity className="w-4 h-4 shrink-0" />
          <span>Status Monitoring</span>
        </button>

        {/* Shared Links */}
        <button 
          onClick={() => navigate('/analytics')}
          className={`flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all ${
            activeItem === 'analytics' ? 'text-on-secondary-container bg-secondary-container shadow-sm font-semibold' : 'text-blue-100/60 hover:bg-white/5'
          }`}
        >
          <span>Analytics</span>
        </button>

        <button 
          onClick={() => navigate('/reports')}
          className={`flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all ${
            activeItem === 'reports' ? 'text-on-secondary-container bg-secondary-container shadow-sm font-semibold' : 'text-blue-100/60 hover:bg-white/5'
          }`}
        >
          <span>Reports</span>
        </button>

        {/* Admin only */}
        {isAdmin && (
          <>
            <button 
              onClick={() => navigate('/counter-management')}
              className={`flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all ${
                activeItem === 'counter-management' ? 'text-on-secondary-container bg-secondary-container shadow-sm font-semibold' : 'text-blue-100/60 hover:bg-white/5'
              }`}
            >
              <span>Counter Management</span>
            </button>
            <button 
              onClick={() => navigate('/service-management')}
              className={`flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all ${
                activeItem === 'service-management' ? 'text-on-secondary-container bg-secondary-container shadow-sm font-semibold' : 'text-blue-100/60 hover:bg-white/5'
              }`}
            >
              <span>Service Management</span>
            </button>
            <button 
              onClick={() => navigate('/user-management')}
              className={`flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all ${
                activeItem === 'user-management' ? 'text-on-secondary-container bg-secondary-container shadow-sm font-semibold' : 'text-blue-100/60 hover:bg-white/5'
              }`}
            >
              <span>User Management</span>
            </button>
          </>
        )}

        <button 
          onClick={() => navigate('/wait-time-prediction')}
          className={`flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all ${
            activeItem === 'wait-time-prediction' ? 'text-on-secondary-container bg-secondary-container shadow-sm font-semibold hover:text-on-secondary-container' : 'text-blue-100/60 hover:bg-white/5'
          }`}
        >
          <span>Wait Time Prediction</span>
        </button>

        {isAdmin && (
          <>
            <button 
              onClick={() => navigate('/system-data-management')}
              className={`flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all ${
                activeItem === 'system-data-management' ? 'text-on-secondary-container bg-secondary-container shadow-sm font-semibold' : 'text-blue-100/60 hover:bg-white/5'
              }`}
            >
              <span>System Data</span>
            </button>
            <button 
              onClick={() => navigate('/system-integration')}
              className={`flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all ${
                activeItem === 'system-integration' ? 'text-on-secondary-container bg-secondary-container shadow-sm font-semibold' : 'text-blue-100/60 hover:bg-white/5'
              }`}
            >
              <span>System Integration</span>
            </button>
          </>
        )}

        <div className="mt-auto border-t border-on-primary-container/20 pt-4 flex flex-col gap-2">
          <button 
            onClick={() => navigate('/my-profile')}
            className="flex items-center gap-3 p-3 text-on-primary-fixed-variant hover:bg-white/5 rounded-xl font-medium text-blue-100/60 text-xs text-left transition-colors cursor-pointer"
          >
            <SettingsIcon className="w-4 h-4 shrink-0" />
            <span>My Profile</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-error-container hover:bg-error text-on-error-container hover:text-white font-bold text-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Panel</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

interface CommonContentProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AdminLayout({ title, description, children }: CommonContentProps) {
  const userEmail = localStorage.getItem('userEmail') || '';
  const namePrefix = userEmail.split('@')[0];
  const userRole = useAdminSecurity(['customer', 'staff', 'manager', 'admin']);
  if (!userRole) return null;

  return (
    <div className="flex min-h-screen bg-[#F2F2F2] w-full text-on-surface select-none font-sans">
      <header className="fixed top-0 right-0 h-[60px] ml-[250px] w-[calc(100%-250px)] bg-surface-container-lowest shadow-sm border-b border-outline-variant/65 flex justify-between items-center px-8 z-40">
        <span className="font-semibold text-lg text-primary tracking-tight">{title}</span>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-primary block capitalize leading-none mb-1">{namePrefix}</span>
            <span className="text-[10px] text-on-surface-variant font-medium block uppercase tracking-wider">{userRole}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden border-2 border-secondary-container shadow-sm flex items-center justify-center text-white font-bold text-sm">
            {namePrefix.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="ml-[250px] pt-[80px] flex-grow min-h-screen p-8 bg-[#F2F2F2]">
        <div className="pb-6 border-b border-outline-variant/30 mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-primary">{title}</h2>
          <p className="text-sm text-on-surface-variant font-medium mt-1">{description}</p>
        </div>
        {children}
      </main>
    </div>
  );
}

// Security wrapper
function useAdminSecurity(requiredRoles: string[] = ['manager', 'admin']) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;
      if (!session) { navigate('/login'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      const role = profile?.role;
      if (!role || !requiredRoles.includes(role)) {
        navigate('/login');
        return;
      }
      setUserRole(role);
    });
  }, [navigate]);

  return userRole;
}

// Screen 1: Analytics
export function AnalyticsScreen() {
  useAdminSecurity(['manager', 'admin', 'staff']);
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [exportToast, setExportToast] = useState<string | null>(null);

  // Dynamic values depending on filter
  const metrics = {
    today: {
      served: { count: '1,284', change: '12.5%' },
      wait: { duration: '08:42', text: 'min', change: '4.2%' },
      peak: { val: '11:00 AM' },
      util: { val: '94.2%', change: '8.1%' }
    },
    week: {
      served: { count: '8,492', change: '8.3%' },
      wait: { duration: '09:12', text: 'min', change: '2.1%' },
      peak: { val: '11:30 AM' },
      util: { val: '91.8%', change: '4.2%' }
    },
    month: {
      served: { count: '34,204', change: '15.1%' },
      wait: { duration: '08:10', text: 'min', change: '5.4%' },
      peak: { val: '11:00 AM' },
      util: { val: '93.1%', change: '12.3%' }
    }
  };

  const activeMetrics = metrics[timeFilter];

  const hourlyVolumes = {
    today: [42, 58, 70, 101, 85, 60, 45, 30, 50, 65, 40, 20],
    week: [310, 420, 560, 780, 650, 480, 390, 240, 410, 520, 310, 150],
    month: [1200, 1680, 2100, 3120, 2700, 1950, 1510, 1040, 1650, 2200, 1310, 750]
  };

  const activeHourly = hourlyVolumes[timeFilter];
  const maxHourly = Math.max(...activeHourly);

  const handleExport = () => {
    setExportToast('Performance report successfully exported as CSV!');
    setTimeout(() => {
      setExportToast(null);
    }, 4000);
  };

  return (
    <div className="flex">
      <AdminSidebar activeItem="analytics" />
      <div className="flex-grow">
        <AdminLayout 
          title="Analytics Dashboard" 
          description="Real-time insight monitor of kiosk interactions, transaction volumes, counter operations, and average branch wait durations."
        >
          {/* Custom Sub-Header with filter buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-outline-variant/30 mb-6">
            <div>
              <span className="text-[10px] text-secondary font-bold tracking-widest uppercase">STITCH TELEMETRY SYSTEM</span>
              <h3 className="text-xl font-extrabold text-primary">In-depth Throughput Monitor</h3>
            </div>
            
            <div className="flex bg-white/80 p-1 rounded-xl border border-outline-variant/30 shadow-sm">
              <button 
                onClick={() => setTimeFilter('today')}
                className={`px-5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                  timeFilter === 'today' 
                    ? 'bg-secondary-container text-on-secondary-container shadow-sm font-bold' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Today
              </button>
              <button 
                onClick={() => setTimeFilter('week')}
                className={`px-5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                  timeFilter === 'week' 
                    ? 'bg-secondary-container text-on-secondary-container shadow-sm font-bold' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Week
              </button>
              <button 
                onClick={() => setTimeFilter('month')}
                className={`px-5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                  timeFilter === 'month' 
                    ? 'bg-secondary-container text-on-secondary-container shadow-sm font-bold' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Month
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {exportToast && (
            <div className="fixed bottom-6 right-6 z-50 bg-[#00081e] text-white border border-secondary px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-2.5 font-bold text-xs animate-bounce">
              <Sparkles className="w-4 h-4 text-secondary-container" />
              <span>{exportToast}</span>
            </div>
          )}

          {/* Row 1: KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* KPI 1 */}
            <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-secondary-fixed/50 rounded-xl">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex items-center text-green-700 bg-green-50 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  <span>{activeMetrics.served.change}</span>
                </div>
              </div>
              <h4 className="text-on-surface-variant text-[11px] uppercase tracking-wider font-extrabold">Customers Served</h4>
              <p className="text-3xl font-black text-primary mt-1">{activeMetrics.served.count}</p>
            </div>

            {/* KPI 2 */}
            <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-fixed rounded-xl">
                  <Clock className="w-5 h-5 text-[#041a3f]" />
                </div>
                <div className="flex items-center text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  <span>{activeMetrics.wait.change}</span>
                </div>
              </div>
              <h4 className="text-on-surface-variant text-[11px] uppercase tracking-wider font-extrabold">Avg Wait Time</h4>
              <p className="text-3xl font-black text-primary mt-1">
                {activeMetrics.wait.duration}
                <span className="text-xs font-semibold text-on-surface-variant ml-1">{activeMetrics.wait.text}</span>
              </p>
            </div>

            {/* KPI 3 */}
            <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-surface-container rounded-xl">
                  <TrendingUp className="w-5 h-5 text-on-surface" />
                </div>
                <div className="flex items-center text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-lg text-[10px] font-bold">
                  <span>Stable</span>
                </div>
              </div>
              <h4 className="text-on-surface-variant text-[11px] uppercase tracking-wider font-extrabold">Peak Hour</h4>
              <p className="text-3xl font-black text-primary mt-1">{activeMetrics.peak.val}</p>
            </div>

            {/* KPI 4 */}
            <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-secondary-container rounded-xl">
                  <Sliders className="w-5 h-5 text-on-secondary-container" />
                </div>
                <div className="flex items-center text-green-700 bg-green-50 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  <span>{activeMetrics.util.change}</span>
                </div>
              </div>
              <h4 className="text-on-surface-variant text-[11px] uppercase tracking-wider font-extrabold">Counter Utilisation</h4>
              <p className="text-3xl font-black text-primary mt-1">{activeMetrics.util.val}</p>
            </div>
          </div>

          {/* Row 2: Main Charts Bento Layout */}
          <div className="grid grid-cols-12 gap-6 mb-8 text-on-surface">
            {/* Hourly Volume Bar Chart */}
            <div className="col-span-12 lg:col-span-7 bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-primary">Hourly Customer Volume</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5 font-medium">Kiosk interaction logs by operational time frames</p>
                </div>
                <span className="text-[10px] tracking-wider uppercase bg-[#fed977]/30 text-[#755b00] px-3 py-1 rounded-full font-extrabold">Kiosk Log</span>
              </div>

              <div className="h-[220px] flex items-end justify-between gap-1.5 px-2 relative pt-6">
                {activeHourly.map((val, idx) => {
                  const percentHeight = `${(val / maxHourly) * 100}%`;
                  const isPeak = idx === 3 || idx === 4; // 11:00 AM and 12:00 PM
                  return (
                    <div 
                      key={idx}
                      className="flex-grow flex flex-col items-center group relative cursor-pointer"
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Bar fill */}
                      <div 
                        style={{ height: percentHeight }}
                        className={`w-full rounded-t-[4px] transition-all duration-500 relative ${
                          isPeak 
                            ? 'bg-[#755b00] hover:bg-[#fed977]' 
                            : 'bg-outline-variant/50 hover:bg-[#755b00]'
                        }`}
                      >
                        {/* Tooltip bubble */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#00081e] text-white text-[10px] px-2.5 py-1 rounded-lg shadow-md pointer-events-none transition-opacity duration-200 opacity-0 group-hover:opacity-100 whitespace-nowrap z-30 font-bold font-mono">
                          {val} clients
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-extrabold border-t border-outline-variant/10 pt-2 font-mono">
                <span>08:00</span>
                <span>10:00</span>
                <span>12:00</span>
                <span>14:00</span>
                <span>16:00</span>
                <span>18:00</span>
              </div>
            </div>

            {/* Daily Wait Time Line Chart */}
            <div className="col-span-12 lg:col-span-5 bg-[#00081e] text-white rounded-2xl p-6 shadow-md relative overflow-hidden group flex flex-col justify-between">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-base font-extrabold text-white">Wait Time Trend (7D)</h3>
                    <span className="w-2.5 h-2.5 bg-[#fed977] rounded-full animate-pulse"></span>
                  </div>
                  <p className="text-blue-100/60 text-xs mb-6 font-medium">Average wait duration across all sub-channels</p>
                </div>

                <div className="h-[140px] relative mt-2">
                  <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fed977" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#fed977" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 0 110 Q 50 90 100 120 T 200 60 T 300 80 T 400 30 L 400 150 L 0 150 Z" 
                      fill="url(#chartGrad)" 
                    />
                    <path 
                      d="M0,110 Q50,90 100,120 T200,60 T300,80 T400,30" 
                      fill="none" 
                      stroke="#fed977" 
                      strokeLinecap="round" 
                      strokeWidth="3.5" 
                    />
                    <circle cx="100" cy="120" fill="#fed977" r="4" />
                    <circle cx="200" cy="60" fill="#fed977" r="4" />
                    <circle cx="300" cy="80" fill="#fed977" r="4" />
                    <circle cx="400" cy="30" fill="#fed977" r="6" className="animate-pulse" />
                  </svg>
                </div>

                <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-4">
                  <div className="text-center">
                    <span className="block text-[#ffe08f] text-[9px] uppercase tracking-wider font-extrabold">Min</span>
                    <span className="text-white font-bold text-xs font-mono">04:12</span>
                  </div>
                  <div className="text-center border-x border-white/10 px-8">
                    <span className="block text-[#ffe08f] text-[9px] uppercase tracking-wider font-extrabold">Avg</span>
                    <span className="text-white font-bold text-xs font-mono">08:42</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[#ffe08f] text-[9px] uppercase tracking-wider font-extrabold">Max</span>
                    <span className="text-white font-bold text-xs font-mono">18:55</span>
                  </div>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-secondary opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000 pointer-events-none"></div>
            </div>
          </div>

          {/* Row 3: Secondary Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-on-surface">
            {/* Doughnut Chart (Service Distribution) */}
            <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6 flex flex-col justify-between">
              <h3 className="text-base font-extrabold text-primary mb-6">Service Distribution</h3>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-8 py-2">
                <div className="relative w-36 h-36 shrink-0 shadow-inner">
                  <div 
                    className="w-full h-full rounded-full" 
                    style={{ background: 'conic-gradient(#0A1F44 0% 45%, #755b00 45% 75%, #fed977 75% 90%, #e2e2e2 90% 100%)' }}
                  />
                  <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] text-on-surface-variant uppercase font-extrabold tracking-wider">Total</span>
                    <span className="text-sm font-bold text-primary font-mono">
                      {timeFilter === 'today' ? '1.2k' : timeFilter === 'week' ? '8.4k' : '34.2k'}
                    </span>
                  </div>
                </div>

                <div className="flex-grow w-full space-y-3 font-semibold text-xs text-on-surface-variant">
                  <div className="flex items-center justify-between p-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0A1F44]"></span>
                      <span>General Banking</span>
                    </div>
                    <span className="font-mono text-primary font-extrabold">45%</span>
                  </div>
                  <div className="flex items-center justify-between p-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#755b00]"></span>
                      <span>Teller Services</span>
                    </div>
                    <span className="font-mono text-primary font-extrabold">30%</span>
                  </div>
                  <div className="flex items-center justify-between p-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#fed977]"></span>
                      <span>Account Opening</span>
                    </div>
                    <span className="font-mono text-primary font-extrabold">15%</span>
                  </div>
                  <div className="flex items-center justify-between p-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
                      <span>Loans/Credit</span>
                    </div>
                    <span className="font-mono text-primary font-extrabold">10%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Counter efficiency */}
            <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6 flex flex-col justify-between">
              <h3 className="text-base font-extrabold text-primary mb-6">Counter Efficiency</h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span className="text-on-surface-variant font-semibold">Counter 01 (General)</span>
                    <span className="text-primary font-extrabold">98%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[98%] rounded-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span className="text-on-surface-variant font-semibold">Counter 02 (Premium)</span>
                    <span className="text-primary font-extrabold">82%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[82%] rounded-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span className="text-on-surface-variant font-semibold">Counter 03 (Teller)</span>
                    <span className="text-primary font-extrabold">95%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[95%] rounded-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span className="text-on-surface-variant font-semibold">Counter 04 (Special)</span>
                    <span className="text-primary font-extrabold">64%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-outline-variant/65 w-[64%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Performance Summary Table */}
          <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden text-on-surface">
            <div className="p-6 pb-4 flex justify-between items-center border-b border-outline-variant/10">
              <div>
                <h3 className="text-base font-extrabold text-primary">Performance Summary by Service Type</h3>
                <p className="text-xs text-on-surface-variant mt-0.5 font-medium">Service level agreement indexes and real-time ratings</p>
              </div>
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 bg-[#F2F2F2] hover:bg-surface-container text-xs font-bold text-primary px-4 py-2.5 rounded-xl border border-outline-variant/30 transition-colors shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
            
            <div className="overflow-x-auto font-sans">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0a1f44] text-white font-bold uppercase tracking-wider font-mono">
                    <th className="px-6 py-4">Service Category</th>
                    <th className="px-6 py-4">Tickets Issued</th>
                    <th className="px-6 py-4">Avg Wait</th>
                    <th className="px-6 py-4">Avg Service</th>
                    <th className="px-6 py-4">SLA Status</th>
                    <th className="px-6 py-4">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 font-semibold text-on-surface-variant">
                  <tr className="hover:bg-surface-container/20 transition-colors bg-white">
                    <td className="px-6 py-4 font-bold text-primary">General Inquiries</td>
                    <td className="px-6 py-4 font-mono font-bold">452</td>
                    <td className="px-6 py-4 font-mono">12:05m</td>
                    <td className="px-6 py-4 font-mono">05:30m</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full font-bold uppercase tracking-wider text-[9px] border border-green-200">
                        Healthy
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex text-secondary-container gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-[#fed977] stroke-secondary" />
                        <Star className="w-3.5 h-3.5 fill-[#fed977] stroke-secondary" />
                        <Star className="w-3.5 h-3.5 fill-[#fed977] stroke-secondary" />
                        <Star className="w-3.5 h-3.5 fill-[#fed977] stroke-secondary" />
                        <Star className="w-3.5 h-3.5 text-outline-variant fill-[#e2e2e2] stroke-outline-variant" />
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container/20 transition-colors bg-surface-container/5">
                    <td className="px-6 py-4 font-bold text-primary">Priority Banking</td>
                    <td className="px-6 py-4 font-mono font-bold">128</td>
                    <td className="px-6 py-4 font-mono">02:30m</td>
                    <td className="px-6 py-4 font-mono">15:45m</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full font-bold uppercase tracking-wider text-[9px] border border-green-300">
                        Excellent
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex text-secondary-container gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-[#fed977] stroke-secondary" />
                        <Star className="w-3.5 h-3.5 fill-[#fed977] stroke-secondary" />
                        <Star className="w-3.5 h-3.5 fill-[#fed977] stroke-secondary" />
                        <Star className="w-3.5 h-3.5 fill-[#fed977] stroke-secondary" />
                        <Star className="w-3.5 h-3.5 fill-[#fed977] stroke-secondary" />
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container/20 transition-colors bg-white">
                    <td className="px-6 py-4 font-bold text-primary">Foreign Exchange</td>
                    <td className="px-6 py-4 font-mono font-bold">84</td>
                    <td className="px-6 py-4 font-mono">18:40m</td>
                    <td className="px-6 py-4 font-mono">08:20m</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-full font-bold uppercase tracking-wider text-[9px] border border-red-200">
                        Attention
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex text-[#fed977] gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-[#fed977] stroke-secondary" />
                        <Star className="w-3.5 h-3.5 fill-[#fed977] stroke-secondary" />
                        <Star className="w-3.5 h-3.5 fill-[#fed977] stroke-secondary" />
                        <Star className="w-3.5 h-3.5 text-outline-variant fill-[#e2e2e2] stroke-outline-variant" />
                        <Star className="w-3.5 h-3.5 text-outline-variant fill-[#e2e2e2] stroke-outline-variant" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </AdminLayout>
      </div>
    </div>
  );
}

// Screen 2: Reports
interface SavedReport {
  id: string;
  name: string;
  author: string;
  createdOn: string;
  type: 'Efficiency' | 'Audit' | 'Traffic' | 'SLA' | 'Prediction';
  status: 'Ready' | 'Archived' | 'Generating';
}

export function ReportsScreen() {
  useAdminSecurity();

  // Selected State variables for generator
  const [reportType, setReportType] = useState<string>('Service Efficiency');
  const [dateRange, setDateRange] = useState<string>('Last 7 Days');
  const [service, setService] = useState<string>('All Services');
  const [counter, setCounter] = useState<string>('All Counters');

  // Interactive UI states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [exportType, setExportType] = useState<'csv' | 'pdf' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination Simulator
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Saved reports list state
  const [savedReports, setSavedReports] = useState<SavedReport[]>([
    { id: '1', name: 'Monthly Performance_Oct23', author: 'Alex Chen', createdOn: 'Oct 31, 2023 ΓÇó 05:30 PM', type: 'Efficiency', status: 'Ready' },
    { id: '2', name: 'Q3_Teller_Audit_Internal', author: 'System Automated', createdOn: 'Oct 15, 2023 ΓÇó 09:00 AM', type: 'Audit', status: 'Ready' },
    { id: '3', name: 'Peak_Traffic_Analysis_W42', author: 'Maria G.', createdOn: 'Oct 12, 2023 ΓÇó 11:20 AM', type: 'Traffic', status: 'Archived' }
  ]);

  // Handle Generate Report simulation
  const handleGenerateReport = () => {
    setIsGenerating(true);
    triggerToast('Initiating predictive calculations and server epoch audits...');

    setTimeout(() => {
      const typeShort = reportType.split(' ').map(word => word[0]).join('');
      const dateShort = dateRange.replace(/\s+/g, '');
      const dynamicName = `${typeShort}_Report_${dateShort}_${Date.now().toString().slice(-4)}`;
      
      const newReport: SavedReport = {
        id: Date.now().toString(),
        name: dynamicName,
        author: 'You (Staff Panel)',
        createdOn: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + ' ΓÇó ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: reportType.includes('Efficiency') ? 'Efficiency' : reportType.includes('Audit') || reportType.includes('Performance') ? 'Audit' : 'Traffic',
        status: 'Ready'
      };

      setSavedReports(prev => [newReport, ...prev]);
      setIsGenerating(false);
      triggerToast(`Successfully generated "${dynamicName}" report!`);
    }, 1500);
  };

  // Export Simulations
  const handleExport = (type: 'csv' | 'pdf') => {
    setExportType(type);
    triggerToast(`Compiling structured datasets for ${type.toUpperCase()} extraction...`);

    setTimeout(() => {
      setExportType(null);
      triggerToast(`${type.toUpperCase()} sheet download initialized successfully!`);
    }, 1200);
  };

  // Helper to trigger floating toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Delete/Archive Action
  const handleArchiveToggle = (id: string) => {
    setSavedReports(prev => prev.map(rep => {
      if (rep.id === id) {
        const nextStatus = rep.status === 'Ready' ? 'Archived' : 'Ready';
        triggerToast(`Report "${rep.name}" has been ${nextStatus === 'Ready' ? 'restored' : 'archived'}.`);
        return { ...rep, status: nextStatus };
      }
      return rep;
    }));
  };

  // Filter logic
  const filteredReports = savedReports.filter(rep => {
    const query = searchQuery.toLowerCase();
    return rep.name.toLowerCase().includes(query) || 
           rep.author.toLowerCase().includes(query) || 
           rep.type.toLowerCase().includes(query) || 
           rep.status.toLowerCase().includes(query);
  });

  return (
    <div className="flex">
      <AdminSidebar activeItem="reports" />
      <AdminLayout 
        title="Financial Intelligence Hub" 
        description="Analyze teller performance, customer traffic, and service efficiency metrics."
      >
        <div className="space-y-8 max-w-6xl w-full pb-10">
          
          {/* Header Last Update Row (Stitch-specific element) */}
          <div className="flex justify-between items-center bg-[#f3f3f3] border border-outline-variant/30 p-4 rounded-xl -mt-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-white rounded-lg shadow-sm">
                <LayoutDashboard className="w-4 h-4 text-[#755b00]" />
              </span>
              <div>
                <span className="text-xs font-bold text-primary block leading-none">SmartQ Reporting Terminal</span>
                <span className="text-[10px] text-on-surface-variant font-medium mt-0.5 block">Audit compliance index verified by Enterprise Cryptographic hash</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e2e2e2] rounded-lg">
              <Activity className="w-3.5 h-3.5 text-[#755b00] animate-pulse" />
              <span className="text-[10px] font-bold text-[#44464e]">Last update: 5 mins ago</span>
            </div>
          </div>

          {/* Bento Grid: Report Generator & Efficiency Rating */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Report Generator Module (8 cols) */}
            <section className="xl:col-span-8 bg-white p-6 rounded-xl border border-outline-variant/30 shadow-[0px_4px_12px_rgba(0,0,0,0.02)] flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#fed977]/30 text-[#755b00] rounded-lg flex items-center justify-center shadow-inner">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-primary uppercase tracking-wide">Generate New Report</h4>
                    <p className="text-[11px] text-on-surface-variant font-medium">Select criteria to extract real-time server records.</p>
                  </div>
                </div>
              </div>

              {/* Selection Parameter Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-0.5">Report Type</label>
                  <select 
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    disabled={isGenerating}
                    className="w-full bg-[#f3f3f3] border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 transition-all cursor-pointer"
                  >
                    <option>Service Efficiency</option>
                    <option>Teller Performance</option>
                    <option>Wait Time Analysis</option>
                    <option>Peak Hours Trends</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-0.5">Date Range</label>
                  <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    disabled={isGenerating}
                    className="w-full bg-[#f3f3f3] border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 transition-all cursor-pointer"
                  >
                    <option>Last 7 Days</option>
                    <option>Current Month</option>
                    <option>Last Quarter</option>
                    <option>Custom Range</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-0.5">Service</label>
                  <select 
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    disabled={isGenerating}
                    className="w-full bg-[#f3f3f3] border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 transition-all cursor-pointer"
                  >
                    <option>All Services</option>
                    <option>Cash Deposit</option>
                    <option>Account Opening</option>
                    <option>Foreign Exchange</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-0.5">Counter</label>
                  <select 
                    value={counter}
                    onChange={(e) => setCounter(e.target.value)}
                    disabled={isGenerating}
                    className="w-full bg-[#f3f3f3] border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 transition-all cursor-pointer"
                  >
                    <option>All Counters</option>
                    <option>Counter 01 - Cash</option>
                    <option>Counter 02 - Loans</option>
                    <option>Counter 03 - Support</option>
                  </select>
                </div>
              </div>

              {/* Action Trigger Buttons Container */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                <button 
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="bg-[#fed977] text-[#241a00] px-6 py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#ffe08f] hover:shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                >
                  {isGenerating ? (
                    <>
                      <motion.span 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-[#241a00] border-t-transparent rounded-full"
                      />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current text-[#241a00]" />
                      <span>Generate Report</span>
                    </>
                  )}
                </button>

                <button 
                  onClick={() => handleExport('csv')}
                  disabled={exportType !== null || isGenerating}
                  className="bg-[#0a1f44] text-white px-6 py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 hover:shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {exportType === 'csv' ? (
                    <>
                      <motion.span 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Exporting CSV...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Export CSV</span>
                    </>
                  )}
                </button>

                <button 
                  onClick={() => handleExport('pdf')}
                  disabled={exportType !== null || isGenerating}
                  className="text-primary hover:bg-slate-100 border border-outline-variant/65 px-6 py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {exportType === 'pdf' ? (
                    <>
                      <motion.span 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                      />
                      <span>Exporting PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Export PDF</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Quick Efficiency Meter Insight Column (4 cols) */}
            <section className="xl:col-span-4 bg-[#0a1f44] p-6 rounded-xl text-white flex flex-col justify-between shadow-md relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <span className="bg-[#fed977] text-[#241a00] text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded shadow-sm">
                  Quick Stat
                </span>
                
                <div>
                  <h4 className="text-[11px] text-blue-100/70 font-bold uppercase tracking-widest leading-none">Branch Performance</h4>
                  <p className="text-lg font-bold text-[#fed977] mt-1">SLA Efficiency Rating</p>
                </div>

                <div className="py-2">
                  <span className="text-4xl font-extrabold font-mono tracking-tight text-white block">94.2%</span>
                  <span className="text-xs text-green-400 font-semibold block mt-1">Γåæ 2.4% vs last period</span>
                </div>
                
                <p className="text-[11px] text-blue-200/60 leading-relaxed font-semibold">
                  Predictions are synchronized across 4 unique tellers with actual processing intervals verified.
                </p>
              </div>

              {/* Progress visual accent */}
              <div className="mt-6 flex gap-2 relative z-10">
                <div className="h-1 bg-[#fed977] rounded-full flex-1"></div>
                <div className="h-1 bg-[#fed977] rounded-full flex-1"></div>
                <div className="h-1 bg-[#fed977] rounded-full flex-1"></div>
                <div className="h-1 bg-slate-500 rounded-full flex-1"></div>
              </div>

              {/* Blur gradient decoration */}
              <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#fed977]/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
            </section>
          </div>

          {/* Saved Reports Archive Module (Stitch styling table) */}
          <section className="bg-white rounded-xl border border-outline-variant/30 shadow-[0px_4px_12px_rgba(0,0,0,0.02)] overflow-hidden">
            
            {/* Archive Header & Filters */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0a1f44]/5 text-[#0a1f44] rounded-lg flex items-center justify-center shadow-inner">
                  <Database className="w-5 h-5 text-[#0a1f44]" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-primary uppercase tracking-wide">Saved Reports Archive</h4>
                  <p className="text-[11px] text-on-surface-variant font-medium">Browse, retrieve, and delete previous data extractions.</p>
                </div>
              </div>

              {/* Instant Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search archive..."
                  className="pl-9 pr-4 py-2 bg-[#f3f3f3] border border-outline-variant/60 rounded-full text-xs font-semibold text-primary w-full focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Archive Table */}
            <div className="overflow-x-auto">
              {filteredReports.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center text-on-surface-variant/70 space-y-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                    <Search className="w-5 h-5 text-slate-300" />
                  </div>
                  <p className="text-xs font-bold font-sans">No matching reports found inside local archives.</p>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Try re-filtering criteria or query string</span>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead className="bg-[#00081e] text-white">
                    <tr className="uppercase tracking-wider text-[10px] font-bold font-mono">
                      <th className="px-6 py-4">Report Name</th>
                      <th className="px-6 py-4">Created On</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-primary font-semibold">
                    {filteredReports.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`transition-colors hover:bg-slate-50 duration-150 ${index % 2 === 1 ? 'bg-[#f9f9f9]' : 'bg-white'}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-xs text-primary">{item.name}</span>
                            <span className="text-[10px] text-on-surface-variant font-medium">Generated by {item.author}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant text-[11px] font-mono leading-none font-bold">
                          {item.createdOn}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-[#f3f3f3] text-on-surface-variant border border-outline-variant/20 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 font-bold text-xs text-[#755b00]">
                            <span className={`w-2 h-2 rounded-full ${item.status === 'Ready' ? 'bg-[#fed977]' : 'bg-slate-400 animate-pulse'}`}></span>
                            <span>{item.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => triggerToast(`Report dataset "${item.name}" download queued.`)}
                              className="p-1.5 hover:bg-[#fed977]/30 text-[#755b00] rounded-full transition-colors cursor-pointer"
                              title="Download dataset"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleArchiveToggle(item.id)}
                              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-full transition-colors cursor-pointer"
                              title={item.status === 'Ready' ? 'Archive catalog' : 'Restore catalog'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
              <span className="text-xs text-on-surface-variant font-bold leading-none">
                Showing {filteredReports.length} of {savedReports.length} saved reports
              </span>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setCurrentPage(1);
                    triggerToast("First page loaded.");
                  }}
                  disabled={currentPage === 1}
                  className="p-1 text-slate-500 hover:text-slate-700 bg-slate-50 rounded border border-outline-variant/40 disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    setCurrentPage(2);
                    triggerToast("No additional pages stored in current operational logs.");
                  }}
                  className="p-1 text-slate-500 hover:text-slate-700 bg-slate-50 rounded border border-outline-variant/40 shadow-sm cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Bottom Decorative Cards (Stitch image mock references) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Visual Block 1 */}
            <div className="rounded-xl overflow-hidden h-48 relative shadow-sm group cursor-pointer border border-outline-variant/20 bg-cover bg-center">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCieGGFiY0xcjed9BHLUnFLEuuR8uDOHEF-vidJv65WcHNVGIpjdFBVBzEJfZYgzg9OZ8m53DtmoPgwmJohO9Vg80FUb1Xr68FwxqpBK3ZYsf1-qarGIjypWnSxSDi-NPsVP8gH6j08gvZkRNn4t7zYsQJvKJI1B8nQ76QNmA1GAK39AQ288WONSZmeiEoHlqPpY805b_M34kc8Q1OPMKqtlNGizay0O54a3xEUqfLAqnOC7-l_Kl_W7w" 
                alt="Fintech Charts" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00081e]/90 via-[#00081e]/45 to-transparent flex items-end p-6">
                <div>
                  <p className="text-[#fed977] text-[10px] font-extrabold uppercase tracking-widest">Global Insights</p>
                  <p className="text-white font-bold text-sm mt-0.5">Real-time Network Analytics</p>
                </div>
              </div>
            </div>

            {/* Visual Block 2 */}
            <div className="rounded-xl overflow-hidden h-48 relative shadow-sm group cursor-pointer border border-outline-variant/20 bg-cover bg-center">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPzHL-sJ4g4ePbuq32h8Q8r_n1inj9uwCpDT9dN6ewPgrS8tZh3xHrknBdVz2c9CaGpZAnzI5rGXZzIotW-6JU0-2rlGk2MeIqJjGDU9BaD4jRUmjmZJ0dT3aRpfckWoDde5Yse0NycktajGDLapa_9i3nZ-zLwKfvQ5m0PI_9mEm_dLFroWXdUE4TdJpktDFVY8c6RbwzHfmeBndsd82I1aABLgUkxuVsxONPu8uJB2MTRUtFuG-apw" 
                alt="Audit Review" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00081e]/90 via-[#00081e]/45 to-transparent flex items-end p-6">
                <div>
                  <p className="text-[#fed977] text-[10px] font-extrabold uppercase tracking-widest">Compliance</p>
                  <p className="text-white font-bold text-sm mt-0.5">Regulatory Reporting Framework</p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Branding */}
          <footer className="pt-4 text-center text-on-surface-variant/40 text-[10px] uppercase tracking-widest leading-loose font-bold">
            SmartQ Analytics Systems ΓÇó Authorized Access Only
          </footer>

        </div>
      </AdminLayout>

      {/* Floating Animated Toast Notifications */}
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-8 right-8 bg-[#0a1f44] text-[#fed977] text-xs font-bold px-5 py-4 rounded-xl shadow-2xl border border-white/10 z-50 flex items-center gap-3 max-w-sm"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0"></span>
          <span className="text-white leading-relaxed font-semibold">{toastMessage}</span>
        </motion.div>
      )}

    </div>
  );
}

// Screen 3: Counter Management
interface Counter {
  id: string;
  name: string;
  staffName: string;
  status: 'Active' | 'Inactive';
  services: string[];
}

export function CounterManagementScreen() {
  useAdminSecurity(['admin']);

  // Initial counters list
  const [counters, setCounters] = useState<Counter[]>([
    { id: '1', name: 'Counter 01', staffName: 'Robert Harrison', status: 'Active', services: ['Cash Deposit', 'Withdrawal', 'Forex'] },
    { id: '2', name: 'Counter 02', staffName: 'Sarah Mitchell', status: 'Active', services: ['General Inquiry', 'Loans'] },
    { id: '3', name: 'Counter 03', staffName: 'Unassigned', status: 'Inactive', services: ['Priority Services'] },
    { id: '4', name: 'Counter 04', staffName: 'Alex Thompson', status: 'Active', services: ['Mortgage', 'Advisory'] },
    { id: '5', name: 'Counter 05', staffName: 'Maintenance', status: 'Inactive', services: ['Collections'] },
    { id: '6', name: 'Counter 06', staffName: 'Maria Garcia', status: 'Active', services: ['Bulk Cash', 'Clearing'] },
  ]);

  // Notifications Log
  const [systemLogs, setSystemLogs] = useState<string[]>([
    'Counter 03 marked as inactive by Supervisor.',
    'Counter 01 printer low on thermal paper.'
  ]);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingCounterId, setEditingCounterId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formStaff, setFormStaff] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formServicesString, setFormServicesString] = useState('');

  // Toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Open modal for creating
  const openCreateModal = () => {
    setModalMode('create');
    setEditingCounterId(null);
    setFormName(`Counter 0${counters.length + 1}`);
    setFormStaff('');
    setFormStatus('Active');
    setFormServicesString('General, Support');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (counter: Counter) => {
    setModalMode('edit');
    setEditingCounterId(counter.id);
    setFormName(counter.name);
    setFormStaff(counter.staffName === 'Unassigned' ? '' : counter.staffName);
    setFormStatus(counter.status);
    setFormServicesString(counter.services.join(', '));
    setIsModalOpen(true);
  };

  // Delete counter
  const handleDeleteCounter = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      setCounters(prev => prev.filter(c => c.id !== id));
      triggerToast(`Successfully removed ${name} from active desk matrices.`);
      setSystemLogs(prev => [`Desk registry "${name}" was decommissioned by Administrator.`, ...prev]);
    }
  };

  // Form Submission
  const handleSaveCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Counter name cannot be empty');
      return;
    }

    const servicesArray = formServicesString
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const resolvedStaff = formStaff.trim() || 'Unassigned';

    if (modalMode === 'create') {
      const newCounter: Counter = {
        id: Date.now().toString(),
        name: formName,
        staffName: resolvedStaff,
        status: formStatus,
        services: servicesArray.length > 0 ? servicesArray : ['General Services']
      };
      setCounters(prev => [...prev, newCounter]);
      triggerToast(`Created new active terminal "${formName}" successfully!`);
      setSystemLogs(prev => [`New terminal ${formName} was commissioned and linked to ${resolvedStaff}.`, ...prev]);
    } else {
      setCounters(prev => prev.map(c => {
        if (c.id === editingCounterId) {
          return {
            ...c,
            name: formName,
            staffName: resolvedStaff,
            status: formStatus,
            services: servicesArray.length > 0 ? servicesArray : ['General Services']
          };
        }
        return c;
      }));
      triggerToast(`Updated configurations for "${formName}" instantly.`);
      setSystemLogs(prev => [`Configurations set on terminal ${formName} were synchronized.`, ...prev]);
    }

    setIsModalOpen(false);
  };

  // Calculated Stats
  const activeCount = counters.filter(c => c.status === 'Active').length;
  const totalCount = counters.length;

  // Filtering
  const filteredCounters = counters.filter(c => {
    const query = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(query) ||
           c.staffName.toLowerCase().includes(query) ||
           c.services.some(s => s.toLowerCase().includes(query));
  });

  return (
    <div className="flex min-h-screen bg-[#F2F2F2] w-full text-on-surface select-none font-sans">
      <AdminSidebar activeItem="counter-management" />

      <AdminLayout 
        title="Counter Management" 
        description="Configure and monitor your branch teller stations in real-time."
      >
        <div className="space-y-8 max-w-6xl w-full pb-12">
          
          {/* Header Controls Area */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search station or teller..."
                className="pl-9 pr-4 py-2 bg-white border border-outline-variant/60 rounded-full text-xs font-semibold text-primary w-full focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none transition-all placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {/* Add Counter call to action */}
            <button 
              onClick={openCreateModal}
              className="bg-[#fed977] text-[#241a00] font-bold py-2.5 px-6 rounded-lg text-xs shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Counter</span>
            </button>
          </div>

          {/* Counters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCounters.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center col-span-full border border-outline-variant/30 flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                  <Sliders className="w-5 h-5 text-slate-300" />
                </div>
                <p className="text-xs font-bold text-on-surface-variant">No matching counter stations registered in this segment.</p>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Expand query or register a new counter unit</span>
              </div>
            ) : (
              filteredCounters.map((counter) => (
                <div 
                  key={counter.id}
                  className={`bg-white rounded-xl p-6 border-t-4 shadow-[0px_4px_12px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden ${
                    counter.status === 'Active' ? 'border-[#fed977]' : 'border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg ${counter.status === 'Active' ? 'bg-[#fed977]/20 text-[#755b00]' : 'bg-slate-100 text-slate-400'}`}>
                      <Layout className="w-5 h-5" />
                    </div>
                    
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${
                      counter.status === 'Active' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {counter.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-primary mb-1">{counter.name}</h3>
                  
                  <p className="text-xs text-on-surface-variant font-bold mb-4 flex items-center gap-1.5">
                    {counter.staffName === 'Unassigned' ? (
                      <>
                        <UserX className="w-3.5 h-3.5 text-slate-400" />
                        <span>Staff: <span className="font-semibold text-slate-400 italic">Unassigned</span></span>
                      </>
                    ) : (
                      <>
                        <User className="w-3.5 h-3.5 text-[#755b00]" />
                        <span>Staff: <span className="font-extrabold text-primary">{counter.staffName}</span></span>
                      </>
                    )}
                  </p>

                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Designated Services</p>
                    <div className="flex flex-wrap gap-1.5">
                      {counter.services.map((srv, idx) => (
                        <span 
                          key={idx} 
                          className="bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Operational actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
                    <button 
                      onClick={() => openEditModal(counter)}
                      className="flex-1 py-2 text-[10px] font-bold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer leading-none"
                    >
                      <Edit className="w-3 h-3" /> 
                      <span>Edit</span>
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteCounter(counter.id, counter.name)}
                      className="flex-1 py-2 text-[10px] font-bold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer leading-none"
                    >
                      <Trash2 className="w-3 h-3" /> 
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Asymmetric Detail section */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Live stats card inside deep slate bg */}
            <div className="lg:col-span-8 bg-[#0a1f44] text-white p-8 rounded-xl relative overflow-hidden flex flex-col justify-between shadow-md">
              <div className="relative z-10">
                <h3 className="text-lg font-extrabold text-[#fed977] uppercase tracking-wide">Live Statistics</h3>
                <p className="text-xs text-blue-100/60 max-w-md mt-1 font-semibold">
                  Branch performance overview for counters currently active in the rotation system.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-10 relative z-10 border-t border-white/5 pt-6">
                <div>
                  <p className="text-3xl font-black font-mono tracking-tight text-white">{`0${activeCount}/0${totalCount}`}</p>
                  <p className="text-[9px] text-[#7687b2] uppercase tracking-wider font-extrabold mt-1">Active Tellers</p>
                </div>
                <div>
                  <p className="text-3xl font-black font-mono tracking-tight text-white">12m</p>
                  <p className="text-[9px] text-[#7687b2] uppercase tracking-wider font-extrabold mt-1">Avg. Service Time</p>
                </div>
                <div>
                  <p className="text-3xl font-black font-mono tracking-tight text-[#fed977]">08</p>
                  <p className="text-[9px] text-[#7687b2] uppercase tracking-wider font-extrabold mt-1">Waiting Guests</p>
                </div>
              </div>

              {/* Backing large motif */}
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-white/[0.03] select-none pointer-events-none">
                <Sliders className="w-64 h-64" />
              </div>
            </div>

            {/* Notification logs & quick info columns */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Notification Logs */}
              <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-[0px_4px_12px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-primary">Terminal Warnings & Feed</h4>
                
                <ul className="space-y-3">
                  {systemLogs.map((log, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[11px] leading-relaxed font-semibold text-on-surface-variant">
                      <span className="p-1 bg-amber-50 rounded text-[#755b00] shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </span>
                      <span>{log}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assignment alert section */}
              <div className="bg-[#fed977] p-5 rounded-xl shadow-sm flex items-center justify-between border border-[#241a00]/5">
                <div>
                  <p className="text-[#241a00] text-[9px] uppercase font-black tracking-widest">Newest Assignment</p>
                  <p className="text-[#785d00] text-xs font-extrabold mt-0.5">
                    {counters.length > 0 && counters[counters.length - 1].staffName !== 'Unassigned' 
                      ? `${counters[counters.length - 1].staffName} @ ${counters[counters.length - 1].name}`
                      : 'Alex T. @ Counter 04'
                    }
                  </p>
                </div>
                <div className="bg-[#0a1f44] text-white w-9 h-9 rounded-full flex items-center justify-center shadow">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          </div>

          {/* Footer lock bottom */}
          <footer className="pt-4 text-center text-on-surface-variant/40 text-[10px] uppercase tracking-widest leading-loose font-bold">
            SmartQ Desks Registry ΓÇó Authorized Admins Protocol
          </footer>

        </div>
      </AdminLayout>

      {/* Dynamic Creation / Editing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00081e]/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100"
          >
            {/* Modal Header */}
            <div className="bg-[#0a1f44] text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#fed977]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider">
                  {modalMode === 'create' ? 'Link New Channel Unit' : 'Configure Channel Unit'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCounter} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Counter Name/ID</label>
                <input 
                  type="text"
                  placeholder="e.g. Counter 07"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#f3f3f3] border border-outline-variant/50 rounded-lg px-3 py-2 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Assigned Staff Member</label>
                <input 
                  type="text"
                  placeholder="Leave blank for 'Unassigned'"
                  value={formStaff}
                  onChange={(e) => setFormStaff(e.target.value)}
                  className="w-full bg-[#f3f3f3] border border-outline-variant/50 rounded-lg px-3 py-2 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Operational Status</label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer">
                    <input 
                      type="radio"
                      checked={formStatus === 'Active'}
                      onChange={() => setFormStatus('Active')}
                      className="text-[#755b00] focus:ring-0 cursor-pointer"
                    />
                    <span>Active Rotation</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer">
                    <input 
                      type="radio"
                      checked={formStatus === 'Inactive'}
                      onChange={() => setFormStatus('Inactive')}
                      className="text-[#755b00] focus:ring-0 cursor-pointer"
                    />
                    <span>Inactive Offline</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Designated Services (comma-separated)</label>
                <input 
                  type="text"
                  placeholder="e.g. Cash Deposit, Withdrawal, Forex"
                  value={formServicesString}
                  onChange={(e) => setFormServicesString(e.target.value)}
                  className="w-full bg-[#f3f3f3] border border-outline-variant/50 rounded-lg px-3 py-2 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#fed977] hover:bg-[#ffe08f] text-[#241a00] rounded-lg shadow-sm cursor-pointer"
                >
                  {modalMode === 'create' ? 'Register Station' : 'Apply Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Floating Animated Toast Notifications */}
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-8 right-8 bg-[#0a1f44] text-[#fed977] text-xs font-bold px-5 py-4 rounded-xl shadow-2xl border border-white/10 z-50 flex items-center gap-3 max-w-sm"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0"></span>
          <span className="text-white leading-relaxed font-semibold">{toastMessage}</span>
        </motion.div>
      )}

    </div>
  );
}

// Screen 4: Service Management
interface ServiceItem {
  id: string;
  name: string;
  division: string;
  duration: string;
  priority: 'High' | 'Med' | 'Low';
  status: 'Active' | 'Inactive';
}

export function ServiceManagementScreen() {
  useAdminSecurity(['admin']);

  // Core Service Catalog State
  const [services, setServices] = useState<ServiceItem[]>([
    { id: 'SRV-001', name: 'Personal Account Opening', division: 'Retail Banking Division', duration: '25 mins', priority: 'High', status: 'Active' },
    { id: 'SRV-002', name: 'Cash Withdrawal (>10k)', division: 'Teller Services', duration: '08 mins', priority: 'Med', status: 'Active' },
    { id: 'SRV-003', name: 'Wealth Consultation', division: 'Premium Services', duration: '45 mins', priority: 'High', status: 'Active' },
    { id: 'SRV-004', name: 'Forex Exchange', division: 'Treasury Dept', duration: '15 mins', priority: 'Low', status: 'Inactive' },
    { id: 'SRV-005', name: 'Mortgage Application', division: 'Lending Services', duration: '60 mins', priority: 'Med', status: 'Active' },
  ]);

  // Interactive configurations & alerts states
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [bottleneckMsg, setBottleneckMsg] = useState(
    '"Mortgage Application" duration is 15% above target. Consider reallocating staff from "Retail" or increasing service points.'
  );

  // Modal controller state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formDivision, setFormDivision] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formPriority, setFormPriority] = useState<'High' | 'Med' | 'Low'>('High');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');

  // Trigger floating notifications helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Open modal triggers
  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormName('');
    setFormDivision('Retail Banking Division');
    setFormDuration('15 mins');
    setFormPriority('High');
    setFormStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (srv: ServiceItem) => {
    setModalMode('edit');
    setEditingId(srv.id);
    setFormName(srv.name);
    setFormDivision(srv.division);
    setFormDuration(srv.duration);
    setFormPriority(srv.priority);
    setFormStatus(srv.status);
    setIsModalOpen(true);
  };

  // Delete Action handler
  const handleDeleteService = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently decommission service catalog item [${id}] "${name}"?`)) {
      setServices(prev => prev.filter(s => s.id !== id));
      triggerToast(`Decommissioned catalog item "${name}" successfully.`);
    }
  };

  // Submit creator/updated service fields
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Service catalog name is required');
      return;
    }

    if (modalMode === 'create') {
      const nextIdNum = services.length + 1;
      const newSrv: ServiceItem = {
        id: `SRV-0${nextIdNum < 10 ? '0' + nextIdNum : nextIdNum}`,
        name: formName,
        division: formDivision,
        duration: formDuration,
        priority: formPriority,
        status: formStatus
      };
      setServices(prev => [...prev, newSrv]);
      triggerToast(`Added "${formName}" to active service lists!`);
    } else {
      setServices(prev => prev.map(s => {
        if (s.id === editingId) {
          return {
            ...s,
            name: formName,
            division: formDivision,
            duration: formDuration,
            priority: formPriority,
            status: formStatus
          };
        }
        return s;
      }));
      triggerToast(`Successfully modified catalog parameters for "${formName}".`);
    }

    setIsModalOpen(false);
  };

  // Simulated AI Analyzer
  const handleRunAnalysis = () => {
    setIsAnalysing(true);
    triggerToast('Initiating SmartQ workflow analysis & transactional audit...');

    setTimeout(() => {
      setIsAnalysing(false);
      setBottleneckMsg('Optimised! Recommended staff redistribution for Lending and Retail successfully computed.');
      triggerToast('AI analysis completed. New operational recommendations compiled.');
    }, 1800);
  };

  // Dynamically compute stats from state
  const activeServicesCount = services.filter(s => s.status === 'Active').length;
  // Sum up base average durations for a neat dynamic display
  const averageDurationValue = services.length > 0 
    ? Math.round(services.reduce((acc, curr) => acc + parseInt(curr.duration || '0'), 0) / services.length)
    : 12.5;

  // Search Filter implementation
  const filteredServices = services.filter(srv => {
    const query = searchQuery.toLowerCase();
    return srv.id.toLowerCase().includes(query) ||
           srv.name.toLowerCase().includes(query) ||
           srv.division.toLowerCase().includes(query) ||
           srv.priority.toLowerCase().includes(query) ||
           srv.status.toLowerCase().includes(query);
  });

  return (
    <div className="flex min-h-screen bg-[#F2F2F2] w-full text-on-surface font-sans select-none">
      <AdminSidebar activeItem="service-management" />

      <AdminLayout 
        title="Service Management" 
        description="Configure and optimize banking service categories and workflow priorities."
      >
        <div className="space-y-8 max-w-6xl w-full pb-12">
          
          {/* Header Action Trigger Area */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Branch Segment: Retail & Premium Operations</p>
            </div>
            
            <button 
              onClick={openCreateModal}
              className="bg-[#fed977] hover:bg-[#ffe08f] text-[#241a00] px-6 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#241a00]" />
              <span>Add Service</span>
            </button>
          </div>

          {/* Quick Statistic Metric Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Total Services Stats */}
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 flex flex-col gap-1 shadow-xs border-l-4 border-[#755b00]">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Total Services</span>
              <span className="text-xl font-extrabold text-primary">{activeServicesCount} Active</span>
            </div>

            {/* Average duration */}
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 flex flex-col gap-1 shadow-xs border-l-4 border-[#755b00]">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Avg Duration</span>
              <span className="text-xl font-extrabold text-primary">{averageDurationValue} mins</span>
            </div>

            {/* Peak efficiency */}
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 flex flex-col gap-1 shadow-xs border-l-4 border-[#755b00]">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Peak Load Efficiency</span>
              <span className="text-xl font-extrabold text-primary">94%</span>
            </div>

            {/* Dynamic staff projection */}
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 flex flex-col gap-1 shadow-xs border-l-4 border-[#755b00]">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Staff Allocation</span>
              <span className="text-xl font-extrabold text-primary">12 Tellers</span>
            </div>

          </div>

          {/* Interactive Catalog Section card */}
          <div className="bg-white rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30 overflow-hidden">
            
            {/* Table Control Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider">Active Service Catalog</h3>
              
              {/* Search Control */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services..."
                  className="pl-9 pr-4 py-2 bg-[#f3f3f3] border border-outline-variant/60 rounded-full text-xs font-semibold text-primary w-full focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Structured responsive table body */}
            <div className="overflow-x-auto">
              {filteredServices.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center text-on-surface-variant/70 space-y-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                    <Sliders className="w-5 h-5 text-slate-300" />
                  </div>
                  <p className="text-xs font-bold">No matching services registered inside active catalogs.</p>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Simplify search string params</span>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead className="bg-[#00081e] text-white">
                    <tr className="uppercase tracking-wider text-[10px] font-bold font-mono">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Service Name</th>
                      <th className="px-6 py-4">Avg Duration</th>
                      <th className="px-6 py-4">Priority Level</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-primary font-semibold">
                    {filteredServices.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`transition-colors hover:bg-slate-50 duration-150 ${index % 2 === 1 ? 'bg-[#f9f9f9]' : 'bg-white'}`}
                      >
                        <td className="px-6 py-4 font-mono font-bold text-slate-500">
                          {item.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-xs text-primary">{item.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{item.division}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant font-mono text-[11px] font-bold">
                          {item.duration}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${
                            item.priority === 'High' 
                              ? 'bg-rose-50 text-rose-700 border-rose-200' 
                              : item.priority === 'Med'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${item.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                            <span className={`text-[10px] uppercase font-black tracking-wider ${item.status === 'Active' ? 'text-emerald-700' : 'text-slate-400'}`}>
                              {item.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {/* Edit Action trigger */}
                            <button 
                              onClick={() => openEditModal(item)}
                              className="p-1.5 hover:bg-[#fed977]/30 text-[#755b00] rounded-full transition-colors cursor-pointer"
                              title="Edit service specifications"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            {/* Delete Action trigger */}
                            <button 
                              onClick={() => handleDeleteService(item.id, item.name)}
                              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-full transition-colors cursor-pointer"
                              title="Decommission service catalog"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
              <span className="text-xs text-on-surface-variant font-bold leading-none">
                Showing {filteredServices.length} of {services.length} registered entries
              </span>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => triggerToast("First catalog segment loaded.")}
                  className="p-1 text-slate-500 hover:text-slate-700 bg-slate-50 rounded border border-outline-variant/40 shadow-sm cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => triggerToast("Pagination query is locked to regional segments.")}
                  className="p-1 text-slate-500 hover:text-slate-700 bg-slate-50 rounded border border-outline-variant/40 shadow-sm cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Atmospheric bottom intelligence grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Run Analysis Panel */}
            <div className="bg-[#0a1f44] text-white p-8 rounded-xl relative overflow-hidden flex flex-col justify-between shadow-md">
              <div className="relative z-10 space-y-2">
                <span className="bg-[#fed977] text-[#241a00] text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
                  SmartQ Analytics
                </span>
                <h4 className="text-base font-extrabold text-[#fed977] uppercase tracking-wide">Service Optimization AI</h4>
                <p className="text-xs text-blue-100/60 leading-relaxed font-semibold max-w-sm">
                  SmartQ is currently analyzing 2,400+ transactions to suggest active queue priority re-routing during peak hours.
                </p>
              </div>

              <div className="pt-6 relative z-10">
                <button 
                  onClick={handleRunAnalysis}
                  disabled={isAnalysing}
                  className="bg-[#fed977] text-[#241a00] px-5 py-2.5 rounded-lg font-bold text-xs hover:bg-[#ffe08f] transition-all cursor-pointer disabled:opacity-40"
                >
                  {isAnalysing ? 'Run Analytics...' : 'Run Analysis'}
                </button>
              </div>

              <div className="absolute right-[-20px] bottom-[-20px] text-white/[0.04] pointer-events-none select-none">
                <Sparkles className="w-48 h-48" />
              </div>
            </div>

            {/* Warnings Alert Log section */}
            <div className="bg-white border border-outline-variant/30 p-8 rounded-xl shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fed977]/30 text-[#755b00] shrink-0 flex items-center justify-center shadow-inner">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-primary">Bottleneck Warning</h4>
                <p className="text-xs text-on-surface-variant font-bold leading-relaxed">
                  {bottleneckMsg}
                </p>
              </div>
            </div>

          </section>

          {/* Footer Branding */}
          <footer className="pt-4 text-center text-on-surface-variant/40 text-[10px] uppercase tracking-widest leading-loose font-bold">
            SmartQ Services Network Portal ΓÇó Secured System Access
          </footer>

        </div>
      </AdminLayout>

      {/* Dynamic Creation / Editing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00081e]/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100"
          >
            {/* Modal Header */}
            <div className="bg-[#0a1f44] text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#fed977]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider">
                  {modalMode === 'create' ? 'Register New Services' : 'Configure Service Parameters'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveService} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Service Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Instant Card Issuing"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#f3f3f3] border border-outline-variant/50 rounded-lg px-3 py-2 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Division Name, Dept</label>
                  <input 
                    type="text"
                    placeholder="e.g. Retail Services"
                    value={formDivision}
                    onChange={(e) => setFormDivision(e.target.value)}
                    className="w-full bg-[#f3f3f3] border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Avg Interval Duration</label>
                  <input 
                    type="text"
                    placeholder="e.g. 15 mins"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full bg-[#f3f3f3] border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Priority Rank</label>
                  <select 
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as 'High' | 'Med' | 'Low')}
                    className="w-full bg-[#f3f3f3] border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none cursor-pointer"
                  >
                    <option value="High">≡ƒö┤ High Priority</option>
                    <option value="Med">≡ƒƒí Medium Priority</option>
                    <option value="Low">ΓÜ¬ Low Priority</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Operational Status</label>
                  <select 
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Inactive')}
                    className="w-full bg-[#f3f3f3] border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none cursor-pointer"
                  >
                    <option value="Active">≡ƒƒó Active Rotation</option>
                    <option value="Inactive">ΓÜ½ Offline/Inactive</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#fed977] hover:bg-[#ffe08f] text-[#241a00] rounded-lg shadow-sm cursor-pointer"
                >
                  {modalMode === 'create' ? 'Register Service' : 'Save Configurations'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Floating Animated Toast Notifications */}
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-8 right-8 bg-[#0a1f44] text-[#fed977] text-xs font-bold px-5 py-4 rounded-xl shadow-2xl border border-white/10 z-50 flex items-center gap-3 max-w-sm"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0"></span>
          <span className="text-white leading-relaxed font-semibold">{toastMessage}</span>
        </motion.div>
      )}

    </div>
  );
}

// Screen 5: User Management
interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Staff' | 'Customer';
  status: 'Active' | 'Inactive' | 'Pending';
  avatarUrl: string;
}

export function UserManagementScreen() {
  useAdminSecurity(['admin']);

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Load real users from Supabase
  const loadUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('get_all_users');
    if (error) {
      console.error('Error loading users:', error.message);
      triggerToast('Failed to load users: ' + error.message);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Change user role in Supabase
  const handleRoleChange = async (userId: string, newRole: string, userName: string) => {
    setUpdatingId(userId);
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role: newRole }
    });

    if (error) {
      triggerToast('Failed to update role: ' + error.message);
    } else {
      triggerToast(`Role updated to "${newRole}" for ${userName}`);
      await loadUsers();
    }
    setUpdatingId(null);
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      (user.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'All Roles' || user.role === selectedRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  // Stats
  const totalActive = users.length;
  const adminsAndManagers = users.filter(u => u.role === 'admin' || u.role === 'manager').length;
  const staffCount = users.filter(u => u.role === 'staff').length;
  const customerCount = users.filter(u => u.role === 'customer').length;

  return (
    <div className="flex min-h-screen bg-[#F2F2F2] w-full text-on-surface font-sans select-none">
      <AdminSidebar activeItem="user-management" />

      <AdminLayout
        title="User Management"
        description="View and manage all registered users and their roles across the branch network."
      >
        <div className="space-y-8 max-w-6xl w-full pb-12">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
              SmartQ Directory Authorization Desk
            </p>
            <button
              onClick={loadUsers}
              className="bg-[#fed977] hover:bg-[#ffe08f] text-[#241a00] px-6 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Users</span>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-5 border border-outline-variant/30 shadow-sm flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-9 pr-4 py-2 bg-[#f3f3f3] border-none rounded-lg text-xs font-semibold text-primary w-full focus:outline-none focus:ring-1 focus:ring-[#755b00]/30 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Role</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-[#f3f3f3] border border-outline-variant/45 rounded-lg px-3 py-1.5 text-xs font-bold text-primary outline-none cursor-pointer"
              >
                <option>All Roles</option>
                <option>admin</option>
                <option>manager</option>
                <option>staff</option>
                <option>customer</option>
              </select>
            </div>

            <button
              onClick={() => { setSearchQuery(''); setSelectedRole('All Roles'); }}
              className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg transition-colors cursor-pointer"
              title="Clear Filters"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-xs font-bold text-on-surface-variant animate-pulse">
                  Loading users from Supabase...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                    <UserX className="w-5 h-5 text-slate-300" />
                  </div>
                  <p className="text-xs font-bold text-on-surface-variant">No users found.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead className="bg-[#00081e] text-white">
                    <tr className="uppercase tracking-wider text-[10px] font-bold font-mono">
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Registered</th>
                      <th className="px-6 py-4 text-right">Change Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-primary font-semibold">
                    {filteredUsers.map((user, index) => (
                      <tr
                        key={user.id}
                        className={`transition-colors hover:bg-slate-50 duration-150 ${index % 2 === 1 ? 'bg-[#f9f9f9]' : 'bg-white'}`}
                      >
                        {/* Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-extrabold text-xs text-primary block">
                                {user.full_name || 'ΓÇö'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{user.id.slice(0, 8)}...</span>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-on-surface-variant font-mono text-[11px] font-bold">
                          {user.email}
                        </td>

                        {/* Role badge */}
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${
                            user.role === 'admin'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : user.role === 'manager'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : user.role === 'staff'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {user.role || 'unknown'}
                          </span>
                        </td>

                        {/* Registered date */}
                        <td className="px-6 py-4 text-on-surface-variant font-mono text-[11px]">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>

                        {/* Role change dropdown */}
                        <td className="px-6 py-4 text-right">
                          {updatingId === user.id ? (
                            <span className="text-[10px] text-slate-400 font-bold animate-pulse">Updating...</span>
                          ) : (
                            <select
                              value={user.role || 'customer'}
                              onChange={(e) => handleRoleChange(user.id, e.target.value, user.full_name || user.email)}
                              className="bg-[#f3f3f3] border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-bold text-primary outline-none cursor-pointer focus:border-[#755b00]"
                            >
                              <option value="customer">Customer</option>
                              <option value="staff">Staff</option>
                              <option value="manager">Manager</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
              <span className="text-xs text-on-surface-variant font-bold">
                Showing {filteredUsers.length} of {users.length} users
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#0a1f44] text-white p-6 rounded-xl shadow-md flex flex-col justify-between">
              <Users className="w-8 h-8 text-[#fed977]" />
              <div className="mt-4">
                <h4 className="text-3xl font-black font-mono">{totalActive}</h4>
                <p className="text-[#7687b2] text-[10px] mt-1 font-extrabold uppercase tracking-wider">Total Registered</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 border-l-4 border-[#755b00] shadow-xs flex flex-col justify-between">
              <h4 className="text-primary text-2xl font-black font-mono">{adminsAndManagers}</h4>
              <p className="text-on-surface-variant text-[10px] mt-1 font-extrabold uppercase tracking-wider">Admins & Managers</p>
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-[#fed977] h-full rounded-full" style={{ width: `${users.length > 0 ? (adminsAndManagers / users.length) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 border-l-4 border-slate-700 shadow-xs flex flex-col justify-between">
              <h4 className="text-primary text-2xl font-black font-mono">{staffCount}</h4>
              <p className="text-on-surface-variant text-[10px] mt-1 font-extrabold uppercase tracking-wider">Staff Members</p>
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-slate-700 h-full rounded-full" style={{ width: `${users.length > 0 ? (staffCount / users.length) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 border-l-4 border-emerald-500 shadow-xs flex flex-col justify-between">
              <h4 className="text-primary text-2xl font-black font-mono">{customerCount}</h4>
              <p className="text-on-surface-variant text-[10px] mt-1 font-extrabold uppercase tracking-wider">Customers</p>
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${users.length > 0 ? (customerCount / users.length) * 100 : 0}%` }} />
              </div>
            </div>
          </section>

          <footer className="pt-4 text-center text-on-surface-variant/40 text-[10px] uppercase tracking-widest leading-loose font-bold">
            SmartQ Security Central Core ΓÇó Branch Registry System
          </footer>
        </div>
      </AdminLayout>

      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed bottom-8 right-8 bg-[#0a1f44] text-[#fed977] text-xs font-bold px-5 py-4 rounded-xl shadow-2xl border border-white/10 z-50 flex items-center gap-3 max-w-sm"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0"></span>
          <span className="text-white leading-relaxed font-semibold">{toastMessage}</span>
        </motion.div>
      )}
    </div>
  );
}
// Screen 6: Wait Time Prediction
export function WaitTimePredictionScreen() {
  const navigate = useNavigate();
  const userRole = useAdminSecurity(['customer', 'staff', 'manager', 'admin']);

  // Core forecast states
  const [serviceCode, setServiceCode] = useState<string>('cash_deposit');
  const [peopleAhead, setPeopleAhead] = useState<number>(15);
  const [activeTellers, setActiveTellers] = useState<number>(4);
  const [timeOfDay, setTimeOfDay] = useState<string>('afternoon');

  // Interactive delay simulation state
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [recalibrating, setRecalibrating] = useState<boolean>(false);

  // Admin tunable parameters
  const [isModelActive, setIsModelActive] = useState<boolean>(true);
  const [editMultiplier, setEditMultiplier] = useState<number>(1.0);

  // Simulation History log state
  const [historyList, setHistoryList] = useState([
    { id: 'p-1', timestamp: '09:42 AM', customer: 'Session User', service: 'General Banking', ahead: 12, tellers: 3, result: 32, status: 'Accurate', actual: '30 mins' },
    { id: 'p-2', timestamp: '10:15 AM', customer: 'Session User', service: 'Forex Exchange', ahead: 8, tellers: 1, result: 55, status: 'Accurate', actual: '58 mins' },
    { id: 'p-3', timestamp: '11:05 AM', customer: 'Session User', service: 'Loan Inquiry', ahead: 21, tellers: 5, result: 18, status: 'Drift Detected', actual: '25 mins' },
    { id: 'p-4', timestamp: '11:30 AM', customer: 'Session User', service: 'General Banking', ahead: 14, tellers: 4, result: 22, status: 'Pending', actual: '--' }
  ]);

  // Audit Logs for admin view
  const [auditLogs, setAuditLogs] = useState<string[]>([
    '09:00 AM: SmartQ Predictive Engine v4.2.0 initialized with accuracy metrics optimized.',
    '10:15 AM: Hourly teller speed coefficient auto-calculated by server cron.',
    '11:42 AM: ML Engine status validated by Admin Portal.'
  ]);

  const serviceData: Record<string, { name: string; baseTime: number }> = {
  cash_deposit:    { name: 'General Banking',    baseTime: 8.2  }, // dataset base
  account_opening: { name: 'Corporate Services', baseTime: 15.6 }, // complex = 1.5x base
  cash_withdrawal: { name: 'Forex Exchange',     baseTime: 10.4 }, // dataset average
  loan_inquiry:    { name: 'Loan Inquiry',       baseTime: 13.5 }, // dataset 75th percentile
  card_services:   { name: 'Card Services',      baseTime: 9.2  }, // slightly above base
  general_inquiry: { name: 'Wealth Management',  baseTime: 6.8  }, // dataset 25th percentile
};

  const peakFactors: Record<string, { label: string; factor: number }> = {
  morning:   { label: 'Morning Peak (x1.1)',     factor: 1.1 }, // mild increase
  lunch:     { label: 'Lunch Hour Peak (x1.5)',  factor: 1.5 }, // highest load
  afternoon: { label: 'Afternoon Steady (x1.0)', factor: 1.0 }, // baseline = dataset avg
  evening:   { label: 'Evening Rush (x1.3)',     factor: 1.3 }, // moderate increase
};

  const currentService = serviceData[serviceCode] || { name: 'General Banking', baseTime: 8 };
  const currentPeak = peakFactors[timeOfDay] || { label: 'Afternoon Steady', factor: 0.9 };
  
  const baseTime = currentService.baseTime;
  const multiplier = isModelActive ? editMultiplier : 1.0;
  
  // Interactive Wait prediction formula
  const datasetBase = 8.2;
const datasetPerPerson = 0.3;

const computedDuration = isModelActive
  ? Math.round(
      (baseTime + (peopleAhead / (activeTellers || 1)) * datasetPerPerson)
      * currentPeak.factor
      * multiplier
    )
  : Math.round(
      (datasetBase + (peopleAhead / (activeTellers || 1)) * datasetPerPerson)
      * currentPeak.factor
    );

  const finalWaitTime = computedDuration < 1 ? 1 : computedDuration;

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    
    setTimeout(() => {
      setIsCalculating(false);
      const newLog = {
        id: `p-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customer: userRole === 'customer' ? 'You' : 'Simulated User',
        service: currentService.name,
        ahead: peopleAhead,
        tellers: activeTellers,
        result: finalWaitTime,
        status: 'Pending',
        actual: '--'
      };
      setHistoryList(prev => [newLog, ...prev]);

      if (userRole === 'admin') {
        const logMsg = `${newLog.timestamp}: Operator triggered custom simulation of ${finalWaitTime} mins for ${currentService.name}.`;
        setAuditLogs(prev => [logMsg, ...prev]);
      }
      
      showToast(`Calculation successful: ${finalWaitTime} minutes predicted!`);
    }, 1200);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleDelete = (id: string) => {
    setHistoryList(prev => prev.filter(item => item.id !== id));
    if (userRole === 'admin') {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setAuditLogs(prev => [`${nowStr}: Deleted prediction log row ${id} by Administrator.`, ...prev]);
    }
  };

  const handleToggleModel = () => {
    const nextState = !isModelActive;
    setIsModelActive(nextState);
    if (userRole === 'admin') {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setAuditLogs(prev => [`${nowStr}: Machine Learning Prediction model toggled to ${nextState ? 'Active' : 'Inactive'}.`, ...prev]);
    }
  };

  const handleRecalibrate = () => {
    setRecalibrating(true);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (userRole === 'admin') {
      setAuditLogs(prev => [`${nowStr}: Requested manual execution of deep epoch iteration calibration.`, ...prev]);
    }
    setTimeout(() => {
      setRecalibrating(false);
      if (userRole === 'admin') {
        setAuditLogs(prev => [`${nowStr}: Model convergence successful. New error metric RMSE = 0.042.`, ...prev]);
      }
      showToast('SmartQ Predictive Core recalibrated successfully!');
    }, 1500);
  };

  // Role assertions
  const isCustomer = userRole === 'customer';
  const isStaff = userRole === 'staff';
  const isManager = userRole === 'manager';
  const isAdmin = userRole === 'admin';

  return (
    <div className="flex">
      <AdminSidebar activeItem="wait-time-prediction" />
      <AdminLayout 
        title="Wait Time Prediction" 
        description="Dynamic prediction engine utilizing machine learning regression models based on real-time traffic."
      >
        <div className="space-y-6 max-w-6xl pb-10">
          
          {/* Main Grid: Info + Predictor Parameters */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Column: Form & Config (5 cols) */}
            <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
              <section className="bg-white rounded-xl p-6 shadow-sm border border-outline-variant/30">
                <div className="flex items-center gap-2 mb-6">
                  <Sliders className="text-secondary w-5 h-5 shrink-0" />
                  <h3 className="font-semibold text-primary text-base">Prediction Parameters</h3>
                </div>
                
                <form onSubmit={handleSimulate} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-on-surface-variant">Queue Length</label>
                      <input 
                        type="number" 
                        min="0"
                        max="100"
                        value={peopleAhead}
                        onChange={(e) => setPeopleAhead(parseInt(e.target.value) || 0)}
                        className="w-full border-outline-variant/60 border rounded-[6px] px-3 py-2 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none transition-all font-semibold bg-white"
                        placeholder="e.g. 15"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-on-surface-variant">Active Counters</label>
                      <input 
                        type="number" 
                        min="1"
                        max="10"
                        value={activeTellers}
                        onChange={(e) => setActiveTellers(parseInt(e.target.value) || 1)}
                        className="w-full border-outline-variant/60 border rounded-[6px] px-3 py-2 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none transition-all font-semibold bg-white"
                        placeholder="e.g. 4"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface-variant">Service Type</label>
                    <select 
                      value={serviceCode} 
                      onChange={(e) => setServiceCode(e.target.value)}
                      className="w-full border-outline-variant/60 border rounded-[6px] px-3 py-2 text-xs focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none transition-all font-bold bg-white cursor-pointer py-2.5"
                    >
                      <option value="cash_deposit">General Banking</option>
                      <option value="account_opening">Corporate Services</option>
                      <option value="cash_withdrawal">Forex Exchange</option>
                      <option value="general_inquiry">Wealth Management</option>
                      <option value="loan_inquiry">Loan Inquiry</option>
                      <option value="card_services">Card Services</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface-variant">Time of Day</label>
                    <select 
                      value={timeOfDay} 
                      onChange={(e) => setTimeOfDay(e.target.value)}
                      className="w-full border-outline-variant/60 border rounded-[6px] px-3 py-2 text-xs focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none transition-all font-bold bg-white cursor-pointer py-2.5"
                    >
                      <option value="afternoon">Afternoon Steady (Normal)</option>
                      <option value="morning">Morning Peak (Slight delay)</option>
                      <option value="lunch">Lunch Hour Peak (High delay)</option>
                      <option value="evening">Evening Rush (Moderate delay)</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    disabled={isCalculating}
                    className="w-full bg-[#FFD05B] text-primary hover:bg-[#ffe08f] active:bg-[#e6c364] text-on-secondary-container font-semibold py-3 rounded-[6px] flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all shadow-sm cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                  >
                    {isCalculating ? (
                      <>
                        <motion.span 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-[#1A1C1C] border-t-transparent rounded-full block"
                        />
                        Processing Estimation...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Predict Wait Time
                      </>
                    )}
                  </button>
                </form>
              </section>

              {/* Mini Insight Card */}
              <div className="bg-[#00081e] p-6 rounded-xl text-white relative overflow-hidden shadow-sm">
                <div className="absolute right-0 top-0 opacity-10 font-bold text-white text-[100px] select-none pointer-events-none font-mono">
                  ML
                </div>
                <div className="relative z-10">
                  <h4 className="text-[11px] font-bold text-[#fed977] uppercase tracking-wider mb-2">ML Model Status</h4>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-sm font-semibold">Real-time Optimization Active</p>
                  </div>
                  <p className="text-xs text-[#EEEEEE]/80 leading-relaxed font-medium">
                  Model trained on 560 real banking queue records. Base wait: 8.2 mins, per-person factor: 0.3 mins/counter derived from queue_data.csv analysis.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Output visuals (7 cols) */}
            <div className="lg:col-span-12 xl:col-span-7">
              <section className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden h-full flex flex-col justify-between">
                <div className="p-8 flex-grow flex flex-col items-center justify-center text-center">
                  <div className="mb-6 p-4 rounded-full bg-[#eeeeee] flex items-center justify-center">
                    <Clock className="w-12 h-12 text-[#00081e]" />
                  </div>
                  <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-2">Predicted Wait Time</p>
                  
                  {isCalculating ? (
                    <div className="h-28 flex flex-col items-center justify-center space-y-3">
                      <div className="flex gap-1.5 justify-center items-center">
                        <span className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <p className="text-xs font-semibold text-outline tracking-wider uppercase">Evaluating metrics...</p>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-[64px] font-extrabold text-[#00081e] leading-tight mb-2 font-mono">
                        {finalWaitTime} <span className="text-2xl font-medium text-[#44464e] font-sans">minutes</span>
                      </h2>
                      <p className="text-xs font-medium text-[#44464e] max-w-sm mb-12">
                        Based on current branch traffic, historical peak patterns, and active counter availability.
                      </p>
                    </>
                  )}

                  {/* Wait Level Indicator */}
                  <div className="w-full max-w-md">
                    <div className="flex justify-between mb-3 px-1 text-xs font-bold text-outline">
                      <span className="text-green-600">Low</span>
                      <span className="text-secondary">Moderate</span>
                      <span className="text-[#ba1a1a]">High</span>
                    </div>
                    <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden flex relative">
                      <div className="h-full bg-green-500/30" style={{ width: '30%' }}></div>
                      <div className="h-full bg-secondary/30" style={{ width: '40%' }}></div>
                      <div className="h-full bg-[#ba1a1a]/30" style={{ width: '30%' }}></div>
                      
                      {/* Dynamic Indicator Pin Positioned based on finalWaitTime */}
                      <motion.div 
                        className="absolute -top-1 w-4 h-5 bg-[#00081e] rounded-sm shadow-md border-2 border-white cursor-help"
                        style={{ 
                          left: `${(() => {
                            if (finalWaitTime <= 10) {
                              return Math.max(2, (finalWaitTime / 10) * 28);
                            } else if (finalWaitTime <= 25) {
                              return 30 + ((finalWaitTime - 10) / 15) * 40;
                            } else {
                              return Math.min(96, 70 + ((finalWaitTime - 25) / 35) * 26);
                            }
                          })()}%`
                        }}
                        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                      />
                    </div>
                    
                    <p className="mt-4 font-bold text-xs flex justify-center items-center gap-1.5" style={{ color: finalWaitTime < 15 ? '#16a34a' : finalWaitTime < 30 ? '#755b00' : '#ba1a1a' }}>
                      <span className="inline-block w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: finalWaitTime < 15 ? '#16a34a' : finalWaitTime < 30 ? '#755b00' : '#ba1a1a' }}></span>
                      Wait level: {finalWaitTime < 15 ? 'Low' : finalWaitTime < 30 ? 'Moderate' : 'High'}
                    </p>
                  </div>
                </div>

                {/* Prediction Metadata */}
                <div className="bg-surface-container-low p-6 grid grid-cols-3 divide-x divide-outline-variant/30 border-t border-outline-variant/30 bg-[#f3f3f3]">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Confidence</p>
                    <p className="text-sm font-extrabold text-primary">78.4%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Precision</p>
                    <p className="text-sm font-extrabold text-primary">+/- 4.8m</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Last Update</p>
                    <p className="text-sm font-extrabold text-primary">Just now</p>
                  </div>
                </div>
              </section>
            </div>
            
          </div>

          {/* Model status view (Hides from Customer only) */}
          {!isCustomer && (
            <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-primary text-sm flex items-center gap-1.5">
                    <Cpu className="w-5 h-5 text-secondary shrink-0" /> ML Predictor Engine Control
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium leading-relaxed max-w-xl font-sans mt-1">
                    SmartQ uses random forest classification combined with active queue load factors to predict actual physical counter wait times.
                  </p>
                </div>
                
                {/* Admin configuration status controls */}
                <div className="flex items-center gap-3">
                  <div className="text-xs font-bold text-right">
                    <span className="text-outline block uppercase tracking-wider text-[10px]">Engine Status</span>
                    <span className={`font-black uppercase text-xs ${isModelActive ? 'text-green-600' : 'text-rose-600'}`}>
                      {isModelActive ? 'ΓùÅ Active' : 'ΓùÅ Inactive'}
                    </span>
                  </div>

                  {/* Toggle button ONLY for Admin */}
                  {isAdmin ? (
                    <button 
                      type="button"
                      onClick={handleToggleModel}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors ${
                        isModelActive ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isModelActive ? 'Deactivate ML Engine' : 'Activate ML Engine'}
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 bg-[#F2F2F2] rounded-lg text-[10px] font-black uppercase text-outline">
                      Read Only
                    </span>
                  )}
                </div>
              </div>

              {/* Edit predictions slider for Admin users */}
              {isAdmin && (
                <div className="p-4 bg-secondary-container/10 border border-secondary/25 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-[#0A1F44]">
                    <span className="uppercase tracking-wider">Admin Calibration: Engine Wait Multiplier</span>
                    <span className="text-secondary bg-[#0A1F44] text-white px-2 py-0.5 rounded text-[11px] font-mono">
                      {editMultiplier.toFixed(1)}x
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={editMultiplier}
                    onChange={(e) => setEditMultiplier(Number(e.target.value))}
                    className="w-full accent-secondary h-1 bg-surface-container-low rounded-lg cursor-pointer"
                  />
                  <p className="text-[10px] font-medium text-[#0A1F44] opacity-75">
                    Modifying the multiplier scales wait estimations up or down company-wide to compensate for emergency server outages or regional weather interruptions.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Bottom: Recent Predictions Table */}
          <div className="col-span-12 animate-fade-in">
            <section className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-white">
                <div className="flex items-center gap-2">
                  <Clock className="text-secondary w-5 h-5" />
                  <h3 className="font-bold text-primary text-sm">Recent Predictions</h3>
                </div>
                <div className="text-xs text-outline font-semibold">
                  Showing {isStaff ? 3 : historyList.length} records
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#00081e] text-white">
                    <tr>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Time Generated</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Service Type</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Input Parameters</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-center">Predicted Time</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-center">Actual Wait</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-center">Status</th>
                      {isAdmin && <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-center">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="text-primary font-semibold">
                    {(isStaff ? historyList.slice(0, 3) : historyList).map((item, index) => (
                      <tr key={item.id} className={index % 2 === 1 ? 'bg-[#F2F2F2]' : 'bg-white hover:bg-slate-50 border-b border-outline-variant/10'}>
                        <td className="px-6 py-4 font-mono text-[11px] text-on-surface-variant font-bold">{item.timestamp}</td>
                        <td className="px-6 py-4 font-bold">{item.service}</td>
                        <td className="px-6 py-4 text-on-surface-variant font-medium">QL: {item.ahead} | Cnt: {item.tellers}</td>
                        <td className="px-6 py-4 font-bold text-primary text-center text-sm">{item.result} mins</td>
                        <td className="px-6 py-4 text-center font-bold text-on-surface-variant">{item.actual !== '--' ? item.actual : '--'}</td>
                        <td className="px-6 py-4 text-center">
                          {item.id.startsWith('p-') && parseFloat(item.id.split('-')[1]) > 50000 ? (
                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                              Pending
                            </span>
                          ) : item.result > 30 ? (
                            <span className="px-3 py-1 rounded-full bg-[#ffe4e6] text-[#ba1a1a] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                              Drift Detected
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-[#dcfce7] text-[#15803d] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                              Accurate
                            </span>
                          )}
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer inline-flex items-center transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Audit History block ONLY for Admin */}
          {isAdmin && (
            <div className="bg-[#1C2C46] text-[#E2E8F0] p-6 rounded-2xl border border-outline-variant/40 shadow-sm space-y-3">
              <h3 className="font-bold text-[#FFD700] text-sm flex items-center gap-1.5">
                <Terminal className="w-5 h-5 text-[#FFD700] shrink-0" /> Machine Learning Engine Audit Trail
              </h3>
              <p className="text-xs text-blue-200/70 font-medium leading-relaxed">
                Security actions, parameter tweaking logs, and database deletion histories are recorded locally for compliance audits.
              </p>
              
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-2 font-mono text-[10px] leading-relaxed max-h-40 overflow-y-auto">
                {auditLogs.map((logStr, i) => (
                  <div key={i} className="text-[#A0AEC0] border-l-2 border-[#FFD700] pl-2">
                    {logStr}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Branding */}
          <footer className="pt-4 text-center text-on-surface-variant/50 text-[10px] uppercase tracking-widest leading-loose">
            SmartQ Predictive Engine v4.2.0 ΓÇó Powered by Enterprise ML Core
          </footer>

        </div>
      </AdminLayout>

      {/* Dynamic Toast Alerts - Elegant replacement to browser alerts */}
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed bottom-24 right-8 bg-[#00081e] text-[#FFD700] text-xs font-bold px-4 py-3.5 rounded-xl shadow-2xl border border-white/10 z-50 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Recalibrate Model Floating Action Button */}
      <button 
        onClick={handleRecalibrate}
        disabled={recalibrating}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#FFD05B] text-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all group z-50 hover:bg-[#ffe08f] active:bg-[#e6c364] cursor-pointer disabled:opacity-75 disabled:cursor-wait"
      >
        {recalibrating ? (
          <motion.span 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
          />
        ) : (
          <Sparkles className="w-6 h-6" />
        )}
        <span className="absolute right-16 bg-[#00081e] text-white text-[11px] px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10 font-bold">
          Recalibrate Engine
        </span>
      </button>

    </div>
  );
}

// Screen 7: System Data Management
export function SystemDataScreen() {
  useAdminSecurity(['admin']);
  const navigate = useNavigate();

  // Core configuration engine parameters
  const [branchName, setBranchName] = useState('Main Metropolitan Hub - Floor 1');
  const [maxCapacity, setMaxCapacity] = useState(150);
  const [openingTime, setOpeningTime] = useState('08:00');
  const [closingTime, setClosingTime] = useState('17:30');

  // Rules toggles
  const [seniorCitizenRule, setSeniorCitizenRule] = useState(true);
  const [vipRule, setVipRule] = useState(true);
  const [quickExpressRule, setQuickExpressRule] = useState(false);

  // Status & analytics states
  const [lastBackupMins, setLastBackupMins] = useState(14);
  const [isBackupLive, setIsBackupLive] = useState(true);
  
  // Interactive loading animation flags
  const [isSaving, setIsSaving] = useState(false);
  const [isFlushing, setIsFlushing] = useState(false);
  const [isSnapshotting, setIsSnapshotting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger floating notifications helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Periodic simulation: Tick backup minutes up over time
  useEffect(() => {
    const backupTimer = setInterval(() => {
      setLastBackupMins(prev => prev + 1);
    }, 60000);
    return () => clearInterval(backupTimer);
  }, []);

  // Save Settings handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    triggerToast('Initializing global system data synchronization...');

    setTimeout(() => {
      setIsSaving(false);
      triggerToast('Global configuration metrics successfully saved!');
    }, 1200);
  };

  // Reset defaults callback
  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to revert all system configuration rules to original factory limits?')) {
      setBranchName('Main Metropolitan Hub - Floor 1');
      setMaxCapacity(150);
      setOpeningTime('08:00');
      setClosingTime('17:30');
      setSeniorCitizenRule(true);
      setVipRule(true);
      setQuickExpressRule(false);
      triggerToast('All parameters reverted to original guidelines.');
    }
  };

  // Trigger Full DB Snapshot simulation
  const handleTriggerSnapshot = () => {
    setIsSnapshotting(true);
    triggerToast('Executing deep binary sector backup & database snapshot...');

    setTimeout(() => {
      setIsSnapshotting(false);
      setLastBackupMins(0);
      setIsBackupLive(true);
      triggerToast('Backup live snapshot complete. All regional nodes updated!');
    }, 1800);
  };

  // Flush Demo Tickets handler
  const handleFlushDemoTickets = () => {
    if (window.confirm('WARNING: Are you sure you want to flush all trial and temporary active queue numbers? This action is irreversible.')) {
      setIsFlushing(true);
      triggerToast('Flushing general transaction memory databases...');

      setTimeout(() => {
        setIsFlushing(false);
        triggerToast('Sandbox logs cleansed. Active memory buffers emptied.');
      }, 1500);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F2F2F2] w-full text-on-surface font-sans select-none">
      <AdminSidebar activeItem="system-data-management" />

      <AdminLayout 
        title="System Data Management" 
        description="Modify the core engine parameters, set working hours, and trigger database snapshot cycles."
      >
        <div className="space-y-8 max-w-4xl w-full pb-12">
          
          {/* Horizontal Navigation Grid Tabs matching Stitch precisely */}
          <div className="overflow-x-auto">
            <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl w-max">
              <button 
                onClick={() => navigate('/queue-control-center')}
                className="px-5 py-2 text-xs font-semibold text-slate-600 hover:text-[#755b00] hover:bg-white/40 rounded-lg transition-all cursor-pointer"
              >
                Queue Control Center
              </button>
              <button 
                onClick={() => navigate('/service-management')}
                className="px-5 py-2 text-xs font-semibold text-slate-600 hover:text-[#755b00] hover:bg-white/40 rounded-lg transition-all cursor-pointer"
              >
                Service Config
              </button>
              <button 
                onClick={() => navigate('/counter-management')}
                className="px-5 py-2 text-xs font-semibold text-slate-600 hover:text-[#755b00] hover:bg-white/40 rounded-lg transition-all cursor-pointer"
              >
                Counter Config
              </button>
              <button 
                className="px-5 py-2 text-xs font-extrabold bg-white shadow-xs text-[#755b00] rounded-lg transition-all"
              >
                System Settings
              </button>
            </div>
          </div>

          {/* Bento-Style Intro and Sync Status Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Intro description card */}
            <div className="md:col-span-2 bg-white rounded-xl p-6 border border-outline-variant/30 shadow-[0px_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-extrabold text-primary uppercase tracking-wider mb-1">Global Configuration</h2>
                <p className="text-xs text-on-surface-variant font-bold max-w-sm">
                  Modify the core SmartQ engine parameters, working operational limits, and priority-aware queue logic.
                </p>
              </div>
              <div className="hidden sm:block text-[#755b00]/15 shrink-0">
                <Sliders className="w-12 h-12" />
              </div>
            </div>

            {/* Sync Status block inside dark theme card */}
            <div className="bg-[#0a1f44] text-white p-6 rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden">
              <div>
                <p className="text-[#7687b2] text-[9px] font-black uppercase tracking-widest mb-2">Sync Status</p>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs font-extrabold">{isBackupLive ? 'Database Live' : 'Out of Sync'}</span>
                </div>
              </div>
              <p className="text-[10px] text-blue-100/60 font-semibold relative z-10">
                Last backup: {lastBackupMins === 0 ? 'Just now' : `${lastBackupMins} mins ago`}
              </p>
              
              {/* Overlay graphics decoration */}
              <div className="absolute right-[-15px] bottom-[-15px] text-white/[0.03] select-none pointer-events-none">
                <Database className="w-24 h-24" />
              </div>
            </div>

          </div>

          {/* Core Configuration Forms Card */}
          <section className="bg-white rounded-xl border border-outline-variant/30 p-6 sm:p-8 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
            <form onSubmit={handleSaveSettings} className="space-y-8">
              
              {/* Branch name & Capacity limitations section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Branch designation input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-[#75777f] tracking-wider flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-[#755b00]" />
                    <span>Branch Name</span>
                  </label>
                  <input 
                    type="text"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="Enter branch identifier"
                    className="w-full bg-[#f3f3f3] border border-outline-variant/50 rounded-lg px-3.5 py-3 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none transition-all"
                  />
                </div>

                {/* Capacity thresholds input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-[#75777f] tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#755b00]" />
                    <span>Max Capacity Threshold</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={maxCapacity}
                      onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#f3f3f3] border border-outline-variant/50 rounded-lg pl-3.5 pr-14 py-3 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                      People
                    </span>
                  </div>
                </div>

              </div>

              <hr className="border-slate-100" />

              {/* Operating hours settings section */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#755b00] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#755b00]" />
                  <span>Operating Hours</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Opening hourly bounds */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Opening Time</label>
                    <div className="relative">
                      <input 
                        type="time"
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                        className="w-full bg-[#f3f3f3] border border-outline-variant/50 rounded-lg px-3.5 py-3 text-xs font-bold text-slate-700 outline-none focus:border-[#755b00]"
                      />
                    </div>
                  </div>

                  {/* Closing hourly bounds */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Closing Time</label>
                    <div className="relative">
                      <input 
                        type="time"
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                        className="w-full bg-[#f3f3f3] border border-outline-variant/50 rounded-lg px-3.5 py-3 text-xs font-bold text-slate-700 outline-none focus:border-[#755b00]"
                      />
                    </div>
                  </div>

                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Rules and Priorities toggles section */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#755b00] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#755b00]" />
                  <span>Priority Rules</span>
                </h3>

                <div className="space-y-3.5">
                  
                  {/* Senior Citizen & assistance rule switch row */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl transition-colors hover:bg-slate-100/60 duration-200">
                    <div className="flex items-center gap-3.5 pr-2">
                      <div className="w-9 h-9 rounded-full bg-[#fed977]/30 text-[#755b00] shrink-0 flex items-center justify-center font-bold">
                        ΓÖ┐
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-extrabold text-primary">Senior Citizens & Accessibility</p>
                        <p className="text-[10px] text-slate-400 font-bold leading-normal">
                          Automatic top-of-queue assignment for priority physical identifiers.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox"
                        checked={seniorCitizenRule}
                        onChange={() => setSeniorCitizenRule(!seniorCitizenRule)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#755b00]"></div>
                    </label>
                  </div>

                  {/* VIP / Corporate high priority account switch row */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl transition-colors hover:bg-slate-100/60 duration-200">
                    <div className="flex items-center gap-3.5 pr-2">
                      <div className="w-9 h-9 rounded-full bg-blue-150 text-blue-700 shrink-0 flex items-center justify-center font-bold">
                        ≡ƒÆÄ
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-extrabold text-primary">VIP & Private Banking Tier</p>
                        <p className="text-[10px] text-slate-400 font-bold leading-normal">
                          Elevate scheduling speed multipliers for premium private wealth status.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox"
                        checked={vipRule}
                        onChange={() => setVipRule(!vipRule)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#755b00]"></div>
                    </label>
                  </div>

                  {/* Quick Express short intervals switch row */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl transition-colors hover:bg-slate-100/60 duration-200">
                    <div className="flex items-center gap-3.5 pr-2">
                      <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 shrink-0 flex items-center justify-center font-bold">
                        ΓÜí
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-extrabold text-primary">Quick Transaction Express</p>
                        <p className="text-[10px] text-slate-400 font-bold leading-normal">
                          Isolate dedicated channels for rapid sub-5 min teller appointments.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox"
                        checked={quickExpressRule}
                        onChange={() => setQuickExpressRule(!quickExpressRule)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#755b00]"></div>
                    </label>
                  </div>

                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Action Buttons footer layout */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    System updates are logged for audit compliance
                  </span>
                </div>

                <div className="flex gap-3">
                  {/* Reset Default configurations actions */}
                  <button 
                    type="button"
                    onClick={handleResetDefaults}
                    className="px-5 py-2.5 text-xs font-bold border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                  
                  {/* Save configurations changes action */}
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 text-xs font-bold bg-[#fed977] hover:bg-[#ffe08f] text-[#241a00] rounded-lg shadow-sm font-semibold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <span className="animate-spin text-sm block">ΓÅ│</span>
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
                  </button>
                </div>
              </div>

            </form>
          </section>

          {/* Maintenance Sandbox section (fully preserve prior specs inside beautifully structured UI) */}
          <section className="bg-white rounded-xl border border-rose-100 p-6 shadow-xs relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  <span>Maintenance Sandbox Central</span>
                </h4>
                <p className="text-[11px] text-slate-400 font-bold">
                  Execute system clearing cycles, flush experimental queues, and create deep database backups.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {/* Clear Active memory cycle */}
                <button 
                  onClick={handleFlushDemoTickets}
                  disabled={isFlushing}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer disabled:opacity-40"
                >
                  {isFlushing ? 'Clearing Core...' : 'Flush Sandbox Demo Queue'}
                </button>
                
                {/* Execute sector backup capture */}
                <button 
                  onClick={handleTriggerSnapshot}
                  disabled={isSnapshotting}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer disabled:opacity-40"
                >
                  {isSnapshotting ? 'Creating Image...' : 'Trigger Full DB Snapshot'}
                </button>
              </div>
            </div>
            {/* Soft decorative background tint */}
            <div className="absolute right-0 bottom-0 top-0 w-24 bg-rose-50/20 translate-x-12 select-none pointer-events-none rotate-12"></div>
          </section>

          {/* Bottom live stats blocks from Stitch UI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-lg border border-outline-variant/30 text-center shadow-xs">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Average Wait</p>
              <p className="text-xl font-extrabold text-primary font-mono tracking-tight">12.4m</p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-outline-variant/30 text-center shadow-xs">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Active Counters</p>
              <p className="text-xl font-extrabold text-primary font-mono tracking-tight">08/12</p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-outline-variant/30 text-center shadow-xs">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Today's Traffic</p>
              <p className="text-xl font-extrabold text-primary font-mono tracking-tight">1,204</p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-outline-variant/30 text-center shadow-xs">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Peak Hour</p>
              <p className="text-xl font-extrabold text-primary font-mono tracking-tight">11:30</p>
            </div>

          </div>

          {/* Footer Branding */}
          <footer className="pt-4 text-center text-on-surface-variant/40 text-[10px] uppercase tracking-widest leading-loose font-bold">
            SmartQ Global Cluster Portal ΓÇó Security Tier Zero Access
          </footer>

        </div>
      </AdminLayout>

      {/* Floating Animated Toast Notifications */}
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-8 right-8 bg-[#0a1f44] text-[#fed977] text-xs font-bold px-5 py-4 rounded-xl shadow-2xl border border-white/10 z-50 flex items-center gap-3 max-w-sm"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0"></span>
          <span className="text-white leading-relaxed font-semibold">{toastMessage}</span>
        </motion.div>
      )}

    </div>
  );
}

// Screen 8: System Integration
interface IntegrationLogItem {
  timestamp: string;
  source: string;
  action: string;
  status: 'Success' | 'Warning' | 'Error';
  latency: string;
}

export function SystemIntegrationScreen() {
  useAdminSecurity(['admin']);
  const navigate = useNavigate();

  // Core configuration parameters
  const [productionUrl, setProductionUrl] = useState('https://api.smartq-banking.enterprise/v1/sync');
  // WARNING: Never store real API keys here. This field is UI-only.
  // Real keys must live in Supabase Edge Functions or your backend, never the browser.
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  // Connection testing states
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);

  // Saving states
  const [isSaving, setIsSaving] = useState(false);

  // Logs state
  const [logs, setLogs] = useState<IntegrationLogItem[]>([
    { timestamp: '2026-06-18 14:42:05', source: 'Oracle DB Master', action: 'Full Sync Transaction', status: 'Success', latency: '124ms' },
    { timestamp: '2026-06-18 14:41:50', source: 'ML Inference Engine', action: 'Queue Wait Prediction', status: 'Success', latency: '38ms' },
    { timestamp: '2026-06-18 14:40:12', source: 'API Gateway', action: 'External Auth Handshake', status: 'Warning', latency: '850ms' },
    { timestamp: '2026-06-18 14:38:44', source: 'PostgreSQL Archive', action: 'Nightly Batch Cleanup', status: 'Success', latency: '2.4s' },
    { timestamp: '2026-06-18 14:35:21', source: 'ML Engine Agent', action: 'Weight Update Push', status: 'Success', latency: '412ms' },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger floating notifications helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Test Connection simulation handler
  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    triggerToast('Initiating handshake credentials validation with gateway host...');

    setTimeout(() => {
      setIsTesting(false);
      setTestResult('success');
      triggerToast('Handshake complete. Connection confirmed (Status Code: 200 OK)');
    }, 1500);
  };

  // Save changes handler
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productionUrl.trim()) {
      alert('Production Endpoint URL is mandatory');
      return;
    }
    setIsSaving(true);
    triggerToast('Synchronizing active external environment credentials...');

    setTimeout(() => {
      setIsSaving(false);
      triggerToast('Production endpoint credentials updated in centralized vaults.');
    }, 1200);
  };

  // CSV download simulator
  const handleDownloadLogs = () => {
    triggerToast('Generating deep structural CSV latency reports logs...');
    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Timestamp,Event Source,Action,Status,Latency\n"
        + logs.map(l => `${l.timestamp},${l.source},${l.action},${l.status},${l.latency}`).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", encodedUri);
      linkElement.setAttribute("download", `smartq_integration_logs.csv`);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      triggerToast('CSV dump file download dispatched successfully.');
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-[#F2F2F2] w-full text-on-surface font-sans select-none">
      <AdminSidebar activeItem="system-integration" />

      <AdminLayout 
        title="System Integration" 
        description="Configure enterprise API endpoints, evaluate machine learning engines, and audit external integration webhooks."
      >
        <div className="space-y-8 max-w-4xl w-full pb-12">
          
          {/* Horizontal Navigation Grid Tabs matching Stitch and SystemSettings */}
          <div className="overflow-x-auto">
            <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl w-max">
              <button 
                onClick={() => navigate('/queue-control-center')}
                className="px-5 py-2 text-xs font-semibold text-slate-600 hover:text-[#755b00] hover:bg-white/40 rounded-lg transition-all cursor-pointer"
              >
                Queue Control Center
              </button>
              <button 
                onClick={() => navigate('/service-management')}
                className="px-5 py-2 text-xs font-semibold text-slate-600 hover:text-[#755b00] hover:bg-white/40 rounded-lg transition-all cursor-pointer"
              >
                Service Config
              </button>
              <button 
                onClick={() => navigate('/counter-management')}
                className="px-5 py-2 text-xs font-semibold text-slate-600 hover:text-[#755b00] hover:bg-white/40 rounded-lg transition-all cursor-pointer"
              >
                Counter Config
              </button>
              <button 
                onClick={() => navigate('/system-data-management')}
                className="px-5 py-2 text-xs font-semibold text-slate-600 hover:text-[#755b00] hover:bg-white/40 rounded-lg transition-all cursor-pointer"
              >
                System Settings
              </button>
              <button 
                className="px-5 py-2 text-xs font-extrabold bg-white shadow-xs text-[#755b00] rounded-lg transition-all"
              >
                Integration
              </button>
            </div>
          </div>

          {/* 1. API Configuration Card */}
          <section className="bg-white rounded-xl border border-outline-variant/30 p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-6">
              <Link className="w-5 h-5 text-[#755b00]" />
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#755b00]">API Configuration</h3>
            </div>

            <form onSubmit={handleSaveChanges} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Production Endpoint URL Input */}
                <div className="space-y-1.5 row-span-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Production Endpoint URL</label>
                  <input 
                    type="text"
                    value={productionUrl}
                    onChange={(e) => setProductionUrl(e.target.value)}
                    placeholder="https://api.smartq-banking.enterprise/v1/sync"
                    className="w-full bg-[#f3f3f3] border border-outline-variant/50 rounded-lg px-3.5 py-2.5 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none transition-all"
                  />
                </div>

                {/* Authorization API Key */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Authorization API Key</label>
                  <div className="relative">
                    <input 
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Auth security tokens..."
                      className="w-full bg-[#f3f3f3] border border-outline-variant/50 rounded-lg pl-3.5 pr-12 py-2.5 text-xs font-mono font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showApiKey ? <X className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              </div>

              {/* Lower Controls Integration */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${testResult === 'success' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {isTesting ? 'Handshake Testing...' : testResult === 'success' ? 'Tested: Connection OK' : 'Ready to Test'}
                  </span>
                </div>

                <div className="flex gap-2.5 w-full sm:w-auto">
                  {/* Test Connection Buttons */}
                  <button 
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-[#00081e] hover:opacity-90 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
                  >
                    {isTesting ? (
                      <span className="animate-spin">ΓÅ│</span>
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                  </button>

                  {/* Save Settings Form submit parameter */}
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-[#fed977] hover:bg-[#ffe08f] text-[#241a00] rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
                  >
                    {isSaving ? (
                      <span className="animate-spin">ΓÅ│</span>
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* 2. Database Status Card */}
          <section className="bg-white rounded-xl border border-outline-variant/30 p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-[#755b00]" />
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#755b00]">Database Status</h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] uppercase font-black tracking-wider text-green-700">Connected</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-4 bg-[#f3f3f3] rounded-xl border border-outline-variant/20 flex flex-col justify-center">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Last Synchronized</span>
                <span className="font-extrabold text-xs text-primary mt-1.5 font-mono">Today, 14:42:05</span>
              </div>

              <div className="p-4 bg-[#f3f3f3] rounded-xl border border-outline-variant/20 flex flex-col justify-center">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Total Record Count</span>
                <span className="font-extrabold text-xs text-primary mt-1.5 font-mono">1,248,592 rows</span>
              </div>

              <div className="p-4 bg-[#f3f3f3] rounded-xl border border-outline-variant/20 flex flex-col justify-center">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Sync Frequency</span>
                <span className="font-extrabold text-xs text-primary mt-1.5 font-mono">Real-time Push/Pull</span>
              </div>

            </div>
          </section>

          {/* 3. ML Model Status Card */}
          <section className="bg-white rounded-xl border border-outline-variant/30 p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-[#755b00]" />
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#755b00]">ML Model Status</h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-700">Active</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Neurology visual icon wrapper */}
              <div className="relative w-24 h-24 flex items-center justify-center bg-[#0a1f44] rounded-full overflow-hidden text-[#fed977]/30 shadow-inner">
                <Sparkles className="w-10 h-10 text-[#fed977]" />
              </div>

              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 w-full text-center md:text-left">
                
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Model Version</span>
                  <p className="font-extrabold text-xs text-primary mt-1">v2.4.0 (Enterprise)</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Current Accuracy</span>
                  <p className="font-extrabold text-xs text-primary mt-1 font-mono">98.4%</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Inference Latency</span>
                  <p className="font-extrabold text-xs text-primary mt-1 font-mono">42ms</p>
                </div>

                <div className="flex flex-col justify-center items-center md:items-start">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Wait Prediction</span>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wide bg-[#fed977] text-[#241a00] border border-[#fed977]">
                    Optimized
                  </span>
                </div>

              </div>
            </div>
          </section>

          {/* 4. Integration Logs Table Card */}
          <section className="bg-white rounded-xl border border-outline-variant/30 shadow-[0px_4px_12px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-[#755b00]" />
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#755b00]">Integration Logs</h3>
              </div>
              <button 
                onClick={handleDownloadLogs}
                className="text-xs font-extrabold text-[#755b00] hover:underline cursor-pointer"
              >
                Download Full Log (CSV)
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead className="bg-[#00081e] text-white">
                  <tr className="uppercase tracking-wider text-[10px] font-bold font-mono">
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Event Source</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-primary font-semibold">
                  {logs.map((item, index) => (
                    <tr 
                      key={index}
                      className={`transition-colors hover:bg-slate-50 duration-150 ${index % 2 === 1 ? 'bg-[#f9f9f9]' : 'bg-white'}`}
                    >
                      <td className="px-6 py-4 font-mono font-bold text-slate-500 text-[11px]">
                        {item.timestamp}
                      </td>
                      <td className="px-6 py-4 text-primary font-extrabold">
                        {item.source}
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant font-bold">
                        {item.action}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide border ${
                          item.status === 'Success' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-extrabold text-[11px] text-slate-500">
                        {item.latency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Footer lock bottom */}
          <footer className="pt-4 text-center text-on-surface-variant/40 text-[10px] uppercase tracking-widest leading-loose font-bold">
            SmartQ Gateway Hub Core ΓÇó Branch Tunnel System
          </footer>

        </div>
      </AdminLayout>

      {/* Floating Animated Toast Notifications */}
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-8 right-8 bg-[#0a1f44] text-[#fed977] text-xs font-bold px-5 py-4 rounded-xl shadow-2xl border border-white/10 z-50 flex items-center gap-3 max-w-sm"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0"></span>
          <span className="text-white leading-relaxed font-semibold">{toastMessage}</span>
        </motion.div>
      )}

    </div>
  );
}
