import { supabase } from '../supabaseClient';
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
  User,
  Mail,
  Phone,
  Briefcase,
  CheckCircle2,
  Timer
} from 'lucide-react';

export default function MyProfile() {
  const navigate = useNavigate();

  // Role and Auth
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;
      if (!session) { navigate('/login'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, email, full_name, phone, department')
        .eq('id', session.user.id)
        .single();

      if (!profile?.role) { navigate('/login'); return; }
      setUserRole(profile.role);
      setUserEmail(profile.email ?? '');
      setFullName(profile.full_name ?? '');
      setPhone(profile.phone ?? '');
      setDepartment(profile.department ?? '');
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center">
      <p className="text-sm text-on-surface-variant font-medium animate-pulse">Loading...</p>
    </div>
  );

  const namePrefix = userEmail.split('@')[0];

 const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    navigate('/login');
    return;
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone: phone,
      department: department,
    })
    .eq('id', user.id);

  if (error) {
    alert('Failed to save profile: ' + error.message);
    return;
  }

  setSuccessMsg(true);
  setTimeout(() => setSuccessMsg(false), 3000);
};

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate('/login');
  };

  if (!userRole) return null;

  if (loading) return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center">
      <p className="text-sm text-on-surface-variant font-medium animate-pulse">Loading profile...</p>
    </div>
  );

  const isCustomer = userRole === 'customer';
  const isStaff = userRole === 'staff';
  const isManagerOrAdmin = userRole === 'manager' || userRole === 'admin';

  // Compile dynamic layout sidebar matching selected role
  const renderSidebar = () => {
    if (userRole === 'customer') {
      return (
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
              className="flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left transition-all active:scale-[0.98] cursor-pointer text-on-primary-fixed-variant hover:bg-white/5 text-blue-100/60"
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
                className="flex items-center gap-3 p-3 rounded-xl font-semibold text-xs text-left transition-all active:scale-[0.98] cursor-pointer text-on-secondary-container bg-secondary-container shadow-md"
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
    } else if (userRole === 'staff') {
      return (
        <aside className="fixed left-0 top-0 h-full w-[250px] bg-primary-container shadow-lg flex flex-col p-4 z-50 text-white">
          <div className="mb-0 px-2 flex flex-col gap-1">
            <div className="flex items-center gap-3 mt-4 mb-4">
              <div className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center shadow-lg">
                <Landmark className="w-6 h-6 text-[#0A1F44]" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Smart<span className="text-secondary-container">Q</span>
              </span>
            </div>
            <p className="text-on-primary-container text-[10px] font-semibold mt-1 tracking-wider opacity-60 uppercase mb-8">
              Agent Terminal
            </p>
          </div>

          <nav className="flex flex-col gap-2 flex-grow">
            <button
              type="button"
              onClick={() => navigate('/queue-control-center')}
              className="flex items-center gap-3 p-3 rounded-xl font-medium text-xs text-left transition-all active:scale-[0.98] cursor-pointer text-on-primary-fixed-variant hover:bg-white/5 text-blue-100/60"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Queue Control Center</span>
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
                className="flex items-center gap-3 p-3 rounded-xl font-semibold text-xs text-left transition-all active:scale-[0.98] cursor-pointer text-on-secondary-container bg-secondary-container shadow-md"
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
    } else {
      const isAdmin = userRole === 'admin';
      return (
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
              {isAdmin ? 'Admin Panel' : 'Manager Panel'}
            </p>
          </div>

          <nav className="flex flex-col gap-1 flex-grow overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => navigate('/admin-dashboard')}
              className="flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all active:scale-[0.98] cursor-pointer text-on-primary-fixed-variant hover:bg-white/5 text-blue-100/60"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Admin Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/status-monitoring')}
              className="flex items-center gap-2.5 p-2 rounded-lg font-medium text-xs text-left transition-all active:scale-[0.98] cursor-pointer text-on-primary-fixed-variant hover:bg-white/5 text-blue-100/60"
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span>Status Monitoring</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/analytics')}
              className="flex items-center gap-2.5 p-2 rounded-lg font-medium text-blue-100/60 hover:bg-white/5 text-xs text-left"
            >
              <span>Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="flex items-center gap-2.5 p-2 rounded-lg font-medium text-blue-100/60 hover:bg-white/5 text-xs text-left"
            >
              <span>Reports</span>
            </button>

            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/counter-management')}
                  className="flex items-center gap-2.5 p-2 rounded-lg font-medium text-blue-100/60 hover:bg-white/5 text-xs text-left"
                >
                  <span>Counter Management</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/service-management')}
                  className="flex items-center gap-2.5 p-2 rounded-lg font-medium text-blue-100/60 hover:bg-white/5 text-xs text-left"
                >
                  <span>Service Management</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/user-management')}
                  className="flex items-center gap-2.5 p-2 rounded-lg font-medium text-blue-100/60 hover:bg-white/5 text-xs text-left"
                >
                  <span>User Management</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => navigate('/wait-time-prediction')}
              className="flex items-center gap-2.5 p-2 rounded-lg font-medium text-blue-100/60 hover:bg-white/5 text-xs text-left"
            >
              <span>Wait Time Prediction</span>
            </button>

            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/system-data-management')}
                  className="flex items-center gap-2.5 p-2 rounded-lg font-medium text-blue-100/60 hover:bg-white/5 text-xs text-left"
                >
                  <span>System Data</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/system-integration')}
                  className="flex items-center gap-2.5 p-2 rounded-lg font-medium text-blue-100/60 hover:bg-white/5 text-xs text-left"
                >
                  <span>System Integration</span>
                </button>
              </>
            )}

            <div className="mt-auto border-t border-on-primary-container/20 pt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => navigate('/my-profile')}
                className="flex items-center gap-3 p-3 rounded-xl font-semibold text-xs text-left transition-all active:scale-[0.98] cursor-pointer text-on-secondary-container bg-secondary-container shadow-md"
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
  };

  return (
    <div className="flex min-h-screen bg-[#F2F2F2] w-full text-on-surface select-none font-sans">

      {/* Dynamic Sidebar */}
      {renderSidebar()}

      {/* Top Navigation Shell */}
      <header className="fixed top-0 right-0 h-[60px] ml-[250px] w-[calc(100%-250px)] bg-surface-container-lowest shadow-sm border-b border-outline-variant/65 flex justify-between items-center px-8 z-40">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-lg text-primary tracking-tight">
            My Profile
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 text-on-surface-variant hover:text-secondary rounded-lg"
          >
            <Bell className="w-5 h-5" />
          </button>

          <div className="h-8 w-[1px] bg-outline-variant/50" />

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-primary block capitalize leading-none mb-1">{namePrefix}</span>
              <span className="text-[10px] text-on-surface-variant font-medium block uppercase tracking-wider">{userRole}</span>
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
          className="max-w-[650px] mx-auto bg-white rounded-3xl p-8 border border-outline-variant/40 shadow-sm"
        >
          <div className="border-b border-outline-variant/30 pb-4 mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-primary">Personal Account Profile</h2>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">Manage details and default security parameters.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-5">

            {/* Full Name field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-on-surface-variant ml-0.5" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-secondary">
                  <User className="w-[18px] h-[18px]" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm"
                />
              </div>
            </div>

            {/* Email Address - All roles */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-on-surface-variant ml-0.5" htmlFor="emailAddress">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                  <Mail className="w-[18px] h-[18px]" />
                </div>
                <input
                  id="emailAddress"
                  type="email"
                  disabled
                  value={userEmail}
                  className="block w-full pl-10 pr-4 py-3 bg-gray-100 border border-outline-variant/30 rounded-xl font-medium text-outline-variant cursor-not-allowed text-sm"
                />
              </div>
            </div>

            {/* Contact Mobile — hidden from staff */}
            {!isStaff && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant ml-0.5" htmlFor="contactMobile">
                  Contact Mobile
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-secondary">
                    <Phone className="w-[18px] h-[18px]" />
                  </div>
                  <input
                    id="contactMobile"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm"
                  />
                </div>
              </div>
            )}

            {/* Department — staff only */}
            {!isCustomer && !isManagerOrAdmin && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface-variant ml-0.5" htmlFor="departmentBranch">
                  Department / Desk Location
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-secondary">
                    <Briefcase className="w-[18px] h-[18px]" />
                  </div>
                  <input
                    id="departmentBranch"
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm"
                  />
                </div>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Account profile changes validated & stored successfully!</span>
              </div>
            )}

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-6 py-3 bg-secondary-container hover:bg-secondary text-[#584400] hover:text-on-secondary font-bold text-xs rounded-xl shadow-md active:scale-[0.98] transition-all cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>

          </form>
        </motion.div>
      </main>
    </div>
  );
}
