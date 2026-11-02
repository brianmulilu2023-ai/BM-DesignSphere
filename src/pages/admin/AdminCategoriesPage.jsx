import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Edit2, Trash2, Tags, FolderKanban, AlertCircle } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../lib/categoryService';
import { fetchProjects } from '../../lib/portfolioService';

export function AdminCategoriesPage() {
  const { setSidebarOpen } = useOutletContext();
  const { success, error } = useToast();

  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create / Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      const [cats, projs] = await Promise.all([
        fetchCategories(),
        fetchProjects()
      ]);
      setCategories(cats || []);
      setProjects(projs || []);
    } catch (err) {
      error('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setModalOpen(true);
  };

  const handleNameChange = (val) => {
    setName(val);
    if (!editingCategory) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(autoSlug);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Category name is required.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name, slug });
        success(`Category renamed to "${name}".`);
      } else {
        await createCategory({ name, slug });
        success(`New category "${name}" created.`);
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      error(err.message || 'Error saving category.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteTarget) return;

    // Check count of associated projects
    const count = projects.filter(p => p.category_id === deleteTarget.id).length;
    if (count > 0) {
      error(`Cannot delete category: ${count} project(s) are currently assigned to it. Please reassign or delete those projects first.`);
      setDeleteTarget(null);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      success('Category removed.');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      error(err.message || 'Failed to delete category.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <AdminHeader
        onMenuClick={() => setSidebarOpen(true)}
        title="Category Architecture"
        subtitle="Organize your portfolio works into distinct aesthetic and client disciplines."
      />

      {/* Top Action */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-400">
          Categories populate the portfolio filter bar on the public landing page.
        </p>
        <Button size="sm" onClick={handleOpenCreate} leftIcon={Plus}>
          Add Category
        </Button>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const associatedProjects = projects.filter((p) => p.category_id === cat.id);
          const count = associatedProjects.length;

          return (
            <div
              key={cat.id}
              className="p-6 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#333333] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#171717] border border-[#252525] text-[#FF751F] flex items-center justify-center">
                    <Tags className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-[#181818] border border-[#262626] text-neutral-300">
                    {count} {count === 1 ? 'project' : 'projects'}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-white mb-1">
                  {cat.name}
                </h3>
                <span className="text-xs text-neutral-400 font-mono">
                  slug: /{cat.slug}
                </span>
              </div>

              {/* Actions */}
              <div className="pt-6 mt-6 border-t border-[#1d1d1d] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(cat)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-white"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Rename</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(cat)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Rename Category' : 'Create New Category'}
        subtitle="Categories group projects on the live gallery."
      >
        <form onSubmit={handleSaveCategory} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Category Name <span className="text-[#FF751F]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              placeholder="e.g. Brand Identity, Packaging, UI Concepting"
              className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              URL Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="brand-identity"
              className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm font-mono focus:outline-none focus:border-[#FF751F]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSaving}
            >
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteCategory}
        title="Delete Category?"
        message={`Are you sure you want to remove the category "${deleteTarget?.name}"? Make sure no projects are currently assigned to this category.`}
        confirmText="Confirm Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}

