import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  ArrowUpRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '../common/Button';
import { sendMessage } from '../../lib/messageService';
import { useToast } from '../../context/ToastContext';

export function ContactSection({ profile }) {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    sender_name: '',
    sender_email: '',
    sender_phone: '',
    project_type: 'Brand Identity Design',
    message: ''
  });

  const projectTypes = [
    'Brand Identity Design',
    'Logo Design',
    'Poster Design',
    'Flyer Design',
    'Social Media Advertising',
    'Brochure Design',
    'Business Cards',
    'Digital Graphics',
    'Publication Design',
    'Other / Custom Project'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sender_name || !formData.sender_email || !formData.message) {
      error('Please complete all required fields (Name, Email, Message).');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendMessage(formData);
      setSubmitted(true);
      success('Thank you! Your inquiry has been sent to Victor Graphics.');
      setFormData({
        sender_name: '',
        sender_email: '',
        sender_phone: '',
        project_type: 'Brand Identity Design',
        message: ''
      });
    } catch (err) {
      error(err.message || 'Failed to send message. Please try again or use WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format WhatsApp Link
  const rawWhatsApp = profile?.whatsapp_number || '+254712345678';
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, '');
  const whatsAppUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    `Hello Victor, I visited Victor Graphics portfolio and would like to discuss a design project.`
  )}`;

  return (
    <section id="contact" className="py-24 bg-[#0a0a0a] border-t border-[#1c1c1c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171717] border border-[#252525] text-xs font-semibold text-[#FF751F] uppercase tracking-wider mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            Initiate Contact
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight">
            Let's Build Something <span className="text-[#FF751F]">Remarkable</span>.
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 font-sans mt-3 max-w-xl">
            Have a project in mind, an existing brand to reinvent, or a campaign to launch? Get in touch today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick Contact Card */}
            <div className="p-8 rounded-3xl bg-[#111111] border border-[#222222] space-y-6">
              <h3 className="font-heading font-bold text-xl text-white">
                Direct Channels
              </h3>

              <div className="space-y-4">
                {/* Email */}
                <a
                  href={`mailto:${profile?.email || 'victor@victorgraphics.com'}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#171717] border border-[#252525] hover:border-[#FF751F]/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#222222] flex items-center justify-center text-[#FF751F] group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400 font-medium">Email Inquiry</div>
                    <div className="text-sm font-semibold text-white group-hover:text-[#FF751F] transition-colors">
                      {profile?.email || 'victor@victorgraphics.com'}
                    </div>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href={`tel:${profile?.phone || '+254712345678'}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#171717] border border-[#252525] hover:border-[#FF751F]/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#222222] flex items-center justify-center text-[#FF751F] group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400 font-medium">Telephone</div>
                    <div className="text-sm font-semibold text-white group-hover:text-[#FF751F] transition-colors">
                      {profile?.phone || '+254 712 345 678'}
                    </div>
                  </div>
                </a>

                {/* WhatsApp Dedicated Button */}
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#25D366]/15 to-[#128C7E]/10 border border-[#25D366]/30 hover:border-[#25D366]/60 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#25D366] flex items-center justify-center text-white">
                      <MessageSquare className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <div className="text-xs text-[#25D366] font-semibold uppercase tracking-wider">
                        Instant WhatsApp Chat
                      </div>
                      <div className="text-sm font-bold text-white">
                        {rawWhatsApp}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-[#25D366] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </div>

              {/* Working Hours / Response Promise */}
              <div className="pt-4 border-t border-[#1e1e1e] flex items-center gap-2.5 text-xs text-neutral-400">
                <Clock className="w-4 h-4 text-[#FF751F]" />
                <span>Typical response time: within 4 - 12 hours.</span>
              </div>
            </div>

            {/* Social Channels */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222]">
              <h4 className="text-xs uppercase tracking-widest font-bold text-neutral-400 mb-4">
                Social Profiles & Portfolios
              </h4>
              <div className="flex flex-wrap gap-3">
                {profile?.instagram_url && (
                  <a
                    href={profile.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#171717] border border-[#262626] text-xs font-semibold text-neutral-300 hover:text-white hover:border-[#FF751F] transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-[#FF751F]" />
                    <span>Instagram</span>
                  </a>
                )}
                {profile?.facebook_url && (
                  <a
                    href={profile.facebook_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#171717] border border-[#262626] text-xs font-semibold text-neutral-300 hover:text-white hover:border-[#FF751F] transition-colors"
                  >
                    <Facebook className="w-4 h-4 text-[#FF751F]" />
                    <span>Facebook</span>
                  </a>
                )}
                {profile?.behance_url && (
                  <a
                    href={profile.behance_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#171717] border border-[#262626] text-xs font-semibold text-neutral-300 hover:text-white hover:border-[#FF751F] transition-colors"
                  >
                    <Globe className="w-4 h-4 text-[#FF751F]" />
                    <span>Behance</span>
                  </a>
                )}
                {profile?.twitter_url && (
                  <a
                    href={profile.twitter_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#171717] border border-[#262626] text-xs font-semibold text-neutral-300 hover:text-white hover:border-[#FF751F] transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-[#FF751F]" />
                    <span>Twitter</span>
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#111111] border border-[#252525] shadow-2xl relative">
              
              {submitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white">
                    Inquiry Received
                  </h3>
                  <p className="text-neutral-400 text-sm max-w-md mx-auto">
                    Thank you for reaching out to Victor Graphics. Victor will review your design requirements and get back to you promptly.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => setSubmitted(false)}
                    className="mt-4"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-xl font-heading font-bold text-white mb-2">
                    Send a Direct Brief
                  </h3>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                        Full Name <span className="text-[#FF751F]">*</span>
                      </label>
                      <input
                        type="text"
                        name="sender_name"
                        value={formData.sender_name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F] focus:ring-1 focus:ring-[#FF751F] transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                        Email Address <span className="text-[#FF751F]">*</span>
                      </label>
                      <input
                        type="email"
                        name="sender_email"
                        value={formData.sender_email}
                        onChange={handleChange}
                        required
                        placeholder="alex@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F] focus:ring-1 focus:ring-[#FF751F] transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone & Project Type Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        name="sender_phone"
                        value={formData.sender_phone}
                        onChange={handleChange}
                        placeholder="+254 700 000 000"
                        className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F] focus:ring-1 focus:ring-[#FF751F] transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                        Project Scope / Category
                      </label>
                      <select
                        id="project_type_select"
                        name="project_type"
                        value={formData.project_type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F] focus:ring-1 focus:ring-[#FF751F] transition-all"
                      >
                        {projectTypes.map((type) => (
                          <option key={type} value={type} className="bg-[#171717] text-white">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                      Project Details & Objectives <span className="text-[#FF751F]">*</span>
                    </label>
                    <textarea
                      id="message_textarea"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us about your brand, goals, target audience, timeline, and any specific deliverables needed..."
                      className="w-full px-4 py-3 rounded-xl bg-[#171717] border border-[#252525] text-white text-sm focus:outline-none focus:border-[#FF751F] focus:ring-1 focus:ring-[#FF751F] transition-all resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    isLoading={isSubmitting}
                    rightIcon={Send}
                    className="w-full"
                  >
                    Submit Project Request
                  </Button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

