import React from 'react';
import { Target, Compass, Sparkles, CheckCircle, Award, Cpu, Code2 } from 'lucide-react';

export function AboutSection({ profile }) {
  const skillsList = profile?.skills
    ? (Array.isArray(profile.skills) ? profile.skills : profile.skills.split(',').map(s => s.trim()))
    : [
        'Brand Strategy',
        'Visual Identity',
        'Editorial Design',
        'Motion Graphics',
        'Print Production',
        'UI/UX Concepting',
        'Packaging Design',
        'Typography Architecture'
      ];

  const softwareList = profile?.design_software
    ? (Array.isArray(profile.design_software) ? profile.design_software : profile.design_software.split(',').map(s => s.trim()))
    : [
        'Adobe Illustrator',
        'Adobe Photoshop',
        'Adobe InDesign',
        'Figma',
        'After Effects',
        'Premiere Pro'
      ];

  const designPillars = [
    {
      step: '01',
      title: 'Strategy & Research',
      desc: 'Dissecting market context, audience psychology, and brand differentiation before drawing a single vector.'
    },
    {
      step: '02',
      title: 'Visual Architecture',
      desc: 'Developing cohesive typographic systems, distinct palettes, and grid hierarchies that anchor the brand.'
    },
    {
      step: '03',
      title: 'Iterative Precision',
      desc: 'Refining details with mathematical balance, testing across micro-icons, billboards, and mobile interfaces.'
    },
    {
      step: '04',
      title: 'Delivery & Longevity',
      desc: 'Delivering comprehensive production guidelines and high-resolution deliverables engineered to withstand time.'
    }
  ];

  return (
    <section id="about" className="py-24 bg-[#0a0a0a] border-t border-[#1c1c1c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171717] border border-[#252525] text-xs font-semibold text-[#FF751F] uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            About The Designer & Studio
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
            Design Built With <span className="text-[#FF751F]">Obsessive Craft</span> & Clear Intent.
          </h2>
        </div>

        {/* Top Split: Profile Photo + Biography & Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Profile Photo Card */}
          <div className="lg:col-span-5">
            <div className="relative group">
              <div className="relative rounded-3xl overflow-hidden border border-[#262626] bg-[#121212] aspect-[4/5] shadow-2xl">
                <img
                  src={profile?.profile_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80'}
                  alt={profile?.full_name || 'Victor Muiruri - Graphic Designer'}
                  className="w-full h-full object-cover object-top filter grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-xl font-heading font-extrabold text-white">
                    {profile?.full_name || 'Victor Muiruri'}
                  </div>
                  <div className="text-xs font-medium text-[#FF751F] uppercase tracking-wider mt-0.5">
                    Creative Director & Lead Designer
                  </div>
                </div>
              </div>

              {/* Decorative Accent Ring */}
              <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-[#FF751F]/15 rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>

          {/* Biography & Philosophy Details */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Biography */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FF751F]" />
                Biography
              </h3>
              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-sans">
                {profile?.biography || 'Passionate multidisciplinary graphic designer and brand identity architect with over 7 years of professional experience crafting visually stunning, commercially compelling design systems for global brands and visionary startups.'}
              </p>
            </div>

            {/* Creative Philosophy */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-[#222222] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FF751F]" />
              <h4 className="text-xs uppercase tracking-widest font-bold text-[#FF751F] mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Creative Philosophy
              </h4>
              <p className="text-sm sm:text-base text-neutral-300 italic font-sans leading-relaxed">
                "{profile?.creative_philosophy || 'Design is not just what it looks like and feels like. Design is how it works and communicates. Every curve, font pairing, and color choice must tell an authentic story.'}"
              </p>
            </div>

            {/* Professional Experience */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-400">
                Professional Experience
              </h4>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                {profile?.professional_experience || '7+ Years of industry experience spanning branding agencies, high-growth tech startups, and independent creative direction.'}
              </p>
            </div>

            {/* Skills & Software Badges */}
            <div className="pt-2 space-y-5">
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-400 mb-3 flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-[#FF751F]" />
                  Core Capabilities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#171717] border border-[#262626] text-neutral-200 hover:border-[#FF751F]/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-400 mb-3 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-[#FF751F]" />
                  Tools & Design Software
                </h4>
                <div className="flex flex-wrap gap-2">
                  {softwareList.map((sw, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#111111] border border-[#202020] text-[#FF751F]"
                    >
                      {sw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Section: Design Approach (4 Pillars) */}
        <div className="pt-8 border-t border-[#1a1a1a]">
          <h3 className="text-sm uppercase tracking-widest font-bold text-neutral-400 mb-8 text-left">
            The Design Approach
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {designPillars.map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#FF751F]/40 transition-all duration-300 group"
              >
                <div className="font-mono text-2xl font-bold text-[#FF751F] mb-4">
                  {item.step}
                </div>
                <h4 className="text-base font-heading font-bold text-white mb-2 group-hover:text-[#FF751F] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

