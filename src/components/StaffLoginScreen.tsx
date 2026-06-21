import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Landmark, IdCard, Lock, Eye, EyeOff, ShieldAlert, ArrowRight, Shield } from 'lucide-react';
import { UserRole } from '../types';
import { supabase } from '../supabaseClient';

interface StaffLoginScreenProps {
  onLoginSuccess?: (email: string, role: UserRole) => void;
  onNavigate?: (route: string) => void;
}

type StaffRole = 'staff' | 'manager' | 'admin';

export default function StaffLoginScreen({ onLoginSuccess, onNavigate }: StaffLoginScreenProps) {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<StaffRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      setError('Please select your staff role to continue');
      return;
    }

    if (!employeeId || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Convert Employee ID to internal Supabase email format
    const internalEmail = `${employeeId.trim().toUpperCase()}@smartqbank.com`;

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: internalEmail,
      password,
    });

    setIsLoading(false);

    if (authError) {
      setError('Invalid Employee ID or password. Please try again.');
      return;
    }

    
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('role, full_name, employee_id')
  .eq('id', data.user.id)
  .single();

if (profileError || !profile) {
  setError('Unable to load your account. Please contact your administrator.');
  await supabase.auth.signOut();
  return;
}

const userRole = profile.role as StaffRole;

// Verify selected role matches what is actually stored in the database
if (userRole !== selectedRole) {
  setError('Incorrect role selected. Please select the correct role for your Employee ID.');
  await supabase.auth.signOut();
  return;
}

// Store only display data — role is never trusted from localStorage for access control
localStorage.setItem('userEmail', employeeId.trim().toUpperCase());
localStorage.setItem('userId', data.user.id);
localStorage.setItem('userName', profile.full_name || employeeId.trim().toUpperCase());
localStorage.setItem('employeeId', employeeId.trim().toUpperCase());

if (onLoginSuccess) {
  onLoginSuccess(employeeId, userRole);
}

if (userRole === 'staff') {
  navigate('/queue-control-center');
} else {
  navigate('/admin-dashboard');
}
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-[440px] flex flex-col items-center z-10 px-4"
    >
      {/* Header Branding for Mobile */}
      <div className="mb-8 text-center select-none md:hidden">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-secondary-container rounded-2xl shadow-lg transform transition-transform hover:scale-105">
          <Landmark className="w-12 h-12 text-[#584400]" />
        </div>
        <h1 className="font-semibold text-[26px] text-secondary-container tracking-tight leading-tight">
          SmartQ Staff Portal
        </h1>
        <p className="text-on-primary-container text-[11px] font-semibold mt-1 uppercase tracking-widest opacity-90">
          Authorized Personnel Only
        </p>
      </div>

      {/* Staff Login Card */}
      <div className="w-full bg-surface-container-lowest rounded-2xl p-8 sm:p-10 shadow-[0px_10px_40px_rgba(0,0,0,0.4)] border-2 border-[#fed977]/30 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#fed977] via-[#e5c158] to-[#fed977]" />

        {/* Security Badge */}
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container/25 border border-error/20 text-[11px] font-bold text-error uppercase tracking-wider mb-2">
            <Lock className="w-3 h-3" /> Restricted Access
          </span>
          <p className="text-[11px] text-red-400 font-semibold leading-normal">
            Unauthorized access attempts are logged and monitored
          </p>
        </div>

        <h2 className="text-[24px] font-semibold text-primary mb-1">Staff Access</h2>
        <p className="text-[13px] text-on-surface-variant mb-6">Enter your employee credentials</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Employee ID Input */}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-semibold text-on-surface-variant ml-0.5" htmlFor="employeeId">
              Employee ID
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-secondary transition-colors">
                <IdCard className="w-[18px] h-[18px]" />
              </div>
              <input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                disabled={isLoading}
                placeholder="EMP-2024-001"
                className="block w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl font-medium text-on-surface placeholder:text-outline-variant/70 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-semibold text-on-surface-variant ml-0.5" htmlFor="password">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-secondary transition-colors">
                <Lock className="w-[18px] h-[18px]" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="••••••••"
                className="block w-full pl-10 pr-12 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl font-medium text-on-surface placeholder:text-outline-variant/70 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface-variant transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
              </button>
            </div>
          </div>

          {/* Role Grid Section */}
          <div className="space-y-2 pt-1">
            <label className="block text-[13px] font-semibold text-on-surface-variant ml-0.5">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setSelectedRole('staff'); setError(null); }}
                disabled={isLoading}
                className={`py-3 text-[11px] font-bold uppercase rounded-xl border text-center transition-all cursor-pointer leading-tight ${
                  selectedRole === 'staff'
                    ? 'bg-[#fed977] border-[#fed977] text-[#0A1F44] shadow-md scale-[1.02]'
                    : 'bg-surface-container-low border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Staff
              </button>
              <button
                type="button"
                onClick={() => { setSelectedRole('manager'); setError(null); }}
                disabled={isLoading}
                className={`py-3 text-[11px] font-bold uppercase rounded-xl border text-center transition-all cursor-pointer leading-tight ${
                  selectedRole === 'manager'
                    ? 'bg-[#fed977] border-[#fed977] text-[#0A1F44] shadow-md scale-[1.02]'
                    : 'bg-surface-container-low border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => { setSelectedRole('admin'); setError(null); }}
                disabled={isLoading}
                className={`col-span-2 py-3 text-[11px] font-bold uppercase rounded-xl border text-center transition-all cursor-pointer leading-tight ${
                  selectedRole === 'admin'
                    ? 'bg-[#fed977] border-[#fed977] text-[#0A1F44] shadow-md scale-[1.02]'
                    : 'bg-surface-container-low border-outline-variant/40 text-on-surface-variant hover:bg-[#fed977]/10'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 bg-error-container/40 border border-error/20 p-3 rounded-xl text-xs text-error font-medium"
            >
              <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#fed977] hover:bg-[#e5c158] transition-all text-[#0A1F44] font-bold rounded-xl shadow-md cursor-pointer active:scale-[0.98] transform flex items-center justify-center gap-2 mt-4 text-[14px] disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Entering Staff Portal...</span>
              </>
            ) : (
              <>
                <span>Access Staff Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back to Customer Login */}
        <div className="mt-8 pt-5 border-t border-outline-variant/20 text-center">
          <button
            type="button"
            onClick={() => {
              if (onNavigate) {
                onNavigate('/login');
              } else {
                navigate('/login');
              }
            }}
            className="text-secondary font-bold hover:underline text-[12px] cursor-pointer"
          >
            &larr; Back to Customer Login
          </button>
        </div>
      </div>
    </motion.main>
  );
}