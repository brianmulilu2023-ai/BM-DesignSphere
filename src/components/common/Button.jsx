import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF751F]/50 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-[#FF751F] text-white hover:bg-[#FF8A3D] shadow-lg shadow-[#FF751F]/20 hover:shadow-[#FF751F]/30 border border-[#FF751F]',
    secondary: 'bg-[#171717] text-white hover:bg-[#222222] border border-[#252525] hover:border-[#3a3a3a]',
    outline: 'bg-transparent text-[#FF751F] border border-[#FF751F]/60 hover:bg-[#FF751F]/10 hover:border-[#FF751F]',
    ghost: 'bg-transparent text-neutral-300 hover:text-white hover:bg-white/5',
    danger: 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {LeftIcon && <LeftIcon className="w-4 h-4 flex-shrink-0" />}
          {children}
          {RightIcon && <RightIcon className="w-4 h-4 flex-shrink-0" />}
        </>
      )}
    </button>
  );
}

