import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Star,
  Film,
  FileText,
  ImageIcon,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { ProjectModal } from '../../components/public/ProjectModal';
import { useToast } from '../../context/ToastContext';
import { fetchProjects, deleteProject, updateProject } from '../../lib/portfolioService';
import { fetchCategories } from '../../lib/categoryService';

export function AdminProjectsPage() {
  const { setSidebarOpen } = useOutletContext();
  const { success, error } = useToast();

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals
  const [previewProject, setPreviewProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      const [projList, catList] = await Promise.all([
        fetchProjects(),
        fetchCategories()
      ]);
      setProjects(projList || []);
      setCategories(catList || []);
    } catch (err) {
      error('Failed to load projects list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Toggle Featured status
  const handleToggleFeatured = async (project) => {
    try {
      const updated = await updateProject(project.id, {
        is_featured: !project.is_featured
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, is_featured: updated.is_featured } : p))
      );
      success(`Project ${updated.is_featured ? 'featured on homepage' : 'removed from featured'}.`);
    } catch (err) {
      error('Failed to update featured status.');
    }
  };

  // Toggle Publish/Draft status
  const handleToggleStatus = async (project) => {
    const nextStatus = project.status === 'published' ? 'draft' : 'published';
    try {
      const updated = await updateProject(project.id, { status: nextStatus });
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, status: updated.status } : p))
      );
      success(`Project marked as ${nextStatus}.`);
    } catch (err) {
      error('Failed to change status.');
    }
  };

  // Delete project
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProject(deleteTarget.id);
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      success('Project removed from portfolio.');
      setDeleteTarget(null);
    } catch (err) {
      error(err.message || 'Could not delete project.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered List
  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory =
      selectedCategory === 'all' || p.category_id === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all' || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <AdminHeader
        onMenuClick={() => setSidebarOpen(true)}
        title="Project Management"
        subtitle="Upload, edit, categorize, and showcase your visual design work."
      />

      {/* Top Action Bar & Filter Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search projects by title or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111111] border border-[#252525] text-xs text-white focus:outline-none focus:border-[#FF751F]"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filters and New Project Button */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#111111] border border-[#252525] text-xs text-white focus:outline-none focus:border-[#FF751F]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#111111] border border-[#252525] text-xs text-white focus:outline-none focus:border-[#FF751F]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          {/* Add New CTA */}
          <Link to="/admin/projects/new">
            <Button size="md" leftIcon={PlusCircle}>
              Add Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl bg-[#111111] border border-[#222222] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161616] border-b border-[#222222] text-neutral-400 font-mono uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Artwork</th>
                <th className="py-3.5 px-4">Project Title & Tags</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {filtered.length > 0 ? (
                filtered.map((proj) => {
                  const isVid = proj.file_type === 'video';
                  const isPdf = proj.file_type === 'pdf';

                  return (
                    <tr key={proj.id} className="hover:bg-[#151515] transition-colors">
                      {/* Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-14 h-12 rounded-lg bg-[#1c1c1c] overflow-hidden border border-[#282828] relative group flex-shrink-0">
                          <img
                            src={proj.thumbnail_url || proj.file_url}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Title & Tags */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-white truncate text-sm">
                          {proj.title}
                        </div>
                        {proj.tags && proj.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(Array.isArray(proj.tags) ? proj.tags : proj.tags.split(',')).slice(0, 2).map((t, i) => (
                              <span key={i} className="text-[10px] text-neutral-400 font-mono">
                                #{t.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-neutral-300 font-medium">
                          {proj.category_name || 'Design'}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isVid ? (
                          <span className="inline-flex items-center gap-1 text-[#FF751F] font-mono text-[11px]">
                            <Film className="w-3.5 h-3.5" /> MP4
                          </span>
                        ) : isPdf ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                            <FileText className="w-3.5 h-3.5" /> PDF
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-neutral-400 font-mono text-[11px]">
                            <ImageIcon className="w-3.5 h-3.5" /> Image
                          </span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(proj)}
                          className="focus:outline-none"
                          title="Click to toggle status"
                        >
                          <Badge
                            size="xs"
                            variant={proj.status === 'published' ? 'green' : 'amber'}
                          >
                            {proj.status}
                          </Badge>
                        </button>
                      </td>

                      {/* Featured Star Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(proj)}
                          className="p-1 rounded hover:bg-neutral-800 transition-colors"
                          title={proj.is_featured ? 'Featured on home' : 'Click to feature'}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              proj.is_featured
                                ? 'text-[#FF751F] fill-[#FF751F]'
                                : 'text-neutral-600 hover:text-neutral-400'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewProject(proj)}
                            className="p-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#252525] text-neutral-400 hover:text-white transition-colors"
                            title="Preview Modal"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            to={`/admin/projects/edit/${proj.id}`}
                            className="p-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#252525] text-neutral-400 hover:text-[#FF751F] transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(proj)}
                            className="p-1.5 rounded-lg bg-[#1c1c1c] hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    No projects found matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Project?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This will remove the artwork and case study from both public and admin galleries.`}
        confirmText="Yes, Delete Project"
        isLoading={isDeleting}
      />

      {/* Preview Modal */}
      <ProjectModal
        isOpen={Boolean(previewProject)}
        onClose={() => setPreviewProject(null)}
        project={previewProject}
      />
    </div>
  );
}

