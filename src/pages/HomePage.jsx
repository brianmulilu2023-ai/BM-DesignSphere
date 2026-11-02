import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { HeroSection } from '../components/public/HeroSection';
import { AboutSection } from '../components/public/AboutSection';
import { ServicesSection } from '../components/public/ServicesSection';
import { PortfolioSection } from '../components/public/PortfolioSection';
import { ContactSection } from '../components/public/ContactSection';
import { fetchProfile } from '../lib/profileService';
import { fetchCategories } from '../lib/categoryService';
import { fetchProjects } from '../lib/portfolioService';

export function HomePage() {
  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profData, catData, projData] = await Promise.all([
          fetchProfile(),
          fetchCategories(),
          fetchProjects({ status: 'published' })
        ]);
        setProfile(profData);
        setCategories(catData || []);
        setProjects(projData || []);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col font-sans selection:bg-[#FF751F] selection:text-white">
      {/* Top Navbar */}
      <Navbar profile={profile} />

      {/* Main Sections */}
      <main className="flex-1">
        <HeroSection profile={profile} />
        <PortfolioSection projects={projects} categories={categories} />
        <AboutSection profile={profile} />
        <ServicesSection />
        <ContactSection profile={profile} />
      </main>

      {/* Footer */}
      <Footer profile={profile} />
    </div>
  );
}

