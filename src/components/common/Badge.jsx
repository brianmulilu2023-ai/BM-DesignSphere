import React from 'react';

export function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const variants = {
    default: 'bg-[#1e1e1e] text-neutral-300 border border-[#2d2d2d]',
    orange: 'bg-[#FF751F]/15 text-[#FF751F] border border-[#FF751F]/30',
    green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    gray: 'bg-neutral-800 text-neutral-400 border border-neutral-700',
  };

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5 tracking-wider font-semibold uppercase',
    sm: 'text-xs px-2.5 py-1 font-medium',
    md: 'text-sm px-3 py-1.5 font-medium',
  };

  return (
    <span className={`inline-flex items-center rounded-full ${variants[variant] || variants.default} ${sizes[size] || sizes.sm} ${className}`}>
      {children}
    </span>
  );
}

