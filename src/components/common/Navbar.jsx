import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Shield } from 'lucide-react';
import { Button } from './Button';

export function Navbar({ profile }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', href: '#portfolio' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e, href) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      // Let standard link navigate to /#hash
      return;
    }
    e.preventDefault();
    const elem = document.querySelector(href);
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
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080808]/90 backdrop-blur-md border-b border-[#252525] py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-[#111] border border-[#252525] flex items-center justify-center group-hover:border-[#FF751F] transition-colors">
            <span className="font-heading font-extrabold text-lg text-white">
              V<span className="text-[#FF751F]">G</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-lg sm:text-xl tracking-wider text-white">
              {profile?.brand_name || 'VICTOR GRAPHICS'}
            </span>
            <span className="text-[10px] tracking-widest uppercase text-neutral-400 font-medium">
              Studio & Portfolio
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-neutral-300 hover:text-white transition-colors relative py-1 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF751F] transition-all duration-200 group-hover:w-full" />
            </a>
          ))}

          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-[#FF751F] transition-colors py-1 px-2.5 rounded-lg border border-[#252525] hover:border-[#FF751F]/40"
            title="Admin Portal"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            <Button size="md" rightIcon={ArrowUpRight}>
              Let's Talk
            </Button>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/admin"
            className="p-2 text-neutral-400 hover:text-[#FF751F] rounded-lg border border-[#252525]"
            title="Admin"
          >
            <Shield className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-neutral-300 hover:text-white bg-[#111111] border border-[#252525] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e0e0e] border-b border-[#252525] px-6 py-6 animate-slide-up">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-base font-semibold text-neutral-200 hover:text-[#FF751F] py-2 border-b border-[#1c1c1c] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-base font-semibold text-neutral-400 hover:text-[#FF751F] py-2 border-b border-[#1c1c1c]"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
            <div className="pt-2">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="block w-full"
              >
                <Button size="lg" className="w-full" rightIcon={ArrowUpRight}>
                  Let's Work Together
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

