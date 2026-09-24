import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Server, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { ParticleBackground } from '../components/layout/ParticleBackground';
import { getApiBaseUrl, setApiBaseUrl } from '../utils/constants';

export const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const [backendUrl, setBackendUrl] = useState(() => getApiBaseUrl());
  const [showBackendConfig, setShowBackendConfig] = useState(false);
  const [pingLoading, setPingLoading] = useState(false);
  const [pingResult, setPingResult] = useState(null);

  const testBackendConnection = async (urlToTest) => {
    let target = (urlToTest !== undefined ? urlToTest : backendUrl) || '';
    target = target.trim().replace(/\/+$/, '');
    if (target && !target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }
    setPingLoading(true);
    setPingResult(null);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);
      const res = await fetch(`${target}/api/system/metrics`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        setPingResult({ ok: true, message: 'Backend connected! Status 200 OK.' });
        success('Backend connected successfully!');
      } else {
        setPingResult({ ok: false, message: `Server returned HTTP ${res.status}.` });
      }
    } catch (err) {
      setPingResult({
        ok: false,
        message: err.name === 'AbortError'
          ? 'Timeout (9s). Render free tier may be waking up (~50s) or URL is unreachable.'
          : 'Failed to connect. Check URL or verify backend is deployed.',
      });
    } finally {
      setPingLoading(false);
    }
  };

  const handleSaveBackendUrl = () => {
    setApiBaseUrl(backendUrl);
    success('Backend URL saved!');
    testBackendConnection(backendUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      error('Please enter both email/username and password');
      return;
    }

    try {
      setLoading(true);
      await login(usernameOrEmail, password);
      success('Welcome back to DevPilot!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('Load failed')) {
        error(`Backend unreachable at ${getApiBaseUrl() || 'default URL'}. Service may be waking up or URL needs updating.`);
        setShowBackendConfig(true);
      } else {
        error(msg || 'Authentication failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = async () => {
    try {
      setDemoLoading(true);
      await demoLogin();
      success('Welcome back, Manohar!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('Load failed')) {
        error(`Backend unreachable at ${getApiBaseUrl() || 'default URL'}. Service may be waking up or URL needs updating.`);
        setShowBackendConfig(true);
      } else {
        error(msg || 'Demo login failed');
      }
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 relative overflow-hidden">
      <ParticleBackground />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-white mt-4 tracking-tight">Sign in to DevPilot</h2>
          <p className="text-xs text-slate-400 mt-1">Autonomous AI developer copilot workspace</p>
        </div>

        {/* Demo Account 1-Click Banner */}
        <div className="mb-6 p-4 rounded-20 bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Instant Demo Access</p>
              <p className="text-[11px] text-blue-300/80">manohar@devpilot.io / DevPilot2025!</p>
            </div>
          </div>
          <AnimatedButton
            onClick={handleDemoFill}
            loading={demoLoading}
            variant="primary"
            size="sm"
          >
            1-Click Demo
          </AnimatedButton>
        </div>

        {/* Auth GlassCard */}
        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Username or Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="manohar@devpilot.io"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-white/10 border-white/20 text-blue-500 focus:ring-0" />
                <span className="text-xs text-slate-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-blue-400 hover:underline">
                Forgot password?
              </Link>
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
              Sign In to Copilot
            </AnimatedButton>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </GlassCard>

        {/* Backend Server Connection Drawer */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 overflow-hidden">
              <Server className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="shrink-0">Backend API:</span>
              <span className="text-slate-200 font-mono text-[11px] truncate max-w-[170px]" title={backendUrl || 'Default'}>
                {backendUrl || '(Auto / Same Origin)'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowBackendConfig(!showBackendConfig)}
              className="text-blue-400 hover:text-blue-300 font-semibold text-[11px] underline shrink-0 ml-2"
            >
              {showBackendConfig ? 'Close' : 'Configure URL'}
            </button>
          </div>

          {showBackendConfig && (
            <div className="mt-3 pt-3 border-t border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300">
                  Backend Server URL
                </label>
                <span className="text-[10px] text-slate-400">Render or localhost:8080</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  placeholder="https://devpilot-backend-xxxx.onrender.com"
                  className="flex-1 px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleSaveBackendUrl}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shrink-0"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => testBackendConnection(backendUrl)}
                  disabled={pingLoading}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${pingLoading ? 'animate-spin' : ''}`} />
                  Test
                </button>
              </div>

              {pingResult && (
                <div className={`p-2.5 rounded-xl text-[11px] flex items-center gap-2 ${pingResult.ok ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {pingResult.ok ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                  <span>{pingResult.message}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
