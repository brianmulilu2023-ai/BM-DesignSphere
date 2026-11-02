import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Key,
  Server,
  Shield,
  FileCode,
  RotateCcw
} from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { checkSupabaseConnection, isSupabaseConfigured } from '../../lib/supabase';
import { INITIAL_PROJECTS, INITIAL_CATEGORIES, INITIAL_PROFILE, INITIAL_MESSAGES } from '../../lib/mockData';

export function AdminSettingsPage() {
  const { setSidebarOpen } = useOutletContext();
  const { success, info } = useToast();

  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const testConnection = async () => {
    setTestingConnection(true);
    try {
      const res = await checkSupabaseConnection();
      setConnectionStatus(res);
    } catch (e) {
      setConnectionStatus({ connected: false, message: e.message });
    } finally {
      setTestingConnection(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const handleResetDemoData = () => {
    localStorage.setItem('vg_portfolio_projects', JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem('vg_portfolio_categories', JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem('vg_portfolio_profile', JSON.stringify(INITIAL_PROFILE));
    localStorage.setItem('vg_portfolio_messages', JSON.stringify(INITIAL_MESSAGES));
    success('Local demo database reset to default showcase data.');
  };

  return (
    <div className="space-y-8 text-left">
      <AdminHeader
        onMenuClick={() => setSidebarOpen(true)}
        title="Backend & System Settings"
        subtitle="Supabase integration status, database security, and storage architecture."
      />

      {/* Supabase Connection Status Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111111] border border-[#222222] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isSupabaseConfigured ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
            }`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                Supabase Backend Status
              </h3>
              <p className="text-xs text-neutral-400">
                {isSupabaseConfigured ? 'Realtime PostgreSQL Database & Storage Enabled' : 'Running in Local Demonstration Mode (Client Storage)'}
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={testConnection}
            isLoading={testingConnection}
            leftIcon={RefreshCw}
          >
            Test Connection
          </Button>
        </div>

        {connectionStatus && (
          <div className={`p-4 rounded-xl border text-xs font-mono flex items-center gap-2.5 ${
            connectionStatus.connected
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/25 text-amber-300'
          }`}>
            {connectionStatus.connected ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
            <span>{connectionStatus.message}</span>
          </div>
        )}
      </div>

      {/* Configuration Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Environment Variables Guide */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-[#FF751F]" />
            <h4 className="font-heading font-bold text-white text-base">
              Environment Variables (.env)
            </h4>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            To link this website to your real Supabase project, copy <code className="text-[#FF751F]">.env.example</code> to <code className="text-[#FF751F]">.env</code> in the project root and fill in your keys:
          </p>

          <pre className="p-4 rounded-xl bg-[#0a0a0a] border border-[#222222] text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...`}
          </pre>

          <div className="p-3.5 rounded-xl bg-[#171717] border border-[#282828] text-xs text-neutral-400 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-[#FF751F] flex-shrink-0 mt-0.5" />
            <span>
              <strong>Security Protocol:</strong> Never include your Supabase <code className="text-[#FF751F]">service_role</code> secret key in client code. Only public anon keys are used here with Row Level Security (RLS).
            </span>
          </div>
        </div>

        {/* Database Schema & Storage */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
          <div className="flex items-center gap-2.5">
            <FileCode className="w-5 h-5 text-[#FF751F]" />
            <h4 className="font-heading font-bold text-white text-base">
              Database Schema Script
            </h4>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            A comprehensive SQL schema script <code className="text-[#FF751F]">supabase_schema.sql</code> is included in the project root. Run it in your Supabase SQL Editor to instantly provision:
          </p>

          <ul className="text-xs text-neutral-300 space-y-1.5 list-disc list-inside">
            <li><span className="font-mono text-white">categories</span>, <span className="font-mono text-white">projects</span>, <span className="font-mono text-white">profiles</span>, <span className="font-mono text-white">messages</span></li>
            <li>Row Level Security (RLS) policies for admin write & public read</li>
            <li>Storage bucket <span className="font-mono text-white">portfolio</span> policies for project uploads</li>
            <li>Seed initial data for Victor Graphics</li>
          </ul>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetDemoData}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#171717] border border-[#2a2a2a] hover:border-[#FF751F] text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#FF751F]" />
              <span>Reset Local Demo Content</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

