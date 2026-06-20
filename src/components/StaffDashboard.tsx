import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Landmark, LogOut, CheckCircle2, AlertTriangle, Play, HelpCircle, Users, Activity, ExternalLink, Coffee, Radio, Sparkles, Clock } from 'lucide-react';
import { User, QueueItem } from '../types';

interface StaffDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function StaffDashboard({ user, onLogout }: StaffDashboardProps) {
  const [counterStatus, setCounterStatus] = useState<'active' | 'break' | 'offline'>('active');
  const [servingTicket, setServingTicket] = useState<QueueItem | null>({
    id: 'ticket-101',
    ticketNumber: 'A-242',
    customerName: 'Marcus Aurelius',
    serviceType: 'Teller & Cash Transactions',
    status: 'serving',
    arrivalTime: '11:15 AM',
    counterId: 'Counter 3',
    estimatedWaitMinutes: 0,
  });

  const [waitingQueue, setWaitingQueue] = useState<QueueItem[]>([
    { id: 'ticket-102', ticketNumber: 'A-243', customerName: 'Alice Green', serviceType: 'Teller & Cash Transactions', status: 'waiting', arrivalTime: '11:20 AM', estimatedWaitMinutes: 5 },
    { id: 'ticket-103', ticketNumber: 'B-704', customerName: 'Devon Smith', serviceType: 'New Accounts & Services', status: 'waiting', arrivalTime: '11:25 AM', estimatedWaitMinutes: 10 },
    { id: 'ticket-104', ticketNumber: 'A-244', customerName: 'Zoe Vance', serviceType: 'Teller & Cash Transactions', status: 'waiting', arrivalTime: '11:30 AM', estimatedWaitMinutes: 15 },
    { id: 'ticket-105', ticketNumber: 'C-082', customerName: 'Reginald Cole', serviceType: 'Loans & Mortgages', status: 'waiting', arrivalTime: '11:32 AM', estimatedWaitMinutes: 20 },
  ]);

  const [servedCount, setServedCount] = useState(14);
  const [avgHandlingMinutes, setAvgHandlingMinutes] = useState(6.2);

  const handleCallNext = () => {
    if (waitingQueue.length === 0) {
      alert('The waiting queue is currently empty.');
      return;
    }

    if (servingTicket && servingTicket.status === 'serving') {
      // Must complete current ticket first
      alert('Please mark the current ticket as Completed or No Show before serving the next customer.');
      return;
    }

    const nextTicket = waitingQueue[0];
    const updatedQueue = waitingQueue.slice(1);

    setServingTicket({
      ...nextTicket,
      status: 'serving',
      counterId: 'Counter 3',
    });
    setWaitingQueue(updatedQueue);
  };

  const handleCompleteCurrent = () => {
    if (!servingTicket) return;
    setServedCount(prev => prev + 1);
    // recalculate random average
    setAvgHandlingMinutes(prev => Number((prev * 0.95 + (4 + Math.random() * 4) * 0.05).toFixed(1)));
    setServingTicket(null);
  };

  const handleNoShowCurrent = () => {
    if (!servingTicket) return;
    setServingTicket(null);
  };

  return (
    <div className="flex min-h-screen bg-background w-full">
      {/* Sidebar - Matching Design System: 250px width, #0A1F44 background */}
      <aside className="w-[250px] bg-primary-container text-white flex flex-col shrink-0 border-r border-white/10 relative p-6 font-sans">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-secondary-container rounded-xl flex items-center justify-center">
            <Landmark className="w-5 h-5 text-on-secondary-container" />
          </div>
          <div>
            <span className="font-semibold text-base block tracking-tight">SmartQ</span>
            <span className="text-[10px] text-[#7687b2] uppercase font-bold tracking-widest block">Agent Terminal</span>
          </div>
        </div>

        {/* User Info inside Sidebar */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/5 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-container/20 text-secondary-container font-bold flex items-center justify-center text-sm">
              S
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-on-primary-container font-semibold">Staff Officer</p>
              <p className="text-xs font-bold text-white truncate">{user.email}</p>
              <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full uppercase">
                Active Staff
              </span>
            </div>
          </div>
        </div>

        {/* Counter Status Controls inside Sidebar */}
        <div className="mb-8 space-y-2">
          <span className="text-[10px] uppercase font-bold text-[#7687b2] tracking-wider block mb-2 px-1">
            Terminal Status
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              onClick={() => setCounterStatus('active')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                counterStatus === 'active' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'text-outline hover:bg-white/5'
              }`}
            >
              <Radio className="w-4 h-4 text-green-400" />
              <span>Online & Active</span>
            </button>
            <button
              onClick={() => setCounterStatus('break')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                counterStatus === 'break' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-outline hover:bg-white/5'
              }`}
            >
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>Coffee Break</span>
            </button>
            <button
              onClick={() => setCounterStatus('offline')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                counterStatus === 'offline' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'text-outline hover:bg-white/5'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Offline</span>
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <div className="px-3 py-2 text-[10px] uppercase font-bold text-[#7687b2] tracking-wider">
            Menu
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 text-white font-semibold text-xs text-left">
            <span>Counter Control</span>
          </button>
        </nav>

        {/* Exit bottom */}
        <button
          onClick={onLogout}
          className="mt-auto w-full flex items-center justify-center gap-2 px-3 py-3 rounded-lg bg-error-container text-on-error-container hover:bg-error hover:text-white font-semibold text-xs transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Close Terminal</span>
        </button>
      </aside>

      {/* Control Station Main Content */}
      <main className="flex-1 overflow-auto p-8 font-sans">
        {/* Top bar */}
        <div className="flex justify-between items-center pb-6 border-b border-outline-variant/30 mb-8">
          <div>
            <h1 className="text-page-title font-bold text-primary">Queue Control Center</h1>
            <p className="text-sm text-on-surface-variant font-medium">Manage and call customers at Counter 3 (Teller Operations)</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-outline-variant/30 shadow-sm flex items-center gap-3">
            <span className="text-xs font-bold text-outline uppercase tracking-wider">Status:</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              counterStatus === 'active' ? 'bg-green-100 text-green-800' : counterStatus === 'break' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
            }`}>
              <span className={`w-2 h-2 rounded-full ${counterStatus === 'active' ? 'bg-green-500' : counterStatus === 'break' ? 'bg-amber-500' : 'bg-red-500'}`} />
              {counterStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        {/* Counter Action Boards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Action Center (Current Ticket) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-[#fed977]" />
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-[17px] font-extrabold text-primary flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    Now Serving Display
                  </h2>
                  <p className="text-xs text-on-surface-variant font-medium">Control panel for the active transaction ticket</p>
                </div>
                <span className="px-3 py-1 bg-primary-container/10 rounded-full text-xs font-bold text-primary-container">
                  Counter 3
                </span>
              </div>

              {servingTicket ? (
                <div className="space-y-6">
                  <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 border border-outline-variant/20">
                    <div className="text-center md:text-left">
                      <span className="text-[10px] text-outline uppercase font-extrabold tracking-wider bg-white px-2.5 py-1 rounded-full border border-outline-variant/30">
                        {servingTicket.serviceType}
                      </span>
                      <h3 className="text-white bg-primary-container px-6 py-4 rounded-xl text-3xl font-mono font-extrabold my-3 w-fit tracking-wider shadow-inner">
                        {servingTicket.ticketNumber}
                      </h3>
                      <div className="space-y-0.5">
                        <p className="text-xs text-outline font-semibold">Customer</p>
                        <p className="text-base font-bold text-primary">{servingTicket.customerName}</p>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-auto">
                      <button
                        onClick={handleCompleteCurrent}
                        className="flex-1 md:w-44 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Complete Order
                      </button>
                      <button
                        onClick={handleNoShowCurrent}
                        className="flex-1 md:w-44 py-3.5 bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold text-xs rounded-xl transition-all border border-outline-variant/30 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <AlertTriangle className="w-4 h-4 text-on-surface-variant" />
                        No Show / Skip
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-outline-variant/50 rounded-2xl bg-surface-container-low/40">
                  <Play className="w-12 h-12 text-outline/60 mx-auto mb-3" />
                  <p className="text-sm font-bold text-primary">No Active Customer</p>
                  <p className="text-xs text-on-surface-variant font-medium mt-1 mb-5">Call the next queue ticket to begin Counter 3 operations.</p>
                  <button
                    onClick={handleCallNext}
                    className="px-6 py-3 bg-secondary-container hover:bg-secondary text-[#584400] hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Call Next Customer
                  </button>
                </div>
              )}

              {servingTicket && (
                <div className="mt-6 pt-5 border-t border-outline-variant/30 flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant font-semibold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-secondary" />
                    Served count this session: <strong className="text-primary">{servedCount - 14} customers</strong>
                  </span>
                  <button
                    onClick={handleCallNext}
                    className="px-4 py-2 bg-secondary-container hover:bg-secondary text-[#584400] hover:text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    Force Call Next (Skip)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Line (Wait Queue List) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6">
              <h3 className="font-extrabold text-primary text-base mb-4">
                Counter Queue ({waitingQueue.length})
              </h3>

              <div className="space-y-2.5 max-h-[380px] overflow-auto pr-1">
                <AnimatePresence initial={false}>
                  {waitingQueue.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-surface-container-low border border-outline-variant/20 rounded-xl flex justify-between items-center text-left"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-primary bg-secondary-container px-2 py-0.5 rounded-lg border border-outline-variant/30">
                            {item.ticketNumber}
                          </span>
                          <span className="text-[10px] text-outline font-semibold">{item.arrivalTime}</span>
                        </div>
                        <p className="text-xs font-bold text-on-surface mt-1.5">{item.customerName}</p>
                        <p className="text-[10px] text-on-surface-variant font-semibold">{item.serviceType}</p>
                      </div>
                      
                      {index === 0 && (
                        <button
                          onClick={handleCallNext}
                          className="px-2.5 py-1.5 bg-primary-container text-white rounded-lg text-[11px] font-bold hover:bg-primary transition-colors cursor-pointer"
                        >
                          Call
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {waitingQueue.length === 0 && (
                  <div className="text-center py-8 text-xs text-outline font-semibold">
                    Queue is empty. Everything clear!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
