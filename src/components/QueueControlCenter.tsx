import { supabase } from '../supabaseClient';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Landmark, 
  LogOut, 
  CheckCircle2, 
  Play, 
  Users, 
  Activity, 
  Radio, 
  Clock, 
  Settings as SettingsIcon,
  LayoutDashboard,
  TrendingUp
} from 'lucide-react';
import { QueueItem } from '../types';
import StaffNotificationBell from './StaffNotificationBell';

// Local alias so each waiting row can carry its real created_at timestamp
// without touching the shared types file.
type WaitItem = QueueItem & { createdAt: string };

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

export default function QueueControlCenter() {
  const navigate = useNavigate();
  const [verifiedRole, setVerifiedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [assignedCounter, setAssignedCounter] = useState<{ id: string; name: string; services?: string[] | null } | null>(null);
  const [servingTicket, setServingTicket] = useState<QueueItem | null>(null);
  const [waitingQueue, setWaitingQueue] = useState<WaitItem[]>([]);
  const [servedCount, setServedCount] = useState(0);
  const [avgHandlingSeconds, setAvgHandlingSeconds] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const verifySession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('id', session.user.id)
        .single();

      if (!profile) {
        await supabase.auth.signOut();
        navigate('/login');
        return;
      }
      if (profile.role !== 'staff') {
        if (profile.role === 'customer') {
          navigate('/customer-dashboard');
        } else {
          navigate('/admin-dashboard');
        }
        return;
      }

      // Load the staff member's assigned active counter
      const { data: counterRows, error: counterError } = await supabase
        .from('counters')
        .select('id, name, services')
        .eq('staff_id', session.user.id)
        .eq('status', 'active')
        .limit(1);
      if (counterError) {
        console.error('Failed to load assigned counter:', counterError.message);
        setAssignedCounter(null);
        showToast('Failed to load the counter.');
      } else {
        setAssignedCounter((counterRows && counterRows[0]) || null);
      }

      setVerifiedRole(profile.role);
      setVerifiedEmail(profile.email || session.user.email || '');
      setLoading(false);
    };

    verifySession();
  }, [navigate]);

  const loadWaitingQueue = async () => {
    if (!assignedCounter) return;
    const startOfTodayStr = startOfToday();
    let query = supabase
      .from('queues')
      .select('*')
      .eq('status', 'waiting')
      .gte('created_at', startOfTodayStr)
      .order('created_at', { ascending: true });

    if (assignedCounter.services && Array.isArray(assignedCounter.services) && assignedCounter.services.length > 0) {
      query = query.in('service_name', assignedCounter.services);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading queue:', error.message);
      showToast('Failed to load the queue.');
      return;
    }

    const mapped: WaitItem[] = (data || []).map((row: any) => ({
      id: row.id,
      ticketNumber: row.ticket_number,
      customerName: row.customer_name,
      serviceType: row.service_name,
      status: row.status,
      arrivalTime: row.issued_time,
      estimatedWaitMinutes: row.estimated_wait,
      counterId: row.counter_id ?? undefined,
      createdAt: row.created_at,
    }));

    setWaitingQueue(mapped);
  };

const loadServedCount = async () => {
  const { count } = await supabase
    .from('queues')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')
    .gte('created_at', startOfToday());

  setServedCount(count ?? 0);
};

const loadAvgHandling = async () => {
  const { data, error } = await supabase
    .from('queues')
    .select('called_at, completed_at')
    .eq('status', 'completed')
    .gte('created_at', startOfToday())
    .not('called_at', 'is', null)
    .not('completed_at', 'is', null);

  if (error) {
    console.error('Error loading average handling time:', error.message);
    return;
  }

  const durations = (data || [])
    .map((row: any) => new Date(row.completed_at).getTime() - new Date(row.called_at).getTime())
    .filter((ms: number) => Number.isFinite(ms) && ms >= 0);

  if (durations.length === 0) {
    setAvgHandlingSeconds(null);
    return;
  }

  const avgMs = durations.reduce((sum: number, ms: number) => sum + ms, 0) / durations.length;
  setAvgHandlingSeconds(Math.round(avgMs / 1000));
};

const loadServingTicket = async () => {
  if (!assignedCounter) {
    setServingTicket(null);
    return;
  }
  const { data, error } = await supabase
    .from('queues')
    .select('*')
    .eq('status', 'serving')
    .eq('counter_id', assignedCounter.name)
    .gte('created_at', startOfToday())
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (data && !error) {
    setServingTicket({
      id: data.id,
      ticketNumber: data.ticket_number,
      customerName: data.customer_name,
      serviceType: data.service_name,
      status: data.status,
      arrivalTime: data.issued_time,
      estimatedWaitMinutes: data.estimated_wait,
      counterId: data.counter_id ?? undefined,
    });
  } else {
    setServingTicket(null);
  }
};

useEffect(() => {
  if (!assignedCounter) return;
  loadWaitingQueue();
  loadServingTicket();
  loadServedCount();
  loadAvgHandling();
}, [assignedCounter]);

  useEffect(() => {
    const channel = supabase
      .channel('queues-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'queues' },
        () => {
          loadWaitingQueue();
          loadServedCount();
          loadServingTicket();
          loadAvgHandling();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

useEffect(() => {
  (async () => {
    try {
      await supabase.rpc('expire_old_tickets');
    } catch {}
  })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const formatElapsed = (totalSeconds: number) => {
    const safe = Math.max(0, Math.floor(totalSeconds));
    const h = Math.floor(safe / 3600);
    const m = Math.floor((safe % 3600) / 60);
    const s = safe % 60;
    if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m ${s}s`;
    return `${String(m).padStart(2, '0')}m ${s}s`;
  };

  const formatHandling = (totalSeconds: number | null) => {
    if (totalSeconds === null) return '—';
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}m ${String(s).padStart(2, '0')}s`;
  };

  const handleCallNext = async () => {
    if (!assignedCounter) {
      console.warn('No active counter is assigned to this staff member.');
      showToast('No active counter is assigned to you.');
      return;
    }

    if (waitingQueue.length === 0) {
      console.warn('The waiting queue is currently empty.');
      showToast('The waiting queue is currently empty.');
      return;
    }

    if (servingTicket) {
      console.warn('Please mark the current ticket as Completed or No Show before serving the next customer.');
      showToast('Finish the current ticket first.');
      return;
    }

    const startOfTodayStr = startOfToday();
    let query = supabase
      .from('queues')
      .select('*')
      .eq('status', 'waiting')
      .gte('created_at', startOfTodayStr)
      .order('created_at', { ascending: true })
      .limit(1);

    if (assignedCounter.services && Array.isArray(assignedCounter.services) && assignedCounter.services.length > 0) {
      query = query.in('service_name', assignedCounter.services);
    }

    const { data: candidates, error: fetchError } = await query;
    if (fetchError) {
      console.error('Failed to fetch next ticket:', fetchError.message);
      showToast('Failed to load the next ticket.');
      return;
    }
    if (!candidates || candidates.length === 0) {
      showToast('The waiting queue is currently empty.');
      loadWaitingQueue();
      return;
    }
    const nextTicket = candidates[0];

    const { data: claimed, error } = await supabase
      .from('queues')
      .update({ status: 'serving', called_at: new Date().toISOString(), counter_id: assignedCounter.name })
      .eq('id', nextTicket.id)
      .eq('status', 'waiting')
      .select();

    if (error) {
      console.error('Failed to call next customer: ' + error.message);
      showToast('Failed to call next customer.');
      loadWaitingQueue();
      loadServingTicket();
      return;
    }
    if (!claimed || claimed.length === 0) {
      showToast('That customer was just called by another counter');
      loadWaitingQueue();
      loadServingTicket();
      return;
    }

    setServingTicket({ ...waitingQueue.find(t => t.id === nextTicket.id) || {
      id: claimed[0].id,
      ticketNumber: claimed[0].ticket_number,
      customerName: claimed[0].customer_name,
      serviceType: claimed[0].service_name,
      status: 'serving',
      arrivalTime: claimed[0].issued_time,
      estimatedWaitMinutes: claimed[0].estimated_wait,
      counterId: claimed[0].counter_id ?? undefined,
      createdAt: claimed[0].created_at,
    }, status: 'serving' });
    setWaitingQueue(prev => prev.filter(t => t.id !== nextTicket.id));
  };

  const handleCompleteCurrent = async () => {
    if (!servingTicket) return;

    const { data: completed, error } = await supabase
      .from('queues')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', servingTicket.id)
      .eq('status', 'serving')
      .select();

    if (error) {
      console.error('Failed to complete ticket: ' + error.message);
      showToast('Failed to complete ticket.');
      return;
    }
    if (!completed || completed.length === 0) {
      showToast('Failed to complete ticket.');
      loadServingTicket();
      loadWaitingQueue();
      return;
    }

    setServingTicket(null);
    loadAvgHandling();
    loadServedCount();
    loadWaitingQueue();
  };

  const handleNoShowCurrent = async () => {
    if (!servingTicket) return;

    const { data: noShowed, error } = await supabase
      .from('queues')
      .update({ status: 'no_show', completed_at: new Date().toISOString() })
      .eq('id', servingTicket.id)
      .eq('status', 'serving')
      .select();

    if (error) {
      console.error('Failed to mark no show: ' + error.message);
      showToast('Failed to mark no-show.');
      return;
    }
    if (!noShowed || noShowed.length === 0) {
      showToast('Failed to mark no-show.');
      loadServingTicket();
      loadWaitingQueue();
      return;
    }

    setServingTicket(null);
    loadWaitingQueue();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('activeTicket');
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center">
      <p className="text-sm text-on-surface-variant font-medium animate-pulse">Loading...</p>
    </div>
  );

  if (!verifiedRole) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center">
        <p className="text-sm text-on-surface-variant font-medium animate-pulse">
          Verifying session...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F2F2F2] w-full text-on-surface select-none font-sans">

      {/* Side Navigation Shell */}
      <aside className="fixed left-0 top-0 h-full w-[250px] bg-primary-container shadow-lg flex flex-col p-4 z-50 text-white">
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
            className="flex items-center gap-3 p-3 rounded-xl font-semibold text-xs text-left transition-all active:scale-[0.98] cursor-pointer text-on-secondary-container bg-secondary-container shadow-md"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Queue Control Center</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/status-monitoring')}
            className="flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left transition-all active:scale-[0.98] cursor-pointer text-on-primary-fixed-variant hover:bg-white/5 text-blue-100/60"
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span>Status Monitoring</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/analytics')}
            className="flex items-center gap-3 p-3 text-on-primary-fixed-variant hover:bg-white/5 rounded-xl font-medium text-blue-100/60 text-xs text-left transition-colors cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span>Analytics</span>
          </button>

          <div className="mt-auto border-t border-on-primary-container/20 pt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => navigate('/my-profile')}
              className="flex items-center gap-3 p-3 text-on-primary-fixed-variant hover:bg-white/5 rounded-xl font-medium text-blue-100/60 text-xs text-left transition-colors cursor-pointer"
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

      {/* Top Navigation Shell */}
      <header className="fixed top-0 right-0 h-[60px] ml-[250px] w-[calc(100%-250px)] bg-surface-container-lowest shadow-sm border-b border-outline-variant/65 flex justify-between items-center px-8 z-40">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-lg text-primary tracking-tight">
            Queue Control Center
          </span>
        </div>

        <div className="flex items-center gap-4">
          <StaffNotificationBell buttonClassName="relative p-2 text-on-surface-variant hover:text-secondary rounded-lg cursor-pointer" />

          <div className="h-8 w-[1px] bg-outline-variant/50" />

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-primary block capitalize leading-none mb-1">{verifiedEmail ? verifiedEmail.split('@')[0] : ''}</span>
              <span className="text-[10px] text-on-surface-variant font-medium block uppercase tracking-wider">Staff</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden border-2 border-secondary-container shadow-sm flex items-center justify-center text-white font-bold text-sm">
              {verifiedEmail ? verifiedEmail.split('@')[0].charAt(0).toUpperCase() : ''}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="ml-[250px] pt-[80px] flex-grow min-h-screen p-8 bg-[#F2F2F2]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-outline-variant/30">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary">Terminal Control</h2>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-container" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-outline uppercase tracking-wider">Customers in Line</span>
                <span className="text-2xl font-bold text-primary">{waitingQueue.length} Waiting</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-outline uppercase tracking-wider">Delivered Services</span>
                <span className="text-2xl font-bold text-green-700">{servedCount} Completed</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-outline uppercase tracking-wider">Average Handling</span>
                <span className="text-2xl font-bold text-secondary">{formatHandling(avgHandlingSeconds)}</span>
              </div>
            </div>
          </div>

          {/* Live Action Stations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Left Box: Caller Control Panel */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-outline-variant/40 shadow-sm flex flex-col justify-between min-h-[360px]">
              <div>
                <div className="flex justify-between items-start pb-4 border-b border-outline-variant/30 w-full mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                      <Radio className="w-4 h-4 text-green-500 animate-pulse" />
                      Active Caller Panel
                    </h3>
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                      {assignedCounter ? `${assignedCounter.name} virtual call console` : 'No active counter assigned'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${servingTicket ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                    {servingTicket ? 'Serving' : 'Idle'}
                  </span>
                </div>

                {!assignedCounter && (
                  <div className="flex items-start gap-2.5 text-[11px] text-amber-800 font-semibold bg-amber-500/15 border border-amber-500/30 p-3.5 rounded-xl mb-6">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    <span>No active counter is assigned to you. Please ask an admin to assign one.</span>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {servingTicket ? (
                    <motion.div
                      key="serving"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="bg-secondary-container/20 border border-secondary/20 rounded-2xl p-6 text-center shadow-inner relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-12 -mt-12 blur-2xl" />
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#584400]">Now Serving Customer</span>
                      <h4 className="text-6xl font-black text-[#0A1F44] tracking-wide font-mono mt-2 mb-4">
                        {servingTicket.ticketNumber}
                      </h4>
                      <p className="font-bold text-primary text-sm mb-1">{servingTicket.customerName}</p>
                      <span className="text-[11px] font-semibold text-[#584400]/80 lowercase italic block">
                        Category: {servingTicket.serviceType}
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty-console"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-10 text-center flex flex-col items-center justify-center"
                    >
                      <div className="w-14 h-14 bg-surface-container border border-outline-variant/30 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-outline" />
                      </div>
                      <h4 className="font-bold text-primary text-sm mb-1">Server Console Vacant</h4>
                      <p className="text-[11px] text-on-surface-variant font-semibold">
                        {assignedCounter ? `No customer is currently called to ${assignedCounter.name}.` : 'No customer is currently being served.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Interaction Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 mt-8 border-t border-outline-variant/30">
                <button
                  onClick={handleCallNext}
                  disabled={!assignedCounter}
                  className="py-3 px-4 bg-secondary-container hover:bg-secondary text-[#584400] hover:text-on-secondary font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Call Next</span>
                </button>
                <button
                  onClick={handleCompleteCurrent}
                  disabled={!servingTicket}
                  className="py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Complete</span>
                </button>
                <button
                  onClick={handleNoShowCurrent}
                  disabled={!servingTicket}
                  className="py-3 px-4 border border-outline-variant text-[#584400] hover:bg-surface-container text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>No Show</span>
                </button>
              </div>
            </div>

            {/* Right Box: Waiting Queue List */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-outline-variant/40 shadow-sm flex flex-col min-h-[360px]">
              <h3 className="font-bold text-primary text-base pb-4 border-b border-outline-variant/30 flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-secondary" />
                Line Wait Queue
                {waitingQueue.length > 0 && (
                  <span className="ml-auto text-[10px] font-bold bg-secondary-container text-[#584400] px-2 py-0.5 rounded-full">
                    {waitingQueue.length} in line
                  </span>
                )}
              </h3>

              <div className="space-y-3.5 flex-grow overflow-y-auto max-h-[350px] pr-1">
                {waitingQueue.length > 0 ? (
                  waitingQueue.map((item) => {
                    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(item.createdAt).getTime()) / 1000));
                    const isOverdue = item.estimatedWaitMinutes != null && elapsedSeconds > item.estimatedWaitMinutes * 60;
                    return (
                      <div key={item.id} className="flex justify-between items-center p-3.5 bg-[#F8F9FA] rounded-2xl border border-outline-variant/35 ring-1 ring-black/[2%]">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 bg-white border border-outline-variant/35 rounded-xl flex items-center justify-center font-bold text-primary font-mono text-xs shadow-inner">
                            {item.ticketNumber}
                          </div>
                          <div>
                            <h4 className="font-bold text-primary text-xs">{item.customerName}</h4>
                            <span className="text-[10px] text-on-surface-variant font-semibold block">{item.arrivalTime}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`block text-[10px] font-bold ${isOverdue ? 'text-amber-700' : 'text-outline'}`}>
                            {formatElapsed(elapsedSeconds)}
                          </span>
                          <span className="text-[10px] font-semibold text-on-surface-variant">
                            {item.estimatedWaitMinutes != null ? `Est. ${item.estimatedWaitMinutes} mins` : 'Est. —'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-xs text-outline font-semibold">Queue list is empty.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-xs font-semibold bg-red-600"
              >
                {toast.message}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}