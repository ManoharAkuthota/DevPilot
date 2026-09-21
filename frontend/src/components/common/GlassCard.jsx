import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({
  children,
  className = '',
  hover = true,
  glow = false,
  glowColor = 'blue',
  onClick,
  ...props
}) => {
  const glowClasses = {
    blue: 'hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] hover:border-blue-500/40',
    purple: 'hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)] hover:border-purple-500/40',
    emerald: 'hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] hover:border-emerald-500/40',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`
        relative rounded-[20px] 
        bg-white/[0.04] dark:bg-[#0E0E12]/80 
        backdrop-blur-xl 
        border border-white/[0.08] dark:border-white/[0.06] 
        shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] 
        transition-all duration-300
        ${glow ? glowClasses[glowColor] : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};
