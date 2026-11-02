import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Tags,
  User,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function AdminSidebar({ isOpen, onClose }) {
  const { logout, user } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      info('You have logged out of the admin console.');
      navigate('/admin/login');
    } catch (e) {
      console.error(e);
    }
  };

  const menuItems = [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
    { label: 'Add New Project', to: '/admin/projects/new', icon: PlusCircle },
    { label: 'Categories', to: '/admin/categories', icon: Tags },
    { label: 'Profile / About', to: '/admin/profile', icon: User },
    { label: 'Messages', to: '/admin/messages', icon: MessageSquare },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0d0d0d] border-r border-[#222222] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Brand */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-[#1c1c1c]">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#161616] border border-[#252525] flex items-center justify-center">
                <span className="font-heading font-extrabold text-sm text-white">
                  V<span className="text-[#FF751F]">G</span>
                </span>
              </div>
              <div>
                <span className="font-heading font-extrabold text-sm text-white tracking-wider block">
                  VICTOR GRAPHICS
                </span>
                <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5 text-[#FF751F]" />
                  Admin Console
                </span>
              </div>
            </Link>

            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-left">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#FF751F] text-white shadow-md shadow-[#FF751F]/20'
                        : 'text-neutral-400 hover:text-white hover:bg-[#161616]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Info & Actions */}
        <div className="p-4 border-t border-[#1c1c1c] space-y-3">
          {/* View Public Website */}
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-[#151515] border border-[#252525] hover:border-[#333333] transition-colors"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#FF751F]" />
          </Link>

          {/* User profile / Logout */}
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="truncate pr-2">
              <div className="text-xs font-bold text-white truncate">
                {user?.user_metadata?.full_name || 'Administrator'}
              </div>
              <div className="text-[11px] text-neutral-400 truncate">
                {user?.email || 'admin@victorgraphics.com'}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Log Out"
              aria-label="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

