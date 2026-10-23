import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Landmark, Mail, ArrowLeft, Send, ShieldAlert } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface ForgotPasswordScreenProps {
  onNavigate: (route: string) => void;
}

export default function ForgotPasswordScreen({ onNavigate }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin + '/reset-password',
    });

    setIsLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setIsSent(true);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-[420px] flex flex-col items-center z-10 px-4"
    >
      {/* Header Branding */}
      <div className="mb-8 text-center select-none md:hidden">
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

      {/* Forgot Password Card */}
      <div className="w-full bg-surface-container-lowest rounded-2xl p-8 sm:p-10 shadow-[0px_10px_40px_rgba(0,0,0,0.4)] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-secondary-container" />

        <h2 className="text-[24px] font-semibold text-primary mb-4 text-center">Reset Password</h2>

        {!isSent ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
              Enter your registered bank email address below. We'll send you secure instructions to recover your dashboard credentials.
            </p>

            {/* Email Input */}
            <div className="space-y-1.5">
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
                  placeholder="name@bank.com"
                  className="block w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl font-medium text-on-surface placeholder:text-outline-variant/90 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm"
                />
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

            {/* Send Instructions button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-secondary-container hover:bg-secondary transition-all text-[#584400] hover:text-white font-semibold rounded-xl shadow-md cursor-pointer active:scale-[0.98] transform flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Sending Secure Link...</span>
              ) : (
                <>
                  <span>Send Secure Link</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4 py-4"
          >
            <p className="text-sm font-semibold text-green-700">
              A password reset link has been sent to <strong>{email}</strong>. Please check your inbox.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="text-secondary font-bold hover:underline text-sm cursor-pointer"
            >
              ← Return to Login
            </button>
          </motion.div>
        )}

        {/* Back to Login link */}
        <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Login Screen</span>
          </button>
        </div>
      </div>
    </motion.main>
  );
}
