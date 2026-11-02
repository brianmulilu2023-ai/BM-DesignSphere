import React from 'react';
import { Calendar, Tag, ArrowUpRight, User, Folder, CheckCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { VideoPlayer } from './VideoPlayer';
import { PdfViewer } from './PdfViewer';
import { Button } from '../common/Button';

export function ProjectModal({ project, isOpen, onClose }) {
  if (!project) return null;

  const isVideo = project.file_type === 'video';
  const isPdf = project.file_type === 'pdf';

  const formattedDate = project.created_at
    ? new Date(project.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  const handleInquire = () => {
    onClose();
    const contactSection = document.querySelector('#contact');
    const projectTypeInput = document.querySelector('#project_type_select');
    const messageInput = document.querySelector('#message_textarea');
    
    if (projectTypeInput) {
      projectTypeInput.value = project.category_name || 'Brand Identity Design';
    }
    if (messageInput) {
      messageInput.value = `Hi Victor, I'm interested in discussing a project similar to "${project.title}".`;
    }

    if (contactSection) {
      const topOffset = 80;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6 text-left">
        {/* Header Tags & Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#252525]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-[#FF751F]/15 text-[#FF751F] border border-[#FF751F]/30 font-semibold">
              {project.category_name || 'Design'}
            </span>
            {project.client_name && (
              <span className="px-3 py-1 rounded-full text-xs bg-[#1a1a1a] text-neutral-300 border border-[#2a2a2a] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-neutral-500" />
                {project.client_name}
              </span>
            )}
          </div>
          {formattedDate && (
            <span className="text-xs text-neutral-400 font-mono flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              {formattedDate}
            </span>
          )}
        </div>

        {/* Project Title */}
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white leading-tight">
          {project.title}
        </h2>

        {/* Media Preview Box */}
        <div className="rounded-2xl overflow-hidden bg-[#0d0d0d] border border-[#222222] shadow-xl">
          {isVideo ? (
            <VideoPlayer
              src={project.file_url}
              poster={project.thumbnail_url}
            />
          ) : isPdf ? (
            <PdfViewer
              src={project.file_url}
              title={project.title}
            />
          ) : (
            <div className="relative max-h-[600px] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={project.file_url || project.thumbnail_url}
                alt={project.title}
                className="w-full h-auto max-h-[580px] object-contain rounded-xl"
              />
            </div>
          )}
        </div>

        {/* Project Description */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF751F]">
            Project Overview & Strategy
          </h4>
          <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="pt-2">
            <h5 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-neutral-500" />
              Deliverables & Tags
            </h5>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(project.tags) ? project.tags : project.tags.split(',')).map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs bg-[#171717] text-neutral-300 border border-[#262626]"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="pt-6 border-t border-[#252525] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-400 font-sans">
            Ready to craft a powerful visual identity for your brand?
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1 sm:flex-initial"
            >
              Close
            </Button>
            <Button
              onClick={handleInquire}
              rightIcon={ArrowUpRight}
              className="flex-1 sm:flex-initial"
            >
              Inquire About Similar Project
            </Button>
          </div>
        </div>

      </div>
    </Modal>
  );
}

