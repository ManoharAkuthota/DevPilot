import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  GitBranch,
  CheckSquare,
  Bot,
  Globe,
  Activity,
  User,
  Settings,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onToggle, isCollapsed, onToggleCollapse }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'GitHub Analytics', path: '/github', icon: GitBranch },
    { name: 'Task Manager', path: '/tasks', icon: CheckSquare, badge: 'Kanban' },
    { name: 'AI Assistant', path: '/ai', icon: Bot, badge: 'Ollama' },
    { name: 'Browser Automation', path: '/automation', icon: Globe },
    { name: 'System Monitor', path: '/system', icon: Activity, live: true },
    { name: 'Developer Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-40 
          bg-[#0A0A0E]/95 backdrop-blur-2xl 
          border-r border-white/[0.08] 
          transition-all duration-300 ease-in-out
          flex flex-col justify-between
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Top Header */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    DevPilot
                  </span>
                  <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">
                    AI Copilot v1.0
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/10 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full" />
                      )}
                      <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      
                      {!isCollapsed && (
                        <span className="truncate">{item.name}</span>
                      )}

                      {!isCollapsed && item.badge && (
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-blue-300 border border-white/10 font-medium">
                          {item.badge}
                        </span>
                      )}

                      {!isCollapsed && item.live && (
                        <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          LIVE
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-white/[0.08]">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
