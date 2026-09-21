import React from 'react';
import { GlassCard } from './GlassCard';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendDirection = 'up',
  color = 'blue',
}) => {
  const colorSchemes = {
    blue: {
      bg: 'from-blue-500/10 to-transparent',
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      glow: 'blue',
    },
    purple: {
      bg: 'from-purple-500/10 to-transparent',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      glow: 'purple',
    },
    emerald: {
      bg: 'from-emerald-500/10 to-transparent',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'emerald',
    },
    amber: {
      bg: 'from-amber-500/10 to-transparent',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'blue',
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;

  return (
    <GlassCard glow glowColor={scheme.glow} className="p-6 relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-28 h-28 bg-gradient-to-br ${scheme.bg} rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={`p-3 rounded-2xl border ${scheme.iconBg} shadow-inner`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
          {trendDirection === 'up' ? (
            <span className="flex items-center text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {trend}
            </span>
          ) : (
            <span className="flex items-center text-rose-400 font-semibold">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {trend}
            </span>
          )}
          <span className="text-slate-400">vs last sprint</span>
        </div>
      )}
    </GlassCard>
  );
};
