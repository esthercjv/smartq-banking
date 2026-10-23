import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import NotificationBell from './NotificationBell';
import StaffNotificationBell from './StaffNotificationBell';
import ManagementNotificationBell from './ManagementNotificationBell';
import { 
  Landmark, 
  LogOut, 
  LayoutDashboard,
  UserCheck,
  Activity,
  Settings as SettingsIcon,
  Users,
  Clock,
  Radio,
  Coffee,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle2,
  ListFilter,
  Timer,
  TrendingUp,
  Terminal,
  Sliders
} from 'lucide-react';

interface QueueRow {
  id: string;
  ticket_number: string;
  service_name: string;
  status: string;
  estimated_wait: number | null;
  created_at: string;
  user_id?: string | null;
}

interface CounterRow {
  key: string;
  label: string;
  service: string;
  ticket: string;
  state: 'serving' | 'idle' | 'inactive';
  staffName: string | null;
}

export default function StatusMonitoring() {
  const navigate = useNavigate();

  // Role and Auth
const [userRole, setUserRole] = useState<string | null>(null);
const [currentUserId, setCurrentUserId] = useState<string | null>(null);
const [loading, setLoading] = useState(true);
const [searchQuery, setSearchQuery] = useState('');
const [activeFilter, setActiveFilter] = useState<'all' | 'waiting' | 'serving'>('all');
const [autoRefresh, setAutoRefresh] = useState(true);
const [highlightedTickets, setHighlightedTickets] = useState<Record<string, boolean>>({});
const [reloadPulse, setReloadPulse] = useState(false);

// Live Supabase queue data
const [queueItems, setQueueItems] = useState<QueueRow[]>([]);
const [counters, setCounters] = useState<CounterRow[]>([]);
const [nowServing, setNowServing] = useState<string | null>(null);
const [servingService, setServingService] = useState<string | null>(null);
const [servingUserId, setServingUserId] = useState<string | null>(null);
const [waitingCount, setWaitingCount] = useState(0);
const [avgWait, setAvgWait] = useState<number | null>(null);

const [userEmail, setUserEmail] = useState('');
const namePrefix = userEmail ? userEmail.split('@')[0] : '';

  useEffect(() => {
  const verifySession = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) { navigate('/login'); return; }
    setCurrentUserId(session.user.id);

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role, email')
      .eq('id', session.user.id)
      .single();

    if (error || !profile) {
      await supabase.auth.signOut();
      navigate('/login');
      return;
    }

    setUserRole(profile.role);
    setUserEmail(profile.email || session.user.email || '');
    setLoading(false);
  };

  verifySession();
}, [navigate]);

// Load all live data from Supabase
const loadLiveData = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTodayStr = startOfToday.toISOString();

  // Get currently serving ticket
  const { data: servingData } = await supabase
    .from('queues')
    .select('ticket_number, service_name, customer_name, user_id')
    .eq('status', 'serving')
    .gte('created_at', startOfTodayStr)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (servingData) {
    setNowServing(servingData.ticket_number);
    setServingService(servingData.service_name);
    setServingUserId(servingData.user_id ?? null);
  } else {
    setNowServing(null);
    setServingService(null);
    setServingUserId(null);
  }

  // Get waiting count
  const { count } = await supabase
    .from('queues')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'waiting')
    .gte('created_at', startOfTodayStr);

  setWaitingCount(count || 0);

  // Get queue list. Customers must never fetch other people's service types
  // into the browser (privacy): they get a restricted column set and their own
  // service names are merged in separately.
  const effectiveRole = userRole ?? localStorage.getItem('userRole');
  const currentUid = currentUserId ?? localStorage.getItem('userId');
  const isCustomerQuery = effectiveRole === 'customer';

  const queueSelect = isCustomerQuery
    ? 'id, ticket_number, status, estimated_wait, created_at, user_id'
    : 'id, ticket_number, service_name, status, estimated_wait, created_at, user_id';

  const queueQuery = (supabase
    .from('queues')
    .select(queueSelect) as any)
    .in('status', ['waiting', 'serving'])
    .gte('created_at', startOfTodayStr)
    .order('created_at', { ascending: true });

  const { data: queueList } = await queueQuery;

  if (queueList) {
    if (isCustomerQuery) {
      const ownIds = queueList
        .filter((r: any) => r.user_id && currentUid && r.user_id === currentUid)
        .map((r: any) => r.id);

      const ownServices = new Map<string, string>();
      if (ownIds.length > 0) {
      const { data: ownRows } = await (supabase
          .from('queues')
          .select('id, service_name') as any)
          .in('id', ownIds);
        (ownRows || []).forEach((r: any) => ownServices.set(r.id, r.service_name));
      }

      setQueueItems(
        queueList.map((r: any) => ({
          ...r,
          service_name: ownServices.get(r.id) ?? '',
        })) as QueueRow[]
      );
    } else {
      setQueueItems(queueList as QueueRow[]);
    }
  }

  // Real average wait time from actual data
  const { data: avgData } = await supabase
    .from('queues')
    .select('estimated_wait')
    .eq('status', 'waiting')
    .gte('created_at', startOfTodayStr);

  if (avgData && avgData.length > 0) {
    const avg = avgData.reduce((sum, r) => sum + (r.estimated_wait || 0), 0) / avgData.length;
    setAvgWait(Math.round(avg));
  } else {
    setAvgWait(null);
  }

  // Counter overview: every row from the counters table, joined with the
  // queue row currently being served at that counter (status = 'serving').
  // Staff names are attached for staff/manager/admin views only.
  const { data: countersTable, error: countersError } = await supabase
    .from('counters')
    .select('id, name, status, staff_id')
    .order('name');

  if (countersError) {
    console.error('Failed to load counters:', countersError.message);
    setCounters([]);
  } else if (!countersTable || countersTable.length === 0) {
    setCounters([]);
  } else {
    const { data: servingRows, error: servingError } = await supabase
      .from('queues')
      .select('ticket_number, service_name, counter_id')
      .eq('status', 'serving')
      .gte('created_at', startOfTodayStr);

    if (servingError) {
      console.error('Failed to load serving tickets:', servingError.message);
    }

    const servingByCounter = new Map<string, { ticket: string; service: string }>();
    (servingRows ?? []).forEach((r: any) => {
      if (r.counter_id) {
        servingByCounter.set(r.counter_id, {
          ticket: r.ticket_number ?? '—',
          service: r.service_name ?? ''
        });
      }
    });

    const role = userRole ?? localStorage.getItem('userRole');
    const staffIds = role !== 'customer'
      ? Array.from(new Set((countersTable as any[]).map(c => c.staff_id).filter(Boolean)))
      : [];
    const staffNames = new Map<string, string>();
    if (staffIds.length > 0) {
      const { data: staffRows, error: staffError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', staffIds);
      if (staffError) {
        console.error('Failed to load staff names:', staffError.message);
      } else {
        (staffRows ?? []).forEach((p: any) => staffNames.set(p.id, p.full_name || p.email || ''));
      }
    }

    setCounters(
      (countersTable as any[]).map((c: any, i: number) => {
        const serving = servingByCounter.get(c.name);
        return {
          key: String(c.id ?? i),
          label: c.name ?? 'Counter',
          service: serving?.service ?? '',
          ticket: serving?.ticket ?? '—',
          state: c.status === 'active' ? (serving ? 'serving' : 'idle') : 'inactive',
          staffName: role !== 'customer' && c.staff_id ? (staffNames.get(c.staff_id) ?? '') : null
        } as CounterRow;
      })
    );
  }
};

useEffect(() => {
  loadLiveData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

// Real-time subscription to the queues table
useEffect(() => {
  if (!autoRefresh) return;

  const channel = supabase
    .channel('status-monitor-live')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'queues'
    }, () => {
      loadLiveData();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [autoRefresh]);

   if (loading) return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center">
      <p className="text-sm text-on-surface-variant font-medium animate-pulse">Loading...</p>
    </div>
  );
  if (!userRole) return null;
  
const handleLogout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('activeTicket');
  navigate('/login');
};

  const handleReloadBoard = () => {
    setReloadPulse(true);
    setTimeout(() => setReloadPulse(false), 900);

    // Re-fetch the latest real data from Supabase
    loadLiveData();
  };

  const toggleRowHighlight = (id: string) => {
    setHighlightedTickets(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter implementation (ticket number + service only — no personal data)
  const isCustomerView = userRole === 'customer';
  const isOwnTicket = (ticket: any) =>
    !!currentUserId && ticket.user_id === currentUserId;

  const filteredItems = queueItems.filter(item => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = isCustomerView
      ? item.ticket_number.toLowerCase().includes(query) ||
        (isOwnTicket(item) && item.service_name.toLowerCase().includes(query))
      : item.ticket_number.toLowerCase().includes(query) ||
        item.service_name.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    // Tab filter
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  const formatStatus = (status: string) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : status;

  // Side navigation menus based on roles
  const renderSidebar = () => {
    const isCustomer = userRole === 'customer';
    const isStaff = userRole === 'staff';
    const isAdmin = userRole === 'admin';
    const isManager = userRole === 'manager';

    if (isCustomer) {
      return (
        <aside className="fixed left-0 top-0 h-full w-[250px] bg-[#0a1f44] shadow-lg flex flex-col p-4 z-50 text-white font-sans">
          <div className="mb-8 px-2 flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#fed977] rounded-[10px] flex items-center justify-center shadow-lg">
                <Landmark className="w-6 h-6 text-[#0A1F44]" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Smart<span className="text-[#fed977]">Q</span>
              </span>
            </div>
            <p className="text-[#7687b2] text-[10px] font-semibold mt-1 tracking-wider opacity-60 uppercase">
              Enterprise Queue Management
            </p>
          </div>

          <nav className="flex flex-col gap-2 flex-grow">
            <button 
              type="button"
              onClick={() => navigate('/customer-dashboard')}
              className="flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left text-blue-100/60 hover:bg-white/5 transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button 
              type="button"
              onClick={() => navigate('/queue-registration')}
              className="flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left text-blue-100/60 hover:bg-white/5 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>Queue Registration</span>
            </button>

            <button 
              type="button"
              className="flex items-center gap-3 p-3 rounded-xl font-bold text-xs text-left text-[#785d00] bg-[#fed977] shadow-md cursor-pointer"
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span>Status Monitoring</span>
            </button>

            <button 
              type="button"
              onClick={() => navigate('/wait-time-prediction')}
              className="flex items-center gap-3 p-3 text-blue-100/60 hover:bg-white/5 rounded-xl font-medium text-xs text-left transition-colors cursor-pointer"
            >
              <Timer className="w-4 h-4 shrink-0" />
              <span>Wait Time Prediction</span>
            </button>

            <div className="mt-auto border-t border-[#7687b2]/25 pt-4 flex flex-col gap-2">
              <button 
                type="button"
                onClick={() => navigate('/my-profile')}
                className="flex items-center gap-3 p-3 text-blue-100/60 hover:bg-white/5 rounded-xl font-medium text-xs text-left transition-colors cursor-pointer"
              >
                <SettingsIcon className="w-4 h-4 shrink-0" />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-950/40 hover:bg-red-500 text-red-300 hover:text-white font-bold text-xs transition-colors cursor-pointer border border-red-500/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Exit Portal</span>
              </button>
            </div>
          </nav>
        </aside>
      );
    }

    if (isStaff) {
      return (
        <aside className="fixed left-0 top-0 h-full w-[250px] bg-[#0a1f44] shadow-lg flex flex-col p-4 z-50 text-white font-sans">
          <div className="mb-8 px-2 flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#fed977] rounded-[10px] flex items-center justify-center shadow-lg">
                <Landmark className="w-6 h-6 text-[#0A1F44]" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Smart<span className="text-[#fed977]">Q</span>
              </span>
            </div>
            <p className="text-[#7687b2] text-[10px] font-semibold mt-1 tracking-wider opacity-60 uppercase">
              Agent Terminal
            </p>
          </div>

          <nav className="flex flex-col gap-2 flex-grow">
            <button 
              type="button"
              onClick={() => navigate('/queue-control-center')}
              className="flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left text-blue-100/60 hover:bg-white/5 transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Queue Control Center</span>
            </button>

            <button 
              type="button"
              className="flex items-center gap-3 p-3 rounded-xl font-bold text-xs text-left text-[#785d00] bg-[#fed977] shadow-md cursor-pointer"
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span>Status Monitoring</span>
            </button>

            <button 
              type="button"
              onClick={() => navigate('/analytics')}
              className="flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left text-blue-100/60 hover:bg-white/5 transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>Analytics</span>
            </button>

            <div className="mt-auto border-t border-[#7687b2]/25 pt-4 flex flex-col gap-2">
              <button 
                type="button"
                onClick={() => navigate('/my-profile')}
                className="flex items-center gap-3 p-3 text-blue-100/60 hover:bg-white/5 rounded-xl font-medium text-xs text-left transition-colors cursor-pointer"
              >
                <SettingsIcon className="w-4 h-4 shrink-0" />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-950/40 hover:bg-red-500 text-red-300 hover:text-white font-bold text-xs transition-colors cursor-pointer border border-red-500/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Close Terminal</span>
              </button>
            </div>
          </nav>
        </aside>
      );
    }

    // Manager and Admin
    return (
      <aside className="fixed left-0 top-0 h-full w-[250px] bg-[#0a1f44] shadow-lg flex flex-col p-4 z-50 text-white font-sans">
        <div className="mb-8 px-2 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#fed977] rounded-[10px] flex items-center justify-center shadow-lg">
              <Landmark className="w-6 h-6 text-[#0A1F44]" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Smart<span className="text-[#fed977]">Q</span>
            </span>
          </div>
          <p className="text-[#7687b2] text-[10px] font-semibold mt-1 tracking-wider opacity-60 uppercase">
            {isAdmin ? 'Admin Panel' : 'Manager Panel'}
          </p>
        </div>

        <nav className="flex flex-col gap-1.5 flex-grow overflow-y-auto pr-1 custom-scrollbar">
          <button 
            type="button"
            onClick={() => navigate('/admin-dashboard')}
            className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-xs text-left text-blue-100/60 hover:bg-white/5 transition-all cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </button>

          {!isAdmin && (
            <>
              <button 
                type="button"
                className="flex items-center gap-2.5 p-2.5 rounded-xl font-bold text-xs text-left text-[#785d00] bg-[#fed977] shadow-md cursor-pointer"
              >
                <Activity className="w-4 h-4 shrink-0" />
                <span>Status Monitoring</span>
              </button>

              <button 
                type="button"
                onClick={() => navigate('/analytics')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-xs text-left text-blue-100/60 hover:bg-white/5 transition-all cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span>Analytics</span>
              </button>

              <button 
                type="button"
                onClick={() => navigate('/reports')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-xs text-left text-blue-100/60 hover:bg-white/5 transition-all cursor-pointer"
              >
                <Terminal className="w-4 h-4 shrink-0" />
                <span>Reports</span>
              </button>
            </>
          )}

          {isAdmin && (
            <>
              <button 
                type="button"
                onClick={() => navigate('/user-management')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-xs text-left text-blue-100/60 hover:bg-white/5 transition-all"
              >
                <UserCheck className="w-4 h-4 shrink-0" />
                <span>User Management</span>
              </button>
              <button 
                type="button"
                onClick={() => navigate('/service-management')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-xs text-left text-blue-100/60 hover:bg-white/5 transition-all"
              >
                <Sliders className="w-4 h-4 shrink-0" />
                <span>Service Management</span>
              </button>
              <button 
                type="button"
                onClick={() => navigate('/counter-management')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-xs text-left text-blue-100/60 hover:bg-white/5 transition-all"
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Counter Management</span>
              </button>
            </>
          )}

          <div className="mt-auto border-t border-[#7687b2]/25 pt-4 flex flex-col gap-2">
            <button 
              type="button"
              onClick={() => navigate('/my-profile')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-xs text-left text-blue-100/60 hover:bg-white/5 transition-all cursor-pointer"
            >
              <SettingsIcon className="w-4 h-4 shrink-0" />
              <span>My Profile</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-950/40 hover:bg-red-500 text-red-300 hover:text-white font-bold text-xs transition-colors cursor-pointer border border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Panel</span>
            </button>
          </div>
        </nav>
      </aside>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f9f9f9] w-full text-[#1a1c1c] select-none font-sans antialiased">
      
      {/* 1. Side Navigation Panel */}
      {renderSidebar()}

      {/* 2. Top Navigation Bar */}
      <header className="fixed top-0 right-0 h-[60px] ml-[250px] w-[calc(100%-250px)] bg-white border-b border-[#c5c6cf] flex justify-between items-center px-8 z-40">
        <h2 className="text-[#00081e] font-semibold text-lg tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#755b00]" /> Queue Status Monitor
        </h2>
        
        <div className="flex items-center gap-6">
          {/* Dynamic Auto-Refresh Indicator Switch */}
          <div className="flex items-center gap-3 bg-[#f3f3f3] px-3 py-1.5 rounded-full border border-[#c5c6cf]">
            <span className="text-[10px] text-[#44464e] uppercase font-bold tracking-wider">
              Auto-Refresh
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-[#c5c6cf] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#755b00]" />
            </label>
          </div>

          {isCustomerView ? (
            <NotificationBell buttonClassName="relative p-2 text-on-surface-variant hover:text-secondary transition-colors rounded-lg cursor-pointer" />
          ) : userRole === 'staff' ? (
            <StaffNotificationBell buttonClassName="relative p-2 text-on-surface-variant hover:text-secondary transition-colors rounded-lg cursor-pointer" />
          ) : (
            <ManagementNotificationBell
              role={userRole === 'admin' ? 'admin' : 'manager'}
              buttonClassName="relative p-2 text-on-surface-variant hover:text-secondary transition-colors rounded-lg cursor-pointer"
            />
          )}
          
          <div className="h-8 w-[1px] bg-[#c5c6cf]" />

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-semibold text-[#00081e] leading-none block capitalize">{namePrefix}</p>
              <p className="text-[10px] text-[#44464e] font-semibold uppercase tracking-wider mt-0.5">{userRole}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#ffe08f] flex items-center justify-center text-[#755b00] border-2 border-[#fed977] overflow-hidden font-bold">
              {namePrefix.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* 3. Main Board Canvas */}
      <main className="ml-[250px] pt-[84px] p-8 flex-grow min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 max-w-7xl mx-auto"
        >
          {/* Top Panel: Now Serving Hero Card */}
          <div className="bg-[#0a1f44] rounded-[10px] p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Decorative background visual orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#755b00]/10 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 pointer-events-none"></div>
            
            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></span>
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full absolute"></span>
                <span className="text-[#fed977] text-xs font-bold tracking-widest uppercase">
                  Live Queue Status
                </span>
              </div>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-none tracking-tight font-mono">
                NOW SERVING {nowServing || '—'}
              </h3>
              <p className="text-[#7687b2] font-medium text-sm pt-1">
                {!isCustomerView || (servingUserId && servingUserId === currentUserId)
                  ? <>Service: {servingService || '—'}</>
                  : <>Service details are private for other customers</>}
              </p>
            </div>

            <div className="relative z-10 flex gap-4 w-full md:w-auto shrink-0">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center min-w-[124px] flex-1 md:flex-none">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">In Line Waiting</p>
                <p className="text-[#fed977] text-3xl font-extrabold mt-1">{waitingCount}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center min-w-[124px] flex-1 md:flex-none">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Avg. Response</p>
                <p className="text-white text-3xl font-extrabold mt-1">{avgWait !== null ? `${avgWait}m` : '—'}</p>
              </div>
            </div>
          </div>

          {/* Core Content Grid Split (8 cols Queue list vs 4 cols Stats/Counters) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* L1. Queue List Board Column (8 Columns) */}
            <div className="col-span-12 lg:col-span-8 bg-white rounded-[10px] shadow-sm border border-[#c5c6cf] overflow-hidden">
              
              {/* Header block with visual controls */}
              <div className="p-6 border-b border-[#c5c6cf] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <h4 className="font-bold text-[#00081e] text-base leading-none">Queue Line</h4>
                  
                  {/* Status selection filters */}
                  <div className="flex p-1 bg-[#eeeeee] rounded-xl border border-gray-200">
                    <button 
                      onClick={() => setActiveFilter('all')}
                      className={`px-4 py-1 text-xs font-bold rounded-lg transition-all ${
                        activeFilter === 'all' 
                          ? 'bg-white text-[#00081e] shadow-sm' 
                          : 'text-[#44464e] hover:text-[#00081e]'
                      }`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setActiveFilter('waiting')}
                      className={`px-4 py-1 text-xs font-bold rounded-lg transition-all ${
                        activeFilter === 'waiting' 
                          ? 'bg-white text-[#00081e] shadow-sm' 
                          : 'text-[#44464e] hover:text-[#00081e]'
                      }`}
                    >
                      Waiting
                    </button>
                    <button 
                      onClick={() => setActiveFilter('serving')}
                      className={`px-4 py-1 text-xs font-bold rounded-lg transition-all ${
                        activeFilter === 'serving' 
                          ? 'bg-white text-[#00081e] shadow-sm' 
                          : 'text-[#44464e] hover:text-[#00081e]'
                      }`}
                    >
                      Serving
                    </button>
                  </div>
                </div>

                {/* Filter and Reload control block */}
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center max-w-xs bg-white border border-[#c5c6cf] rounded-xl py-1.5 pl-9 pr-3">
                    <Search className="w-4 h-4 text-[#75777f] absolute left-3" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isCustomerView ? 'Search ticket #...' : 'Search ticket, service...'}
                      className="bg-transparent border-none text-xs text-[#00081e] outline-none p-0 focus:ring-0 placeholder-[#75777f] font-semibold w-full"
                    />
                  </div>

                  <button 
                    onClick={handleReloadBoard}
                    title="Reload queue board data"
                    className="p-2 bg-[#f3f3f3] hover:bg-zinc-200 border border-[#c5c6cf] rounded-xl text-primary flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 text-[#755b00] ${reloadPulse ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Responsive Queue Table — privacy-respecting (no customer names) */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#00081e] text-white">
                      <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider">Ticket #</th>
                      <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider">Service Type</th>
                      <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider text-center">Wait Time</th>
                      <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c5c6cf]">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item, index) => {
                        const isHighlighted = highlightedTickets[item.id];
                        return (
                          <tr 
                            key={item.id} 
                            onClick={() => toggleRowHighlight(item.id)}
                            className={`transition-colors cursor-pointer border-b border-[#c5c6cf] ${
                              isHighlighted 
                                ? 'bg-[#fed977]/20 border-l-4 border-l-[#755b00]' 
                                : isCustomerView && isOwnTicket(item)
                                  ? 'bg-secondary-container/20 border-l-4 border-l-[#755b00]'
                                  : index % 2 === 1 ? 'bg-[#f3f3f3] hover:bg-neutral-200/50' : 'bg-white hover:bg-neutral-50'
                            }`}
                          >
                            <td className="px-6 py-4 font-extrabold text-[#00081e] font-mono">
                              {item.ticket_number}
                              {isCustomerView && isOwnTicket(item) && (
                                <span className="ml-2 text-[9px] font-bold bg-secondary-container text-[#584400] px-1.5 py-0.5 rounded">
                                  YOUR TICKET
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-xs font-semibold text-[#44464e]">
                              {!isCustomerView || isOwnTicket(item)
                                ? item.service_name
                                : <span className="text-outline italic">Hidden for privacy</span>}
                            </td>
                            <td className="px-6 py-4 text-center font-semibold text-[#44464e] font-mono text-xs">
                              {item.estimated_wait !== null && item.estimated_wait !== undefined ? `${item.estimated_wait} min` : '—'}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                item.status === 'serving' 
                                  ? 'bg-green-100 text-green-700' 
                                  : item.status === 'completed'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-[#fed977]/30 text-[#755b00]'
                              }`}>
                                {formatStatus(item.status)}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-xs text-[#75777f] font-semibold">
                          No matching tickets in active line. Try clearing search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* R2. Counter Overview & Stats Column (4 Columns) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-base text-[#00081e] tracking-tight">Counter Overview</h4>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#44464e] px-2 py-1 bg-[#eeeeee] rounded-[4px] border border-gray-200">
                  {counters.length} Total
                </span>
              </div>

              {/* Counters List — real data only */}
              {counters.length === 0 ? (
                <div className="bg-white border border-[#c5c6cf] rounded-[10px] p-6 text-center text-xs text-[#75777f] font-semibold">
                  No counters configured.
                </div>
              ) : (
                <div className="space-y-4">
                  {counters.map((counter) => (
                    <div 
                      key={counter.key}
                      className="p-4 rounded-[10px] shadow-sm flex items-center gap-4 bg-white border border-[#c5c6cf] transition-transform active:scale-[0.98]"
                    >
                      <div className="w-12 h-12 rounded-lg flex flex-col items-center justify-center font-mono bg-[#00081e] text-white">
                        <span className="text-[9px] font-bold leading-none">C</span>
                        <span className="text-sm font-extrabold leading-none mt-1">{counter.label.slice(0, 2)}</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-sm text-[#00081e]">{counter.label}</p>
                          {counter.state === 'serving' ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-green-100 text-green-700">
                              Serving
                            </span>
                          ) : counter.state === 'idle' ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                              Idle
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-600">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-[#44464e]">{counter.service || '—'}</p>
                        {counter.staffName && (
                          <p className="text-[10px] font-semibold text-[#75777f] mt-0.5">
                            Staff: {counter.staffName}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] font-bold uppercase text-zinc-500">Ticket</p>
                        <p className="text-sm font-extrabold text-[#00081e]">{counter.ticket}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>
        </motion.div>
      </main>
    </div>
  );
}
