import React from 'react';
import { Menu, Database, Cloud, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isCloudSyncConfigured } from '../../lib/cloudSync';

export function AdminHeader({ onMenuClick, title, subtitle }) {
  const { isSupabaseConfigured } = useAuth();
  const hasCloudSync = isCloudSyncConfigured();

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
        {hasCloudSync ? (
          <Link
            to="/admin/settings"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
            title="Changes sync live across all visitors worldwide without Supabase!"
          >
            <Cloud className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Live Cloud Sync (Active)</span>
            <span className="sm:hidden">Live Cloud</span>
          </Link>
        ) : isSupabaseConfigured ? (
          <Link
            to="/admin/settings"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Supabase Connected</span>
            <span className="sm:hidden">Supabase</span>
          </Link>
        ) : (
          <Link
            to="/admin/settings"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
            title="Click to connect free Cloud Sync so your live visitors see your changes"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Local Mode (Click to Sync Cloud)</span>
            <span className="sm:hidden">Local Only</span>
          </Link>
        )}
      </div>
    </header>
  );
}
