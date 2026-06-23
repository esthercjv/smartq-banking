import { supabase } from '../supabaseClient';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Landmark, 
  LogOut, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  RefreshCw, 
  Bell, 
  Settings as SettingsIcon,
  ShieldCheck,
  Activity,
  Users,
  CheckCircle2,
  LayoutDashboard,
  Clock,
  Sliders,
  UserPlus,
  Terminal,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { CounterStatus } from '../types';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // ── Secure session verification ──────────────────────────────────────────
  const [verifiedRole, setVerifiedRole] = useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const namePrefix = verifiedEmail ? verifiedEmail.split('@')[0] : '';

  useEffect(() => {
    const verifySession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      const role = session.user.user_metadata?.role;
      if (role !== 'manager' && role !== 'admin') {
        if (role === 'customer') {
          navigate('/customer-dashboard');
        } else {
          navigate('/queue-control-center');
        }
        return;
      }
      setVerifiedRole(role);
      setVerifiedEmail(session.user.email ?? '');
      setLoading(false);
    };
    verifySession();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center">
      <p className="text-sm text-on-surface-variant font-medium animate-pulse">Loading...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F2F2F2] w-full text-on-surface select-none font-sans">
      
      {/* Side Navigation Bar */}
      <aside className="fixed left-0 top-0 h-full w-[250px] bg-[#0a1f44] z-50 flex flex-col gap-6 p-4 shadow-md text-white">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-4 mt-2">
          <div className="w-10 h-10 bg-[#ffe08f] flex items-center justify-center rounded-lg shadow-sm">
            <Landmark className="w-5 h-5 text-[#241a00]" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#ffe08f] leading-tight">SmartQ Banking</h1>
            <p className="text-[9px] text-[#7687b2] uppercase tracking-widest font-extrabold">Enterprise Queue</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {/* Dashboard (Active) */}
          <button 
            type="button"
            onClick={() => navigate('/admin-dashboard')}
            className="flex items-center gap-3 p-3 text-[#755b00] bg-[#fed977] rounded-lg font-bold text-xs text-left cursor-pointer transition-all active:scale-[0.98]"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </button>

          {/* Inactive links matching Stitch branding style */}
          <button 
            type="button"
            onClick={() => navigate('/queue-registration')}
            className="flex items-center gap-3 p-3 text-blue-100/60 hover:text-white hover:bg-primary transition-colors rounded-lg text-xs text-left cursor-pointer"
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>Queue Registration</span>
          </button>

          <button 
            type="button"
            onClick={() => navigate('/status-monitoring')}
            className="flex items-center gap-3 p-3 text-blue-100/60 hover:text-white hover:bg-primary transition-colors rounded-lg text-xs text-left cursor-pointer"
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span>Status Monitoring</span>
          </button>

          {/* Shared manager & admin subpages */}
          <button 
            type="button"
            onClick={() => navigate('/analytics')}
            className="flex items-center gap-3 p-3 text-blue-100/60 hover:text-white hover:bg-primary transition-colors rounded-lg text-xs text-left cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span>Analytics</span>
          </button>

          <button 
            type="button"
            onClick={() => navigate('/reports')}
            className="flex items-center gap-3 p-3 text-blue-100/60 hover:text-white hover:bg-primary transition-colors rounded-lg text-xs text-left cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>Reports</span>
          </button>

          {/* Admin Specific Links */}
          {true && (
            <>
              <button 
                type="button"
                onClick={() => navigate('/counter-management')}
                className="flex items-center gap-3 p-3 text-blue-100/60 hover:text-white hover:bg-primary transition-colors rounded-lg text-xs text-left cursor-pointer"
              >
                <Sliders className="w-4 h-4 shrink-0" />
                <span>Counter Management</span>
              </button>

              <button 
                type="button"
                onClick={() => navigate('/service-management')}
                className="flex items-center gap-3 p-3 text-blue-100/60 hover:text-white hover:bg-primary transition-colors rounded-lg text-xs text-left cursor-pointer"
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Service Management</span>
              </button>

              <button 
                type="button"
                onClick={() => navigate('/user-management')}
                className="flex items-center gap-3 p-3 text-blue-100/60 hover:text-white hover:bg-primary transition-colors rounded-lg text-xs text-left cursor-pointer"
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>User Management</span>
              </button>
            </>
          )}

          <button 
            type="button"
            onClick={() => navigate('/wait-time-prediction')}
            className="flex items-center gap-3 p-3 text-blue-100/60 hover:text-white hover:bg-primary transition-colors rounded-lg text-xs text-left cursor-pointer"
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span>Wait Time Prediction</span>
          </button>

          {true && (
            <>
              <button 
                type="button"
                onClick={() => navigate('/system-data-management')}
                className="flex items-center gap-3 p-3 text-blue-100/60 hover:text-white hover:bg-primary transition-colors rounded-lg text-xs text-left cursor-pointer"
              >
                <Terminal className="w-4 h-4 shrink-0" />
                <span>System Data</span>
              </button>
              <button 
                type="button"
                onClick={() => navigate('/system-integration')}
                className="flex items-center gap-3 p-3 text-blue-100/60 hover:text-white hover:bg-primary transition-colors rounded-lg text-xs text-left cursor-pointer"
              >
                <SettingsIcon className="w-4 h-4 shrink-0" />
                <span>System Integration</span>
              </button>
            </>
          )}

          {/* Footer controls */}
          <div className="mt-auto pt-4 border-t border-on-primary-container/20 flex flex-col gap-2">
            <button 
              type="button"
              onClick={() => navigate('/my-profile')}
              className="flex items-center gap-3 p-3 text-blue-100/60 hover:text-white hover:bg-primary transition-colors rounded-lg text-xs text-left cursor-pointer"
            >
              <SettingsIcon className="w-4 h-4 shrink-0" />
              <span>System Settings</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 font-bold text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Panel</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Top Navigation Bar */}
      <header className="fixed top-0 right-0 h-[60px] ml-[250px] w-[calc(100%-250px)] bg-white border-b border-outline-variant z-40 flex justify-between items-center px-8 shadow-sm">
        <h2 className="text-lg font-bold text-primary">System Overview</h2>
        <div className="flex items-center gap-6">
          <button className="p-2 text-on-surface-variant hover:text-secondary transition-colors relative">
            <Bell className="w-5 h-5 text-on-surface-variant" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full border border-white"></span>
          </button>
          <div className="h-8 w-[1px] bg-slate-200"></div>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/my-profile')}>
            <span className="text-xs font-bold text-on-surface-variant capitalize">{namePrefix}</span>
            <ChevronDown className="w-4 h-4 text-primary" />
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-[250px] mt-[60px] p-8 flex-grow">
        {/* Page Header with tab/switcher */}
        <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-xs text-on-surface-variant font-semibold mt-0.5">System overview and performance summary</p>
          </div>

          {/* Stitch style view tab switcher */}
          <div className="flex bg-slate-200/55 p-1 rounded-lg border border-outline-variant/30">
            <button 
              onClick={() => navigate('/admin-dashboard', { state: { tab: 'overview' } })}
              className={`px-5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                '/admin-dashboard' === '/admin-dashboard' 
                  ? 'bg-white shadow-sm text-primary font-bold' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Branch Overview
            </button>
            <button 
              onClick={() => navigate('/admin-dashboard', { state: { tab: 'counters' } })}
              className={`px-5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                '/admin-dashboard' === '/admin-dashboard' 
                  ? 'bg-white shadow-sm text-primary font-bold' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Counter Controls
            </button>
          </div>
        </header>

        <motion.div
          key={'/admin-dashboard'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {true ? (
            <div className="space-y-8">
              {/* Row 1: KPI Cards */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users */}
                <div className="bg-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <span className="p-2 bg-[#ffe08f]/30 rounded-lg">
                      <Users className="w-5 h-5 text-[#755b00]" />
                    </span>
                    <span className="text-xs font-semibold bg-green-50 px-2 py-1 rounded text-green-700">+12%</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">Total Users</p>
                  <h3 className="text-2xl font-extrabold text-primary mt-1">{2000}</h3>
                </div>

                {/* Total Queues Today */}
                <div className="bg-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <span className="p-2 bg-blue-50 rounded-lg">
                      <LayoutDashboard className="w-5 h-5 text-[#0a1f44]" />
                    </span>
                    <span className="text-xs font-semibold bg-red-50 px-2 py-1 rounded text-red-600">-3%</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">Queues Today</p>
                  <h3 className="text-2xl font-extrabold text-primary mt-1">{500}</h3>
                </div>

                {/* Active Counters */}
                <div className="bg-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <span className="p-2 bg-[#ffe08f]/30 rounded-lg">
                      <Sliders className="w-5 h-5 text-[#755b00]" />
                    </span>
                    <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded text-slate-600">Stable</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">Active Counters</p>
                  <h3 className="text-2xl font-extrabold text-primary mt-1">24/28</h3>
                </div>

                {/* Avg Wait Time */}
                <div className="bg-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <span className="p-2 bg-blue-50 rounded-lg">
                      <Clock className="w-5 h-5 text-[#0a1f44]" />
                    </span>
                    <span className="text-xs font-semibold bg-green-50 px-2 py-1 rounded text-green-700">-5m</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">Avg Wait Time</p>
                  <h3 className="text-2xl font-extrabold text-primary mt-1">14.2<span className="text-sm font-medium ml-1">min</span></h3>
                </div>
              </section>

              {/* Row 2: Charts */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Queue Volume by Hour (Bar Chart) */}
                <div className="bg-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-extrabold text-primary uppercase tracking-wide">Queue Volume by Hour</h3>
                    <span className="text-[10px] bg-[#fed977]/35 text-[#755b00] px-2.5 py-1 rounded-full font-bold">Kiosk Analytics</span>
                  </div>
                  <div className="h-[200px] flex items-end justify-between gap-2.5 px-1 relative">
                    {[42, 58, 70, 101, 85, 60, 45, 30, 50, 65, 40, 20].map((val, idx) => {
                      const heightPercent = `${(val / 110) * 100}%`;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center group relative cursor-pointer h-full justify-end">
                          <div 
                            style={{ height: heightPercent }}
                            className="w-full bg-[#fed977] hover:bg-[#755b00] transition-colors rounded-t-sm shadow-sm"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-bold border-t border-outline-variant/15 pt-2.5 font-mono">
                    <span>8AM</span>
                    <span>10AM</span>
                    <span>12PM</span>
                    <span>2PM</span>
                    <span>4PM</span>
                  </div>
                </div>

                {/* Wait Time Trend (Line Chart) */}
                <div className="bg-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-extrabold text-primary uppercase tracking-wide">Wait Time Trend</h3>
                    <span className="text-[10px] bg-indigo-50 text-[#0a1f44] px-2.5 py-1 rounded-full font-bold">Performance Logs</span>
                  </div>
                  
                  <div className="h-[200px] relative w-full pt-4">
                    <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="adminChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0a1f44" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="#0a1f44" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M 0 160 Q 62.5 140 125 100 T 250 40 T 375 70 T 500 60 L 500 200 L 0 200 Z" 
                        fill="url(#adminChartGrad)" 
                      />
                      <path 
                        d="M 0 160 Q 62.5 140 125 100 T 250 40 T 375 70 T 500 60" 
                        fill="none" 
                        stroke="#0a1f44" 
                        strokeLinecap="round" 
                        strokeWidth="3.5" 
                      />
                      <circle cx="125" cy="100" fill="#0a1f44" r="4.5" />
                      <circle cx="250" cy="40" fill="#0a1f44" r="4.5" />
                      <circle cx="375" cy="70" fill="#0a1f44" r="4.5" />
                      <circle cx="500" cy="60" fill="#755b00" r="6" className="animate-pulse" />
                    </svg>
                  </div>

                  <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-bold border-t border-outline-variant/15 pt-2.5 font-mono">
                    <span>8AM</span>
                    <span>10AM</span>
                    <span>12PM</span>
                    <span>2PM</span>
                    <span>4PM</span>
                  </div>
                </div>
              </section>

              {/* Row 3: Table and System Health */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Queue Activity (Table) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30 overflow-hidden">
                  <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
                    <h3 className="text-sm font-extrabold text-primary uppercase tracking-wide">Recent Queue Activity</h3>
                    <span className="text-xs text-secondary hover:underline cursor-pointer font-bold select-none" onClick={() => navigate('/status-monitoring')}>View All</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-[#00081e] text-white">
                        <tr className="text-[10px] uppercase font-mono font-bold tracking-wider">
                          <th className="p-4">Ticket ID</th>
                          <th className="p-4">Customer Name</th>
                          <th className="p-4">Selected Service</th>
                          <th className="p-4">Operational Status</th>
                          <th className="p-4">Assigned Desk</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10 text-xs font-semibold text-on-surface-variant">
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-mono font-bold text-primary">B-104</td>
                          <td className="p-4 text-primary">Sarah Jenkins</td>
                          <td className="p-4">Mortgage Dept</td>
                          <td className="p-4">
                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-green-50 text-green-700 border border-green-200">Active</span>
                          </td>
                          <td className="p-4 font-mono">Counter 03</td>
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-mono font-bold text-primary">A-522</td>
                          <td className="p-4 text-primary">Michael Chen</td>
                          <td className="p-4">General Inquiry</td>
                          <td className="p-4">
                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-700 border border-amber-200">Waiting</span>
                          </td>
                          <td className="p-4 font-mono text-slate-400">—</td>
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-mono font-bold text-primary">C-088</td>
                          <td className="p-4 text-primary">Elena Rodriguez</td>
                          <td className="p-4">Cash Deposit</td>
                          <td className="p-4">
                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-green-50 text-green-700 border border-green-200">Active</span>
                          </td>
                          <td className="p-4 font-mono">Counter 12</td>
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-mono font-bold text-primary">A-523</td>
                          <td className="p-4 text-primary">David Miller</td>
                          <td className="p-4">General Inquiry</td>
                          <td className="p-4">
                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-700 border border-amber-200">Waiting</span>
                          </td>
                          <td className="p-4 font-mono text-slate-400">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.02)] border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-primary mb-6 uppercase tracking-wide">System Health Index</h3>
                    <ul className="space-y-5">
                      <li className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                        <div className="flex items-center gap-3">
                          <span className="p-1.5 bg-slate-100 rounded-md">
                            <Activity className="w-4 h-4 text-slate-600" />
                          </span>
                          <span>Database Server</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-slate-500">Online</span>
                          <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e] animate-pulse"></span>
                        </div>
                      </li>
                      <li className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                        <div className="flex items-center gap-3">
                          <span className="p-1.5 bg-slate-100 rounded-md">
                            <RefreshCw className="w-4 h-4 text-slate-600" />
                          </span>
                          <span>Predictive AI Kernel</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-slate-500">Stable</span>
                          <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e] animate-pulse"></span>
                        </div>
                      </li>
                      <li className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                        <div className="flex items-center gap-3">
                          <span className="p-1.5 bg-slate-100 rounded-md">
                            <Sliders className="w-4 h-4 text-slate-600" />
                          </span>
                          <span>Active Desks Sync</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-slate-500">Syncing</span>
                          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6] animate-pulse"></span>
                        </div>
                      </li>
                      <li className="flex items-center justify-between text-xs font-bold text-on-surface-variant opacity-60">
                        <div className="flex items-center gap-3">
                          <span className="p-1.5 bg-slate-100 rounded-md">
                            <Clock className="w-4 h-4 text-slate-600" />
                          </span>
                          <span>Working Hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-slate-500">Closed</span>
                          <span className="w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 leading-relaxed">
                    <span className="font-bold block text-[10px] uppercase text-[#755b00] tracking-wider mb-0.5">Integrity Monitor</span>
                    System checked 2 minutes ago. All redundant cloud nodes are operating with optimal processing latencies.
                  </div>
                </div>
              </section>
            </div>
          ) : (
            /* Counter Controls view */
            <div className="bg-white rounded-xl p-6 border border-outline-variant/30 shadow-[0px_4px_12px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30 mb-6">
                <div>
                  <h3 className="text-sm font-extrabold text-primary uppercase tracking-wide">Staff Desks Allocation</h3>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">Update assigned roles or operational desks states instantly.</p>
                </div>
                <span className="text-[10px] bg-[#0A1F44] text-[#fed977] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Live Desk Controller</span>
              </div>
              
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-outline-variant/30 text-[10px] text-on-surface-variant uppercase tracking-wider font-extrabold bg-[#00081e] text-white">
                      <th className="py-4 px-4 font-mono">Desk ID</th>
                      <th className="py-4 px-4">Allocated Staff member</th>
                      <th className="py-4 px-4">Currently Serving</th>
                      <th className="py-4 px-4">Power Status</th>
                      <th className="py-4 px-4">Assigned Service Queue Type</th>
                      <th className="py-4 px-4 text-right">Desks Settings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-xs font-semibold text-on-surface-variant">
                    {[
                      { id: '01', staffName: 'Sarah Jenkins', serviceType: 'General Services', status: 'active', currentTicket: '#68' },
                      { id: '02', staffName: 'David Chen', serviceType: 'Corporate Banking', status: 'active', currentTicket: '#71' },
                      { id: '03', staffName: 'Maria Garcia', serviceType: 'Teller Operations', status: 'break', currentTicket: '—' },
                      { id: '04', staffName: 'James Wilson', serviceType: 'Express Teller', status: 'active', currentTicket: '#72' }
                    ].map((counter) => (
                      <tr key={counter.id} className="hover:bg-slate-55 transition-colors">
                        <td className="py-4 px-4 font-bold font-mono text-primary">Counter {counter.id}</td>
                        <td className="py-4 px-4 text-primary font-bold">{counter.staffName}</td>
                        <td className="py-4 px-4 font-mono font-bold text-[#755b00]">
                          {counter.currentTicket || '—'}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            counter.status === 'active' ? 'bg-green-100 text-green-800' : counter.status === 'break' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              counter.status === 'active' ? 'bg-green-500' : counter.status === 'break' ? 'bg-amber-500' : 'bg-red-500'
                            }`} />
                            {counter.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold">{counter.serviceType}</td>
                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {}}
                            className="bg-slate-100 hover:bg-slate-200 border border-slate-250 text-primary font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                          >
                            Toggle Desk Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}