import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Landmark, 
  LogOut, 
  Bell, 
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

export default function StatusMonitoring() {
  const navigate = useNavigate();

  // Role and Auth
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail') || 'demo@bank.com';
  const namePrefix = userEmail.split('@')[0];

  useEffect(() => {
    if (!userRole) {
      navigate('/login');
    } else if (userRole !== 'customer' && userRole !== 'staff' && userRole !== 'admin') {
      // Use environment variables as the source of truth for role
      const validCustomerRole = process.env.REACT_APP_VALID_CUSTOMER_ROLE || 'customer';
      const validStaffRole = process.env.REACT_APP_VALID_STAFF_ROLE || 'staff';
      const validAdminRole = process.env.REACT_APP_VALID_ADMIN_ROLE || 'admin';
      
      if (userRole !== validCustomerRole && userRole !== validStaffRole && userRole !== validAdminRole) {
        navigate('/login');
      }
    }
  }, [userRole, navigate]);

  // UI Interactive States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'waiting' | 'serving'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [highlightedTickets, setHighlightedTickets] = useState<Record<string, boolean>>({});
  const [showFullLogs, setShowFullLogs] = useState(false);
  const [reloadPulse, setReloadPulse] = useState(false);

  // Core Data sets
  const [queueTickets, setQueueTickets] = useState([
    { id: '#72', service: 'Cash Deposit', wait: '08:45', status: 'Serving', counter: 'Counter 04', customer: 'James Wilson' },
    { id: '#73', service: 'Account Inquiry', wait: '12:10', status: 'Waiting', counter: '—', customer: 'Sarah Connor' },
    { id: '#74', service: 'Card Collection', wait: '15:30', status: 'Waiting', counter: '—', customer: 'Alex Mercer' },
    { id: '#75', service: 'Loan Consultation', wait: '18:22', status: 'Waiting', counter: '—', customer: 'Bruce Wayne' },
    { id: '#71', service: 'Account Closure', wait: '22:05', status: 'Completed', counter: 'Counter 02', customer: 'David Chen' },
    { id: '#76', service: 'General Services', wait: '02:15', status: 'Waiting', counter: '—', customer: 'Zoe Vance' },
  ]);

  const [counterDashboard, setCounterDashboard] = useState([
    { id: '01', staff: 'Sarah Jenkins', service: 'General Services', status: 'Active', serving: '#68' },
    { id: '02', staff: 'David Chen', service: 'Corporate Banking', status: 'Active', serving: '#71' },
    { id: '03', staff: 'Maria Garcia', service: 'Teller Operations', status: 'On Break', serving: '—' },
    { id: '04', staff: 'James Wilson', service: 'Express Teller', status: 'Active', serving: '#72' },
  ]);

  const [auditLogs, setAuditLogs] = useState<string[]>([
    '06:45 PM: Ticket #72 called to Counter 04 by teller James Wilson.',
    '06:42 PM: Ticket #71 processed and marked completed at Counter 02.',
    '06:30 PM: System sync completed. Auto-refreshing branch line distribution.',
    '06:15 PM: Teller operations initialized. Main lobby kiosk online.'
  ]);

  // Auto-simulation of active banking terminal events
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Periodic update to tickets or wait times to represent a living, breathing application
      setQueueTickets(prev => {
        return prev.map(t => {
          if (t.status === 'Waiting') {
            const [mins, secs] = t.wait.split(':').map(Number);
            let total = mins * 60 + secs + Math.floor(Math.random() * 15) - 5;
            if (total < 60) total = 60;
            const newMins = String(Math.floor(total / 60)).padStart(2, '0');
            const newSecs = String(total % 60).padStart(2, '0');
            return { ...t, wait: `${newMins}:${newSecs}` };
          }
          return t;
        });
      });

      // Occasional audit log stream action
      const randomTimes = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const randomEvents = [
        `Teller Counter 01 registered status check.`,
        `Kiosk heartbeat status: green, 0ms packet latency.`,
        `Estimated wait time updated based on current speed coefficient.`,
        `Dynamic wait prediction model verified standard queue throughput.`
      ];
      const selectedEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
      setAuditLogs(prev => [`${randomTimes}: ${selectedEvent}`, ...prev.slice(0, 15)]);

    }, 7000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleReloadBoard = () => {
    setReloadPulse(true);
    setTimeout(() => setReloadPulse(false), 900);

    // Shuffle/Re-evaluate list values realistically
    setQueueTickets(prev => {
      return prev.map(t => ({
        ...t,
        wait: `${String(Math.floor(Math.random() * 20)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
      }));
    });

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAuditLogs(prev => [`${nowStr}: Board reloads manually initialized by operator.`, ...prev]);
  };

  const toggleRowHighlight = (id: string) => {
    setHighlightedTickets(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter implementation
  const filteredTickets = queueTickets.filter(ticket => {
    // Search filter
    const matchesSearch = ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ticket.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Tab filter
    if (activeFilter === 'all') return true;
    if (activeFilter === 'waiting') return ticket.status === 'Waiting';
    if (activeFilter === 'serving') return ticket.status === 'Serving';
    return true;
  });

  // Dynamic statistics calculations
  const totalWaitingCount = queueTickets.filter(t => t.status === 'Waiting').length;
  const servingNowTicket = queueTickets.find(t => t.status === 'Serving');

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
            onClick={() => navigate(isAdmin ? '/admin-dashboard' : '/manager-dashboard')}
            className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-xs text-left text-blue-100/60 hover:bg-white/5 transition-all cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Admin Dashboard</span>
          </button>

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
            <Clock className="w-4 h-4 shrink-0" />
            <span>Analytics Charts</span>
          </button>

          <button 
            type="button"
            onClick={() => navigate('/reports')}
            className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-xs text-left text-blue-100/60 hover:bg-white/5 transition-all cursor-pointer"
          >
            <Terminal className="w-4 h-4 shrink-0" />
            <span>Reports</span>
          </button>

          {isAdmin && (
            <>
              <button 
                type="button"
                onClick={() => navigate('/counter-management')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-xs text-left text-blue-100/60 hover:bg-white/5 transition-all"
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Counter Management</span>
              </button>
              <button 
                type="button"
                onClick={() => navigate('/service-management')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-xs text-left text-blue-100/60 hover:bg-white/5 transition-all"
              >
                <Sliders className="w-4 h-4 shrink-0" />
                <span>Service Type Setup</span>
              </button>
              <button 
                type="button"
                onClick={() => navigate('/user-management')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-xs text-left text-blue-100/60 hover:bg-white/5 transition-all"
              >
                <UserCheck className="w-4 h-4 shrink-0" />
                <span>User Roles Board</span>
              </button>
            </>
          )}

          <button 
            type="button"
            onClick={() => navigate('/wait-time-prediction')}
            className="flex items-center gap-2.5 p-2.5 rounded-xl font-medium text-xs text-left text-blue-100/60 hover:bg-white/5 transition-all cursor-pointer"
          >
            <Timer className="w-4 h-4 shrink-0" />
            <span>Wait Time Predictor</span>
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

          <button className="p-1.5 text-[#44464e] hover:text-[#755b00] transition-colors relative rounded-lg hover:bg-gray-100">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white"></span>
          </button>
          
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
                NOW SERVING {servingNowTicket ? servingNowTicket.id : '#72'}
              </h3>
              <p className="text-[#7687b2] font-medium text-sm pt-1">
                Assigned to {servingNowTicket ? servingNowTicket.counter : 'Counter 04'} • Customer: {servingNowTicket ? servingNowTicket.customer : 'James Wilson'}
              </p>
            </div>

            <div className="relative z-10 flex gap-4 w-full md:w-auto shrink-0">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center min-w-[124px] flex-1 md:flex-none">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">In Line Waiting</p>
                <p className="text-[#fed977] text-3xl font-extrabold mt-1">{totalWaitingCount}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center min-w-[124px] flex-1 md:flex-none">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Avg. Response</p>
                <p className="text-white text-3xl font-extrabold mt-1">12m</p>
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
                      placeholder="Search ticket, name..."
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

              {/* Responsive Queue Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#00081e] text-white">
                      <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider">Ticket #</th>
                      <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider">Service Type</th>
                      <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider text-center">Wait Time</th>
                      <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider text-center">Status</th>
                      <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-wider">Destination</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c5c6cf]">
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map((ticket, index) => {
                        const isHighlighted = highlightedTickets[ticket.id];
                        return (
                          <tr 
                            key={ticket.id} 
                            onClick={() => toggleRowHighlight(ticket.id)}
                            className={`transition-colors cursor-pointer border-b border-[#c5c6cf] ${
                              isHighlighted 
                                ? 'bg-[#fed977]/20 border-l-4 border-l-[#755b00]' 
                                : index % 2 === 1 ? 'bg-[#f3f3f3] hover:bg-neutral-200/50' : 'bg-white hover:bg-neutral-50'
                            }`}
                          >
                            <td className="px-6 py-4 font-extrabold text-[#00081e] font-mono">{ticket.id}</td>
                            <td className="px-6 py-4 font-semibold text-[#00081e]">{ticket.customer}</td>
                            <td className="px-6 py-4 text-xs font-semibold text-[#44464e]">{ticket.service}</td>
                            <td className="px-6 py-4 text-center font-semibold text-[#44464e] font-mono text-xs">{ticket.wait}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                ticket.status === 'Serving' 
                                  ? 'bg-green-100 text-green-700' 
                                  : ticket.status === 'Completed'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-[#fed977]/30 text-[#755b00]'
                              }`}>
                                {ticket.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-semibold text-xs text-[#75777f]">
                              {ticket.counter}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-xs text-[#75777f] font-semibold">
                          No matching tickets in active line. Try clearing search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* View/Hide Live Logs control */}
              <div className="p-4 bg-[#f3f3f3] text-center border-t border-[#c5c6cf]">
                <button 
                  onClick={() => setShowFullLogs(!showFullLogs)}
                  className="text-[#755b00] font-bold text-xs hover:underline transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  {showFullLogs ? 'Hide Live Monitor Audit Trace' : 'View Live Monitor Audit Trace'}
                </button>
              </div>

              {/* Expandable dark CLI view inside the table footer */}
              {showFullLogs && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-[#1C2C46] border-t border-[#c5c6cf] p-6 text-white font-mono text-[11px] space-y-2 max-h-48 overflow-y-auto"
                >
                  <div className="flex items-center justify-between text-[#fed977] font-bold uppercase tracking-wider pb-1.5 border-b border-white/10 mb-2">
                    <span>SmartQ Terminal Logger v2.4</span>
                    <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded animate-pulse">LIVE FEED</span>
                  </div>
                  {auditLogs.map((log, index) => (
                    <div key={index} className="text-[#A0AEC0] border-l-2 border-[#fed977] pl-3 leading-relaxed">
                      {log}
                    </div>
                  ))}
                </motion.div>
              )}

            </div>

            {/* R2. Counter Overview & Stats Column (4 Columns) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-base text-[#00081e] tracking-tight">Counter Overview</h4>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#44464e] px-2 py-1 bg-[#eeeeee] rounded-[4px] border border-gray-200">
                  {counterDashboard.length} Total
                </span>
              </div>

              {/* Counters List */}
              <div className="space-y-4">
                {counterDashboard.map((counter) => {
                  const isCounterExpress = counter.id === '04'; // Highlight James Wilson/Counter 04 as the golden highlighted focus
                  
                  return (
                    <div 
                      key={counter.id}
                      className={`p-4 rounded-[10px] shadow-sm flex items-center gap-4 transition-transform active:scale-[0.98] ${
                        isCounterExpress 
                          ? 'bg-white border-2 border-[#755b00] ring-4 ring-[#755b00]/5'
                          : counter.status === 'On Break'
                            ? 'bg-[#f3f3f3] border border-[#c5c6cf] opacity-75 grayscale-[0.3]'
                            : 'bg-white border border-[#c5c6cf]'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center font-mono ${
                        isCounterExpress 
                          ? 'bg-[#755b00] text-[#00081e]' 
                          : counter.status === 'On Break'
                            ? 'bg-[#75777f] text-white'
                            : 'bg-[#00081e] text-white'
                      }`}>
                        <span className="text-[9px] font-bold leading-none">C</span>
                        <span className="text-sm font-extrabold leading-none mt-1">{counter.id}</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-sm text-[#00081e]">{counter.staff}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            counter.status === 'On Break' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {counter.status}
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-[#44464e]">{counter.service}</p>
                      </div>

                      <div className="text-right">
                        <p className={`text-[9px] font-bold uppercase ${isCounterExpress ? 'text-[#755b00]' : 'text-zinc-500'}`}>
                          {counter.status === 'On Break' ? 'Idle' : 'Serving'}
                        </p>
                        <p className={`text-sm font-extrabold ${isCounterExpress ? 'text-[#755b00]' : 'text-[#00081e]'}`}>
                          {counter.serving}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Branch Clock / Efficiency Metrics Widget */}
              <div className="bg-[#00081e] p-5 rounded-[10px] shadow-sm text-white">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-sm text-white">Branch efficiency</p>
                  <span className="text-[9px] bg-[#755b00] text-white font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                    98.2% SLA
                  </span>
                </div>
                
                {/* Simulated bar chart representation */}
                <div className="flex items-end gap-3.5 h-24 pt-2">
                  <div className="flex-1 bg-[#755b00] rounded-t-[3px] transition-all duration-700" style={{ height: '60%' }} title="09:00 AM (60%)"></div>
                  <div className="flex-1 bg-[#755b00]/80 rounded-t-[3px] transition-all duration-700" style={{ height: '85%' }} title="10:30 AM (85%)"></div>
                  <div className="flex-1 bg-[#755b00] rounded-t-[3px] transition-all duration-700" style={{ height: '45%' }} title="12:00 PM (45%)"></div>
                  <div className="flex-1 bg-[#755b00]/80 rounded-t-[3px] transition-all duration-700" style={{ height: '70%' }} title="01:30 PM (70%)"></div>
                  <div className="flex-1 bg-[#755b00] rounded-t-[3px] transition-all duration-700" style={{ height: '95%' }} title="03:00 PM (95%)"></div>
                  <div className="flex-1 bg-[#755b00]/80 rounded-t-[3px] transition-all duration-700" style={{ height: '65%' }} title="04:30 PM (65%)"></div>
                </div>

                <div className="flex justify-between text-[10px] text-[#7687b2] font-semibold font-mono mt-3 pt-2 border-t border-white/10">
                  <span>09:00</span>
                  <span>12:00</span>
                  <span>15:00</span>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </main>
    </div>
  );
}

