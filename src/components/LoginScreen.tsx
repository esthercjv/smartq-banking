import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLoginSuccess?: (email: string, role: UserRole) => void;
  onNavigate?: (route: string) => void;
}

export default function LoginScreen({ onLoginSuccess, onNavigate }: LoginScreenProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Demo accounts for credential validation
  const testAccounts = [
    { label: 'Customer', email: 'customer@bank.com', pass: 'customer123!', role: 'customer' as UserRole },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const specialCharRegex = /[^A-Za-z0-9]/;
    if (password.length < 8 || !specialCharRegex.test(password)) {
      setError('Password must be at least 8 characters long and have at least one special character.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate database lookup/validation
    setTimeout(() => {
      setIsLoading(false);
      const matchedAccount = testAccounts.find(
        (acc) => acc.email.toLowerCase() === email.trim().toLowerCase()
      );

      // Save role in localStorage
      localStorage.setItem('userRole', 'customer');
      localStorage.setItem('userEmail', email.trim());

      if (matchedAccount) {
        if (password === matchedAccount.pass) {
          if (onLoginSuccess) {
            onLoginSuccess(matchedAccount.email, 'customer');
          }
          navigate('/customer-dashboard');
        } else {
          setError(`Incorrect password. (Hint: Use "${matchedAccount.pass}" to validate the demo Customer role)`);
        }
      } else {
        // Any other credentials can login as customer
        if (onLoginSuccess) {
          onLoginSuccess(email, 'customer');
        }
        navigate('/customer-dashboard');
      }
    }, 1200);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-[440px] flex flex-col items-center z-10 px-4"
    >
      {/* Header Branding */}
      <div className="mb-8 text-center select-none md:hidden">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-secondary-container rounded-2xl shadow-lg transform transition-transform hover:scale-105">
          <Landmark className="w-12 h-12 text-[#584400]" />
        </div>
        <h1 className="font-semibold text-[26px] text-secondary-container tracking-tight leading-tight">
          SmartQ Banking
        </h1>
        <p className="text-on-primary-container text-[11px] font-semibold mt-1 uppercase tracking-widest opacity-90">
          Queue Management System
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full bg-surface-container-lowest rounded-2xl p-8 sm:p-10 shadow-[0px_10px_40px_rgba(0,0,0,0.4)] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-secondary-container via-secondary to-secondary-container" />
        
        <h2 className="text-[24px] font-semibold text-primary mb-6">Welcome Back</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-semibold text-on-surface-variant ml-0.5" htmlFor="email">
              Email address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-secondary transition-colors">
                <Mail className="w-[18px] h-[18px]" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder=""
                className="block w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl font-medium text-on-surface placeholder:text-outline-variant/90 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-0.5">
              <label className="block text-[13px] font-semibold text-on-surface-variant" htmlFor="password">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('/forgot-password');
                  } else {
                    navigate('/forgot-password');
                  }
                }}
                disabled={isLoading}
                className="text-[12px] font-semibold text-secondary hover:underline transition-all cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
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
                placeholder=""
                className="block w-full pl-10 pr-12 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl font-medium text-on-surface placeholder:text-outline-variant/90 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm"
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

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-secondary-container hover:bg-secondary transition-all text-[#584400] hover:text-on-secondary font-semibold rounded-xl shadow-md cursor-pointer active:scale-[0.98] transform flex items-center justify-center gap-2 mt-4 text-[14px] disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Login to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Register link */}
        <div className="mt-6 pt-5 border-t border-outline-variant/30 text-center">
          <p className="text-[13px] text-on-surface-variant">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => {
                if (onNavigate) {
                  onNavigate('/register');
                } else {
                  navigate('/register');
                }
              }}
              className="text-secondary font-bold hover:underline ml-1 cursor-pointer"
            >
              Register here
            </button>
          </p>
        </div>

        {/* Subtle Divider & Staff Access link */}
        <div className="mt-5 pt-4 border-t border-outline-variant/20 text-center">
          <p className="text-[11px] text-outline">
            Are you a staff member?
          </p>
          <button
            type="button"
            onClick={() => {
              if (onNavigate) {
                onNavigate('/staff-login');
              } else {
                navigate('/staff-login');
              }
            }}
            className="text-secondary font-bold hover:underline text-[11px] mt-1 cursor-pointer"
          >
            Access Staff Portal &rarr;
          </button>
        </div>
      </div>
    </motion.main>
  );
}
