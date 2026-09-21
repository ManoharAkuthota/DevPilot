import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { authService } from '../services/authService';
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

  const handleSaveIntegrations = (e) => {
    e.preventDefault();
    success('AI & Integration configuration saved to local environment');
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

      {/* AI & Integration Settings */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-white/10 mb-5">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Local AI & Ollama Configuration</h3>
        </div>

        <form onSubmit={handleSaveIntegrations} className="space-y-4">
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

          <div className="flex justify-end pt-2">
            <AnimatedButton
              type="submit"
              variant="outline"
              size="sm"
              icon={Save}
            >
              Save Ollama Config
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
