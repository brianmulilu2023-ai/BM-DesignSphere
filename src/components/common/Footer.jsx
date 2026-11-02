import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Globe, ArrowUp, Shield } from 'lucide-react';

export function Footer({ profile }) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#252525] pt-16 pb-12 text-neutral-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#1c1c1c]">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#111] border border-[#252525] flex items-center justify-center">
                <span className="font-heading font-extrabold text-lg text-white">
                  V<span className="text-[#FF751F]">G</span>
                </span>
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-wider">
                {profile?.brand_name || 'VICTOR GRAPHICS'}
              </span>
            </div>
            <p className="text-neutral-400 text-sm max-w-md leading-relaxed">
              "{profile?.tagline || 'Turning Ideas Into Powerful Visual Experiences.'}"
            </p>
            <p className="text-xs text-neutral-400 max-w-sm">
              Strategic visual communication, high-end brand identity architecture, publication craft, and premium commercial advertising.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#portfolio" className="hover:text-[#FF751F] transition-colors">
                  Featured Work
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#FF751F] transition-colors">
                  About Designer
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#FF751F] transition-colors">
                  Services & Solutions
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#FF751F] transition-colors">
                  Start a Project
                </a>
              </li>
            </ul>
          </div>

          {/* Connect / Socials */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white mb-4">
              Connect
            </h4>
            <div className="flex flex-wrap gap-2.5 mb-6">
              {profile?.instagram_url && (
                <a
                  href={profile.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-lg bg-[#141414] border border-[#252525] flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#FF751F] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {profile?.facebook_url && (
                <a
                  href={profile.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-lg bg-[#141414] border border-[#252525] flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#FF751F] transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {profile?.twitter_url && (
                <a
                  href={profile.twitter_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter / X"
                  className="w-9 h-9 rounded-lg bg-[#141414] border border-[#252525] flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#FF751F] transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile?.behance_url && (
                <a
                  href={profile.behance_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Behance"
                  className="w-9 h-9 rounded-lg bg-[#141414] border border-[#252525] flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#FF751F] transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>

            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-[#FF751F] transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Dashboard Portal</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            &copy; {currentYear} {profile?.brand_name || 'VICTOR GRAPHICS'}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Designed for creative distinction.</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-neutral-400 hover:text-[#FF751F] transition-colors"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

