import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Key,
  Shield,
  Download,
  Upload,
  Database,
  ExternalLink,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Zap
} from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import {
  getCloudSyncId,
  setCloudSyncId,
  isCloudSyncConfigured,
  testCloudConnection,
  pushToCloud,
  fetchFromCloud,
  getLocalData,
  exportPortfolioJson,
  importPortfolioJson,
  STORAGE_KEYS
} from '../../lib/cloudSync';
import { checkSupabaseConnection, isSupabaseConfigured } from '../../lib/supabase';
import initialSeedData from '../../data/portfolioData.json';

export function AdminSettingsPage() {
  const { setSidebarOpen } = useOutletContext();
  const { success, error, info } = useToast();

  // Cloud Sync state
  const [pantryId, setPantryId] = useState(getCloudSyncId() || '');
  const [testingCloud, setTestingCloud] = useState(false);
  const [cloudStatus, setCloudStatus] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Supabase state
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState(null);

  useEffect(() => {
    // Initial check
    if (isCloudSyncConfigured()) {
      handleTestCloud(getCloudSyncId());
    }
  }, []);

  // Test & Save Cloud ID
  const handleTestCloud = async (idToTest = pantryId) => {
    if (!idToTest || !idToTest.trim()) {
      setCloudStatus({ success: false, message: 'Please enter a Pantry ID.' });
      return;
    }

    setTestingCloud(true);
    try {
      const res = await testCloudConnection(idToTest);
      setCloudStatus(res);
      if (res.success) {
        setCloudSyncId(idToTest);
        success('Cloud Sync connected! Your changes will now update the live website immediately.');
      } else {
        error(res.message);
      }
    } catch (e) {
      setCloudStatus({ success: false, message: e.message });
      error('Could not connect to Pantry Cloud.');
    } finally {
      setTestingCloud(false);
    }
  };

  // Push Local Data to Cloud
  const handlePushToCloud = async () => {
    if (!getCloudSyncId()) {
      error('Please connect a Pantry ID first.');
      return;
    }
    setIsSyncing(true);
    try {
      const local = getLocalData();
      await pushToCloud(local);
      success('All projects, categories, and profile synced to Cloud! Live visitors can see them right now.');
    } catch (err) {
      error('Sync failed: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  // Pull Cloud Data to Local
  const handlePullFromCloud = async () => {
    if (!getCloudSyncId()) {
      error('Please connect a Pantry ID first.');
      return;
    }
    setIsSyncing(true);
    try {
      await fetchFromCloud();
      success('Latest live data pulled from Cloud successfully!');
    } catch (err) {
      error('Pull failed: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  // Disconnect Cloud Sync
  const handleDisconnectCloud = () => {
    setCloudSyncId(null);
    setPantryId('');
    setCloudStatus(null);
    info('Cloud Sync disconnected. Portfolio is now running in local mode.');
  };

  // Test Supabase
  const handleTestSupabase = async () => {
    setTestingSupabase(true);
    try {
      const res = await checkSupabaseConnection();
      setSupabaseStatus(res);
    } catch (e) {
      setSupabaseStatus({ connected: false, message: e.message });
    } finally {
      setTestingSupabase(false);
    }
  };

  // File import handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        await importPortfolioJson(event.target.result);
        success('Portfolio data imported successfully!');
      } catch (err) {
        error(err.message);
      }
    };
    reader.readAsText(file);
  };

  // Reset demo
  const handleResetDemoData = () => {
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(initialSeedData.projects));
    localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(initialSeedData.categories));
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(initialSeedData.profile));
    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(initialSeedData.messages));
    success('Local database reset to default showcase data.');
  };

  const isConnected = isCloudSyncConfigured() && cloudStatus?.success;

  return (
    <div className="space-y-8 text-left">
      <AdminHeader
        onMenuClick={() => setSidebarOpen(true)}
        title="Live Backend & Storage Settings"
        subtitle="Configure how changes made in the dashboard sync to your live website."
      />

      {/* ========================================================================= */}
      {/* 1. ZERO-SUPABASE CLOUD SYNC (RECOMMENDED) */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111111] border border-[#222222] space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF751F]/5 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              isConnected
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-[#FF751F]/10 border border-[#FF751F]/20 text-[#FF751F]'
            }`}>
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-lg text-white">
                  Zero-Supabase Cloud Sync (Pantry Cloud)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF751F]/20 text-[#FF751F] border border-[#FF751F]/30 uppercase">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                No SQL, no database tables, and no RLS rules required. Connect with 1 free ID to make all live website changes update instantly!
              </p>
            </div>
          </div>

          {isConnected && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Synced Worldwide</span>
            </div>
          )}
        </div>

        {/* Input & Connect Bar */}
        <div className="p-5 rounded-2xl bg-[#161616] border border-[#252525] space-y-4">
          <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
            Your Pantry Cloud ID:
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={pantryId}
              onChange={(e) => setPantryId(e.target.value)}
              placeholder="e.g. 1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#111111] border border-[#2c2c2c] text-white text-xs font-mono focus:outline-none focus:border-[#FF751F]"
            />
            <Button
              type="button"
              size="sm"
              onClick={() => handleTestCloud(pantryId)}
              isLoading={testingCloud}
              leftIcon={Zap}
            >
              Connect & Test
            </Button>
            {isConnected && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDisconnectCloud}
                className="text-neutral-400 hover:text-red-400"
              >
                Disconnect
              </Button>
            )}
          </div>

          {/* Cloud Status Indicator */}
          {cloudStatus && (
            <div className={`p-3.5 rounded-xl text-xs font-mono flex items-center gap-2.5 ${
              cloudStatus.success
                ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-300'
                : 'bg-red-500/10 border border-red-500/25 text-red-300'
            }`}>
              {cloudStatus.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
              <span>{cloudStatus.message}</span>
            </div>
          )}

          {/* Actions when connected */}
          {isConnected && (
            <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-[#222222]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handlePushToCloud}
                isLoading={isSyncing}
                leftIcon={Upload}
              >
                Sync Local Data to Cloud
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handlePullFromCloud}
                isLoading={isSyncing}
                leftIcon={RefreshCw}
              >
                Pull Latest from Cloud
              </Button>
            </div>
          )}
        </div>

        {/* 20-Second Setup Guide */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-[#242424] space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF751F] flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            How to get a Free Pantry ID in 20 seconds:
          </h4>
          <ol className="text-xs text-neutral-300 space-y-2 list-decimal list-inside leading-relaxed font-sans">
            <li>
              Go to{' '}
              <a
                href="https://getpantry.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF751F] underline inline-flex items-center gap-1 font-semibold"
              >
                getpantry.cloud <ExternalLink className="w-3 h-3" />
              </a>{' '}
              (100% free, no credit card, no password).
            </li>
            <li>Enter your name and email, and click <strong>Create Pantry</strong>.</li>
            <li>Copy your unique <strong>Pantry ID</strong> (a UUID string like <code className="text-[#FF751F] bg-black/40 px-1 py-0.5 rounded">e4b1c2...</code>).</li>
            <li>Paste it into the input box above and click <strong>Connect & Test</strong>.</li>
            <li>
              <strong>Optional (for Vercel):</strong> In your Vercel Dashboard, add an Environment Variable named <code className="text-[#FF751F] bg-black/40 px-1 py-0.5 rounded">VITE_PANTRY_ID</code> with your Pantry ID so every device connects automatically!
            </li>
          </ol>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. OFFLINE BACKUP & JSON PORTABILITY */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111111] border border-[#222222] space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#181818] border border-[#282828] text-white flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-[#FF751F]" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-white">
              Data Backup & Portable JSON
            </h3>
            <p className="text-xs text-neutral-400 font-sans">
              Keep a complete backup of your portfolio works, high-res images, and contact messages.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Download JSON */}
          <div className="p-5 rounded-2xl bg-[#151515] border border-[#222222] space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Export Data
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                Save your full portfolio as a single <code className="text-[#FF751F]">.json</code> file.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={exportPortfolioJson}
              leftIcon={Download}
              className="w-full"
            >
              Download Backup (JSON)
            </Button>
          </div>

          {/* Import JSON */}
          <div className="p-5 rounded-2xl bg-[#151515] border border-[#222222] space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Import / Restore
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                Upload a previous portfolio backup file to restore all content.
              </p>
            </div>
            <label className="w-full">
              <span className="w-full inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#222222] hover:bg-[#2c2c2c] text-xs font-semibold text-white border border-[#333333] cursor-pointer transition-colors gap-2">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload JSON Backup</span>
              </span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset Demo */}
          <div className="p-5 rounded-2xl bg-[#151515] border border-[#222222] space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Reset Demo Data
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                Restore the default showcase projects, categories, and bio.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetDemoData}
              leftIcon={RotateCcw}
              className="w-full border border-[#2a2a2a] text-neutral-400 hover:text-white"
            >
              Reset to Initial Seed
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SUPABASE (OPTIONAL TROUBLESHOOTING) */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111111] border border-[#222222] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              isSupabaseConfigured ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
            }`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                Supabase PostgreSQL (Optional Advanced Backend)
              </h3>
              <p className="text-xs text-neutral-400 font-sans">
                {isSupabaseConfigured ? 'Supabase is configured and active.' : 'Not active (Cloud Sync or local mode used).'}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleTestSupabase}
            isLoading={testingSupabase}
            leftIcon={RefreshCw}
          >
            Test Supabase
          </Button>
        </div>

        {supabaseStatus && (
          <div className={`p-4 rounded-xl border text-xs font-mono flex items-center gap-2.5 ${
            supabaseStatus.connected
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/25 text-amber-300'
          }`}>
            {supabaseStatus.connected ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
            <span>{supabaseStatus.message}</span>
          </div>
        )}

        {/* Why Supabase failed explanation */}
        <div className="p-5 rounded-2xl bg-[#161616] border border-[#222222] space-y-3">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4" />
            Why did your Supabase connection not respond?
          </h4>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            In your <code className="text-[#FF751F]">.env</code> file, line 3 was configured with:{' '}
            <code className="text-amber-400 bg-black/40 px-1 py-0.5 rounded">VITE_SUPABASE_URL=sb_publishable_ycTzyct...</code>.
          </p>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            Notice that <code className="text-amber-400">sb_publishable_...</code> is actually the <strong>Anon API Key</strong>, NOT the <strong>Project URL</strong>! Supabase expects two separate values:
          </p>
          <pre className="p-4 rounded-xl bg-[#0a0a0a] border border-[#222222] text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed">
{`# 1. Your Project URL (from Supabase Dashboard -> Settings -> API)
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# 2. Your Publishable Anon Key (the one starting with sb_publishable_ or eyJ...)
VITE_SUPABASE_ANON_KEY=sb_publishable_ycTzyctK8yPWV-5_3pmiJQ_qYMYWTWR`}
          </pre>
          <p className="text-xs text-neutral-400 italic">
            If you do not want to deal with Supabase SQL tables and RLS rules, you can completely ignore Supabase and use <strong>Zero-Supabase Cloud Sync</strong> at the top of this page!
          </p>
        </div>
      </div>
    </div>
  );
}
