-- ==============================================================================
-- VICTOR GRAPHICS - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PROFILES TABLE (Stores Victor Graphics brand & designer profile)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_name TEXT NOT NULL DEFAULT 'VICTOR GRAPHICS',
    full_name TEXT NOT NULL DEFAULT 'Victor Muiruri',
    tagline TEXT DEFAULT 'Turning Ideas Into Powerful Visual Experiences.',
    biography TEXT DEFAULT 'Passionate multidisciplinary graphic designer and brand identity specialist with over 7 years of professional experience crafting visually stunning, commercially compelling design systems for global brands and visionary startups.',
    creative_philosophy TEXT DEFAULT 'Design is not just what it looks like and feels like. Design is how it works and communicates. Every curve, font pairing, and color choice must tell an authentic story.',
    professional_experience TEXT DEFAULT '7+ Years of industry experience spanning branding agencies, high-growth tech startups, and independent creative direction.',
    skills TEXT DEFAULT 'Brand Strategy, Visual Identity, Editorial & Publication Design, Motion Graphics, Print Production, UI/UX Concepting, Packaging Design',
    design_software TEXT DEFAULT 'Adobe Photoshop, Adobe Illustrator, Adobe InDesign, Figma, After Effects, Premiere Pro, Blender',
    profile_image TEXT DEFAULT 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    email TEXT DEFAULT 'contact@victorgraphics.com',
    phone TEXT DEFAULT '+254 700 000 000',
    whatsapp_number TEXT DEFAULT '+254700000000',
    instagram_url TEXT DEFAULT 'https://instagram.com/victorgraphics',
    facebook_url TEXT DEFAULT 'https://facebook.com/victorgraphics',
    twitter_url TEXT DEFAULT 'https://x.com/victorgraphics',
    behance_url TEXT DEFAULT 'https://behance.net/victorgraphics',
    dribbble_url TEXT DEFAULT 'https://dribbble.com/victorgraphics',
    linkedin_url TEXT DEFAULT 'https://linkedin.com/in/victorgraphics',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
    thumbnail_url TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'pdf')),
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    client_name TEXT,
    completion_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. MESSAGES TABLE (Contact form inquiries)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    sender_phone TEXT,
    project_type TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- CATEGORIES POLICIES
-- Anyone can view categories
CREATE POLICY "Public categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);

-- Only authenticated users (admins) can modify categories
CREATE POLICY "Only admins can insert categories" 
ON public.categories FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Only admins can update categories" 
ON public.categories FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Only admins can delete categories" 
ON public.categories FOR DELETE TO authenticated USING (true);


-- PROFILES POLICIES
-- Anyone can view public profile details
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

-- Only authenticated admins can update profile
CREATE POLICY "Only admins can insert profiles" 
ON public.profiles FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Only admins can update profiles" 
ON public.profiles FOR UPDATE TO authenticated USING (true);


-- PROJECTS POLICIES
-- Public visitors can only view published projects
CREATE POLICY "Public visitors can only view published projects" 
ON public.projects FOR SELECT USING (
    status = 'published' OR (auth.role() = 'authenticated')
);

-- Authenticated admins can insert projects
CREATE POLICY "Admins can insert projects" 
ON public.projects FOR INSERT TO authenticated WITH CHECK (true);

-- Authenticated admins can update projects
CREATE POLICY "Admins can update projects" 
ON public.projects FOR UPDATE TO authenticated USING (true);

-- Authenticated admins can delete projects
CREATE POLICY "Admins can delete projects" 
ON public.projects FOR DELETE TO authenticated USING (true);


-- MESSAGES POLICIES
-- Anyone can insert a contact inquiry (with reasonable rate limiting in app)
CREATE POLICY "Anyone can submit contact message" 
ON public.messages FOR INSERT WITH CHECK (
    length(sender_name) > 0 AND length(sender_email) > 0 AND length(message) > 0
);

-- Only authenticated admins can read, update, or delete messages
CREATE POLICY "Only admins can view messages" 
ON public.messages FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can update messages" 
ON public.messages FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Only admins can delete messages" 
ON public.messages FOR DELETE TO authenticated USING (true);

-- ==============================================================================
-- STORAGE CONFIGURATION
-- ==============================================================================
-- Note: Create a public storage bucket named 'portfolio' in Supabase Dashboard -> Storage
-- Below are the SQL commands if supported by your Supabase setup:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read from portfolio bucket
CREATE POLICY "Public Access To Portfolio Storage" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'portfolio');

-- Authenticated users (admin) can upload to portfolio bucket
CREATE POLICY "Admins can upload to portfolio storage" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Admins can update portfolio storage" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'portfolio');

CREATE POLICY "Admins can delete from portfolio storage" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'portfolio');

-- ==============================================================================
-- SEED INITIAL DATA
-- ==============================================================================

-- Seed Categories
INSERT INTO public.categories (id, name, slug) VALUES
    ('c0000001-0000-0000-0000-000000000001', 'Branding', 'branding'),
    ('c0000002-0000-0000-0000-000000000002', 'Logo Design', 'logo-design'),
    ('c0000003-0000-0000-0000-000000000003', 'Posters', 'posters'),
    ('c0000004-0000-0000-0000-000000000004', 'Advertising', 'advertising'),
    ('c0000005-0000-0000-0000-000000000005', 'Social Media Graphics', 'social-media-graphics'),
    ('c0000006-0000-0000-0000-000000000006', 'Print Design', 'print-design'),
    ('c0000007-0000-0000-0000-000000000007', 'Digital Artwork', 'digital-artwork'),
    ('c0000008-0000-0000-0000-000000000008', 'Other', 'other')
ON CONFLICT (slug) DO NOTHING;

-- Seed Default Profile
INSERT INTO public.profiles (
    id, brand_name, full_name, tagline, biography, creative_philosophy,
    professional_experience, skills, design_software,
    profile_image, email, phone, whatsapp_number,
    instagram_url, facebook_url, twitter_url, behance_url, dribbble_url, linkedin_url
) VALUES (
    'p0000001-0000-0000-0000-000000000001',
    'VICTOR GRAPHICS',
    'Victor Muiruri',
    'Turning Ideas Into Powerful Visual Experiences.',
    'Senior multidisciplinary graphic designer and brand identity architect with over 7 years of professional experience crafting bold visual systems, memorable brand identities, and high-impact digital graphics for visionary companies worldwide.',
    'I believe that great design lives at the intersection of aesthetic boldness and commercial purpose. It shouldn''t merely look attractive—it must communicate emotion, solve friction, and command instant recognition.',
    'Over 7 years of specialized creative work leading brand identity revamps, advertising rollouts, editorial publications, and high-conversion social campaigns across Africa, Europe, and the Americas.',
    'Brand Identity Design, Typography Systems, Logo Architecture, Poster & Billboard Advertising, Publication Design, Editorial Layout, Social Media Visual Strategy, Motion Concepts, Package Design',
    'Adobe Illustrator, Adobe Photoshop, Adobe InDesign, Figma, After Effects, Premiere Pro',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    'victor@victorgraphics.com',
    '+254 712 345 678',
    '+254712345678',
    'https://instagram.com',
    'https://facebook.com',
    'https://x.com',
    'https://behance.net',
    'https://dribbble.com',
    'https://linkedin.com'
) ON CONFLICT (id) DO NOTHING;

