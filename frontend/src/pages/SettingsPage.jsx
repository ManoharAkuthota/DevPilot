import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { authService } from '../services/authService';
import { dashboardService } from '../services/dashboardService';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import {
  Settings,
  Moon,
  Sun,
  Lock,
  User,
  Cpu,
  GitBranch,
  Bell,
  Save,
  Check,
  Sparkles,
  Key,
  ExternalLink,
  Eye,
  EyeOff,
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { success, error } = useNotification();

  // Profile Form
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [techStack, setTechStack] = useState(user?.techStack || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioUrl || '');
  const [githubUsername, setGithubUsername] = useState(user?.githubUsername || '');
  const [profileSaving, setProfileSaving] = useState(false);

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  // AI & Integration settings
  const [aiProvider, setAiProvider] = useState(
    user?.aiProvider || localStorage.getItem('devpilot_ai_provider') || 'gemini'
  );
  const [aiApiKey, setAiApiKey] = useState(
    localStorage.getItem('devpilot_ai_key') || ''
  );
  const [showApiKey, setShowApiKey] = useState(false);
  const [aiTesting, setAiTesting] = useState(false);
  const [aiTestResult, setAiTestResult] = useState(null);
  const [aiSaving, setAiSaving] = useState(false);

  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3.1');
  const [githubToken, setGithubToken] = useState('');

  // Notifications Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      const updated = await authService.updateProfile({
        fullName,
        bio,
        techStack,
        portfolioUrl,
        githubUsername,
      });
      updateUser(updated);
      success('Profile details updated successfully');
    } catch (err) {
      error(err.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      error('Please provide both current and new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      error('New password and confirmation do not match');
      return;
    }
    if (newPassword.length < 6) {
      error('Password must be at least 6 characters');
      return;
    }

    try {
      setPasswordSaving(true);
      await authService.changePassword(currentPassword, newPassword);
      success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      error(err.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSaveIntegrations = async (e) => {
    e?.preventDefault();
    try {
      setAiSaving(true);
      localStorage.setItem('devpilot_ai_provider', aiProvider);
      if (aiApiKey) {
        localStorage.setItem('devpilot_ai_key', aiApiKey);
      } else {
        localStorage.removeItem('devpilot_ai_key');
      }

      const updated = await authService.updateProfile({
        aiProvider,
        aiApiKey: aiApiKey || null,
      });
      updateUser(updated);
      success('AI Engine configuration saved to profile & cloud');
    } catch (err) {
      error(err.message || 'Failed to persist AI configuration');
    } finally {
      setAiSaving(false);
    }
  };

  const handleTestAiConnection = async () => {
    try {
      setAiTesting(true);
      setAiTestResult(null);
      const res = await dashboardService.sendAiPrompt({
        prompt: 'Ping: Return a 1-sentence confirmation that DevPilot AI Copilot is fully online and ready.',
        categoryTemplate: 'GENERAL',
        provider: aiProvider,
        apiKey: aiApiKey || undefined,
      });
      const lastMsg = res?.messages?.[res.messages.length - 1];
      setAiTestResult({
        success: true,
        text: lastMsg?.content || 'DevPilot AI is fully operational!',
      });
      success('AI Engine responded successfully!');
    } catch (err) {
      setAiTestResult({
        success: false,
        text: err.message || 'Failed to connect to AI provider.',
      });
      error('AI test failed: ' + (err.message || 'Check key and network'));
    } finally {
      setAiTesting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">System & Account Settings</h1>
        <p className="text-xs text-slate-400">Configure theme, developer credentials, Ollama gateway, and security</p>
      </div>

      {/* Appearance Section */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Appearance & Theme</h3>
              <p className="text-xs text-slate-400">Toggle between Dark Cyberpunk and Light UI modes</p>
            </div>
          </div>

          <AnimatedButton
            onClick={toggleTheme}
            variant="outline"
            size="sm"
            icon={isDark ? Sun : Moon}
          >
            {isDark ? 'Switch to Light' : 'Switch to Dark'}
          </AnimatedButton>
        </div>
      </GlassCard>

      {/* Developer Profile Section */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-white/10 mb-5">
          <User className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Developer Profile Information</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">GitHub Handle</label>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                className="w-full px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Portfolio URL</label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Tech Stack (Comma-separated)</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <AnimatedButton
              type="submit"
              loading={profileSaving}
              variant="gradient"
              size="sm"
              icon={Save}
            >
              Save Profile Changes
            </AnimatedButton>
          </div>
        </form>
      </GlassCard>

      {/* AI & Cloud LLM Engine Settings */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-sm font-bold text-white">AI Copilot & Cloud Intelligence Gateway</h3>
              <p className="text-xs text-slate-400">Configure Cloud LLMs (Google Gemini 1.5 Flash, Groq Llama 3.3) or local Ollama</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Multi-Provider Ready
          </span>
        </div>

        <form onSubmit={handleSaveIntegrations} className="space-y-5">
          {/* Provider Selection Cards */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase">Active AI Provider</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setAiProvider('gemini')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  aiProvider === 'gemini'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-900/20'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Google Gemini</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">Recommended</span>
                </div>
                <p className="text-[11px] text-slate-400">Gemini 1.5 Flash (Free via Google AI Studio). Fast & smart.</p>
              </button>

              <button
                type="button"
                onClick={() => setAiProvider('groq')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  aiProvider === 'groq'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-900/20'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Groq Cloud</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">~500 tok/s</span>
                </div>
                <p className="text-[11px] text-slate-400">Llama 3.3 70B Versatile. Blazing fast inference.</p>
              </button>

              <button
                type="button"
                onClick={() => setAiProvider('ollama')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  aiProvider === 'ollama'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-900/20'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Local Ollama</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Self-Hosted</span>
                </div>
                <p className="text-[11px] text-slate-400">Runs locally on your machine via localhost:11434.</p>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          {(aiProvider === 'gemini' || aiProvider === 'groq') && (
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-200 uppercase">
                  {aiProvider === 'gemini' ? 'Google Gemini API Key' : 'Groq Cloud API Key'}
                </label>
                <a
                  href={aiProvider === 'gemini' ? 'https://aistudio.google.com/app/apikey' : 'https://console.groq.com/keys'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium underline underline-offset-2"
                >
                  Get Free Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={aiApiKey}
                  onChange={(e) => setAiApiKey(e.target.value)}
                  placeholder={aiProvider === 'gemini' ? 'AIzaSy...' : 'gsk_...'}
                  className="w-full pl-4 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-purple-500/60"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                💡 Keys are securely saved to your TiDB profile and browser storage. If left empty, DevPilot will fall back to server-configured keys or the built-in Smart Code Intelligence Engine.
              </p>
            </div>
          )}

          {/* Ollama Details if Ollama selected */}
          {aiProvider === 'ollama' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Ollama Endpoint URL</label>
                <input
                  type="text"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500/60"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Ollama Model</label>
                <input
                  type="text"
                  value={ollamaModel}
                  onChange={(e) => setOllamaModel(e.target.value)}
                  className="w-full px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500/60"
                />
              </div>
            </div>
          )}

          {/* Test connection result notice */}
          {aiTestResult && (
            <div
              className={`p-3 rounded-xl text-xs border ${
                aiTestResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
              }`}
            >
              <p className="font-semibold mb-1">{aiTestResult.success ? '✅ AI Connection Successful' : '❌ AI Connection Failed'}</p>
              <p className="text-[11px] opacity-90">{aiTestResult.text}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={aiTesting}
              onClick={handleTestAiConnection}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              {aiTesting ? 'Testing Model...' : 'Test AI Connection'}
            </button>

            <AnimatedButton
              type="submit"
              loading={aiSaving}
              variant="gradient"
              size="sm"
              icon={Save}
            >
              Save AI Configuration
            </AnimatedButton>
          </div>
        </form>
      </GlassCard>

      {/* Security & Password Change */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-white/10 mb-5">
          <Lock className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white">Change Account Password</h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500/60"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <AnimatedButton
              type="submit"
              loading={passwordSaving}
              variant="primary"
              size="sm"
            >
              Update Password
            </AnimatedButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
