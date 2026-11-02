import React, { useState } from 'react';
import { Sparkles, Grid, Layers, FolderOpen } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';

export function PortfolioSection({ projects = [], categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeProject, setActiveProject] = useState(null);

  // Filter projects by category
  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category_id === selectedCategory || p.category_name?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="portfolio" className="py-24 bg-[#080808] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 text-left gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151515] border border-[#252525] text-xs font-semibold text-[#FF751F] uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Selected Portfolio
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
              Featured Works & <br className="hidden sm:block" />
              <span className="text-[#FF751F]">Visual Archives</span>.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-neutral-400 max-w-md font-sans">
            A curated showcase of brand identities, posters, editorial publications, video reveals, and digital graphics.
          </p>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar text-left">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#FF751F] text-white shadow-lg shadow-[#FF751F]/20'
                : 'bg-[#141414] text-neutral-400 hover:text-white border border-[#222222] hover:border-[#333333]'
            }`}
          >
            All Works ({projects.length})
          </button>

          {categories.map((cat) => {
            const count = projects.filter(
              p => p.category_id === cat.id || p.category_name?.toLowerCase() === cat.name.toLowerCase()
            ).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF751F] text-white shadow-lg shadow-[#FF751F]/20'
                    : 'bg-[#141414] text-neutral-400 hover:text-white border border-[#222222] hover:border-[#333333]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={(proj) => setActiveProject(proj)}
              />
            ))}
          </div>
        ) : (
          /* Attractive Empty State */
          <div className="py-20 px-4 rounded-3xl bg-[#111111] border border-[#252525] text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mx-auto text-[#FF751F] mb-4">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-2">
              No Projects in this Category Yet
            </h3>
            <p className="text-sm text-neutral-400 font-sans mb-6">
              New creative works are regularly curated and published. Select another category or check back shortly.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-5 py-2.5 rounded-xl bg-[#1a1a1a] text-white border border-[#2c2c2c] hover:border-[#FF751F] text-xs font-semibold transition-colors"
            >
              View All Works
            </button>
          </div>
        )}

      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={activeProject}
        isOpen={Boolean(activeProject)}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}

