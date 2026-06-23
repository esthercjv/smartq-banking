import { supabase } from '../supabaseClient';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Landmark, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Users, 
  Activity, 
  Coffee, 
  Radio, 
  Clock, 
  Bell, 
  Settings as SettingsIcon,
  LayoutDashboard,
  Timer,
  TrendingUp
} from 'lucide-react';
import { QueueItem } from '../types';

export default function QueueControlCenter() {
  const navigate = useNavigate();

  // ── Secure session verification ──────────────────────────────────────────
  const [verifiedRole, setVerifiedRole] = useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const namePrefix = verifiedEmail ? verifiedEmail.split('@')[0] : '';

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

  setVerifiedRole(profile.role);
  setVerifiedEmail(profile.email || session.user.email || '');
};
    verifySession();
  }, [navigate]);

  const [counterStatus, setCounterStatus] = useState<'active' | 'break' | 'offline'>('active');
  const [servingTicket, setServingTicket] = useState<QueueItem | null>(null);
  const [waitingQueue, setWaitingQueue] = useState<QueueItem[]>([]);
  const [servedCount, setServedCount] = useState(0);
  const [avgHandlingMinutes, setAvgHandlingMinutes] = useState(0);

  // ─── Load initial waiting queue from Supabase ─────────────────────────────
  const loadWaitingQueue = async () => {
    const { data, error } = await supabase
      .from('queues')
      .select('*')
      .eq('status', 'waiting')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading queue:', error.message);
      return;
    }

    const mapped: QueueItem[] = (data || []).map((row: any) => ({
      id: row.id,
      ticketNumber: row.ticket_number,
      customerName: row.customer_name,
      serviceType: row.service_name,
      status: row.status,
      arrivalTime: row.issued_time,
      estimatedWaitMinutes: row.estimated_wait,
      counterId: 'Counter 3',
    }));

    setWaitingQueue(mapped);
  };

  // ─── Load served count from Supabase ──────────────────────────────────────
  const loadServedCount = async () => {
    const { count } = await supabase
      .from('queues')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    setServedCount(count ?? 0);
  };

  // ─── Load currently serving ticket ────────────────────────────────────────
  const loadServingTicket = async () => {
    const { data, error } = await supabase
      .from('queues')
      .select('*')
      .eq('status', 'serving')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (data && !error) {
      setServingTicket({
        id: data.id,
        ticketNumber: data.ticket_number,
        customerName: data.customer_name,
        serviceType: data.service_name,
        status: data.status,
        arrivalTime: data.issued_time,
        estimatedWaitMinutes: data.estimated_wait,
        counterId: 'Counter 3',
      });
    } else {
      setServingTicket(null);
    }
  };

  // ─── Load all data on mount ────────────────────────────────────────────────
  useEffect(() => {
    loadWaitingQueue();
    loadServedCount();
    loadServingTicket();
  }, []);

  // ─── Real-time subscription ────────────────────────────────────────────────
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ─── Call Next ────────────────────────────────────────────────────────────
  const handleCallNext = async () => {
    if (waitingQueue.length === 0) {
      alert('The waiting queue is currently empty.');
      return;
    }

    if (servingTicket) {
      alert('Please mark the current ticket as Completed or No Show before serving the next customer.');
      return;
    }

    const nextTicket = waitingQueue[0];

    const { error } = await supabase
      .from('queues')
      .update({ status: 'serving' })
      .eq('id', nextTicket.id);

    if (error) {
      alert('Failed to call next customer: ' + error.message);
      return;
    }

    setServingTicket({ ...nextTicket, status: 'serving' });
    setWaitingQueue(prev => prev.filter(t => t.id !== nextTicket.id));
  };

  // ─── Complete Current ─────────────────────────────────────────────────────
  const handleCompleteCurrent = async () => {
    if (!servingTicket) return;

    const { error } = await supabase
      .from('queues')
      .update({ status: 'completed' })
      .eq('id', servingTicket.id);

    if (error) {
      alert('Failed to complete ticket: ' + error.message);
      return;
    }

    setServedCount(prev => prev + 1);
    setAvgHandlingMinutes(prev =>
      Number((prev * 0.95 + (4 + Math.random() * 4) * 0.05).toFixed(1))
    );
    setServingTicket(null);
  };

  // ─── No Show ──────────────────────────────────────────────────────────────
  const handleNoShowCurrent = async () => {
    if (!servingTicket) return;

    const { error } = await supabase
      .from('queues')
      .update({ status: 'no_show' })
      .eq('id', servingTicket.id);

    if (error) {
      alert('Failed to mark no show: ' + error.message);
      return;
    }

    setServingTicket(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate('/login');
  };

  // ── Session loading guard ─────────────────────────────────────────────────
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

          <button
            type="button"
            onClick={() => navigate('/wait-time-prediction')}
            className="flex items-center gap-3 p-3 text-on-primary-fixed-variant hover:bg-white/5 rounded-xl font-medium text-blue-100/60 text-xs text-left transition-colors cursor-pointer"
          >
            <Timer className="w-4 h-4 shrink-0" />
            <span>Wait Time Prediction</span>
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
          <button
            type="button"
            className="relative p-2 text-on-surface-variant hover:text-secondary rounded-lg"
          >
            <Bell className="w-5 h-5 text-on-surface-variant" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          </button>

          <div className="h-8 w-[1px] bg-outline-variant/50" />

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-primary block capitalize leading-none mb-1">{namePrefix}</span>
              <span className="text-[10px] text-on-surface-variant font-medium block uppercase tracking-wider">Staff</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden border-2 border-secondary-container shadow-sm flex items-center justify-center text-white font-bold text-sm">
              {namePrefix.charAt(0).toUpperCase()}
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
              <p className="text-on-surface-variant text-sm font-medium mt-1">
                Manage and call customers at Counter 3 (Teller Operations).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCounterStatus('active')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  counterStatus === 'active' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-white border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Online & Active</span>
              </button>
              <button
                onClick={() => setCounterStatus('break')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  counterStatus === 'break' ? 'bg-amber-50 border-amber-500 text-amber-800' : 'bg-white border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Coffee Break</span>
              </button>
              <button
                onClick={() => setCounterStatus('offline')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  counterStatus === 'offline' ? 'bg-red-50 border-red-500 text-red-800' : 'bg-white border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Offline</span>
              </button>
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
                <span className="text-2xl font-bold text-secondary">{avgHandlingMinutes} mins</span>
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
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5">Counter 3 virtual call console</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider rounded-full">
                    Online
                  </span>
                </div>

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
                      <p className="text-[11px] text-on-surface-variant font-semibold">No customer is currently called to Counter 3.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Interaction Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 mt-8 border-t border-outline-variant/30">
                <button
                  onClick={handleCallNext}
                  className="py-3 px-4 bg-secondary-container hover:bg-secondary text-[#584400] hover:text-on-secondary font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all cursor-pointer"
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
                  waitingQueue.map((item) => (
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
                      <span className="text-[10px] font-bold text-outline">
                        {item.estimatedWaitMinutes} mins
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-xs text-outline font-semibold">Queue list is empty.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}