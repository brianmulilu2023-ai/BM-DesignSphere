import React from 'react';
import {
  PenTool,
  Palette,
  Image,
  Layers,
  Share2,
  BookOpen,
  CreditCard,
  Monitor,
  FileText,
  ArrowUpRight,
  Briefcase
} from 'lucide-react';
import { INITIAL_SERVICES } from '../../lib/mockData';

const ICON_MAP = {
  PenTool,
  Palette,
  Image,
  Layers,
  Share2,
  BookOpen,
  CreditCard,
  Monitor,
  FileText,
};

export function ServicesSection() {
  const handleServiceSelect = (serviceTitle) => {
    const contactSection = document.querySelector('#contact');
    const projectTypeInput = document.querySelector('#project_type_select');
    if (projectTypeInput) {
      projectTypeInput.value = serviceTitle;
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
    <section id="services" className="py-24 bg-[#080808] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 text-left gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151515] border border-[#252525] text-xs font-semibold text-[#FF751F] uppercase tracking-wider mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              Specialized Services
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
              Design Solutions Tailored <br className="hidden sm:block" />
              For <span className="text-[#FF751F]">Commercial Impact</span>.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-neutral-400 max-w-md font-sans">
            Every deliverable is crafted from first principles, combining brand strategy, bespoke aesthetics, and commercial clarity.
          </p>
        </div>

        {/* 9 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {INITIAL_SERVICES.map((service, index) => {
            const IconComponent = ICON_MAP[service.iconName] || Palette;
            return (
              <div
                key={service.id || index}
                className="group relative p-8 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#FF751F]/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-black/50"
              >
                <div>
                  {/* Card Icon & Index */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] group-hover:bg-[#FF751F]/10 group-hover:border-[#FF751F]/40 flex items-center justify-center text-white group-hover:text-[#FF751F] transition-all duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-neutral-400 group-hover:text-white transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-heading font-bold text-white mb-3 group-hover:text-[#FF751F] transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-neutral-400 leading-relaxed font-sans mb-6">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Bottom Action */}
                <button
                  type="button"
                  onClick={() => handleServiceSelect(service.title)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 group-hover:text-white transition-colors pt-4 border-t border-[#1d1d1d]"
                >
                  <span>Request this service</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#FF751F]" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

