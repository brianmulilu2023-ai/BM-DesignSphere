import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Image as ImageIcon,
  Film,
  FileText,
  X,
  Check,
  Eye,
  Save,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { uploadPortfolioFile } from '../../lib/storageService';
import { createProject, updateProject } from '../../lib/portfolioService';
import { fetchCategories } from '../../lib/categoryService';
import { ProjectModal } from '../public/ProjectModal';

export function ProjectForm({ initialData = null, isEdit = false }) {
  const navigate = useNavigate();
  const { success, error, info } = useToast();

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    file_type: 'image', // 'image' | 'video' | 'pdf'
    thumbnail_url: '',
    file_url: '',
    status: 'published', // 'published' | 'draft'
    is_featured: false,
    client_name: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [thumbnailToUpload, setThumbnailToUpload] = useState(null);

  // Load categories and initialize if editing
  useEffect(() => {
    async function loadCats() {
      try {
        const cats = await fetchCategories();
        setCategories(cats || []);
        if (!initialData && cats && cats.length > 0) {
          setFormData((prev) => ({ ...prev, category_id: cats[0].id }));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCats();

    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category_id: initialData.category_id || '',
        file_type: initialData.file_type || 'image',
        thumbnail_url: initialData.thumbnail_url || '',
        file_url: initialData.file_url || '',
        status: initialData.status || 'published',
        is_featured: Boolean(initialData.is_featured),
        client_name: initialData.client_name || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags : (initialData.tags ? initialData.tags.split(',') : [])
      });
    }
  }, [initialData]);

  // Handle generic input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Tag Management
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (clean && !formData.tags.includes(clean)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, clean] }));
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove)
    }));
  };

  // Main File Selection
  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    validateAndSetMainFile(file);
  };

  const validateAndSetMainFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    let detectedType = 'image';

    if (['mp4', 'webm', 'mov'].includes(ext)) {
      detectedType = 'video';
    } else if (ext === 'pdf') {
      detectedType = 'pdf';
    } else if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext)) {
      detectedType = 'image';
    } else {
      error('Unsupported format. Please upload JPG, PNG, PDF, or MP4.');
      return;
    }

    setFileToUpload(file);
    setFormData((prev) => ({
      ...prev,
      file_type: detectedType,
      // Create local object URL for instant preview
      file_url: URL.createObjectURL(file),
      // If it's an image and no thumbnail is set yet, also set thumbnail
      thumbnail_url: detectedType === 'image' && !prev.thumbnail_url ? URL.createObjectURL(file) : prev.thumbnail_url
    }));
  };

  // Separate Thumbnail Selection (especially useful for video or PDF projects)
  const handleThumbnailSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setThumbnailToUpload(file);
    setFormData((prev) => ({
      ...prev,
      thumbnail_url: URL.createObjectURL(file)
    }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      error('Project title is required.');
      return;
    }
    if (!formData.category_id) {
      error('Please select a project category.');
      return;
    }
    if (!formData.file_url && !fileToUpload) {
      error('Please upload or provide a project file (Image, PDF, or MP4).');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(20);

    try {
      let finalFileUrl = formData.file_url;
      let finalThumbUrl = formData.thumbnail_url || formData.file_url;

      // Upload main file if a local File was selected
      if (fileToUpload) {
        setUploadProgress(40);
        const uploadRes = await uploadPortfolioFile(fileToUpload, 'projects');
        finalFileUrl = uploadRes.url;
        setUploadProgress(70);
      }

      // Upload thumbnail if a local thumbnail File was selected
      if (thumbnailToUpload) {
        const thumbRes = await uploadPortfolioFile(thumbnailToUpload, 'thumbnails');
        finalThumbUrl = thumbRes.url;
      } else if (!formData.thumbnail_url && finalFileUrl) {
        finalThumbUrl = finalFileUrl;
      }

      setUploadProgress(90);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category_id: formData.category_id,
        file_type: formData.file_type,
        file_url: finalFileUrl,
        thumbnail_url: finalThumbUrl,
        status: formData.status,
        is_featured: formData.is_featured,
        client_name: formData.client_name.trim(),
        tags: formData.tags
      };

      if (isEdit && initialData?.id) {
        await updateProject(initialData.id, payload);
        success('Project updated successfully.');
      } else {
        await createProject(payload);
        success('New project created and published to portfolio.');
      }

      setUploadProgress(100);
      navigate('/admin/projects');
    } catch (err) {
      error(err.message || 'Failed to save project.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  // Prepare active category name for modal preview
  const currentCategoryName = categories.find((c) => c.id === formData.category_id)?.name || 'Design';

  return (
    <div className="space-y-6 text-left">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222222]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="p-2 rounded-xl bg-[#141414] border border-[#252525] text-neutral-400 hover:text-white transition-colors"
            aria-label="Back to projects"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-heading font-extrabold text-white">
              {isEdit ? 'Edit Project' : 'Upload New Project'}
            </h2>
            <p className="text-xs text-neutral-400">
              {isEdit ? 'Update details, artwork or visibility of this project.' : 'Add high-resolution design assets to the Victor Graphics portfolio.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setPreviewModalOpen(true)}
            leftIcon={Eye}
            disabled={!formData.file_url}
          >
            Live Preview
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            leftIcon={Save}
          >
            {isEdit ? 'Save Changes' : 'Publish Project'}
          </Button>
        </div>
      </div>

      {/* Progress Bar if uploading */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full bg-[#1c1c1c] rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#FF751F] h-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Main Form Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Core Fields */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Title */}
          <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Project Title <span className="text-[#FF751F]">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Aura Kinetic - Brand Identity & Visual Guidelines"
                className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F] focus:ring-1 focus:ring-[#FF751F] transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Project Description & Case Study
              </label>
              <textarea
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Detail the creative brief, design philosophy, typography choices, and commercial results achieved..."
                className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F] focus:ring-1 focus:ring-[#FF751F] transition-all resize-none"
              />
            </div>

            {/* Client Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Client / Brand Partner
              </label>
              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                placeholder="e.g. Aura Kinetic Labs, London"
                className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F]"
              />
            </div>
          </div>

          {/* Drag & Drop File Upload Area */}
          <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Project Asset Upload (JPG, PNG, PDF, MP4) <span className="text-[#FF751F]">*</span>
              </label>
              <span className="text-[11px] font-mono text-[#FF751F] uppercase">
                Format: {formData.file_type}
              </span>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-[#2d2d2d] hover:border-[#FF751F]/60 rounded-2xl p-8 text-center transition-colors bg-[#141414]/50 cursor-pointer relative group"
            >
              <input
                type="file"
                accept="image/*,video/mp4,application/pdf"
                onChange={handleFileDrop}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] text-[#FF751F] flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white mb-1">
                Drag & drop artwork here, or <span className="text-[#FF751F]">browse</span>
              </p>
              <p className="text-xs text-neutral-400">
                Supports JPG, PNG, PDF brochures, and MP4 showreel videos (up to 50MB)
              </p>
            </div>

            {/* Direct URL input fallback */}
            <div className="space-y-1 pt-2">
              <label className="text-[11px] text-neutral-400 uppercase tracking-wider">
                Or paste an external file URL:
              </label>
              <input
                type="url"
                name="file_url"
                value={formData.file_url}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/... or https://domain.com/video.mp4"
                className="w-full px-3 py-2 rounded-lg bg-[#171717] border border-[#252525] text-xs text-white focus:outline-none focus:border-[#FF751F]"
              />
            </div>
          </div>

          {/* Tags Manager */}
          <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-3">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Project Tags & Deliverables (Press Enter or Comma)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#181818] border border-[#262626] text-neutral-200"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-neutral-500 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="e.g. Branding, Minimalist, Typography, Packaging..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#252525] text-white text-xs focus:outline-none focus:border-[#FF751F]"
            />
          </div>

        </div>

        {/* Right Column: Taxonomy, Status & Previews */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Taxonomy & Visibility */}
          <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-5">
            <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-400">
              Publishing Options
            </h3>

            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Category <span className="text-[#FF751F]">*</span>
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#171717] text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status (Draft / Published) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Publishing Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, status: 'published' }))}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    formData.status === 'published'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-md'
                      : 'bg-[#171717] border-[#252525] text-neutral-400 hover:text-white'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Published</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, status: 'draft' }))}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    formData.status === 'draft'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-400 shadow-md'
                      : 'bg-[#171717] border-[#252525] text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>Draft</span>
                </button>
              </div>
            </div>

            {/* Featured Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[#171717] border border-[#252525] cursor-pointer hover:border-[#333]">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#FF751F] focus:ring-[#FF751F] bg-[#222] border-neutral-700"
                />
                <div>
                  <div className="text-xs font-semibold text-white">
                    Feature on Homepage Highlights
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Pins this project prominently on the main landing view.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Thumbnail / Cover Box */}
          <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Thumbnail Cover
              </label>
              <span className="text-[11px] text-neutral-400">
                Grid preview image
              </span>
            </div>

            {formData.thumbnail_url ? (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black border border-[#282828] group">
                <img
                  src={formData.thumbnail_url}
                  alt="Thumbnail Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, thumbnail_url: '' }))}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-neutral-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border border-dashed border-[#2c2c2c] rounded-xl p-4 text-center bg-[#161616]">
                <p className="text-xs text-neutral-400 mb-2">
                  Upload a custom thumbnail cover:
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailSelect}
                  className="text-xs text-neutral-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#FF751F] file:text-white cursor-pointer"
                />
              </div>
            )}
          </div>

        </div>

      </form>

      {/* Live Preview Modal */}
      <ProjectModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        project={{
          ...formData,
          category_name: currentCategoryName,
          created_at: new Date().toISOString()
        }}
      />
    </div>
  );
}

