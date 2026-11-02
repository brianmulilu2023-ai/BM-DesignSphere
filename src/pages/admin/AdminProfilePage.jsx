import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  User,
  Save,
  Upload,
  Sparkles,
  Phone,
  Mail,
  MessageSquare,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Cpu,
  Award
} from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { fetchProfile, updateProfile } from '../../lib/profileService';
import { uploadPortfolioFile } from '../../lib/storageService';

export function AdminProfilePage() {
  const { setSidebarOpen } = useOutletContext();
  const { success, error } = useToast();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);

  const [profile, setProfile] = useState({
    brand_name: 'VICTOR GRAPHICS',
    full_name: 'Victor Muiruri',
    tagline: 'Turning Ideas Into Powerful Visual Experiences.',
    biography: '',
    creative_philosophy: '',
    professional_experience: '',
    skills: '',
    design_software: '',
    profile_image: '',
    email: '',
    phone: '',
    whatsapp_number: '',
    instagram_url: '',
    facebook_url: '',
    twitter_url: '',
    behance_url: '',
    dribbble_url: '',
    linkedin_url: ''
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProfile();
        if (data) {
          setProfile({
            brand_name: data.brand_name || 'VICTOR GRAPHICS',
            full_name: data.full_name || 'Victor Muiruri',
            tagline: data.tagline || 'Turning Ideas Into Powerful Visual Experiences.',
            biography: data.biography || '',
            creative_philosophy: data.creative_philosophy || '',
            professional_experience: data.professional_experience || '',
            skills: Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || ''),
            design_software: Array.isArray(data.design_software) ? data.design_software.join(', ') : (data.design_software || ''),
            profile_image: data.profile_image || '',
            email: data.email || '',
            phone: data.phone || '',
            whatsapp_number: data.whatsapp_number || '',
            instagram_url: data.instagram_url || '',
            facebook_url: data.facebook_url || '',
            twitter_url: data.twitter_url || '',
            behance_url: data.behance_url || '',
            dribbble_url: data.dribbble_url || '',
            linkedin_url: data.linkedin_url || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setProfileImageFile(file);
    setProfile((prev) => ({
      ...prev,
      profile_image: URL.createObjectURL(file)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalImgUrl = profile.profile_image;
      if (profileImageFile) {
        const res = await uploadPortfolioFile(profileImageFile, 'profile');
        finalImgUrl = res.url;
      }

      const payload = {
        ...profile,
        profile_image: finalImgUrl
      };

      await updateProfile(payload);
      success('Profile & studio details updated successfully.');
    } catch (err) {
      error(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <AdminHeader
        onMenuClick={() => setSidebarOpen(true)}
        title="Profile & Studio Information"
        subtitle="Manage designer biography, philosophy, contact channels, and social links."
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Top Save Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <p className="text-xs text-neutral-400">
            Changes saved here are instantly reflected across the public website.
          </p>
          <Button
            type="submit"
            size="md"
            isLoading={isSaving}
            leftIcon={Save}
          >
            Save Profile Updates
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Brand & Bio */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Identity & Core Info */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-400">
                Brand & Personal Identity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Studio Brand Name
                  </label>
                  <input
                    type="text"
                    name="brand_name"
                    value={profile.brand_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Designer Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F]"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Brand Slogan / Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={profile.tagline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F]"
                />
              </div>

              {/* Biography */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Biography & Background
                </label>
                <textarea
                  name="biography"
                  rows={4}
                  value={profile.biography}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F] resize-none"
                />
              </div>

              {/* Creative Philosophy */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Creative Philosophy
                </label>
                <textarea
                  name="creative_philosophy"
                  rows={3}
                  value={profile.creative_philosophy}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F] resize-none"
                />
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Professional Experience Summary
                </label>
                <input
                  type="text"
                  name="professional_experience"
                  value={profile.professional_experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F]"
                />
              </div>
            </div>

            {/* Skills & Software */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-400">
                Skills & Design Software
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Core Skills (comma separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                  placeholder="Brand Strategy, Visual Identity, Editorial Design, Motion Graphics..."
                  className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Design Software & Tools (comma separated)
                </label>
                <input
                  type="text"
                  name="design_software"
                  value={profile.design_software}
                  onChange={handleChange}
                  placeholder="Adobe Illustrator, Photoshop, InDesign, Figma, After Effects..."
                  className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F]"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Photo & Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Profile Picture Box */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-400">
                Profile Portrait
              </h3>

              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-2xl bg-[#181818] border border-[#262626] overflow-hidden flex-shrink-0">
                  {profile.profile_image ? (
                    <img
                      src={profile.profile_image}
                      alt={profile.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500">
                      <User className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#171717] border border-[#282828] text-xs font-semibold text-neutral-300 hover:text-white cursor-pointer hover:border-[#FF751F] transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-neutral-400">
                    Recommended: 800x1000px high-contrast portrait
                  </p>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-[11px] text-neutral-400 uppercase tracking-wider">
                  Or Image URL:
                </label>
                <input
                  type="url"
                  name="profile_image"
                  value={profile.profile_image}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-[#171717] border border-[#252525] text-xs text-white focus:outline-none focus:border-[#FF751F]"
                />
              </div>
            </div>

            {/* Direct Contact Channels */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-400">
                Contact & Communication Channels
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#FF751F]" />
                  Contact Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#252525] text-white text-xs focus:outline-none focus:border-[#FF751F]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#FF751F]" />
                  Telephone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#252525] text-white text-xs focus:outline-none focus:border-[#FF751F]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  WhatsApp Direct Number (with Country Code)
                </label>
                <input
                  type="text"
                  name="whatsapp_number"
                  value={profile.whatsapp_number}
                  onChange={handleChange}
                  placeholder="+254700000000"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#252525] text-white text-xs focus:outline-none focus:border-[#FF751F]"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-400">
                Social Links & Profiles
              </h3>

              <div className="space-y-3">
                <input
                  type="url"
                  name="instagram_url"
                  value={profile.instagram_url}
                  onChange={handleChange}
                  placeholder="Instagram URL"
                  className="w-full px-3 py-2 rounded-lg bg-[#171717] border border-[#252525] text-xs text-white focus:outline-none focus:border-[#FF751F]"
                />
                <input
                  type="url"
                  name="facebook_url"
                  value={profile.facebook_url}
                  onChange={handleChange}
                  placeholder="Facebook URL"
                  className="w-full px-3 py-2 rounded-lg bg-[#171717] border border-[#252525] text-xs text-white focus:outline-none focus:border-[#FF751F]"
                />
                <input
                  type="url"
                  name="twitter_url"
                  value={profile.twitter_url}
                  onChange={handleChange}
                  placeholder="Twitter / X URL"
                  className="w-full px-3 py-2 rounded-lg bg-[#171717] border border-[#252525] text-xs text-white focus:outline-none focus:border-[#FF751F]"
                />
                <input
                  type="url"
                  name="behance_url"
                  value={profile.behance_url}
                  onChange={handleChange}
                  placeholder="Behance URL"
                  className="w-full px-3 py-2 rounded-lg bg-[#171717] border border-[#252525] text-xs text-white focus:outline-none focus:border-[#FF751F]"
                />
              </div>
            </div>

          </div>

        </div>

      </form>
    </div>
  );
}

