import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { Sparkles, Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { ParticleBackground } from '../components/layout/ParticleBackground';

export const ForgotPasswordPage = () => {
  const { success } = useNotification();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      success('Password reset instructions sent to your email (mock mode)!');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 relative overflow-hidden">
      <ParticleBackground />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-white mt-4">Reset Password</h2>
          <p className="text-xs text-slate-400 mt-1">We will send you a recovery link</p>
        </div>

        <GlassCard className="p-8">
          {sent ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Check your email</h3>
              <p className="text-xs text-slate-400">
                We sent a simulated recovery link to <span className="text-white font-medium">{email}</span>. Click the link to update your credentials.
              </p>
              <Link to="/login" className="inline-block mt-4">
                <AnimatedButton variant="outline" size="sm" icon={ArrowLeft} iconPosition="left">
                  Return to login
                </AnimatedButton>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manohar@devpilot.io"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors"
                  />
                </div>
              </div>

              <AnimatedButton
                type="submit"
                loading={loading}
                variant="gradient"
                size="md"
                className="w-full mt-2"
                icon={ArrowRight}
                iconPosition="right"
              >
                Send Recovery Link
              </AnimatedButton>

              <div className="text-center pt-4">
                <Link to="/login" className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                </Link>
              </div>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
