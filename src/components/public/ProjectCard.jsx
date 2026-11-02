import React from 'react';
import { Eye, Film, FileText, Calendar, ArrowUpRight } from 'lucide-react';
import { Badge } from '../common/Badge';

export function ProjectCard({ project, onSelect }) {
  const isVideo = project.file_type === 'video';
  const isPdf = project.file_type === 'pdf';

  // Format date
  const formattedDate = project.created_at
    ? new Date(project.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      })
    : '';

  return (
    <div
      onClick={() => onSelect(project)}
      className="group cursor-pointer rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#FF751F]/40 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:shadow-black/70"
    >
      <div>
        {/* Thumbnail Container */}
        <div className="relative aspect-[4/3] bg-[#161616] overflow-hidden">
          <img
            src={project.thumbnail_url || project.file_url}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95 group-hover:brightness-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Type Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {isVideo && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/70 backdrop-blur-md text-[#FF751F] border border-[#FF751F]/40 flex items-center gap-1">
                <Film className="w-3 h-3" />
                <span>Video Project</span>
              </span>
            )}
            {isPdf && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>PDF Document</span>
              </span>
            )}
            {!isVideo && !isPdf && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/70 backdrop-blur-md text-white border border-white/10">
                Artwork
              </span>
            )}
          </div>

          {/* Category Tag on top right */}
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#0a0a0a]/80 backdrop-blur-md text-neutral-300 border border-neutral-700">
              {project.category_name || 'Design'}
            </span>
          </div>

          {/* Hover View Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF751F] text-white text-xs font-bold tracking-wide shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Eye className="w-4 h-4" />
              <span>View Case Study</span>
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 text-left">
          {/* Date & Client info */}
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 font-mono">
            {formattedDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
            )}
            {project.client_name && (
              <span className="truncate max-w-[120px] text-neutral-400">
                {project.client_name}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-base sm:text-lg text-white group-hover:text-[#FF751F] transition-colors leading-snug line-clamp-1 mb-2">
            {project.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-neutral-400 font-sans line-clamp-2 leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {(Array.isArray(project.tags) ? project.tags : project.tags.split(',')).slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-[#181818] text-neutral-400 border border-[#262626]"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Link */}
      <div className="px-6 pb-5 pt-0 text-left">
        <div className="flex items-center justify-between pt-3 border-t border-[#1a1a1a] text-xs font-semibold text-neutral-400 group-hover:text-white transition-colors">
          <span>Project Details</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#FF751F]" />
        </div>
      </div>
    </div>
  );
}

