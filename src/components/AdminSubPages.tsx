import { supabase } from '../supabaseClient';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import NotificationBell from './NotificationBell';
import StaffNotificationBell from './StaffNotificationBell';
import ManagementNotificationBell from './ManagementNotificationBell';
import { deviceAlert, getAlertPermission, requestAlertPermission } from './ticketAlerts';
import { predictWaitMinutes, isPeakHour } from '../ml/waitTimeModel';
import { 
  Landmark, 
  LogOut, 
  Settings as SettingsIcon,
  LayoutDashboard,
  Activity,
  TrendingUp,
  FileText,
  Users2,
  Sliders,
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
  const userRole = localStorage.getItem('userRole') || 'customer';
  const isAdmin = userRole === 'admin';

  const handleLogout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('activeTicket');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('employeeId');
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
          <span>Dashboard</span>
        </button>

        {/* Manager only */}
        {userRole === 'manager' && (
          <>
            <button 
              onClick={() => navigate('/status-monitoring')}
              className={`flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all ${
                activeItem === 'status-monitoring' ? 'text-on-secondary-container bg-secondary-container shadow-sm font-semibold' : 'text-blue-100/60 hover:bg-white/5'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span>Status Monitoring</span>
            </button>

            <button 
              onClick={() => navigate('/analytics')}
              className={`flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all ${
                activeItem === 'analytics' ? 'text-on-secondary-container bg-secondary-container shadow-sm font-semibold' : 'text-blue-100/60 hover:bg-white/5'
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>Analytics</span>
            </button>

            <button 
              onClick={() => navigate('/reports')}
              className={`flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all ${
                activeItem === 'reports' ? 'text-on-secondary-container bg-secondary-container shadow-sm font-semibold' : 'text-blue-100/60 hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Reports</span>
            </button>
          </>
        )}

        {/* Admin only */}
        {isAdmin && (
          <>
            <button 
              onClick={() => navigate('/user-management')}
              className={`flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all ${
                activeItem === 'user-management' ? 'text-on-secondary-container bg-secondary-container shadow-sm font-semibold' : 'text-blue-100/60 hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>User Management</span>
            </button>
            <button 
              onClick={() => navigate('/service-management')}
              className={`flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all ${
                activeItem === 'service-management' ? 'text-on-secondary-container bg-secondary-container shadow-sm font-semibold' : 'text-blue-100/60 hover:bg-white/5'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Service Management</span>
            </button>
            <button 
              onClick={() => navigate('/counter-management')}
              className={`flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all ${
                activeItem === 'counter-management' ? 'text-on-secondary-container bg-secondary-container shadow-sm font-semibold' : 'text-blue-100/60 hover:bg-white/5'
              }`}
            >
              <Layout className="w-4 h-4 shrink-0" />
              <span>Counter Management</span>
            </button>
          </>
        )}

        <div className="mt-auto border-t border-on-primary-container/20 pt-4 flex flex-col gap-2">
          <button 
            onClick={() => navigate('/my-profile')}
            className={`flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all ${
              activeItem === 'my-profile' ? 'text-on-secondary-container bg-secondary-container shadow-sm font-semibold' : 'text-blue-100/60 hover:bg-white/5'
            }`}
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
      <header className="fixed top-0 right-0 h-[60px] w-full md:ml-[250px] md:w-[calc(100%-250px)] bg-surface-container-lowest shadow-sm border-b border-outline-variant/65 flex justify-between items-center px-4 md:px-8 z-40">
        <span className="font-semibold text-lg text-primary tracking-tight">{title}</span>
        <div className="flex items-center gap-3">
          {userRole === 'customer' ? (
            <NotificationBell />
          ) : userRole === 'staff' ? (
            <StaffNotificationBell />
          ) : (
            <ManagementNotificationBell role={userRole === 'admin' ? 'admin' : 'manager'} />
          )}
          <div className="text-right">
            <span className="text-xs font-bold text-primary block capitalize leading-none mb-1">{namePrefix}</span>
            <span className="text-[10px] text-on-surface-variant font-medium block uppercase tracking-wider">{userRole}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden border-2 border-secondary-container shadow-sm flex items-center justify-center text-white font-bold text-sm">
            {namePrefix.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="md:ml-[250px] pt-[80px] flex-grow min-h-screen p-4 md:p-8 bg-[#F2F2F2]">
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

  // Operational window and SLA thresholds (local time). Change these in one
  // place if the branch schedule or service targets move.
  const OPEN_HOUR = 8;
  const CLOSE_HOUR = 18;
  const SLA_EXCELLENT_MIN = 5;
  const SLA_HEALTHY_MIN = 15;

  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ---- Local-time date helpers ----
  const startOfDay = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };
  const addDays = (d: Date, days: number) => {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + days);
    return copy;
  };

  const now = new Date();
  const todayStart = startOfDay(now);
  const currentDays = timeFilter === 'today' ? 1 : timeFilter === 'week' ? 7 : 30;
  const rangeStart = timeFilter === 'today' ? todayStart : addDays(todayStart, -(currentDays - 1));
  const rangeEnd = now;
  const prevStart = timeFilter === 'today' ? addDays(todayStart, -1) : addDays(rangeStart, -currentDays);
  const prevEnd = rangeStart;

  // ---- Load real queue data (paginated, refreshed every 30s) ----
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    const loadAnalytics = async () => {
      const nowTs = new Date();
      const sevenDaysAgo = new Date(nowTs.getTime() - 7 * 24 * 60 * 60 * 1000);
      const fetchFrom = new Date(Math.min(prevStart.getTime(), sevenDaysAgo.getTime()));

      const PAGE = 1000;
      const collected: any[] = [];
      let from = 0;

      try {
        // Supabase caps responses at 1000 rows, so page until a short page arrives.
        while (!cancelled) {
          const { data, error } = await supabase
            .from('queues')
            .select('id, service_name, status, created_at, called_at, completed_at, counter_id, estimated_wait')
            .gte('created_at', fetchFrom.toISOString())
            .order('created_at', { ascending: true })
            .range(from, from + PAGE - 1);

          if (error) {
            console.error('AnalyticsScreen: failed to load queue analytics', error.message);
            if (!cancelled) { setRows([]); setIsLoading(false); }
            return;
          }

          const page = (data || []) as any[];
          collected.push(...page);
          if (page.length < PAGE) break;
          from += PAGE;
        }

        if (!cancelled) {
          setRows(collected);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('AnalyticsScreen: failed to load queue analytics', err);
        if (!cancelled) { setRows([]); setIsLoading(false); }
      }
    };

    setIsLoading(true);
    loadAnalytics();
    timer = setInterval(loadAnalytics, 30000);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [timeFilter]);

  // ---- Formatting helpers ----
  const formatMmSs = (ms: number | null): string => {
    if (ms === null || !Number.isFinite(ms)) return '--:--';
    const total = Math.max(0, Math.round(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };
  const formatMmSsOrDash = (ms: number | null): string =>
    ms === null || !Number.isFinite(ms) ? '—' : formatMmSs(ms);
  const formatCompact = (n: number): string =>
    n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n);
  const formatHourLabel = (hour: number): string => {
    const suffix = hour < 12 ? 'AM' : 'PM';
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${h12}:00 ${suffix}`;
  };
  const mean = (vals: number[]): number | null =>
    vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  const pctChange = (current: number | null, previous: number | null): number | null =>
    current !== null && previous !== null && previous > 0
      ? ((current - previous) / previous) * 100
      : null;

  // ---- Aggregate the fetched rows in JavaScript ----
  const toTime = (value: string | null | undefined): number | null => {
    if (!value) return null;
    const t = new Date(value).getTime();
    return Number.isFinite(t) ? t : null;
  };

  const enriched = rows.map((r: any) => {
    const createdMs = toTime(r.created_at);
    const calledMs = toTime(r.called_at);
    const completedMs = toTime(r.completed_at);
    const waitMs = createdMs !== null && calledMs !== null && calledMs >= createdMs ? calledMs - createdMs : null;
    const serviceMs = calledMs !== null && completedMs !== null && completedMs >= calledMs ? completedMs - calledMs : null;
    return { ...r, createdMs, calledMs, completedMs, waitMs, serviceMs };
  });

  const inWindow = (t: number | null, start: Date, end: Date) =>
    t !== null && t >= start.getTime() && t < end.getTime();

  const periodRows = enriched.filter(r => inWindow(r.createdMs, rangeStart, rangeEnd));
  const prevRows = enriched.filter(r => inWindow(r.createdMs, prevStart, prevEnd));
  const periodCalled = enriched.filter(r => inWindow(r.calledMs, rangeStart, rangeEnd));
  const prevCalled = enriched.filter(r => inWindow(r.calledMs, prevStart, prevEnd));
  const justWaits = (list: typeof enriched) =>
    list.map(r => r.waitMs).filter((v): v is number => v !== null);

  // Prediction accuracy for the selected period: completed tickets in the
  // period that carry both a prediction and a call time. Actual wait and
  // errors are in minutes (actual = called_at - created_at).
  const predictionStats = (() => {
    const evaluated = periodRows.filter(
      r =>
        r.status === 'completed' &&
        r.estimated_wait !== null &&
        r.estimated_wait !== undefined &&
        r.calledMs !== null
    );
    if (evaluated.length === 0) return null;

    let accurateCount = 0;
    let absErrorSum = 0;
    let signedErrorSum = 0;
    for (const r of evaluated) {
      const actualMin = Math.round(((r.calledMs as number) - (r.createdMs as number)) / 60000);
      const predicted = Number(r.estimated_wait);
      const diff = actualMin - predicted;
      if (Math.abs(diff) <= Math.max(5, 0.25 * predicted)) accurateCount++;
      absErrorSum += Math.abs(diff);
      signedErrorSum += diff;
    }
    const count = evaluated.length;
    return {
      evaluated: count,
      accuratePct: Math.round((accurateCount / count) * 100),
      meanError: Math.round((absErrorSum / count) * 10) / 10,
      signedError: Math.round((signedErrorSum / count) * 10) / 10
    };
  })();

  // Customers Served
  const servedCurrent = periodRows.filter(r => r.status === 'completed').length;
  const servedPrev = prevRows.filter(r => r.status === 'completed').length;
  const servedChange = pctChange(servedCurrent, servedPrev);

  // Average wait time (tickets whose called_at falls inside the window)
  const waitCurrent = mean(justWaits(periodCalled));
  const waitPrev = mean(justWaits(prevCalled));
  const waitChange = pctChange(waitCurrent, waitPrev);

  // Peak hour (most tickets created, by local hour)
  const hourCounts = new Map<number, number>();
  periodRows.forEach(r => {
    const h = new Date(r.createdMs as number).getHours();
    hourCounts.set(h, (hourCounts.get(h) || 0) + 1);
  });
  let peakHour: number | null = null;
  let peakCount = 0;
  hourCounts.forEach((count, hour) => {
    if (count > peakCount) { peakCount = count; peakHour = hour; }
  });

  // Counter utilisation
  const availableMinutes = (isPrevious: boolean) => {
    if (timeFilter === 'today' && !isPrevious) {
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      return Math.max(0, Math.min(nowMinutes, CLOSE_HOUR * 60) - OPEN_HOUR * 60);
    }
    const days = timeFilter === 'today' ? 1 : currentDays;
    return days * (CLOSE_HOUR - OPEN_HOUR) * 60;
  };

  const buildCounterUtil = (list: typeof enriched, available: number) => {
    const found = Array.from(
      new Set(list.map(r => r.counter_id).filter((c): c is string => !!c))
    );
    const serviceByCounter = new Map<string, number>();
    list.forEach(r => {
      if (r.counter_id && r.status === 'completed' && r.serviceMs !== null) {
        serviceByCounter.set(r.counter_id, (serviceByCounter.get(r.counter_id) || 0) + r.serviceMs);
      }
    });
    const util = new Map<string, number>();
    found.forEach(counter => {
      const ms = serviceByCounter.get(counter) || 0;
      const pct = available > 0 ? (ms / (available * 60000)) * 100 : 0;
      util.set(counter, Math.min(100, Math.max(0, pct)));
    });
    return util;
  };

  const currentCounterUtil = buildCounterUtil(periodRows, availableMinutes(false));
  const prevCounterUtil = buildCounterUtil(prevRows, availableMinutes(true));
  const averageOf = (m: Map<string, number>) =>
    m.size ? Array.from(m.values()).reduce((a, b) => a + b, 0) / m.size : null;
  const avgUtilCurrent = averageOf(currentCounterUtil);
  const avgUtilPrev = averageOf(prevCounterUtil);
  const utilChange = pctChange(avgUtilCurrent, avgUtilPrev);
  const counterList = Array.from(currentCounterUtil.keys());

  // Hourly volume bars
  const dataHours = Array.from(hourCounts.keys());
  const firstHour = dataHours.length ? Math.min(OPEN_HOUR, ...dataHours) : OPEN_HOUR;
  const lastHour = dataHours.length ? Math.max(CLOSE_HOUR, ...dataHours) : CLOSE_HOUR;
  const hourlyBars: { hour: number; count: number }[] = [];
  for (let h = firstHour; h <= lastHour; h++) {
    hourlyBars.push({ hour: h, count: hourCounts.get(h) || 0 });
  }
  const maxHourly = hourlyBars.reduce((m, b) => Math.max(m, b.count), 0);

  // Wait time trend - always the last 7 days regardless of the filter
  const trendStart = startOfDay(addDays(now, -6));
  const trendEnd = new Date(now.getTime() + 86400000);
  const trendRows = enriched.filter(r => inWindow(r.calledMs, trendStart, trendEnd));
  const trendWaits = justWaits(trendRows);
  const trendMin = trendWaits.length ? Math.min(...trendWaits) : null;
  const trendMax = trendWaits.length ? Math.max(...trendWaits) : null;
  const trendAvg = mean(trendWaits);
  const trendBuckets: number[][] = Array.from({ length: 7 }, () => []);
  trendRows.forEach(r => {
    if (r.calledMs === null || r.waitMs === null) return;
    const dayIndex = Math.floor(
      (startOfDay(new Date(r.calledMs)).getTime() - trendStart.getTime()) / 86400000
    );
    if (dayIndex >= 0 && dayIndex < 7) trendBuckets[dayIndex].push(r.waitMs);
  });
  const trendPoints = trendBuckets
    .map((vals, day) => ({ day, avg: mean(vals) }))
    .filter((p): p is { day: number; avg: number } => p.avg !== null);
  const maxTrend = trendPoints.length ? Math.max(...trendPoints.map(p => p.avg)) : 0;
  const trendCoords = trendPoints.map(p => ({
    ...p,
    x: trendPoints.length === 1 ? 200 : (p.day / 6) * 400,
    y: maxTrend > 0 ? 140 - (p.avg / maxTrend) * 120 : 75,
  }));
  const trendPath = trendCoords.length >= 2
    ? trendCoords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ')
    : '';
  const trendArea = trendCoords.length >= 2
    ? `${trendPath} L${trendCoords[trendCoords.length - 1].x.toFixed(1)},150 L${trendCoords[0].x.toFixed(1)},150 Z`
    : '';

  // Service distribution
  const serviceCounts = new Map<string, number>();
  periodRows.forEach(r => {
    const name = r.service_name || 'Unspecified';
    serviceCounts.set(name, (serviceCounts.get(name) || 0) + 1);
  });
  const serviceTotal = periodRows.length;
  const servicePalette = ['#0A1F44', '#755b00', '#fed977', '#e2e2e2', '#4c5e86', '#b4c6f4'];
  const serviceDist = Array.from(serviceCounts.entries())
    .map(([name, count]) => ({
      name,
      count,
      percent: serviceTotal ? (count / serviceTotal) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .map((s, i) => ({ ...s, color: servicePalette[i % servicePalette.length] }));
  let cumulative = 0;
  const donutSegments = serviceDist.map(s => {
    const start = cumulative;
    cumulative += s.percent;
    return `${s.color} ${start}% ${cumulative}%`;
  });
  const donutBackground = donutSegments.length
    ? `conic-gradient(${donutSegments.join(', ')})`
    : 'conic-gradient(#e2e2e2 0% 100%)';

  // Performance summary rows, one per real service name
  const summary = serviceDist.map(s => {
    const forService = periodRows.filter(r => (r.service_name || 'Unspecified') === s.name);
    const avgWaitMs = mean(forService.map(r => r.waitMs).filter((v): v is number => v !== null));
    const avgServiceMs = mean(forService.map(r => r.serviceMs).filter((v): v is number => v !== null));
    const avgWaitMin = avgWaitMs !== null ? avgWaitMs / 60000 : null;
    let sla = 'NO DATA';
    if (avgWaitMin !== null) {
      if (avgWaitMin <= SLA_EXCELLENT_MIN) sla = 'EXCELLENT';
      else if (avgWaitMin <= SLA_HEALTHY_MIN) sla = 'HEALTHY';
      else sla = 'ATTENTION';
    }
    return { service: s.name, tickets: forService.length, avgWaitMs, avgServiceMs, sla };
  });

  const changeBadge = (change: number | null, increaseIsGood: boolean) => {
    if (change === null || !Number.isFinite(change)) return null;
    const up = change > 0;
    const down = change < 0;
    const good = increaseIsGood ? up : down;
    const cls = !up && !down
      ? 'text-on-surface-variant bg-surface-container'
      : good
        ? 'text-green-700 bg-green-50'
        : 'text-red-700 bg-red-50';
    return (
      <div className={`flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold ${cls}`}>
        {up && <TrendingUp className="w-3.5 h-3.5 mr-1" />}
        {down && <TrendingDown className="w-3.5 h-3.5 mr-1" />}
        <span>{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  const slaBadge = (sla: string) => {
    if (sla === 'EXCELLENT') {
      return (
        <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full font-bold uppercase tracking-wider text-[9px] border border-green-300">
          Excellent
        </span>
      );
    }
    if (sla === 'HEALTHY') {
      return (
        <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full font-bold uppercase tracking-wider text-[9px] border border-green-200">
          Healthy
        </span>
      );
    }
    if (sla === 'ATTENTION') {
      return (
        <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-full font-bold uppercase tracking-wider text-[9px] border border-red-200">
          Attention
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 bg-surface-container text-outline rounded-full font-bold uppercase tracking-wider text-[9px] border border-outline-variant/40">
        No Data
      </span>
    );
  };

  const handleExport = () => {
    const header = ['Service Category', 'Tickets Issued', 'Avg Wait', 'Avg Service', 'SLA Status'];
    const lines = [header.join(',')];
    summary.forEach(row => {
      const cols = [
        row.service,
        String(row.tickets),
        formatMmSsOrDash(row.avgWaitMs),
        formatMmSsOrDash(row.avgServiceMs),
        row.sla,
      ];
      lines.push(cols.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smartq-performance-${timeFilter}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportToast('Performance summary exported as CSV.');
    setTimeout(() => setExportToast(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex">
        <AdminSidebar activeItem="analytics" />
        <div className="flex-grow">
          <AdminLayout
            title="Analytics Dashboard"
            description="Live insight monitor of ticket volumes, counter operations, and average branch wait durations."
          >
            <div className="py-20 text-center">
              <p className="text-sm text-on-surface-variant font-medium animate-pulse">Loading analytics…</p>
            </div>
          </AdminLayout>
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex">
        <AdminSidebar activeItem="analytics" />
        <div className="flex-grow">
          <AdminLayout
            title="Analytics Dashboard"
            description="Live insight monitor of ticket volumes, counter operations, and average branch wait durations."
          >
            <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-16 text-center">
              <p className="text-sm font-bold text-primary">No queue activity yet</p>
              <p className="text-xs text-on-surface-variant font-medium mt-1">
                There is no ticket data for the selected period.
              </p>
            </div>
          </AdminLayout>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar activeItem="analytics" />
      <div className="flex-grow">
        <AdminLayout 
          title="Analytics Dashboard" 
          description="Live insight monitor of ticket volumes, counter operations, and average branch wait durations."
        >
          {/* Custom Sub-Header with filter buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-outline-variant/30 mb-6">
            <div>
              <span className="text-[10px] text-secondary font-bold tracking-widest uppercase">BRANCH TELEMETRY</span>
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
            {/* KPI 1: Customers Served */}
            <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-secondary-fixed/50 rounded-xl">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                {changeBadge(servedChange, true)}
              </div>
              <h4 className="text-on-surface-variant text-[11px] uppercase tracking-wider font-extrabold">Customers Served</h4>
              <p className="text-3xl font-black text-primary mt-1">{servedCurrent.toLocaleString()}</p>
            </div>

            {/* KPI 2: Avg Wait Time */}
            <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-fixed rounded-xl">
                  <Clock className="w-5 h-5 text-[#041a3f]" />
                </div>
                {changeBadge(waitChange, false)}
              </div>
              <h4 className="text-on-surface-variant text-[11px] uppercase tracking-wider font-extrabold">Avg Wait Time</h4>
              <p className="text-3xl font-black text-primary mt-1">
                {waitCurrent !== null ? formatMmSs(waitCurrent) : '--:--'}
                <span className="text-xs font-semibold text-on-surface-variant ml-1">min</span>
              </p>
            </div>

            {/* KPI 3: Peak Hour */}
            <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-surface-container rounded-xl">
                  <TrendingUp className="w-5 h-5 text-on-surface" />
                </div>
                {peakHour !== null && (
                  <div className="flex items-center text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-lg text-[10px] font-bold">
                    <span>{peakCount} tickets</span>
                  </div>
                )}
              </div>
              <h4 className="text-on-surface-variant text-[11px] uppercase tracking-wider font-extrabold">Peak Hour</h4>
              <p className="text-3xl font-black text-primary mt-1">{peakHour !== null ? formatHourLabel(peakHour) : '—'}</p>
            </div>

            {/* KPI 4: Counter Utilisation */}
            <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-secondary-container rounded-xl">
                  <Sliders className="w-5 h-5 text-on-secondary-container" />
                </div>
                {changeBadge(utilChange, true)}
              </div>
              <h4 className="text-on-surface-variant text-[11px] uppercase tracking-wider font-extrabold">Counter Utilisation</h4>
              <p className="text-3xl font-black text-primary mt-1">{avgUtilCurrent !== null ? `${avgUtilCurrent.toFixed(1)}%` : '—'}</p>
            </div>
          </div>

          {/* Row 2: Main Charts Bento Layout */}
          <div className="grid grid-cols-12 gap-6 mb-8 text-on-surface">
            {/* Hourly Volume Bar Chart */}
            <div className="col-span-12 lg:col-span-7 bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-primary">Hourly Customer Volume</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5 font-medium">Tickets issued by hour</p>
                </div>
                <span className="text-[10px] tracking-wider uppercase bg-[#fed977]/30 text-[#755b00] px-3 py-1 rounded-full font-extrabold">Live Data</span>
              </div>

              <div className="h-[220px] flex items-end justify-between gap-1.5 px-2 relative pt-6">
                {hourlyBars.map((bar) => {
                  const percentHeight = maxHourly > 0 ? `${(bar.count / maxHourly) * 100}%` : '0%';
                  const isPeak = peakHour !== null && bar.hour === peakHour;
                  return (
                    <div 
                      key={bar.hour}
                      className="flex-grow flex flex-col items-center group relative cursor-pointer"
                      onMouseEnter={() => setHoveredBar(bar.hour)}
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
                          {bar.count} tickets
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-extrabold border-t border-outline-variant/10 pt-2 font-mono">
                {hourlyBars.map((bar) => (
                  <span key={bar.hour} className="flex-grow text-center">
                    {`${String(bar.hour).padStart(2, '0')}:00`}
                  </span>
                ))}
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
                  <p className="text-blue-100/60 text-xs mb-6 font-medium">Average wait duration across the last 7 days</p>
                </div>

                <div className="h-[140px] relative mt-2">
                  {trendCoords.length >= 2 ? (
                    <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#fed977" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#fed977" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {trendArea && <path d={trendArea} fill="url(#chartGrad)" />}
                      <path 
                        d={trendPath} 
                        fill="none" 
                        stroke="#fed977" 
                        strokeLinecap="round" 
                        strokeWidth="3.5" 
                      />
                      {trendCoords.map((c, i) => (
                        <circle
                          key={i}
                          cx={c.x}
                          cy={c.y}
                          fill="#fed977"
                          r={i === trendCoords.length - 1 ? 6 : 4}
                        />
                      ))}
                    </svg>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-blue-100/60 text-xs font-semibold">Not enough data yet</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-4">
                  <div className="text-center">
                    <span className="block text-[#ffe08f] text-[9px] uppercase tracking-wider font-extrabold">Min</span>
                    <span className="text-white font-bold text-xs font-mono">{formatMmSsOrDash(trendMin)}</span>
                  </div>
                  <div className="text-center border-x border-white/10 px-8">
                    <span className="block text-[#ffe08f] text-[9px] uppercase tracking-wider font-extrabold">Avg</span>
                    <span className="text-white font-bold text-xs font-mono">{formatMmSsOrDash(trendAvg)}</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[#ffe08f] text-[9px] uppercase tracking-wider font-extrabold">Max</span>
                    <span className="text-white font-bold text-xs font-mono">{formatMmSsOrDash(trendMax)}</span>
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
                    style={{ background: donutBackground }}
                  />
                  <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] text-on-surface-variant uppercase font-extrabold tracking-wider">Total</span>
                    <span className="text-sm font-bold text-primary font-mono">{formatCompact(serviceTotal)}</span>
                  </div>
                </div>

                <div className="flex-grow w-full space-y-3 font-semibold text-xs text-on-surface-variant">
                  {serviceDist.length > 0 ? (
                    serviceDist.map((s) => (
                      <div key={s.name} className="flex items-center justify-between p-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }}></span>
                          <span className="truncate">{s.name}</span>
                        </div>
                        <span className="font-mono text-primary font-extrabold">{s.percent.toFixed(0)}%</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-outline font-semibold">No service data yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Counter efficiency */}
            {/* Counter efficiency */}
            <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6 flex flex-col justify-between">
              <h3 className="text-base font-extrabold text-primary mb-6">Counter Efficiency</h3>
              
              <div className="space-y-4">
                {counterList.length > 0 ? (
                  counterList.map((counter) => {
                    const util = currentCounterUtil.get(counter) ?? 0;
                    return (
                      <div key={counter} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold font-mono">
                          <span className="text-on-surface-variant font-semibold">{counter}</span>
                          <span className="text-primary font-extrabold">{util.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${util}%` }} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-outline font-semibold">No counter activity yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Row 3.5: Prediction Accuracy for the selected period */}
          <div className="mb-8 text-on-surface">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-primary">Prediction Accuracy</h3>
              <span className="text-[10px] tracking-wider uppercase bg-[#fed977]/30 text-[#755b00] px-3 py-1 rounded-full font-extrabold">
                Selected period
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all p-6">
                <h4 className="text-on-surface-variant text-[11px] uppercase tracking-wider font-extrabold">Tickets Evaluated</h4>
                <p className="text-3xl font-black text-primary mt-1">{predictionStats ? predictionStats.evaluated : '—'}</p>
              </div>
              <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all p-6">
                <h4 className="text-on-surface-variant text-[11px] uppercase tracking-wider font-extrabold">Accurate (%)</h4>
                <p className="text-3xl font-black text-primary mt-1">{predictionStats ? `${predictionStats.accuratePct}%` : '—'}</p>
              </div>
              <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all p-6">
                <h4 className="text-on-surface-variant text-[11px] uppercase tracking-wider font-extrabold">Mean Error (min)</h4>
                <p className="text-3xl font-black text-primary mt-1">{predictionStats ? predictionStats.meanError : '—'}</p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant font-medium mt-3">
              {predictionStats === null
                ? 'Not enough completed tickets yet.'
                : Math.abs(predictionStats.signedError) <= 1
                  ? 'Predictions are on target on average.'
                  : predictionStats.signedError > 0
                    ? `Predictions are running about ${Math.abs(predictionStats.signedError).toFixed(1)} min too low.`
                    : `Predictions are running about ${Math.abs(predictionStats.signedError).toFixed(1)} min too high.`}
            </p>
          </div>

          {/* Row 4: Performance Summary Table */}
          <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden text-on-surface">
            <div className="p-6 pb-4 flex justify-between items-center border-b border-outline-variant/10">
              <div>
                <h3 className="text-base font-extrabold text-primary">Performance Summary by Service Type</h3>
                <p className="text-xs text-on-surface-variant mt-0.5 font-medium">Service level agreement indexes for the selected period</p>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 font-semibold text-on-surface-variant">
                  {summary.length > 0 ? (
                    summary.map((row, idx) => (
                      <tr
                        key={row.service}
                        className={idx % 2 === 0 ? 'hover:bg-surface-container/20 transition-colors bg-white' : 'hover:bg-surface-container/20 transition-colors bg-surface-container/5'}
                      >
                        <td className="px-6 py-4 font-bold text-primary">{row.service}</td>
                        <td className="px-6 py-4 font-mono font-bold">{row.tickets}</td>
                        <td className="px-6 py-4 font-mono">{formatMmSsOrDash(row.avgWaitMs)}</td>
                        <td className="px-6 py-4 font-mono">{formatMmSsOrDash(row.avgServiceMs)}</td>
                        <td className="px-6 py-4">{slaBadge(row.sla)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-outline font-semibold">
                        No service performance data yet.
                      </td>
                    </tr>
                  )}
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
interface ReportQueueRow {
  service_name: string | null;
  status: string;
  counter_id: string | null;
  created_at: string;
  called_at: string | null;
  completed_at: string | null;
}

interface ReportResult {
  columns: string[];
  rows: (string | number)[][];
  periodLabel: string;
  totalTickets: number;
}

const REPORT_PAGE_SIZE = 1000;
const REPORT_OPEN_HOUR = 8;
const REPORT_CLOSE_HOUR = 18;

function reportStartOfDay(offsetDays = 0): Date {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  d.setDate(d.getDate() + offsetDays);
  return d;
}

function reportHourLabel(h: number): string {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}${suffix}`;
}

function formatWaitMs(ms: number): string {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function reportDayLabel(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function resolveReportPeriod(
  dateRange: string,
  customFrom: string,
  customTo: string
): { start: Date; end: Date; label: string } | null {
  const now = new Date();
  const endToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  if (dateRange === 'Last 7 Days') {
    const start = reportStartOfDay(-6);
    return { start, end: endToday, label: `Last 7 days (${reportDayLabel(start)} – ${reportDayLabel(endToday)})` };
  }
  if (dateRange === 'Current Month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { start, end: endToday, label: `Current month (${start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})` };
  }
  if (dateRange === 'Last Quarter') {
    const start = reportStartOfDay(-89);
    return { start, end: endToday, label: `Last quarter (${reportDayLabel(start)} – ${reportDayLabel(endToday)})` };
  }
  // Custom Range
  if (!customFrom || !customTo) return null;
  const from = new Date(`${customFrom}T00:00:00`);
  const to = new Date(`${customTo}T23:59:59.999`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) return null;
  return { start: from, end: to, label: `Custom range (${reportDayLabel(from)} – ${reportDayLabel(to)})` };
}

async function fetchReportRows(
  start: Date,
  end: Date,
  serviceFilter: string,
  counterFilter: string
): Promise<ReportQueueRow[]> {
  const rows: ReportQueueRow[] = [];
  let from = 0;
  for (;;) {
    let query = supabase
      .from('queues')
      .select('service_name, status, counter_id, created_at, called_at, completed_at')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());
    if (serviceFilter !== 'All Services') query = query.eq('service_name', serviceFilter);
    if (counterFilter !== 'All Counters') query = query.eq('counter_id', counterFilter);
    const { data, error } = await query
      .order('created_at', { ascending: true })
      .range(from, from + REPORT_PAGE_SIZE - 1);
    if (error) {
      console.error('Failed to load report data:', error.message);
      throw new Error(error.message);
    }
    const batch = (data ?? []) as ReportQueueRow[];
    rows.push(...batch);
    if (batch.length < REPORT_PAGE_SIZE) break;
    from += REPORT_PAGE_SIZE;
  }
  return rows;
}

function computeReport(
  type: string,
  rows: ReportQueueRow[],
  period: { start: Date; end: Date }
): { columns: string[]; rows: (string | number)[][] } {
  const waitOf = (r: ReportQueueRow): number | null =>
    r.called_at ? new Date(r.called_at).getTime() - new Date(r.created_at).getTime() : null;
  const serviceTimeOf = (r: ReportQueueRow): number | null =>
    r.called_at && r.completed_at
      ? new Date(r.completed_at).getTime() - new Date(r.called_at).getTime()
      : null;
  const avg = (vals: number[]): number | null => (vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null);

  if (type === 'Service Efficiency') {
    const groups = new Map<string, ReportQueueRow[]>();
    for (const r of rows) {
      const key = r.service_name || 'Unknown service';
      const list = groups.get(key) ?? [];
      list.push(r);
      groups.set(key, list);
    }
    const table: (string | number)[][] = [];
    for (const [name, list] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      const completed = list.filter(r => r.status === 'completed').length;
      const noShow = list.filter(r => r.status === 'no_show').length;
      const waits = list.map(waitOf).filter((v): v is number => v !== null);
      const times = list.map(serviceTimeOf).filter((v): v is number => v !== null);
      table.push([
        name,
        list.length,
        completed,
        list.length ? Math.round((noShow / list.length) * 1000) / 10 : 0,
        avg(waits) !== null ? formatWaitMs(avg(waits) as number) : '—',
        avg(times) !== null ? formatWaitMs(avg(times) as number) : '—'
      ]);
    }
    return { columns: ['Service', 'Tickets Issued', 'Completed', 'No-Show %', 'Avg Wait', 'Avg Service Time'], rows: table };
  }

  if (type === 'Counter Performance') {
    const groups = new Map<string, ReportQueueRow[]>();
    for (const r of rows) {
      if (!r.counter_id) continue;
      const list = groups.get(r.counter_id) ?? [];
      list.push(r);
      groups.set(r.counter_id, list);
    }
    const days = Math.max(1, Math.ceil((period.end.getTime() - period.start.getTime()) / 86400000));
    const availableMs = days * (REPORT_CLOSE_HOUR - REPORT_OPEN_HOUR) * 3600000;
    const table: (string | number)[][] = [];
    for (const [name, list] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      const completed = list.filter(r => r.status === 'completed').length;
      const times = list.map(serviceTimeOf).filter((v): v is number => v !== null);
      const handling = times.reduce((a, b) => a + b, 0);
      const utilisation = Math.min(100, Math.round((handling / availableMs) * 100));
      table.push([
        name,
        completed,
        avg(times) !== null ? formatWaitMs(avg(times) as number) : '—',
        `${utilisation}%`
      ]);
    }
    return { columns: ['Counter', 'Tickets Completed', 'Avg Service Time', 'Utilisation %'], rows: table };
  }

  if (type === 'Wait Time Analysis') {
    const groups = new Map<string, ReportQueueRow[]>();
    for (const r of rows) {
      const d = new Date(r.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const list = groups.get(key) ?? [];
      list.push(r);
      groups.set(key, list);
    }
    const table: (string | number)[][] = [];
    for (const [key, list] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      const waits = list.map(waitOf).filter((v): v is number => v !== null);
      table.push([
        reportDayLabel(new Date(`${key}T00:00:00`)),
        list.length,
        avg(waits) !== null ? formatWaitMs(avg(waits) as number) : '—',
        waits.length ? formatWaitMs(Math.max(...waits)) : '—'
      ]);
    }
    return { columns: ['Day', 'Tickets', 'Avg Wait', 'Longest Wait'], rows: table };
  }

  // Peak Hours Trends
  const groups = new Map<number, ReportQueueRow[]>();
  for (const r of rows) {
    const h = new Date(r.created_at).getHours();
    const list = groups.get(h) ?? [];
    list.push(r);
    groups.set(h, list);
  }
  const table: (string | number)[][] = [];
  for (const [h, list] of [...groups.entries()].sort((a, b) => a[0] - b[0])) {
    const waits = list.map(waitOf).filter((v): v is number => v !== null);
    table.push([reportHourLabel(h), list.length, avg(waits) !== null ? formatWaitMs(avg(waits) as number) : '—']);
  }
  return { columns: ['Hour', 'Tickets', 'Avg Wait'], rows: table };
}

export function ReportsScreen() {
  useAdminSecurity();

  // Selected State variables for generator
  const [reportType, setReportType] = useState<string>('Service Efficiency');
  const [dateRange, setDateRange] = useState<string>('Last 7 Days');
  const [service, setService] = useState<string>('All Services');
  const [counter, setCounter] = useState<string>('All Counters');
  const [customFrom, setCustomFrom] = useState<string>('');
  const [customTo, setCustomTo] = useState<string>('');

  // Real options loaded from the database
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);
  const [counterOptions, setCounterOptions] = useState<string[]>([]);

  // Interactive UI states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [result, setResult] = useState<ReportResult | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load filter options from the database
  useEffect(() => {
    const loadFilterOptions = async () => {
      const [svc, cnt] = await Promise.all([
        supabase.from('services').select('name').order('name'),
        supabase.from('counters').select('name').order('name')
      ]);
      if (svc.error) {
        console.error('Failed to load services:', svc.error.message);
      } else {
        setServiceOptions(((svc.data ?? []) as { name: string }[]).map(s => s.name));
      }
      if (cnt.error) {
        console.error('Failed to load counters:', cnt.error.message);
      } else {
        setCounterOptions(((cnt.data ?? []) as { name: string }[]).map(c => c.name));
      }
    };
    loadFilterOptions();
  }, []);

  // Generate a real report from queues data
  const handleGenerateReport = async () => {
    const period = resolveReportPeriod(dateRange, customFrom, customTo);
    if (!period) {
      triggerToast('Select a valid date range. Custom Range needs both dates.');
      return;
    }
    setIsGenerating(true);
    try {
      const rows = await fetchReportRows(period.start, period.end, service, counter);
      const report = computeReport(reportType, rows, period);
      setResult({
        columns: report.columns,
        rows: report.rows,
        periodLabel: period.label,
        totalTickets: rows.length
      });
      if (rows.length === 0) {
        triggerToast('No tickets found for this period.');
      } else {
        triggerToast(`Report generated from ${rows.length} ticket${rows.length === 1 ? '' : 's'}.`);
      }
    } catch (err) {
      console.error('Report generation failed:', err);
      triggerToast('Failed to generate report. Please try again.');
      setResult(null);
    } finally {
      setIsGenerating(false);
    }
  };

  // Real CSV download of the generated report table
  const handleExportCsv = () => {
    if (!result) return;
    const escapeCell = (value: string | number) => {
      const s = String(value);
      return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [
      result.columns.map(escapeCell).join(','),
      ...result.rows.map(row => row.map(escapeCell).join(','))
    ].join('\r\n');
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const now = new Date();
    const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    link.href = url;
    link.download = `smartq-${reportType.toLowerCase().replace(/\s+/g, '-')}-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast('CSV export downloaded.');
  };

  // PDF export: print only the report area
  const handleExportPdf = () => {
    if (!result) return;
    window.print();
  };

  // Clear a stale result whenever the filters change
  const clearResult = () => setResult(null);

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

  return (
    <div className="flex">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #report-print-area, #report-print-area * { visibility: visible !important; }
          #report-print-area { position: absolute; left: 0; top: 0; width: 100%; background: #ffffff; border: none !important; box-shadow: none !important; }
        }
      `}</style>
      <AdminSidebar activeItem="reports" />
      <AdminLayout 
        title="Reports" 
        description="Generate service, counter, wait-time and peak-hour reports from live queue data."
      >
        <div className="space-y-8 max-w-6xl w-full pb-10">

          {/* Report Generator Module */}
          <section className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-[0px_4px_12px_rgba(0,0,0,0.02)] flex flex-col gap-6">
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
                    onChange={(e) => { setReportType(e.target.value); clearResult(); }}
                    disabled={isGenerating}
                    className="w-full bg-[#f3f3f3] border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 transition-all cursor-pointer"
                  >
                    <option>Service Efficiency</option>
                    <option>Counter Performance</option>
                    <option>Wait Time Analysis</option>
                    <option>Peak Hours Trends</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-0.5">Date Range</label>
                  <select 
                    value={dateRange}
                    onChange={(e) => { setDateRange(e.target.value); clearResult(); }}
                    disabled={isGenerating}
                    className="w-full bg-[#f3f3f3] border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 transition-all cursor-pointer"
                  >
                    <option>Last 7 Days</option>
                    <option>Current Month</option>
                    <option>Last Quarter</option>
                    <option>Custom Range</option>
                  </select>
                </div>

                {dateRange === 'Custom Range' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-0.5">From</label>
                      <input
                        type="date"
                        value={customFrom}
                        onChange={(e) => { setCustomFrom(e.target.value); clearResult(); }}
                        disabled={isGenerating}
                        className="w-full bg-[#f3f3f3] border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 transition-all cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-0.5">To</label>
                      <input
                        type="date"
                        value={customTo}
                        onChange={(e) => { setCustomTo(e.target.value); clearResult(); }}
                        disabled={isGenerating}
                        className="w-full bg-[#f3f3f3] border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 transition-all cursor-pointer"
                      />
                    </div>
                  </>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-0.5">Service</label>
                  <select 
                    value={service}
                    onChange={(e) => { setService(e.target.value); clearResult(); }}
                    disabled={isGenerating}
                    className="w-full bg-[#f3f3f3] border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 transition-all cursor-pointer"
                  >
                    <option>All Services</option>
                    {serviceOptions.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-0.5">Counter</label>
                  <select 
                    value={counter}
                    onChange={(e) => { setCounter(e.target.value); clearResult(); }}
                    disabled={isGenerating}
                    className="w-full bg-[#f3f3f3] border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 transition-all cursor-pointer"
                  >
                    <option>All Counters</option>
                    {counterOptions.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
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
                  onClick={handleExportCsv}
                  disabled={!result || isGenerating}
                  className="bg-[#0a1f44] text-white px-6 py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 hover:shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>

                <button 
                  onClick={handleExportPdf}
                  disabled={!result || isGenerating}
                  className="text-primary hover:bg-slate-100 border border-outline-variant/65 px-6 py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </section>

          {/* Report Result Area */}
          <section id="report-print-area" className="bg-white rounded-xl border border-outline-variant/30 shadow-[0px_4px_12px_rgba(0,0,0,0.02)] overflow-hidden">
            
            {/* Result Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0a1f44]/5 text-[#0a1f44] rounded-lg flex items-center justify-center shadow-inner">
                  <Database className="w-5 h-5 text-[#0a1f44]" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-primary uppercase tracking-wide">{reportType}</h4>
                  <p className="text-[11px] text-on-surface-variant font-medium">
                    {result
                      ? `Period: ${result.periodLabel} · ${result.totalTickets} ticket${result.totalTickets === 1 ? '' : 's'}`
                      : 'Choose filters and generate a report.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Report Table */}
            <div className="overflow-x-auto">
              {result === null ? (
                <p className="p-10 text-center text-xs font-bold text-on-surface-variant">Choose filters and generate a report.</p>
              ) : result.totalTickets === 0 ? (
                <p className="p-10 text-center text-xs font-bold text-on-surface-variant">No tickets found for this period.</p>
              ) : (
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead className="bg-[#00081e] text-white">
                    <tr className="uppercase tracking-wider text-[10px] font-bold font-mono">
                      {result.columns.map(col => (
                        <th key={col} className="px-6 py-4">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-primary font-semibold">
                    {result.rows.map((row, index) => (
                      <tr
                        key={index}
                        className={`transition-colors hover:bg-slate-50 duration-150 ${index % 2 === 1 ? 'bg-[#f9f9f9]' : 'bg-white'}`}
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={`px-6 py-4 ${cellIndex === 0 ? 'font-bold text-primary' : 'font-mono text-on-surface-variant'}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </section>

          {/* Footer Branding */}
          <footer className="pt-4 text-center text-on-surface-variant/40 text-[10px] uppercase tracking-widest leading-loose font-bold">
            SmartQ Analytics Systems — Authorized Access Only
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
interface CounterRow {
  id: string;
  name: string;
  staff_id: string | null;
  staff_name: string | null;
  status: string;
  services: string[];
}

export function CounterManagementScreen() {
  useAdminSecurity(['admin']);

  // Counters (counters table, with staff names resolved from profiles)
  const [counters, setCounters] = useState<CounterRow[]>([]);
  const [loadingCounters, setLoadingCounters] = useState<boolean>(true);

  // Option lists for the modal
  const [staffOptions, setStaffOptions] = useState<{ id: string; name: string }[]>([]);
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingCounterId, setEditingCounterId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formStaffId, setFormStaffId] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formServiceNames, setFormServiceNames] = useState<string[]>([]);

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

  // Load all counters with assigned staff names (paginated until a short page).
  const loadCounters = async () => {
    setLoadingCounters(true);
    const rows: Omit<CounterRow, 'staff_name'>[] = [];
    let from = 0;
    let failed = false;
    for (;;) {
      const { data, error } = await supabase
        .from('counters')
        .select('id, name, staff_id, status, services')
        .order('name')
        .range(from, from + 999);
      if (error) {
        console.error('Failed to load counters:', error.message);
        failed = true;
        break;
      }
      const batch = (data ?? []) as Omit<CounterRow, 'staff_name'>[];
      rows.push(...batch);
      if (batch.length < 1000) break;
      from += 1000;
    }
    if (failed) {
      setLoadingCounters(false);
      return;
    }

    // Resolve assigned staff names from profiles
    const staffIds = [...new Set(rows.map(r => r.staff_id).filter((v): v is string => !!v))];
    const nameById = new Map<string, string>();
    if (staffIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', staffIds);
      if (profilesError) {
        console.error('Failed to load assigned staff names:', profilesError.message);
      } else {
        for (const p of (profiles ?? []) as { id: string; full_name: string | null; email: string | null }[]) {
          nameById.set(p.id, p.full_name || (p.email ? p.email.split('@')[0] : ''));
        }
      }
    }

    setCounters(rows.map(r => ({
      ...r,
      staff_name: r.staff_id ? (nameById.get(r.staff_id) || null) : null
    })));
    setLoadingCounters(false);
  };

  // Load staff accounts (role='staff') and active service names for the modal
  const loadOptions = async () => {
    const staffRows: { id: string; full_name: string | null; email: string | null }[] = [];
    let staffFrom = 0;
    for (;;) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'staff')
        .order('full_name')
        .range(staffFrom, staffFrom + 999);
      if (error) {
        console.error('Failed to load staff list:', error.message);
        break;
      }
      const batch = (data ?? []) as typeof staffRows;
      staffRows.push(...batch);
      if (batch.length < 1000) break;
      staffFrom += 1000;
    }
    setStaffOptions(staffRows.map(p => ({
      id: p.id,
      name: p.full_name || (p.email ? p.email.split('@')[0] : 'Staff member')
    })));

    const serviceNames: string[] = [];
    let serviceFrom = 0;
    for (;;) {
      const { data, error } = await supabase
        .from('services')
        .select('name')
        .eq('status', 'active')
        .order('name')
        .range(serviceFrom, serviceFrom + 999);
      if (error) {
        console.error('Failed to load services list:', error.message);
        break;
      }
      const batch = (data ?? []) as { name: string }[];
      serviceNames.push(...batch.map(s => s.name));
      if (batch.length < 1000) break;
      serviceFrom += 1000;
    }
    setServiceOptions(serviceNames);
  };

  useEffect(() => {
    loadCounters();
    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open modal for creating
  const openCreateModal = () => {
    setModalMode('create');
    setEditingCounterId(null);
    setFormName('');
    setFormStaffId('');
    setFormStatus('active');
    setFormServiceNames([]);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (counter: CounterRow) => {
    setModalMode('edit');
    setEditingCounterId(counter.id);
    setFormName(counter.name);
    setFormStaffId(counter.staff_id ?? '');
    setFormStatus(counter.status === 'inactive' ? 'inactive' : 'active');
    setFormServiceNames(counter.services ?? []);
    setIsModalOpen(true);
  };

  // Delete counter (real delete with real error handling)
  const handleDeleteCounter = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    const { error } = await supabase.from('counters').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete counter:', error.message);
      triggerToast(`Failed to delete "${name}": ${error.message}`);
      return;
    }
    triggerToast(`Removed "${name}".`);
    loadCounters();
  };

  // Form Submission — real insert/update against the counters table
  const handleSaveCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = formName.trim();
    if (!name) {
      triggerToast('Counter name cannot be empty.');
      return;
    }
    if (counters.some(c => c.id !== editingCounterId && c.name.toLowerCase() === name.toLowerCase())) {
      triggerToast(`A counter named "${name}" already exists.`);
      return;
    }
    if (formStaffId) {
      const conflict = counters.find(c => c.id !== editingCounterId && c.staff_id === formStaffId);
      if (conflict) {
        triggerToast(`This staff member is already assigned to "${conflict.name}".`);
        return;
      }
    }

    setIsSaving(true);
    const payload = {
      name,
      staff_id: formStaffId || null,
      status: formStatus,
      services: formServiceNames
    };
    const { error } = modalMode === 'create'
      ? await supabase.from('counters').insert(payload)
      : await supabase.from('counters').update(payload).eq('id', editingCounterId);
    setIsSaving(false);

    if (error) {
      console.error('Failed to save counter:', error.message);
      triggerToast(`Failed to save "${name}": ${error.message}`);
      return;
    }
    triggerToast(modalMode === 'create' ? `Created "${name}".` : `Updated "${name}".`);
    setIsModalOpen(false);
    loadCounters();
  };

  // Filtering
  const filteredCounters = counters.filter(c => {
    const query = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(query) ||
           (c.staff_name ?? '').toLowerCase().includes(query) ||
           c.services.some(s => s.toLowerCase().includes(query));
  });

  return (
    <div className="flex min-h-screen bg-[#F2F2F2] w-full text-on-surface select-none font-sans">
      <AdminSidebar activeItem="counter-management" />

      <AdminLayout 
        title="Counter Management" 
        description="Configure branch counters and assign staff."
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
                placeholder="Search counters or staff..."
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
            {loadingCounters ? (
              <div className="bg-white rounded-xl p-12 text-center col-span-full border border-outline-variant/30">
                <p className="text-xs font-bold text-on-surface-variant animate-pulse">Loading counters...</p>
              </div>
            ) : filteredCounters.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center col-span-full border border-outline-variant/30 flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                  <Sliders className="w-5 h-5 text-slate-300" />
                </div>
                <p className="text-xs font-bold text-on-surface-variant">
                  {counters.length === 0
                    ? 'No counters yet. Click Add Counter to create one.'
                    : 'No matching counters found.'}
                </p>
              </div>
            ) : (
              filteredCounters.map((counter) => (
                <div 
                  key={counter.id}
                  className={`bg-white rounded-xl p-6 border-t-4 shadow-[0px_4px_12px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden ${
                    counter.status === 'active' ? 'border-[#fed977]' : 'border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg ${counter.status === 'active' ? 'bg-[#fed977]/20 text-[#755b00]' : 'bg-slate-100 text-slate-400'}`}>
                      <Layout className="w-5 h-5" />
                    </div>
                    
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${
                      counter.status === 'active' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {counter.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-primary mb-1">{counter.name}</h3>
                  
                  <p className="text-xs text-on-surface-variant font-bold mb-4 flex items-center gap-1.5">
                    {!counter.staff_id ? (
                      <>
                        <UserX className="w-3.5 h-3.5 text-slate-400" />
                        <span>Staff: <span className="font-semibold text-slate-400 italic">Unassigned</span></span>
                      </>
                    ) : (
                      <>
                        <User className="w-3.5 h-3.5 text-[#755b00]" />
                        <span>Staff: <span className="font-extrabold text-primary">{counter.staff_name || 'Unassigned'}</span></span>
                      </>
                    )}
                  </p>

                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Designated Services</p>
                    <div className="flex flex-wrap gap-1.5">
                      {counter.services.length > 0 ? (
                        counter.services.map((srv, idx) => (
                          <span 
                            key={idx} 
                            className="bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold"
                          >
                            {srv}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">—</span>
                      )}
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
                  {modalMode === 'create' ? 'Add Counter' : 'Edit Counter'}
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
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Counter Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Counter 01"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#f3f3f3] border border-outline-variant/50 rounded-lg px-3 py-2 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Assigned Staff</label>
                <select
                  value={formStaffId}
                  onChange={(e) => setFormStaffId(e.target.value)}
                  className="w-full bg-[#f3f3f3] border border-outline-variant/50 rounded-lg px-3 py-2 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  {staffOptions.map(st => {
                    const assigned = counters.find(c => c.id !== editingCounterId && c.staff_id === st.id);
                    return (
                      <option key={st.id} value={st.id} disabled={!!assigned}>
                        {st.name}{assigned ? ` — already assigned to ${assigned.name}` : ''}
                      </option>
                    );
                  })}
                </select>
                {staffOptions.length === 0 && (
                  <p className="text-[10px] text-slate-400 font-bold">No staff accounts available.</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Operational Status</label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer">
                    <input 
                      type="radio"
                      checked={formStatus === 'active'}
                      onChange={() => setFormStatus('active')}
                      className="text-[#755b00] focus:ring-0 cursor-pointer"
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer">
                    <input 
                      type="radio"
                      checked={formStatus === 'inactive'}
                      onChange={() => setFormStatus('inactive')}
                      className="text-[#755b00] focus:ring-0 cursor-pointer"
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Designated Services</label>
                {serviceOptions.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-bold">No active services found. Add services in Service Management first.</p>
                ) : (
                  <div className="max-h-40 overflow-y-auto border border-outline-variant/30 rounded-lg p-2 bg-[#f3f3f3] flex flex-col gap-1">
                    {serviceOptions.map(srv => (
                      <label key={srv} className="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formServiceNames.includes(srv)}
                          onChange={() => setFormServiceNames(prev =>
                            prev.includes(srv) ? prev.filter(s => s !== srv) : [...prev, srv]
                          )}
                          className="text-[#755b00] focus:ring-0 cursor-pointer"
                        />
                        <span>{srv}</span>
                      </label>
                    ))}
                  </div>
                )}
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
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-bold bg-[#fed977] hover:bg-[#ffe08f] text-[#241a00] rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : modalMode === 'create' ? 'Add Counter' : 'Save Changes'}
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
  code: string | null;
  name: string;
  base_wait_minutes: number | null;
  description: string | null;
  status: string;
}

function serviceSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function ServiceManagementScreen() {
  useAdminSecurity(['admin']);

  // Core service catalog state (services table)
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(true);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal controller state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formBaseWait, setFormBaseWait] = useState('10');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [isSaving, setIsSaving] = useState<boolean>(false);

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

  // Load all services (paginated until a short page returns).
  const loadServices = async () => {
    setLoadingServices(true);
    const rows: ServiceItem[] = [];
    let from = 0;
    let failed = false;
    for (;;) {
      const { data, error } = await supabase
        .from('services')
        .select('id, code, name, base_wait_minutes, description, status')
        .order('code')
        .order('name')
        .range(from, from + 999);
      if (error) {
        console.error('Failed to load services:', error.message);
        failed = true;
        break;
      }
      const batch = (data ?? []) as ServiceItem[];
      rows.push(...batch);
      if (batch.length < 1000) break;
      from += 1000;
    }
    if (!failed) setServices(rows);
    setLoadingServices(false);
  };

  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open modal triggers
  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormName('');
    setFormBaseWait('10');
    setFormDescription('');
    setFormStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (srv: ServiceItem) => {
    setModalMode('edit');
    setEditingId(srv.id);
    setFormName(srv.name);
    setFormBaseWait(srv.base_wait_minutes !== null ? String(srv.base_wait_minutes) : '');
    setFormDescription(srv.description ?? '');
    setFormStatus(srv.status === 'inactive' ? 'inactive' : 'active');
    setIsModalOpen(true);
  };

  // Delete Action handler — blocked while queues.service_id still references it.
  const handleDeleteService = async (id: string, name: string) => {
    if (!window.confirm(`Delete service "${name}"? This cannot be undone.`)) return;

    const { count: usage, error: usageError } = await supabase
      .from('queues')
      .select('id', { count: 'exact', head: true })
      .eq('service_id', id);

    if (usageError) {
      console.error('Failed to check service usage:', usageError.message);
      triggerToast('Could not verify service usage. Deletion cancelled.');
      return;
    }
    if (usage && usage > 0) {
      triggerToast(`"${name}" is referenced by ${usage} queue ticket${usage === 1 ? '' : 's'} and cannot be deleted.`);
      return;
    }

    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete service:', error.message);
      triggerToast(`Failed to delete service: ${error.message}`);
      return;
    }
    triggerToast(`Deleted "${name}" from the service catalog.`);
    loadServices();
  };

  // Submit create/update service fields to the services table.
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = formName.trim();
    if (!name) {
      triggerToast('Service name is required.');
      return;
    }
    const baseWait = Number(formBaseWait);
    if (!Number.isFinite(baseWait) || baseWait < 0) {
      triggerToast('Base wait must be zero or a positive number of minutes.');
      return;
    }

    setIsSaving(true);
    try {
      if (modalMode === 'create') {
        const slug = serviceSlug(name);
        if (!slug) {
          triggerToast('Service name is required.');
          return;
        }
        if (services.some(s => s.id === slug)) {
          triggerToast(`A service with the ID "${slug}" already exists.`);
          return;
        }
        const { error } = await supabase.from('services').insert({
          id: slug,
          code: slug,
          name,
          base_wait_minutes: baseWait,
          description: formDescription.trim() || null,
          status: formStatus
        });
        if (error) {
          console.error('Failed to add service:', error.message);
          triggerToast(`Failed to add service: ${error.message}`);
          return;
        }
        triggerToast(`Added "${name}" to the service catalog.`);
        setIsModalOpen(false);
        loadServices();
      } else if (editingId) {
        const { error } = await supabase
          .from('services')
          .update({
            name,
            base_wait_minutes: baseWait,
            description: formDescription.trim() || null,
            status: formStatus
          })
          .eq('id', editingId);
        if (error) {
          console.error('Failed to update service:', error.message);
          triggerToast(`Failed to update service: ${error.message}`);
          return;
        }
        triggerToast(`Updated "${name}".`);
        setIsModalOpen(false);
        loadServices();
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Dynamically computed stats from the loaded catalog (real data only).
  const totalServicesCount = services.length;
  const activeServicesCount = services.filter(s => s.status === 'active').length;
  const inactiveServicesCount = totalServicesCount - activeServicesCount;
  const baseWaitValues = services
    .map(s => s.base_wait_minutes)
    .filter((v): v is number => v !== null);
  const averageBaseWait = baseWaitValues.length > 0
    ? Math.round(baseWaitValues.reduce((a, b) => a + b, 0) / baseWaitValues.length)
    : null;

  // Search Filter implementation
  const filteredServices = services.filter(srv => {
    const query = searchQuery.toLowerCase();
    return srv.id.toLowerCase().includes(query) ||
           (srv.code ?? '').toLowerCase().includes(query) ||
           srv.name.toLowerCase().includes(query) ||
           (srv.description ?? '').toLowerCase().includes(query) ||
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
              <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
                {loadingServices ? 'Loading service catalog...' : `${totalServicesCount} service${totalServicesCount === 1 ? '' : 's'} in catalog`}
              </p>
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
              <span className="text-xl font-extrabold text-primary">{loadingServices ? '—' : totalServicesCount}</span>
            </div>

            {/* Active services */}
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 flex flex-col gap-1 shadow-xs border-l-4 border-[#755b00]">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Active</span>
              <span className="text-xl font-extrabold text-primary">{loadingServices ? '—' : activeServicesCount}</span>
            </div>

            {/* Inactive services */}
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 flex flex-col gap-1 shadow-xs border-l-4 border-[#755b00]">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Inactive</span>
              <span className="text-xl font-extrabold text-primary">{loadingServices ? '—' : inactiveServicesCount}</span>
            </div>

            {/* Average base wait from base_wait_minutes */}
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 flex flex-col gap-1 shadow-xs border-l-4 border-[#755b00]">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Avg Base Wait</span>
              <span className="text-xl font-extrabold text-primary">
                {loadingServices || averageBaseWait === null ? '—' : `${averageBaseWait} mins`}
              </span>
            </div>

          </div>

          {/* Interactive Catalog Section card */}
          <div className="bg-white rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30 overflow-hidden">
            
            {/* Table Control Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider">Service Catalog</h3>
              
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
              {loadingServices ? (
                <div className="p-12 text-center flex flex-col items-center justify-center text-on-surface-variant/70 space-y-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                    <Sliders className="w-5 h-5 text-slate-300 animate-pulse" />
                  </div>
                  <p className="text-xs font-bold">Loading service catalog...</p>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center text-on-surface-variant/70 space-y-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                    <Sliders className="w-5 h-5 text-slate-300" />
                  </div>
                  <p className="text-xs font-bold">
                    {services.length === 0 ? 'No services registered yet.' : 'No matching services found.'}
                  </p>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    {services.length === 0 ? 'Add a service to get started' : 'Try a different search term'}
                  </span>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead className="bg-[#00081e] text-white">
                    <tr className="uppercase tracking-wider text-[10px] font-bold font-mono">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Code</th>
                      <th className="px-6 py-4">Service Name</th>
                      <th className="px-6 py-4">Base Wait</th>
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
                        <td className="px-6 py-4 font-mono text-[11px] font-bold text-on-surface-variant">
                          {item.code || '—'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-xs text-primary">{item.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{item.description || '—'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant font-mono text-[11px] font-bold">
                          {item.base_wait_minutes !== null ? `${item.base_wait_minutes} mins` : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${item.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                            <span className={`text-[10px] uppercase font-black tracking-wider ${item.status === 'active' ? 'text-emerald-700' : 'text-slate-400'}`}>
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
                              title="Edit service"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            {/* Delete Action trigger */}
                            <button 
                              onClick={() => handleDeleteService(item.id, item.name)}
                              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-full transition-colors cursor-pointer"
                              title="Delete service"
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

            {/* Result count */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
              <span className="text-xs text-on-surface-variant font-bold leading-none">
                Showing {filteredServices.length} of {services.length} services
              </span>
            </div>

          </div>

          {/* Footer Branding */}
          <footer className="pt-4 text-center text-on-surface-variant/40 text-[10px] uppercase tracking-widest leading-loose font-bold">
            SmartQ Services Network Portal — Secured System Access
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
                {modalMode === 'create' && serviceSlug(formName) && (
                  <p className="text-[10px] text-slate-400 font-bold font-mono">
                    ID / Code: {serviceSlug(formName)}
                  </p>
                )}
                {modalMode === 'edit' && editingId && (
                  <p className="text-[10px] text-slate-400 font-bold font-mono">
                    ID: {editingId}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Base Wait (minutes)</label>
                  <input 
                    type="number"
                    min="0"
                    step="1"
                    placeholder="e.g. 10"
                    value={formBaseWait}
                    onChange={(e) => setFormBaseWait(e.target.value)}
                    className="w-full bg-[#f3f3f3] border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Operational Status</label>
                  <select 
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'active' | 'inactive')}
                    className="w-full bg-[#f3f3f3] border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Short description shown to customers"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-[#f3f3f3] border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-bold text-primary focus:border-[#755b00] focus:ring-1 focus:ring-[#755b00]/30 outline-none resize-none"
                />
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
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-bold bg-[#fed977] hover:bg-[#ffe08f] text-[#241a00] rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : modalMode === 'create' ? 'Register Service' : 'Save Changes'}
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
export function UserManagementScreen() {
  useAdminSecurity(['admin']);

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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
    supabase.auth.getSession().then(({ data }) => {
      setCurrentUserId(data.session?.user.id ?? null);
    });
  }, []);

  // Change user role in Supabase (roles are stored on the profiles row)
  const handleRoleChange = async (userId: string, newRole: string, userName: string) => {
    if (!window.confirm(`Change ${userName}'s role to "${newRole}"?`)) return;

    setUpdatingId(userId);
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      console.error('Failed to update role:', error.message);
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
                              {(user.full_name || user.email || '—').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-extrabold text-xs text-primary block">
                                {user.full_name || (user.email ? user.email.split('@')[0] : '—')}
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
                            {user.role || '—'}
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
                              disabled={user.id === currentUserId}
                              title={user.id === currentUserId ? 'You cannot change your own role' : undefined}
                              onChange={(e) => handleRoleChange(user.id, e.target.value, user.full_name || user.email)}
                              className="bg-[#f3f3f3] border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-bold text-primary outline-none cursor-pointer focus:border-[#755b00] disabled:cursor-not-allowed disabled:opacity-50"
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
            SmartQ Security Central Core — Branch Registry System
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
// Screen 6: Wait Time Prediction (customer-only)
export function WaitTimePredictionScreen() {
  const navigate = useNavigate();
  useAdminSecurity(['customer']);

  useEffect(() => {
    if (!localStorage.getItem('userRole')) {
      navigate('/login');
    }
  }, [navigate]);

  // Core forecast states (filled from live Supabase data)
  const [serviceCode, setServiceCode] = useState<string>('');
  const [peopleAhead, setPeopleAhead] = useState<number>(0);
  const [activeTellers, setActiveTellers] = useState<number>(1);

  // Interactive delay simulation state
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live data loading flags
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(true);
  const [hasActiveTicket, setHasActiveTicket] = useState<boolean>(false);
  const [ticketServiceName, setTicketServiceName] = useState<string>('');
  const [activeTicket, setActiveTicket] = useState<any>(null);

  // Active services loaded from the services table
  const [serviceOptions, setServiceOptions] = useState<{ id: string; name: string; baseTime: number | null }[]>([]);
  const [servicesLoading, setServicesLoading] = useState<boolean>(true);

  // Live countdown: a fixed deadline per ticket position plus a 1-second clock.
  const [deadline, setDeadline] = useState<number | null>(null);
  const [estimateTotalMs, setEstimateTotalMs] = useState<number>(0);
  const [now, setNow] = useState<number>(() => Date.now());
  const [alertPermission, setAlertPermission] = useState<NotificationPermission | 'unsupported'>(
    () => getAlertPermission()
  );

  // Load live branch data from Supabase: queue length, active counters, time of
  // day, the customer's own active ticket and the customer's own recent tickets.
  const loadLiveQueueData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      let ownTicket: any = null;
      if (user) {
        const { data: activeRows, error: activeError } = await supabase
          .from('queues')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['waiting', 'serving'])
          .order('created_at', { ascending: false })
          .limit(1);
        if (activeError) console.error('Error loading active ticket:', activeError.message);
        if (activeRows && activeRows.length > 0) ownTicket = activeRows[0];
      }
      setActiveTicket(ownTicket);
      setHasActiveTicket(!!ownTicket);
      setTicketServiceName(ownTicket?.service_name ?? '');

      if (ownTicket) {
        // Show how many people are actually ahead of this customer.
        const { count: aheadCount, error: aheadError } = await supabase
          .from('queues')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'waiting')
          .lt('created_at', ownTicket.created_at);
        if (aheadError) {
          console.error('Error counting customers ahead:', aheadError.message);
          setPeopleAhead(ownTicket.waiting_ahead || 0);
        } else {
          setPeopleAhead(aheadCount || 0);
        }
        if (ownTicket.service_id) {
          setServiceCode(ownTicket.service_id);
        }
      } else {
        const { count, error } = await supabase
          .from('queues')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'waiting');
        if (error) console.error('Error loading queue length:', error.message);
        else setPeopleAhead(count || 0);
      }

      // Active counters come from the counters table (minimum 1 for the formula).
      const { count: activeCounterCount, error: counterError } = await supabase
        .from('counters')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active');
      if (counterError) console.error('Error loading active counters:', counterError.message);
      else setActiveTellers(activeCounterCount && activeCounterCount > 0 ? activeCounterCount : 1);

      // Recent tickets — the customer only ever sees their own.
      if (user) {
        const { data: historyRows, error: historyError } = await supabase
          .from('queues')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        if (historyError) console.error('Error loading prediction history:', historyError.message);
        else setHistoryList((historyRows || []) as any[]);
      } else {
        setHistoryList([]);
      }
    } catch (err) {
      console.error('Failed to load live queue data:', err);
    } finally {
      setIsLoadingLive(false);
    }
  };

  // Load active services for the Service Type selector (once on mount).
  useEffect(() => {
    const loadServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, base_wait_minutes')
        .eq('status', 'active')
        .order('code')
        .order('name');
      if (error) {
        console.error('Failed to load services:', error.message);
      } else {
        setServiceOptions(
          ((data ?? []) as { id: string; name: string; base_wait_minutes: number | null }[]).map(s => ({
            id: s.id,
            name: s.name,
            baseTime: s.base_wait_minutes
          }))
        );
      }
      setServicesLoading(false);
    };
    loadServices();
  }, []);

  // Initial load plus a 10 second refresh of the live branch data.
  useEffect(() => {
    loadLiveQueueData();
    const poll = setInterval(loadLiveQueueData, 10000);
    return () => clearInterval(poll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real-time refresh of the customer's own ticket (plus the polling above).
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      channel = supabase
        .channel(`wtp-ticket-${user.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'queues',
          filter: `user_id=eq.${user.id}`,
        }, () => {
          loadLiveQueueData();
        })
        .subscribe();
    };

    init();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulation History log state (filled from real queue tickets)
  const [historyList, setHistoryList] = useState<any[]>([]);

  // Service resolution: real rows from the services table (active only).
  const effectiveServiceCode =
    serviceCode && serviceOptions.some(s => s.id === serviceCode)
      ? serviceCode
      : (serviceOptions[0]?.id ?? '');
  const currentService = serviceOptions.find(s => s.id === effectiveServiceCode) ?? null;
  const currentServiceName = currentService?.name || ticketServiceName || '—';

  // Wait-time estimate from the offline regression model (src/ml/waitTimeModel.ts).
  // The model uses only queue length and hour of day; it is intentionally static.
  const estimate = predictWaitMinutes(peopleAhead, new Date().getHours());

  const finalWaitTime = Math.max(1, Math.round(estimate));

  // Unrounded estimate in minutes — keeps second-level accuracy for the countdown.
  const remainingMinutes = Math.max(0, estimate);

  // 1-second clock for the live countdown.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // The deadline is set only when the ticket changes, so the timer never jumps on the 10-second refresh.
  useEffect(() => {
    if (!activeTicket || activeTicket.status !== 'waiting') return;
    const totalMs = remainingMinutes * 60000;
    setEstimateTotalMs(totalMs);
    setDeadline(Date.now() + totalMs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTicket?.id, activeTicket?.status]);

  const remainingSeconds =
    deadline === null ? 0 : Math.max(0, Math.round((deadline - now) / 1000));

  const countdownProgress =
    deadline !== null && estimateTotalMs > 0
      ? Math.min(1, Math.max(0, 1 - (deadline - now) / estimateTotalMs))
      : 0;

  const formatClock = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // One-time 5-minute reminder (deviceAlert deduplicates per ticket + key).
  useEffect(() => {
    if (!activeTicket || activeTicket.status !== 'waiting') return;
    if (remainingSeconds > 0 && remainingSeconds <= 300) {
      deviceAlert({
        userId: activeTicket.user_id,
        key: `${activeTicket.id}:almost`,
        title: 'Get ready — about 5 minutes left',
        body: `Ticket ${activeTicket.ticket_number}: your turn is coming up soon. Please stay close to the counters.`,
      }).catch((err) => console.error('WaitTimePrediction: device alert failed', err));
    }
  }, [remainingSeconds, activeTicket]);

  const handleEnableAlerts = async () => {
    const result = await requestAlertPermission();
    setAlertPermission(result);
  };

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    // Always refresh from the latest live branch data.
    loadLiveQueueData();

    setTimeout(() => {
      setIsCalculating(false);
      showToast(`Wait time recalculated: ${finalWaitTime} minutes predicted.`);
    }, 700);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Actual wait = called_at - created_at (service time is excluded).
  const getActualWait = (ticket: any): number | null => {
    if (ticket?.called_at && ticket?.created_at) {
      const diffMs = new Date(ticket.called_at).getTime() - new Date(ticket.created_at).getTime();
      if (!Number.isNaN(diffMs) && diffMs >= 0) return Math.round(diffMs / 60000);
    }
    return null;
  };

  // Status badge derived from real values, never randomised. A ticket is
  // Accurate when the actual wait is within 25% of the prediction or within
  // 5 minutes; waiting/serving tickets are Pending.
  const getPredictionStatus = (ticket: any, actualWait: number | null): string => {
    if (ticket?.status === 'waiting' || ticket?.status === 'serving') return 'Pending';
    if (ticket?.status === 'no_show') return 'No Show';
    if (ticket?.status === 'completed') {
      if (actualWait === null || ticket?.estimated_wait === null || ticket?.estimated_wait === undefined) return 'No Data';
      const predicted = Number(ticket.estimated_wait);
      const within = Math.abs(actualWait - predicted) <= Math.max(5, predicted * 0.25);
      return within ? 'Accurate' : 'Drift Detected';
    }
    return 'No Data';
  };

  const displayedHistory = historyList;

  return (
    <div className="flex">
      <AdminSidebar activeItem="wait-time-prediction" />
      <AdminLayout 
        title="Wait Time Prediction" 
        description="Estimated wait time based on the live queue, active counters and the time of day."
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
                      <label className="text-xs font-semibold text-on-surface-variant">Current queue length (live)</label>
                      <div className="w-full border-outline-variant/60 border rounded-[6px] px-3 py-2 text-sm font-semibold bg-[#F2F2F2] text-primary">
                        {isLoadingLive ? 'Loading live data...' : peopleAhead}
                      </div>
                      <p className="text-[10px] text-outline font-medium">Live from branch data</p>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-on-surface-variant">Active Counters</label>
                      <div className="w-full border-outline-variant/60 border rounded-[6px] px-3 py-2 text-sm font-semibold bg-[#F2F2F2] text-primary">
                        {isLoadingLive ? 'Loading live data...' : activeTellers}
                      </div>
                      <p className="text-[10px] text-outline font-medium">Live from branch data</p>
                    </div>
                  </div>

                  {hasActiveTicket && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-on-surface-variant">Service Type</label>
                      <div className="w-full border-outline-variant/60 border rounded-[6px] px-3 py-2.5 text-xs font-bold bg-[#F2F2F2] text-primary">
                        From your active ticket
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface-variant">Time of Day</label>
                    <div className="w-full border-outline-variant/60 border rounded-[6px] px-3 py-2 text-xs font-bold bg-[#F2F2F2] text-primary">
                      {isPeakHour(new Date().getHours()) ? 'Peak hours (9–11 and 14–16)' : 'Off-peak hours'}
                    </div>
                    <p className="text-[10px] text-outline font-medium">Based on current time</p>
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
                      <p className="text-[10px] text-outline font-medium max-w-sm mb-12">
                        Estimate from a regression model trained on queue length and hour of day. Service type and counters are not model inputs. The estimate is approximate and may differ from your actual wait.
                      </p>

                      {/* Device-alert opt-in — customers with an active ticket only */}
                      {!isLoadingLive && hasActiveTicket && alertPermission === 'default' && (
                        <div className="w-full max-w-md mb-4 rounded-xl border border-outline-variant/40 bg-[#F8F9FA] px-4 py-3 flex items-center justify-between gap-3 text-left">
                          <p className="text-xs font-semibold text-on-surface">
                            Get notified on this phone when your turn is near
                          </p>
                          <button
                            type="button"
                            onClick={handleEnableAlerts}
                            className="shrink-0 text-xs font-bold text-secondary hover:underline cursor-pointer"
                          >
                            Enable alerts
                          </button>
                        </div>
                      )}
                      {!isLoadingLive && hasActiveTicket && alertPermission === 'denied' && (
                        <p className="w-full max-w-md mb-4 text-xs font-medium text-outline">
                          Alerts are blocked in your browser settings.
                        </p>
                      )}

                      {/* Live countdown card — replaces the old estimate block */}
                      {!isLoadingLive && (
                        hasActiveTicket ? (
                          activeTicket?.status === 'serving' ? (
                            <div className="w-full max-w-md mb-8 rounded-xl border border-green-200 bg-green-50 px-6 py-5 text-center">
                              <p className="text-lg font-extrabold text-green-700">It's your turn!</p>
                              <p className="text-xs font-semibold text-green-700/80 mt-1">
                                Please proceed to {activeTicket?.counter_id || 'the counter'}.
                              </p>
                            </div>
                          ) : (
                            <div className="w-full max-w-md mb-8 text-center">
                              <p className="text-5xl sm:text-6xl font-extrabold text-primary font-mono tracking-tight leading-none">
                                {deadline === null ? '--:--' : formatClock(remainingSeconds)}
                              </p>
                              <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider mt-3">
                                Estimated time until your turn
                              </p>
                              {remainingSeconds === 0 ? (
                                <p className="text-sm font-bold text-amber-600 mt-2 animate-pulse">
                                  Almost there — please stay near the counters.
                                </p>
                              ) : (
                                <p className="text-xs text-on-surface-variant font-medium mt-2">
                                  Ticket {activeTicket?.ticket_number} · {peopleAhead} ahead of you ·{' '}
                                  {activeTicket?.service_name || currentServiceName}
                                </p>
                              )}
                              <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden mt-4">
                                <div
                                  className="h-full bg-secondary rounded-full transition-[width] duration-500"
                                  style={{ width: `${Math.round(countdownProgress * 100)}%` }}
                                ></div>
                              </div>
                              <p className="text-[10px] text-outline font-medium mt-2">
                                Estimate — updates when the queue moves.
                              </p>
                            </div>
                          )
                        ) : (
                          <div className="w-full max-w-md mb-8 text-center">
                            <p className="text-xs font-semibold text-on-surface-variant">
                              Get a ticket to see your live countdown.
                            </p>
                            <button
                              type="button"
                              onClick={() => navigate('/queue-registration')}
                              className="mt-3 text-xs font-bold text-secondary hover:underline cursor-pointer"
                            >
                              Register for a queue
                            </button>
                          </div>
                        )
                      )}
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
              </section>
            </div>
            
          </div>

          {/* Bottom: Recent Predictions Table */}
          <div className="col-span-12 animate-fade-in">
            <section className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-white">
                <div className="flex items-center gap-2">
                  <Clock className="text-secondary w-5 h-5" />
                  <h3 className="font-bold text-primary text-sm">Recent Predictions</h3>
                </div>
                <div className="text-xs text-outline font-semibold">
                  Showing {displayedHistory.length} records
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
                    </tr>
                  </thead>
                  <tbody className="text-primary font-semibold">
                    {displayedHistory.length > 0 ? (
                      displayedHistory.map((ticket, index) => {
                        const actualWait = getActualWait(ticket);
                        const status = getPredictionStatus(ticket, actualWait);
                        return (
                          <tr key={ticket.id} className={index % 2 === 1 ? 'bg-[#F2F2F2]' : 'bg-white hover:bg-slate-50 border-b border-outline-variant/10'}>
                            <td className="px-6 py-4 font-mono text-[11px] text-on-surface-variant font-bold">{ticket.issued_time || '--'}</td>
                            <td className="px-6 py-4 font-bold">{ticket.service_name || '--'}</td>
                            <td className="px-6 py-4 text-on-surface-variant font-medium">QL: {ticket.waiting_ahead ?? 0}</td>
                            <td className="px-6 py-4 font-bold text-primary text-center text-sm">
                              {ticket.estimated_wait !== null && ticket.estimated_wait !== undefined ? `${ticket.estimated_wait} mins` : '--'}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-on-surface-variant">
                              {actualWait !== null ? `${actualWait} mins` : '--'}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {status === 'Pending' ? (
                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                  Pending
                                </span>
                              ) : status === 'Accurate' ? (
                                <span className="px-3 py-1 rounded-full bg-[#dcfce7] text-[#15803d] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                  Accurate
                                </span>
                              ) : status === 'Drift Detected' ? (
                                <span className="px-3 py-1 rounded-full bg-[#ffe4e6] text-[#ba1a1a] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                  Drift Detected
                                </span>
                              ) : status === 'No Show' ? (
                                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                  No Show
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                  No Data
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-xs text-outline font-semibold">
                          No predictions yet. Register for a queue to see your history.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Footer Branding */}
          <footer className="pt-4 text-center text-on-surface-variant/50 text-[10px] uppercase tracking-widest leading-loose">
            SmartQ Predictive Engine — Powered by live queue analytics
          </footer>

        </div>
      </AdminLayout>

      {/* Dynamic Toast Alerts - Elegant replacement to browser alerts */}
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed bottom-8 right-8 bg-[#00081e] text-[#FFD700] text-xs font-bold px-4 py-3.5 rounded-xl shadow-2xl border border-white/10 z-50 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
          <span>{toastMessage}</span>
        </motion.div>
      )}

    </div>
  );
}

// Screen 7: System Data Management
export function SystemDataScreen() {
  useAdminSecurity(['manager', 'admin']);
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
                        ♿
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
                        💎
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
                        ⚡
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
                      <span className="animate-spin text-sm block">◌</span>
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
            SmartQ Global Cluster Portal — Security Tier Zero Access
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
                      <span className="animate-spin">◌</span>
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
                      <span className="animate-spin">◌</span>
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
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Model</span>
                  <p className="font-extrabold text-xs text-primary mt-1">Linear Regression (scikit-learn) · 437/547 rows</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Test MAE</span>
                  <p className="font-extrabold text-xs text-primary mt-1 font-mono">3.62 min</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Test RMSE / R2</span>
                  <p className="font-extrabold text-xs text-primary mt-1 font-mono">4.37 min / -0.02</p>
                </div>

                <div className="flex flex-col justify-center items-center md:items-start">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Model Type</span>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wide bg-[#fed977] text-[#241a00] border border-[#fed977]">
                    Static · No Online Retraining
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
            SmartQ Gateway Hub Core — Branch Tunnel System
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
