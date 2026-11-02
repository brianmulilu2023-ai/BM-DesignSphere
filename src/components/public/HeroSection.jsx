import React from 'react';
import { ArrowUpRight, Sparkles, Award, Layers, Zap } from 'lucide-react';
import { Button } from '../common/Button';

export function HeroSection({ profile }) {
  const brandName = profile?.brand_name || 'VICTOR GRAPHICS';
  const headline = profile?.tagline || 'Turning Ideas Into Powerful Visual Experiences.';
  const supporting = 'We transform ideas into meaningful visual experiences through creativity, strategy and exceptional graphic design.';

  const handleScroll = (id) => {
    const elem = document.querySelector(id);
    if (elem) {
      const topOffset = 80;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#FF751F]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-[#FF751F]/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Top Brand Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#252525] text-xs font-semibold text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-[#FF751F] animate-pulse" />
              <span className="tracking-widest uppercase font-mono text-[11px] text-white">
                {brandName}
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-[#FF751F] font-medium">Design Studio & Direction</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight leading-[1.08]">
              Turning Ideas Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#FF751F]">Powerful Visual</span> Experiences.
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-neutral-400 font-sans max-w-2xl leading-relaxed">
              {supporting}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                onClick={() => handleScroll('#portfolio')}
                rightIcon={ArrowUpRight}
                className="w-full sm:w-auto"
              >
                Explore Our Work
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleScroll('#contact')}
                className="w-full sm:w-auto"
              >
                Let's Work Together
              </Button>
            </div>

            {/* Micro Metrics Highlights */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-[#1f1f1f] max-w-xl">
              <div>
                <div className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                  7<span className="text-[#FF751F]">+</span>
                </div>
                <div className="text-xs text-neutral-400 font-medium uppercase tracking-wider mt-1">
                  Years Experience
                </div>
              </div>
              <div>
                <div className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                  150<span className="text-[#FF751F]">+</span>
                </div>
                <div className="text-xs text-neutral-400 font-medium uppercase tracking-wider mt-1">
                  Projects Delivered
                </div>
              </div>
              <div>
                <div className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                  100<span className="text-[#FF751F]">%</span>
                </div>
                <div className="text-xs text-neutral-400 font-medium uppercase tracking-wider mt-1">
                  Bespoke Craft
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Creative Artwork Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glow Card */}
              <div className="relative rounded-3xl p-2 bg-gradient-to-b from-[#2a2a2a] via-[#161616] to-[#0d0d0d] border border-[#262626] shadow-2xl shadow-black/80 group">
                
                {/* Artwork Display Container */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#111111]">
                  <img
                    src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=85"
                    alt="Victor Graphics Creative Studio Artwork"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Artwork Overlay Tags */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF751F]" />
                      Featured Artwork
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#FF751F] text-white font-bold uppercase tracking-wider">
                      Identity '26
                    </span>
                  </div>

                  {/* Artwork Bottom Info Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0e0e0e]/90 backdrop-blur-md border border-white/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-heading font-bold text-white tracking-wide">
                        Aura Kinetic Brand System
                      </h4>
                      <span className="text-[10px] text-[#FF751F] font-mono uppercase tracking-wider">
                        Full Identity
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-sans line-clamp-1">
                      Geometric wordmark, chromatic dark packaging & editorial publication guidelines.
                    </p>
                  </div>
                </div>

                {/* Floating Decorative Badges */}
                <div className="hidden sm:flex absolute -bottom-5 -left-6 bg-[#161616] border border-[#2a2a2a] rounded-2xl p-3.5 shadow-2xl items-center gap-3 animate-pulse-subtle">
                  <div className="w-10 h-10 rounded-xl bg-[#FF751F]/15 border border-[#FF751F]/30 flex items-center justify-center text-[#FF751F]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">
                      Bold Editorial Aesthetic
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      Minimalist & Purposeful
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex absolute -top-5 -right-5 bg-[#161616] border border-[#2a2a2a] rounded-2xl p-3 shadow-xl items-center gap-2.5">
                  <Award className="w-4 h-4 text-[#FF751F]" />
                  <span className="text-xs font-semibold text-white">
                    Premium Typography
                  </span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

