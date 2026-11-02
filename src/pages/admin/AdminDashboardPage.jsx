import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  FileEdit,
  Tags,
  MessageSquare,
  PlusCircle,
  ArrowUpRight,
  Eye,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { StatCard } from '../../components/admin/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { fetchProjects } from '../../lib/portfolioService';
import { fetchCategories } from '../../lib/categoryService';
import { fetchMessages } from '../../lib/messageService';

export function AdminDashboardPage() {
  const { setSidebarOpen } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    totalCategories: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [projects, categories, messages] = await Promise.all([
          fetchProjects(),
          fetchCategories(),
          fetchMessages(),
        ]);

        const published = projects.filter((p) => p.status === 'published').length;
        const drafts = projects.filter((p) => p.status === 'draft').length;
        const unread = messages.filter((m) => !m.is_read).length;

        setStats({
          totalProjects: projects.length,
          publishedProjects: published,
          draftProjects: drafts,
          totalCategories: categories.length,
          totalMessages: messages.length,
          unreadMessages: unread,
        });

        setRecentProjects(projects.slice(0, 5));
        setRecentMessages(messages.slice(0, 4));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <AdminHeader
        onMenuClick={() => setSidebarOpen(true)}
        title="Studio Dashboard"
        subtitle="Overview of your creative portfolio, content metrics and client inquiries."
      />

      {/* Quick Action Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#111111] border border-[#222222]">
        <div className="text-left">
          <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF751F]" />
            Quick Creative Workflows
          </h2>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Publish high-impact case studies, adjust categories, or review incoming briefs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Link to="/admin/projects/new" className="w-full sm:w-auto">
            <Button size="md" leftIcon={PlusCircle} className="w-full">
              Add New Project
            </Button>
          </Link>
          <Link to="/" target="_blank" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" rightIcon={ExternalLink} className="w-full">
              Live Preview
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
          color="orange"
          changeText="All portfolio works"
        />
        <StatCard
          title="Published Works"
          value={stats.publishedProjects}
          icon={CheckCircle2}
          color="green"
          changeText="Live on public website"
        />
        <StatCard
          title="Draft Projects"
          value={stats.draftProjects}
          icon={FileEdit}
          color="amber"
          changeText="Hidden from visitors"
        />
        <StatCard
          title="Active Categories"
          value={stats.totalCategories}
          icon={Tags}
          color="blue"
          changeText="Filter taxonomy"
        />
      </div>

      {/* Two Columns: Recent Projects & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left Column: Recent Projects Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-white">
              Recent Projects
            </h3>
            <Link
              to="/admin/projects"
              className="text-xs font-semibold text-[#FF751F] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl bg-[#111111] border border-[#222222] overflow-hidden">
            {recentProjects.length > 0 ? (
              <div className="divide-y divide-[#1f1f1f]">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-[#151515] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-[#1c1c1c] overflow-hidden flex-shrink-0 border border-[#282828]">
                        <img
                          src={project.thumbnail_url || project.file_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-sm">
                          {project.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-neutral-400 font-mono">
                            {project.category_name}
                          </span>
                          <span className="text-neutral-600">•</span>
                          <Badge
                            size="xs"
                            variant={project.status === 'published' ? 'green' : 'amber'}
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/admin/projects/edit/${project.id}`}
                      className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#2b2b2b] text-xs font-medium text-neutral-300 hover:text-white hover:border-[#FF751F] transition-colors whitespace-nowrap"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-neutral-400">
                No projects uploaded yet. Click "Add New Project" to get started.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Messages */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-lg text-white">
                Client Inquiries
              </h3>
              {stats.unreadMessages > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF751F] text-white">
                  {stats.unreadMessages} New
                </span>
              )}
            </div>
            <Link
              to="/admin/messages"
              className="text-xs font-semibold text-[#FF751F] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl bg-[#111111] border border-[#222222] overflow-hidden">
            {recentMessages.length > 0 ? (
              <div className="divide-y divide-[#1f1f1f]">
                {recentMessages.map((msg) => (
                  <Link
                    key={msg.id}
                    to="/admin/messages"
                    className="p-4 block hover:bg-[#151515] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-white truncate max-w-[160px]">
                        {msg.sender_name}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-[#FF751F] font-medium mb-1">
                      {msg.project_type}
                    </div>
                    <p className="text-xs text-neutral-400 font-sans line-clamp-2">
                      {msg.message}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-neutral-400">
                No inquiries submitted yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

