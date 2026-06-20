import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Landmark, Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordScreenProps {
  onNavigate: (route: string) => void;
}

export default function ForgotPasswordScreen({ onNavigate }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
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

        <h2 className="text-[24px] font-semibold text-primary mb-4">Reset Password</h2>

        {!isSubmitted ? (
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
            className="text-center py-4 space-y-4"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-primary text-base">Check Your Inbox</h3>
            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
              If an account is associated with <strong>{email}</strong>, we have sent a secure password reset link. Please check your spam folder if you do not receive it in 2 minutes.
            </p>
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
