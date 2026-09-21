import React from 'react';

export const Loader = ({ message = 'Loading DevPilot data...', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 gap-4">
      <div className="relative flex items-center justify-center">
        <div className={`${sizeMap[size]} border-blue-500/20 border-t-blue-500 rounded-full animate-spin`} />
        <div className="absolute w-4 h-4 bg-purple-500/30 rounded-full animate-ping" />
      </div>
      {message && <p className="text-sm font-medium text-slate-400 animate-pulse">{message}</p>}
    </div>
  );
};

export const Skeleton = ({ className = '', rows = 1 }) => {
  return (
    <div className="space-y-2.5 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-white/5 rounded-lg border border-white/[0.04] ${className}`}
        />
      ))}
    </div>
  );
};
