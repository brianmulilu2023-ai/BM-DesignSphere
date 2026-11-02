import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export function AdminLoginPage() {
  const { login, resetPassword, isSupabaseConfigured, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      success(res?.isDemo ? 'Logged in successfully (Demo Session).' : 'Welcome back, Victor.');
      navigate(from, { replace: true });
    } catch (err) {
      error(err.message || 'Invalid credentials or login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@victorgraphics.com');
    setPassword('admin123');
    info('Demo credentials populated.');
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      error('Please enter your administrator email address.');
      return;
    }

    setIsResetting(true);
    try {
      await resetPassword(resetEmail);
      success('Password reset instructions sent. Please check your inbox.');
      setForgotModalOpen(false);
      setResetEmail('');
    } catch (err) {
      error(err.message || 'Could not send reset link.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4 sm:p-6 selection:bg-[#FF751F] selection:text-white">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#FF751F]/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="relative w-full max-w-md">
        {/* Back link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>

          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#FF751F]" />
            Secure Portal
          </span>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-[#111111] border border-[#252525] p-8 sm:p-10 shadow-2xl space-y-8 text-left">
          
          {/* Brand Monogram & Title */}
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#171717] border border-[#2a2a2a] flex items-center justify-center mb-4">
              <span className="font-heading font-extrabold text-xl text-white">
                V<span className="text-[#FF751F]">G</span>
              </span>
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-white tracking-tight">
              Admin Authentication
            </h1>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Sign in to manage projects, categories, inquiries, and brand assets.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@victorgraphics.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#171717] border border-[#282828] text-white text-sm focus:outline-none focus:border-[#FF751F] focus:ring-1 focus:ring-[#FF751F] transition-all"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs text-[#FF751F] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#171717] border border-[#282828] text-white text-sm focus:outline-none focus:border-[#FF751F] focus:ring-1 focus:ring-[#FF751F] transition-all"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              rightIcon={ArrowRight}
              className="w-full mt-2"
            >
              Sign In to Console
            </Button>
          </form>

          {/* Quick Demo Helper Hint */}
          {!isSupabaseConfigured && (
            <div className="pt-4 border-t border-[#202020] text-center space-y-2.5">
              <div className="text-[11px] text-amber-400/90 font-medium">
                Running in Local Demonstration Mode
              </div>
              <p className="text-xs text-neutral-400">
                You can test the full admin dashboard using preset admin credentials:
              </p>
              <button
                type="button"
                onClick={handleFillDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181818] border border-[#2c2c2c] hover:border-[#FF751F] text-xs font-mono text-neutral-300 hover:text-white transition-colors"
              >
                <span>Click to Auto-fill Demo Credentials</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Administrator Password"
        subtitle="Enter your verified admin email address to receive password reset instructions."
      >
        <form onSubmit={handleResetPasswordSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="admin@victorgraphics.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F]"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setForgotModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isResetting}
            >
              Send Reset Link
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

