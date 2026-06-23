import { supabase } from '../supabaseClient';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Landmark, 
  LogOut, 
  ChevronRight, 
  Bell, 
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

export default function QueueRegistration() {
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [regStep, setRegStep] = useState<1 | 2 | 3>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('cash_deposit');
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [additionalNote, setAdditionalNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userEmail = localStorage.getItem('userEmail') || '';
  const namePrefix = userEmail.split('@')[0];

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
      if (role === 'staff') { navigate('/queue-control'); return; }
      if (role === 'admin' || role === 'manager') { navigate('/admin'); return; }
      if (role !== 'customer') { navigate('/login'); return; }
      setUserRole(role);
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center">
      <p className="text-sm text-on-surface-variant font-medium animate-pulse">Loading...</p>
    </div>
  );

  if (userRole !== 'customer') return null;


  const services = [
    { id: 'cash_deposit', name: 'Cash Deposit', code: 'A', wait: 5, icon: 'payments', desc: 'Secure over-the-counter payments & currency updates' },
    { id: 'cash_withdrawal', name: 'Cash Withdrawal', code: 'A', wait: 8, icon: 'atm', desc: 'Teller drawers with robust audit support' },
    { id: 'account_opening', name: 'Account Opening', code: 'B', wait: 45, icon: 'person_add', desc: 'Check eligibility, open digital checking & credit cards' },
    { id: 'loan_inquiry', name: 'Loan Inquiry', code: 'C', wait: 20, icon: 'monetization_on', desc: 'Rates, mortgage structures & consultation requests' },
    { id: 'card_services', name: 'Card Services', code: 'D', wait: 12, icon: 'credit_card', desc: 'Issue replacements, unlock PINs & loyalty updates' },
    { id: 'general_inquiry', name: 'General Inquiry', code: 'E', wait: 10, icon: 'contact_support', desc: 'Compliance status, feedback & information checks' }
  ];

  const currentSelectedService = services.find(s => s.id === selectedServiceId) || services[0];

  const handleNextStepFromService = () => setRegStep(2);

  const handleConfirmDetails = () => {
    if (!fullName.trim() || !phoneNumber.trim()) return;
    setRegStep(3);
  };

  // ─── UPDATED: saves ticket to Supabase ───────────────────────────────────
  const handleIssueTicket = async () => {
    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      navigate('/login');
      return;
    }

    const generatedNum = `${currentSelectedService.code}-${Math.floor(100 + Math.random() * 900)}`;
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const waitingAhead = Math.floor(2 + Math.random() * 8);

    const ticketData = {
      ticket_number: generatedNum,
      service_id: currentSelectedService.id,
      service_name: currentSelectedService.name,
      service_code: currentSelectedService.code,
      customer_name: fullName,
      phone: phoneNumber,
      additional_note: additionalNote || null,
      estimated_wait: currentSelectedService.wait,
      waiting_ahead: waitingAhead,
      status: 'waiting',
      issued_time: currentTimeStr,
      user_id: user.id,
    };

   const { error } = await supabase.from('queues').insert(ticketData);

if (error) {
  alert('Failed to issue ticket: ' + error.message);
  setIsSubmitting(false);
  return;
}

    // Also save to localStorage so CustomerDashboard can read it immediately
    localStorage.setItem('activeTicket', JSON.stringify({
      number: generatedNum,
      service: currentSelectedService.name,
      waitingAhead,
      estimatedWait: currentSelectedService.wait,
      status: 'Waiting',
      customerName: fullName,
      phone: phoneNumber,
      issuedTime: currentTimeStr,
    }));

    setIsSubmitting(false);
    navigate('/customer-dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
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
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-3 flex-1 last:flex-initial">
                <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  regStep === step 
                    ? 'bg-secondary-container border border-secondary text-[#584400] scale-[1.05]' 
                    : regStep > step 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-surface-container-low border border-outline-variant/30 text-outline'
                }`}>
                  {regStep > step ? '✓' : step}
                </div>
                <span className={`text-xs font-bold ${regStep === step ? 'text-primary' : 'text-outline'}`}>
                  {step === 1 ? 'Select Service' : step === 2 ? 'Customer Details' : 'Verify & Ticket'}
                </span>
                {step < 3 && <ChevronRight className="w-4 h-4 text-outline/35 flex-grow" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
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
                  {services.map((item) => {
                    const isSelected = selectedServiceId === item.id;
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
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            isSelected ? 'bg-secondary-container text-[#584400]' : 'bg-surface-container border border-outline-variant/40 text-outline'
                          }`}>
                            Est. Wait: {item.wait} mins
                          </span>
                          <span className="text-lg font-bold text-secondary font-mono">{item.code} Queue</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-primary text-sm leading-snug mb-1">{item.name}</h4>
                          <p className="text-[11px] text-on-surface-variant leading-relaxed opacity-85">{item.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4 border-t border-outline-variant/40">
                  <button
                    type="button"
                    onClick={handleNextStepFromService}
                    className="px-6 py-3 bg-secondary-container hover:bg-secondary text-[#584400] hover:text-on-secondary font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>Proceed to Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {regStep === 2 && (
              <motion.div
                key="step-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-primary mb-1">Enter Customer Information</h3>
                  <p className="text-xs text-on-surface-variant font-medium">Please provide your matching details for this ticket:</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-on-surface-variant" htmlFor="fullName">
                      Your Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-secondary transition-colors">
                        <UserIcon className="w-[18px] h-[18px]" />
                      </div>
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder=""
                        className="block w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl font-medium text-on-surface placeholder:text-outline-variant/90 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-on-surface-variant" htmlFor="phoneNumber">
                      Your Contact Mobile Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-secondary transition-colors">
                        <Phone className="w-[18px] h-[18px]" />
                      </div>
                      <input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder=""
                        className="block w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl font-medium text-on-surface placeholder:text-outline-variant/90 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-on-surface-variant" htmlFor="additionalNote">
                      Additional Instruction or Service Request (Optional)
                    </label>
                    <textarea
                      id="additionalNote"
                      rows={3}
                      value={additionalNote}
                      onChange={(e) => setAdditionalNote(e.target.value)}
                      placeholder=""
                      className="block w-full p-4 bg-surface-container-low border border-outline-variant/60 rounded-xl font-medium text-on-surface placeholder:text-outline-variant/90 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-outline-variant/40">
                  <button
                    type="button"
                    onClick={() => setRegStep(1)}
                    className="px-5 py-3 border border-outline-variant/60 text-outline font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-surface-container transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Category</span>
                  </button>
                  <button
                    type="button"
                    disabled={!fullName.trim() || !phoneNumber.trim()}
                    onClick={handleConfirmDetails}
                    className="px-6 py-3 bg-secondary-container hover:bg-secondary text-[#584400] hover:text-on-secondary font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Proceed to Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {regStep === 3 && (
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

                <div className="bg-surface-container border border-outline-variant/60 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between pb-3 border-b border-outline-variant/40">
                    <span className="text-xs text-outline font-bold">Selected Banking Service</span>
                    <span className="text-xs font-bold text-primary">{currentSelectedService.name}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-outline-variant/40">
                    <span className="text-xs text-outline font-bold">Register Candidate</span>
                    <span className="text-xs font-bold text-primary">{fullName}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-outline-variant/40">
                    <span className="text-xs text-outline font-bold">Verified Contact</span>
                    <span className="text-xs font-bold text-primary">{phoneNumber}</span>
                  </div>
                  {additionalNote.trim() && (
                    <div className="pb-3 border-b border-outline-variant/40">
                      <span className="text-xs text-outline font-bold block mb-1">Service Comment / Notes</span>
                      <p className="text-xs font-medium text-primary italic bg-white/40 p-3 rounded-lg border border-outline-variant/20 leading-relaxed">
                        "{additionalNote}"
                      </p>
                    </div>
                  )}
                  <div className="flex items-start gap-2.5 text-[11px] text-on-surface-variant font-medium bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Virtual queue ticket allocations are live. By issuing this token, SMS alerts will update position shifts.
                    </span>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-outline-variant/40">
                  <button
                    type="button"
                    onClick={() => setRegStep(2)}
                    className="px-5 py-3 border border-outline-variant/60 text-outline font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-surface-container transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Info</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleIssueTicket}
                    disabled={isSubmitting}
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