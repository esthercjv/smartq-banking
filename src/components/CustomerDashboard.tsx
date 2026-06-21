import { supabase } from '../supabaseClient';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Landmark, 
  Clock, 
  LogOut, 
  Ticket, 
  CheckCircle2, 
  Bell, 
  Armchair, 
  QrCode, 
  LayoutDashboard,
  UserCheck,
  Activity,
  Settings as SettingsIcon,
  Timer
} from 'lucide-react';

export default function CustomerDashboard() {
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
      if (profile.role !== 'customer') {
        if (profile.role === 'staff') {
          navigate('/queue-control-center');
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

  // ── Active ticket from Supabase ───────────────────────────────────────────
  const [activeTicket, setActiveTicket] = useState<any>(null);

  useEffect(() => {
    const loadTicket = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('queues')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['waiting', 'serving'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error loading ticket:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const row = data[0];
        setActiveTicket({
          number: row.ticket_number,
          service: row.service_name,
          waitingAhead: row.waiting_ahead,
          estimatedWait: row.estimated_wait,
          status: row.status,
          customerName: row.customer_name,
          phone: row.phone,
          issuedTime: row.issued_time,
          id: row.id,
        });
      }
    };
    loadTicket();
  }, []);

  // ── Live counter simulation ───────────────────────────────────────────────
  const [liveNowServing, setLiveNowServing] = useState({
    number: '72',
    counter: 'Counter 2',
    service: 'Cash Withdrawal'
  });

  useEffect(() => {
    const originalServingTickets = ['72', 'A-108', 'B-240', 'C-114', 'D-302', 'E-019'];
    const counters = ['Counter 2', 'Counter 1', 'Counter 4', 'Counter 3', 'Counter 5', 'Counter 6'];
    const servicesList = ['Cash Withdrawal', 'Cheque Deposit', 'Account Setup', 'Loan Advice', 'Card Setup', 'Enquiry Desk'];

    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * originalServingTickets.length);
      setLiveNowServing({
        number: originalServingTickets[idx],
        counter: counters[idx],
        service: servicesList[idx],
      });
    }, 8500);

    return () => clearInterval(interval);
  }, []);

  // ── Cancel ticket ─────────────────────────────────────────────────────────
  const handleCancelTicket = async () => {
    if (!activeTicket?.id) return;
    await supabase.from('queues').delete().eq('id', activeTicket.id);
    localStorage.removeItem('activeTicket');
    setActiveTicket(null);
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
      <aside className="fixed left-0 top-0 h-full w-[250px] bg-primary-container shadow-lg flex flex-col p-4 z-50">
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
            className="flex items-center gap-3 p-3 rounded-xl font-semibold text-xs text-left transition-all active:scale-[0.98] cursor-pointer text-on-secondary-container bg-secondary-container shadow-md"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/queue-registration')}
            className="flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left transition-all active:scale-[0.98] cursor-pointer text-on-primary-fixed-variant hover:bg-white/5 text-blue-100/60"
          >
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>Queue Registration</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/status-monitoring')}
            className="flex items-center gap-3 p-3 text-on-primary-fixed-variant hover:bg-white/5 rounded-xl font-medium text-blue-100/60 text-xs text-left transition-colors cursor-pointer"
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span>Status Monitoring</span>
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
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-error-container hover:bg-error text-on-error-container hover:text-white font-bold text-xs transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Portal</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Top Navigation Shell */}
      <header className="fixed top-0 right-0 h-[60px] ml-[250px] w-[calc(100%-250px)] bg-surface-container-lowest shadow-sm border-b border-outline-variant/65 flex justify-between items-center px-8 z-40">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-lg text-primary tracking-tight">
            My Dashboard
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative p-2 text-on-surface-variant hover:text-secondary transition-colors active:opacity-80 rounded-lg cursor-pointer"
          >
            <Bell className="w-5 h-5 text-on-surface-variant" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          </button>

          <div className="h-8 w-[1px] bg-outline-variant/50" />

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-primary block capitalize leading-none mb-1">
                {namePrefix}
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium block uppercase tracking-wider">
                Customer
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden border-2 border-secondary-container shadow-sm flex items-center justify-center text-white font-bold text-sm">
              {namePrefix.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="ml-[250px] pt-[80px] flex-grow min-h-screen p-8 bg-[#F2F2F2]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Page Title Row */}
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary">My Dashboard</h2>
              <p className="text-on-surface-variant text-sm font-medium mt-1">
                Welcome back, here is your current queue status.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2.5 bg-green-500/10 border border-green-500/25 px-4 py-2 rounded-xl text-green-700 text-xs font-semibold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span>Interactive Queue Connection Live</span>
            </div>
          </div>

          {/* Row 1: KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.03)] border border-outline-variant/60 flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                My Queue Number
              </span>
              <span className="text-3xl font-extrabold text-primary font-mono tracking-wide">
                {activeTicket ? activeTicket.number : 'None'}
              </span>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.03)] border border-outline-variant/60 flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                Queue Status
              </span>
              <div className="flex items-center">
                {activeTicket ? (
                  <span className="px-3 py-1 bg-secondary-container border border-secondary text-[#584400] font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-secondary-fixed-dim rounded-full animate-pulse" />
                    {activeTicket.status}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-surface-container border border-outline-variant/30 rounded-full text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                    None
                  </span>
                )}
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.03)] border border-outline-variant/60 flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
                Estimated Wait
              </span>
              <span className="text-3xl font-extrabold text-[#755b00]">
                {activeTicket ? `${activeTicket.estimatedWait} mins` : '—'}
              </span>
            </div>
          </div>

          {/* Row 2: Live Display and Ticket */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mb-8 items-stretch">

            {/* Live Queue Display */}
            <div className="lg:col-span-6 bg-primary-container rounded-3xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden group min-h-[300px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/15 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-110 transition-transform duration-700" />

              <div className="flex justify-between items-start relative z-10 w-full">
                <div>
                  <span className="text-secondary-fixed text-xs font-bold tracking-[0.2em] uppercase">
                    Now Serving
                  </span>
                  <div className="text-8xl font-black text-surface-container-lowest mt-2 tracking-tighter hover:scale-105 transition-transform origin-left font-mono">
                    {liveNowServing.number}
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-on-primary-container/20 px-3 py-1.5 rounded-full border border-on-primary-container/30 backdrop-blur-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e] animate-ping" />
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                    Live Terminal
                  </span>
                </div>
              </div>

              <div className="border-t border-on-primary-container/35 pt-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8">
                <div className="flex items-center gap-3">
                  <Armchair className="w-5 h-5 text-secondary-container" />
                  <p className="text-surface-container-lowest font-semibold text-lg">
                    {liveNowServing.counter} — <span className="text-secondary-fixed">{liveNowServing.service}</span>
                  </p>
                </div>
                <p className="text-xs text-blue-100/40 font-medium">Please proceed when called</p>
              </div>
            </div>

            {/* My Queue Ticket */}
            <div className="lg:col-span-4 bg-surface-container-lowest rounded-3xl p-8 shadow-[0px_10px_35px_rgba(0,0,0,0.03)] border border-outline-variant/60 flex flex-col items-center justify-center text-center relative overflow-hidden">
              {!activeTicket ? (
                <div className="flex flex-col items-center w-full">
                  <div className="w-20 h-20 bg-surface-container-low border border-outline-variant/40 rounded-full flex items-center justify-center mb-6">
                    <QrCode className="w-10 h-10 text-outline" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">No Active Queue</h3>
                  <p className="text-on-surface-variant text-sm font-medium mb-6 px-4">
                    You are not currently in line. Register now to receive your virtual ticket.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/queue-registration')}
                    className="w-full py-4 bg-secondary-container hover:bg-secondary transition-all text-[#584400] hover:text-on-secondary font-bold text-sm rounded-2xl shadow-md cursor-pointer hover:shadow-lg active:scale-[0.98]"
                  >
                    Register Now
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="w-16 h-16 bg-secondary-container/20 border border-secondary/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-secondary" />
                  </div>

                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider bg-surface-container border border-outline-variant/30 px-3 py-1 rounded-full mb-1">
                    Active Virtual Ticket
                  </span>
                  <h4 className="text-xs text-on-surface-variant font-bold uppercase mb-4 tracking-wide max-w-[90%] truncate">
                    {activeTicket.service}
                  </h4>

                  <div className="w-full max-w-[240px] bg-secondary-container rounded-2xl p-6 relative flex flex-col items-center gap-1 shadow-md border border-secondary/20">
                    <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full translate-y-[-50%]" />
                    <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full translate-y-[-50%]" />

                    <span className="text-[10px] text-[#584400] tracking-widest uppercase font-bold">Your Identifier</span>
                    <span className="text-4xl font-extrabold text-[#0A1F44] tracking-wider font-mono my-2">
                      {activeTicket.number}
                    </span>
                    <div className="w-full border-t border-dashed border-[#584400]/25 my-2" />

                    <div className="flex justify-between w-full text-left text-[#584400]/75 font-semibold text-[11px] mt-1">
                      <div>
                        <span className="block text-[9px] uppercase tracking-wide opacity-70">Issued</span>
                        <span>{activeTicket.issuedTime}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[9px] uppercase tracking-wide opacity-70">AHEAD</span>
                        <span>{activeTicket.waitingAhead} Clients</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCancelTicket}
                    className="mt-6 text-xs font-bold text-outline hover:text-error transition-colors cursor-pointer"
                  >
                    Cancel Virtual Ticket
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-sm">
            <h3 className="font-bold text-primary mb-3">About SmartQ Virtual Queueing</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
              Your ticket position is simulated dynamically in real-time. Staff call clients based on counter configurations.
            </p>
            <div className="flex gap-4">
              <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5" /> Virtual Token System
              </span>
              <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> SMS Alerts Active
              </span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
