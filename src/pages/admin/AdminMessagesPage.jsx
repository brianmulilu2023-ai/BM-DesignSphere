import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Trash2,
  Search,
  Eye,
  Clock,
  Sparkles
} from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import {
  fetchMessages,
  markMessageAsRead,
  deleteMessage
} from '../../lib/messageService';

export function AdminMessagesPage() {
  const { setSidebarOpen } = useOutletContext();
  const { success, error } = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRead, setFilterRead] = useState('all'); // 'all' | 'unread' | 'read'

  // Modal Detail
  const [activeMessage, setActiveMessage] = useState(null);

  // Delete Confirm
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      const data = await fetchMessages();
      setMessages(data || []);
    } catch (err) {
      error('Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenMessage = async (msg) => {
    setActiveMessage(msg);
    if (!msg.is_read) {
      try {
        await markMessageAsRead(msg.id, true);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
        );
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleToggleRead = async (msg, e) => {
    if (e) e.stopPropagation();
    try {
      const nextRead = !msg.is_read;
      await markMessageAsRead(msg.id, nextRead);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: nextRead } : m))
      );
      success(nextRead ? 'Marked as read' : 'Marked as unread');
    } catch (err) {
      error('Failed to change read status.');
    }
  };

  const handleDeleteMessage = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteMessage(deleteTarget.id);
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      success('Inquiry deleted.');
      if (activeMessage?.id === deleteTarget.id) {
        setActiveMessage(null);
      }
      setDeleteTarget(null);
    } catch (err) {
      error('Failed to delete message.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sender_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.project_type && m.project_type.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      filterRead === 'all' ||
      (filterRead === 'unread' && !m.is_read) ||
      (filterRead === 'read' && m.is_read);

    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6 text-left">
      <AdminHeader
        onMenuClick={() => setSidebarOpen(true)}
        title="Client Inquiries"
        subtitle="Manage prospective client briefs and design commissions sent through your contact form."
      />

      {/* Top Filter & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, email or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111111] border border-[#252525] text-xs text-white focus:outline-none focus:border-[#FF751F]"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterRead('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterRead === 'all'
                ? 'bg-[#FF751F] text-white'
                : 'bg-[#141414] text-neutral-400 hover:text-white border border-[#222222]'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRead('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterRead === 'unread'
                ? 'bg-[#FF751F] text-white'
                : 'bg-[#141414] text-neutral-400 hover:text-white border border-[#222222]'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterRead('read')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterRead === 'read'
                ? 'bg-[#FF751F] text-white'
                : 'bg-[#141414] text-neutral-400 hover:text-white border border-[#222222]'
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {/* Messages List / Table */}
      <div className="rounded-2xl bg-[#111111] border border-[#222222] overflow-hidden shadow-xl">
        <div className="divide-y divide-[#1e1e1e]">
          {filtered.length > 0 ? (
            filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition-colors ${
                  !msg.is_read ? 'bg-[#161616]/70 hover:bg-[#1a1a1a]' : 'hover:bg-[#151515]'
                }`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  {/* Indicator Dot */}
                  <div className="pt-1.5">
                    <span
                      className={`block w-2.5 h-2.5 rounded-full ${
                        !msg.is_read ? 'bg-[#FF751F] shadow-md shadow-[#FF751F]/40' : 'bg-transparent border border-neutral-600'
                      }`}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-heading font-bold text-white truncate">
                        {msg.sender_name}
                      </h4>
                      <span className="text-xs text-neutral-400 font-mono">
                        &lt;{msg.sender_email}&gt;
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#FF751F] font-semibold">
                        {msg.project_type}
                      </span>
                      {msg.sender_phone && (
                        <>
                          <span className="text-neutral-600">•</span>
                          <span className="text-xs text-neutral-400">
                            {msg.sender_phone}
                          </span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-neutral-400 font-sans line-clamp-1 mt-1 max-w-2xl">
                      {msg.message}
                    </p>
                  </div>
                </div>

                {/* Right Date & Action Controls */}
                <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                  <span className="text-[11px] font-mono text-neutral-400">
                    {new Date(msg.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleToggleRead(msg, e)}
                    className="p-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#252525] text-neutral-400 hover:text-white"
                    title={msg.is_read ? 'Mark Unread' : 'Mark Read'}
                  >
                    <CheckCircle className={`w-3.5 h-3.5 ${msg.is_read ? 'text-[#FF751F]' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(msg);
                    }}
                    className="p-1.5 rounded-lg bg-[#1c1c1c] hover:bg-red-500/20 text-neutral-400 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-xs text-neutral-400">
              No inquiries found matching your filters.
            </div>
          )}
        </div>
      </div>

      {/* Message Detail Modal */}
      <Modal
        isOpen={Boolean(activeMessage)}
        onClose={() => setActiveMessage(null)}
        title={`Inquiry from ${activeMessage?.sender_name || 'Client'}`}
        subtitle={activeMessage ? new Date(activeMessage.created_at).toLocaleString() : ''}
      >
        {activeMessage && (
          <div className="space-y-6 pt-2 text-left">
            {/* Sender Metadata Box */}
            <div className="p-4 rounded-xl bg-[#171717] border border-[#252525] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Email:</span>
                <a
                  href={`mailto:${activeMessage.sender_email}`}
                  className="font-mono text-[#FF751F] hover:underline"
                >
                  {activeMessage.sender_email}
                </a>
              </div>
              {activeMessage.sender_phone && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Phone:</span>
                  <a
                    href={`tel:${activeMessage.sender_phone}`}
                    className="font-mono text-neutral-200 hover:underline"
                  >
                    {activeMessage.sender_phone}
                  </a>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Project Type:</span>
                <span className="font-semibold text-white">
                  {activeMessage.project_type}
                </span>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Message Content
              </h4>
              <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] text-sm text-neutral-200 font-sans leading-relaxed whitespace-pre-line">
                {activeMessage.message}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#222222] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(activeMessage);
                }}
                className="text-xs text-red-400 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Message</span>
              </button>

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveMessage(null)}
                >
                  Close
                </Button>
                <a
                  href={`mailto:${activeMessage.sender_email}?subject=${encodeURIComponent(
                    `Re: Victor Graphics - ${activeMessage.project_type}`
                  )}`}
                  className="inline-flex"
                >
                  <Button size="sm" leftIcon={Mail}>
                    Reply via Email
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteMessage}
        title="Delete Inquiry?"
        message={`Are you sure you want to delete the message from ${deleteTarget?.sender_name}?`}
        confirmText="Confirm Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}

