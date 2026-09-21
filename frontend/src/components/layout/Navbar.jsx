import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Bell,
  Search,
  Moon,
  Sun,
  Menu,
  Sparkles,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  ExternalLink,
  Cpu,
} from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'Sprint 4 Goal Reached', time: '10m ago', unread: true },
    { id: 2, title: 'Ollama local inference ready', time: '1h ago', unread: true },
    { id: 3, title: 'Playwright automation executed', time: '3h ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-[#09090B]/80 backdrop-blur-xl border-b border-white/[0.08] px-4 lg:px-8 flex items-center justify-between">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Quick Search */}
        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, repos, prompts... (⌘K)"
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white/[0.04] border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Live Health Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Copilot Engine Active</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#09090B]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-20 bg-[#0E0E14] border border-white/10 shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Notifications</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold">2 new</span>
              </div>
              <div className="divide-y divide-white/5 mt-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 px-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                    <p className="text-xs font-medium text-slate-200">{n.title}</p>
                    <span className="text-[10px] text-slate-500">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 pl-2 hover:bg-white/5 rounded-full border border-white/10 transition-colors"
          >
            <span className="text-xs font-semibold text-slate-200 hidden sm:inline-block">
              {user?.fullName || user?.username || 'Developer'}
            </span>
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500/50"
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-20 bg-[#0E0E14] border border-white/10 shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-white/10">
                <p className="text-xs font-bold text-white truncate">{user?.fullName || user?.username}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-blue-400" />
                  <span>Developer Profile</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <SettingsIcon className="w-4 h-4 text-purple-400" />
                  <span>Settings</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-white/10">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
