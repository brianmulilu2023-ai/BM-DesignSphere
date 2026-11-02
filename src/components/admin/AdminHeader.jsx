import React from 'react';
import { Menu, Database, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminHeader({ onMenuClick, title, subtitle }) {
  const { isSupabaseConfigured } = useAuth();

  return (
    <header className="h-20 bg-[#0d0d0d] border-b border-[#1c1c1c] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Title & Mobile Menu Button */}
      <div className="flex items-center gap-4 text-left">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 lg:hidden focus:outline-none"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-xl font-heading font-extrabold text-white tracking-tight">
            {title || 'Dashboard'}
          </h1>
          {subtitle && (
            <p className="text-xs text-neutral-400 font-sans hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Status Badge */}
      <div className="flex items-center gap-3">
        {isSupabaseConfigured ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Supabase Connected</span>
            <span className="sm:hidden">Live</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Demo Mode (Local Storage)</span>
            <span className="sm:hidden">Demo</span>
          </div>
        )}
      </div>
    </header>
  );
}

