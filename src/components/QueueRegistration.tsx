import { supabase } from '../supabaseClient';
import NotificationBell from './NotificationBell';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Landmark, 
  LogOut, 
  ChevronRight, 
  ArrowRight, 
  ArrowLeft, 
  User as UserIcon, 
  Phone, 
  LayoutDashboard,
  UserCheck,
  Activity,
  Settings as SettingsIcon,
  Sparkles,
  Info,
  Timer
} from 'lucide-react';
import { predictWaitRounded } from '../predictWait';

export default function QueueRegistration() {
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [regStep, setRegStep] = useState<1 | 2>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [additionalNote, setAdditionalNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [serviceOptions, setServiceOptions] = useState<{ id: string; name: string; code: string | null; base_wait_minutes: number | null; description: string | null }[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(true);
  const [activeTicketGuard, setActiveTicketGuard] = useState<{ ticket_number: string; status: string } | null>(null);
  const userEmail = localStorage.getItem('userEmail') || '';
  const namePrefix = userEmail.split('@')[0];

  useEffect(() => {
    const loadServices = async () => {
      const rows: { id: string; name: string; code: string | null; base_wait_minutes: number | null; description: string | null }[] = [];
      let from = 0;
      for (;;) {
        const { data, error } = await supabase
          .from('services')
          .select('id, name, code, base_wait_minutes, description')
          .eq('status', 'active')
          .order('code')
          .order('name')
          .range(from, from + 999);
        if (error) {
          console.error('Failed to load services:', error.message);
          break;
        }
        const batch = (data ?? []) as typeof rows;
        rows.push(...batch);
        if (batch.length < 1000) break;
        from += 1000;
      }
      setServiceOptions(rows);
      setLoadingServices(false);
    };
    loadServices();
  }, []);

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
      if (!role) { navigate('/login'); return; }
      if (role === 'staff') { navigate('/queue-control-center'); return; }
      if (role === 'admin' || role === 'manager') { navigate('/admin-dashboard'); return; }
      if (role !== 'customer') { navigate('/login'); return; }
      setUserRole(role);
      setLoading(false);

      // Auto-load customer profile details
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', session.user.id)
        .single();

      if (profileData) {
        setFullName(profileData.full_name || '');
        setPhoneNumber(profileData.phone || '');
      }

      // Block if user already has an active ticket
      const { data: activeRows, error: activeError } = await supabase
        .from('queues')
        .select('ticket_number, status')
        .eq('user_id', session.user.id)
        .in('status', ['waiting', 'serving'])
        .order('created_at', { ascending: false })
        .limit(1);
      if (activeError) {
        console.error('QueueRegistration: failed to check active ticket', activeError.message);
      }
      setActiveTicketGuard(activeRows?.[0] ?? null);
    });
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center">
      <p className="text-sm text-on-surface-variant font-medium animate-pulse">Loading...</p>
    </div>
  );

  if (userRole !== 'customer') return null;

  const currentSelectedService = serviceOptions.find(s => s.id === selectedServiceId) || serviceOptions[0] || null;

  const handleNextStepFromService = () => setRegStep(2);

  const handleIssueTicket = async () => {
    if (!currentSelectedService) return;
    if (activeTicketGuard) {
      setSubmitError(`You already have an active ticket (${activeTicketGuard.ticket_number}).`);
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const { count: aheadCount, error: aheadError } = await supabase
        .from('queues')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'waiting')
        .gte('created_at', startOfToday.toISOString());
      if (aheadError) {
        console.error('Failed to count waiting tickets:', aheadError.message);
        setSubmitError('Could not determine the current queue length. Please try again.');
        setIsSubmitting(false);
        return;
      }
      const peopleAhead = aheadCount ?? 0;

      const { count: activeCounterCount, error: counterError } = await supabase
        .from('counters')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active');
      if (counterError) {
        console.error('Failed to count active counters:', counterError.message);
      }
      const activeCounters = Math.max(1, activeCounterCount ?? 0);

      const estimated = predictWaitRounded({
        baseWait: currentSelectedService.base_wait_minutes,
        peopleAhead,
        activeCounters,
      });

      const { data: ticket, error } = await supabase.rpc('issue_ticket', {
        p_service_id: currentSelectedService.id,
        p_note: additionalNote || null,
        p_estimated_wait: estimated,
      });

      if (error) {
        console.error('Failed to issue ticket:', error.message);
        setSubmitError(error.message);
        setIsSubmitting(false);
        return;
      }

      if (!ticket) {
        console.error('issue_ticket returned no row');
        setSubmitError('Failed to issue ticket. Please try again.');
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem('activeTicket', JSON.stringify({
        number: ticket.ticket_number,
        service: ticket.service_name,
        waitingAhead: ticket.waiting_ahead,
        estimatedWait: ticket.estimated_wait,
        status: 'Waiting',
        customerName: ticket.customer_name,
        phone: ticket.phone,
        issuedTime: ticket.issued_time,
      }));

      setIsSubmitting(false);
      navigate('/customer-dashboard');
    } catch (err) {
      console.error('QueueRegistration: failed to issue ticket', err);
      setSubmitError('Failed to issue ticket. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('activeTicket');
    navigate('/login');
  };

  if (userRole !== 'customer') return null;

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
            className="flex items-center gap-3 p-3 rounded-xl font-semibold text-xs text-left transition-all active:scale-[0.98] cursor-pointer text-on-primary-fixed-variant hover:bg-white/5 text-blue-100/60"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </button>

          <button 
            type="button"
            onClick={() => navigate('/queue-registration')}
            className="flex items-center gap-3 p-3 rounded-xl font-semibold text-xs text-left transition-all active:scale-[0.98] cursor-pointer text-on-secondary-container bg-secondary-container shadow-md"
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
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-error-container hover:bg-error text-on-error-container hover:text-white font-bold text-xs transition-colors cursor-pointer"
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
            Register for Queue
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <NotificationBell />

          <div className="h-8 w-[1px] bg-outline-variant/50" />

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-primary block capitalize leading-none mb-1">{namePrefix}</span>
              <span className="text-[10px] text-on-surface-variant font-medium block uppercase tracking-wider">Customer</span>
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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[800px] mx-auto bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/60 relative overflow-hidden"
        >
          {/* Wizard Steps */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-outline-variant/60">
            {[
              { num: 1, label: 'Select Service' },
              { num: 2, label: 'Verify & Ticket' }
            ].map((step, idx, arr) => (
              <div key={step.num} className="flex items-center gap-3 flex-1 last:flex-initial">
                <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  regStep === step.num
                    ? 'bg-secondary-container border border-secondary text-[#584400] scale-[1.05]'
                    : regStep > step.num
                    ? 'bg-green-100 text-green-700'
                    : 'bg-surface-container-low border border-outline-variant/30 text-outline'
                }`}>
                  {regStep > step.num ? '✓' : step.num}
                </div>
                <span className={`text-xs font-bold ${regStep === step.num ? 'text-primary' : 'text-outline'}`}>
                  {step.label}
                </span>
                {idx < arr.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-outline/35 flex-grow" />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTicketGuard && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-[11px] text-amber-800 font-semibold">
                  You already have an active ticket ({activeTicketGuard.ticket_number}). Cancel it from your dashboard or wait until it is finished.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/customer-dashboard')}
                  className="px-4 py-2 bg-secondary-container text-[#584400] hover:bg-secondary hover:text-on-secondary font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
            {regStep === 1 && (
              <motion.div
                key="step-service"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-primary mb-1">What service category do you require?</h3>
                  <p className="text-xs text-on-surface-variant font-medium">Select one from our digital counter catalog below:</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loadingServices ? (
                    <p className="text-xs font-medium text-on-surface-variant animate-pulse col-span-full py-8 text-center">
                      Loading services...
                    </p>
                  ) : serviceOptions.length === 0 ? (
                    <p className="text-xs font-medium text-on-surface-variant col-span-full py-8 text-center">
                      No services are available right now. Please try again later.
                    </p>
                  ) : serviceOptions.map((item) => {
                    const isSelected = currentSelectedService?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedServiceId(item.id)}
                        className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 min-h-[140px] cursor-pointer ${
                          isSelected 
                            ? 'bg-secondary-container/20 border-secondary ring-1 ring-secondary' 
                            : 'bg-surface-container-low border-outline-variant/40 hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex justify-between items-start w-full">
                          {item.base_wait_minutes !== null && (
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              isSelected ? 'bg-secondary-container text-[#584400]' : 'bg-surface-container border border-outline-variant/40 text-outline'
                            }`}>
                              Est. Wait: {item.base_wait_minutes} mins
                            </span>
                          )}
                          {item.code && (
                            <span className="text-lg font-bold text-secondary font-mono">{item.code} Queue</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-primary text-sm leading-snug mb-1">{item.name}</h4>
                          {item.description && (
                            <p className="text-[11px] text-on-surface-variant leading-relaxed opacity-85">{item.description}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4 border-t border-outline-variant/40">
                  <button
                    type="button"
                    onClick={handleNextStepFromService}
                    disabled={!currentSelectedService || !!activeTicketGuard}
                    className="px-6 py-3 bg-secondary-container hover:bg-secondary text-[#584400] hover:text-on-secondary font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span>Proceed to Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {regStep === 2 && (
              <motion.div
                key="step-complete"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-primary mb-1">Verify and Issue Ticket</h3>
                  <p className="text-xs text-on-surface-variant font-medium">Please review details before joining the real-time queue:</p>
                </div>

                {(!fullName || !phoneNumber) && (
                  <div className="flex items-start gap-2.5 text-[11px] text-amber-700 font-medium bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl mb-4">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    <span>
                      Your profile is missing some details. Please{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/my-profile')}
                        className="font-bold underline cursor-pointer"
                      >
                        update your profile
                      </button>
                      {' '}before registering for a queue.
                    </span>
                  </div>
                )}

                <div className="bg-surface-container border border-outline-variant/60 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between pb-3 border-b border-outline-variant/40">
                    <span className="text-xs text-outline font-bold">Selected Banking Service</span>
                    <span className="text-xs font-bold text-primary">{currentSelectedService.name}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-outline-variant/40">
                    <span className="text-xs text-outline font-bold">Register Candidate</span>
                    <div className="text-right">
                      <span className="text-xs font-bold text-primary block">{fullName || 'Not set'}</span>
                      <span className="text-[10px] text-outline font-medium">From your account profile</span>
                    </div>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-outline-variant/40">
                    <span className="text-xs text-outline font-bold">Verified Contact</span>
                    <div className="text-right">
                      <span className="text-xs font-bold text-primary block">{phoneNumber || 'Not set'}</span>
                      <span className="text-[10px] text-outline font-medium">From your account profile</span>
                    </div>
                  </div>
                  {additionalNote.trim() && (
                    <div className="pb-3 border-b border-outline-variant/40">
                      <span className="text-xs text-outline font-bold block mb-1">Service Comment / Notes</span>
                      <p className="text-xs font-medium text-primary italic bg-white/40 p-3 rounded-lg border border-outline-variant/20 leading-relaxed">
                        "{additionalNote}"
                      </p>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-on-surface-variant" htmlFor="additionalNote">
                      Additional Instruction or Service Request
                      <span className="text-outline font-medium ml-1">(Optional)</span>
                    </label>
                    <textarea
                      id="additionalNote"
                      rows={2}
                      value={additionalNote}
                      onChange={(e) => setAdditionalNote(e.target.value)}
                      placeholder="Any specific request for the counter staff..."
                      className="block w-full p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl font-medium text-on-surface placeholder:text-outline-variant/70 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm resize-none"
                    />
                  </div>
                  <div className="flex items-start gap-2.5 text-[11px] text-on-surface-variant font-medium bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Virtual queue ticket allocations are live. By issuing this token, Keep this app open to get alerts when your turn is near.
                    </span>
                  </div>

                  {submitError && (
                    <div className="text-[11px] text-red-700 font-semibold bg-red-50 border border-red-200 p-3.5 rounded-xl">
                      {submitError}
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t border-outline-variant/40">
                  <button
                    type="button"
                    onClick={() => setRegStep(1)}
                    className="px-5 py-3 border border-outline-variant/60 text-outline font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-surface-container transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Service</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleIssueTicket}
                    disabled={isSubmitting || !fullName || !phoneNumber || !currentSelectedService || !!activeTicketGuard}
                    className="px-6 py-3 bg-secondary-container hover:bg-secondary text-[#584400] hover:text-on-secondary font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#584400]" />
                    <span>{isSubmitting ? 'Issuing Ticket...' : 'Issue Virtual Ticket'}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
