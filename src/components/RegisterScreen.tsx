import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'motion/react';
import { Landmark, Mail, Lock, User, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface RegisterScreenProps {
  onNavigate: (route: string) => void;
}

export default function RegisterScreen({ onNavigate }: RegisterScreenProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'staff' | 'manager' | 'admin'>('customer');
  const [isDone, setIsDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password) return;

    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      console.log('Signup data:', data);
      console.log('Signup error:', error);

      if (error) {
        alert(error.message);
        return;
      }

      setIsDone(true);
    } catch (err) {
      console.error(err);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-[440px] flex flex-col items-center z-10 px-4"
    >
      {/* Header Branding */}
      <div className="mb-6 text-center select-none md:hidden">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-secondary-container rounded-2xl shadow-lg">
          <Landmark className="w-12 h-12 text-[#584400]" />
        </div>
        <h1 className="font-semibold text-[26px] text-secondary-container tracking-tight">
          SmartQ Banking
        </h1>
        <p className="text-on-primary-container text-[11px] font-semibold mt-1 uppercase tracking-widest opacity-90">
          Queue Management System
        </p>
      </div>

      {/* Register Card */}
      <div className="w-full bg-surface-container-lowest rounded-2xl p-8 sm:p-10 shadow-[0px_10px_40px_rgba(0,0,0,0.4)] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-secondary-container" />

        <h2 className="text-[24px] font-semibold text-primary mb-5">Create Account</h2>

        {!isDone ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-[13px] font-semibold text-on-surface-variant ml-0.5" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-secondary transition-colors">
                  <User className="w-[18px] h-[18px]" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder=""
                  className="block w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/60 rounded-xl font-medium text-on-surface placeholder:text-outline-variant/90 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-[13px] font-semibold text-on-surface-variant ml-0.5" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-secondary transition-colors">
                  <Mail className="w-[18px] h-[18px]" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  className="block w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/60 rounded-xl font-medium text-on-surface placeholder:text-outline-variant/90 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-[13px] font-semibold text-on-surface-variant ml-0.5" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-secondary transition-colors">
                  <Lock className="w-[18px] h-[18px]" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  className="block w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/60 rounded-xl font-medium text-on-surface placeholder:text-outline-variant/90 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm"
                />
              </div>
            </div>

            {/* Role Options */}
            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-on-surface-variant ml-0.5">
                Register Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['customer', 'staff', 'manager', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 text-[11px] font-bold uppercase rounded-xl border text-center transition-all cursor-pointer ${
                      role === r
                        ? 'bg-secondary-container border-secondary text-[#584400] shadow-sm'
                        : 'bg-surface-container-low border-outline-variant/40 text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-secondary-container hover:bg-secondary transition-all text-[#584400] hover:text-white font-semibold rounded-xl shadow-md cursor-pointer active:scale-[0.98] transform flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span>Registering Account...</span>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4 space-y-4"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-primary text-base">Registration Complete</h3>
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
              Your <strong>{role}</strong> profile (<strong>{email}</strong>) has been successfully created. You can now use these credentials to log in.
            </p>
            <button
              onClick={() => onNavigate('/')}
              className="px-6 py-2.5 bg-secondary-container text-[#584400] font-bold text-xs rounded-xl hover:bg-secondary hover:text-white transition-colors cursor-pointer"
            >
              Log In Now
            </button>
          </motion.div>
        )}

        {/* Back to Login link */}
        <div className="mt-6 pt-5 border-t border-outline-variant/30 text-center">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Login Screen</span>
          </button>
        </div>
      </div>
    </motion.main>
  );
}
