// Realistic high quality portfolio demonstration data for VICTOR GRAPHICS

export const INITIAL_CATEGORIES = [
  { id: 'c0000001-0000-0000-0000-000000000001', name: 'Branding', slug: 'branding' },
  { id: 'c0000002-0000-0000-0000-000000000002', name: 'Logo Design', slug: 'logo-design' },
  { id: 'c0000003-0000-0000-0000-000000000003', name: 'Posters', slug: 'posters' },
  { id: 'c0000004-0000-0000-0000-000000000004', name: 'Advertising', slug: 'advertising' },
  { id: 'c0000005-0000-0000-0000-000000000005', name: 'Social Media Graphics', slug: 'social-media-graphics' },
  { id: 'c0000006-0000-0000-0000-000000000006', name: 'Print Design', slug: 'print-design' },
  { id: 'c0000007-0000-0000-0000-000000000007', name: 'Digital Artwork', slug: 'digital-artwork' },
  { id: 'c0000008-0000-0000-0000-000000000008', name: 'Other', slug: 'other' }
];

export const INITIAL_PROFILE = {
  id: 'p0000001-0000-0000-0000-000000000001',
  brand_name: 'VICTOR GRAPHICS',
  full_name: 'Victor Muiruri',
  tagline: 'Turning Ideas Into Powerful Visual Experiences.',
  biography: 'Creative director and lead visual designer at Victor Graphics. With over 7 years of relentless focus on brand identity, editorial craft, and commercial design, I transform ambitious concepts into enduring visual identities. Every project is approached with research, obsessive typographic precision, and a hunger to make brands stand out in saturated markets.',
  creative_philosophy: 'Great design is both aesthetic poetry and commercial architecture. It should stop scrolling thumbs, evoke emotional resonance, and solve business challenges with unmistakable clarity.',
  professional_experience: 'Over 7 years of specialized creative practice across corporate branding, high-end editorial publications, dynamic advertising campaigns, and experiential visual art.',
  skills: 'Brand Identity Design, Typography Systems, Logo Architecture, Poster & Billboard Art, Publication & Magazine Layout, Social Campaign Graphics, Packaging Design, Vector Illustration',
  design_software: 'Adobe Photoshop, Adobe Illustrator, Adobe InDesign, Figma, Adobe After Effects, Premiere Pro',
  profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
  email: 'victor@victorgraphics.com',
  phone: '+254 712 345 678',
  whatsapp_number: '+254712345678',
  instagram_url: 'https://instagram.com',
  facebook_url: 'https://facebook.com',
  twitter_url: 'https://x.com',
  behance_url: 'https://behance.net',
  dribbble_url: 'https://dribbble.com',
  linkedin_url: 'https://linkedin.com'
};

export const INITIAL_PROJECTS = [
  {
    id: 'proj-001',
    title: 'Aura Kinetic - Complete Brand Identity & Visual Guidelines',
    description: 'Comprehensive brand identity system created for Aura Kinetic, a next-generation smart sound technology company. We developed a distinctive geometric wordmark, custom typographic rhythm, dark-mode packaging system, and comprehensive 60-page brand guidelines.',
    category_id: 'c0000001-0000-0000-0000-000000000001',
    category_name: 'Branding',
    thumbnail_url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=85',
    file_url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1800&q=85',
    file_type: 'image',
    status: 'published',
    is_featured: true,
    tags: ['Branding', 'Typography', 'Visual Identity', 'Packaging'],
    client_name: 'Aura Kinetic Labs',
    created_at: '2026-01-15T10:00:00Z'
  },
  {
    id: 'proj-002',
    title: 'Vortex Audio - Minimalist Monogram & Emblem',
    description: 'An iconic monogram study combining precision sound waves with brutalist letterforms. Designed for luxury high-fidelity headphone brand Vortex, engineered to scale effortlessly from microscopic earbud laser-engravings to stadium-sized billboards.',
    category_id: 'c0000002-0000-0000-0000-000000000002',
    category_name: 'Logo Design',
    thumbnail_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=85',
    file_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1800&q=85',
    file_type: 'image',
    status: 'published',
    is_featured: true,
    tags: ['Logo Design', 'Minimalism', 'Vector', 'Symbol'],
    client_name: 'Vortex Audio Tech',
    created_at: '2026-01-28T14:30:00Z'
  },
  {
    id: 'proj-003',
    title: 'Nocturne Symphony - International Jazz Festival Poster Series',
    description: 'A striking tri-color screenprint poster series celebrating contemporary experimental jazz. Utilizing intense negative space, tactile risograph grain textures, and expressive typography that echoes improvisational rhythm.',
    category_id: 'c0000003-0000-0000-0000-000000000003',
    category_name: 'Posters',
    thumbnail_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
    file_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1800&q=85',
    file_type: 'image',
    status: 'published',
    is_featured: true,
    tags: ['Poster Design', 'Screenprint', 'Editorial', 'Typography'],
    client_name: 'Metropolis Arts Council',
    created_at: '2026-02-05T09:15:00Z'
  },
  {
    id: 'proj-004',
    title: 'Ignite Energy - High-Voltage Beverage Advertising Campaign',
    description: 'Dynamic outdoor and digital advertising campaign designed for Ignite Zero-Sugar Energy. Bold typography treatments, high-speed fluid simulations, and vivid orange contrast against deep obsidian black to stimulate sensory impact.',
    category_id: 'c0000004-0000-0000-0000-000000000004',
    category_name: 'Advertising',
    thumbnail_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=85',
    file_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1800&q=85',
    file_type: 'image',
    status: 'published',
    is_featured: false,
    tags: ['Advertising', 'Commercial', 'Campaign', 'Digital'],
    client_name: 'Ignite Beverage Corp',
    created_at: '2026-02-12T11:45:00Z'
  },
  {
    id: 'proj-005',
    title: 'Pulse Studio - 3D Motion Identity Showreel',
    description: 'Animated 3D identity sequence and brand reveal for Pulse Creative Studio. Demonstrates dynamic logo evolution, tactile materials, reflective liquid metals, and energetic transitions.',
    category_id: 'c0000007-0000-0000-0000-000000000007',
    category_name: 'Digital Artwork',
    thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=85',
    file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    file_type: 'video',
    status: 'published',
    is_featured: true,
    tags: ['Video', 'Motion Graphics', 'Showreel', '3D Design'],
    client_name: 'Pulse Studio',
    created_at: '2026-02-18T16:20:00Z'
  },
  {
    id: 'proj-006',
    title: 'Strata Architecture Annual - Editorial Monograph & PDF Publication',
    description: 'Curated 140-page architectural monograph celebrating brutalist and sustainable public structures across the globe. Features an asymmetric grid system, duplex fold covers, and rigorous typographic structure.',
    category_id: 'c0000006-0000-0000-0000-000000000006',
    category_name: 'Print Design',
    thumbnail_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=85',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_type: 'pdf',
    status: 'published',
    is_featured: false,
    tags: ['Editorial', 'PDF', 'Publication', 'Book Design'],
    client_name: 'Strata Architectural Forum',
    created_at: '2026-02-22T08:00:00Z'
  },
  {
    id: 'proj-007',
    title: 'Neon Horizon - Cyberpunk Social Media Campaign Kit',
    description: 'High-conversion carousel layouts, promotional story templates, and animated kinetic typography banners designed to drive pre-orders for an indie sci-fi game release.',
    category_id: 'c0000005-0000-0000-0000-000000000005',
    category_name: 'Social Media Graphics',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
    file_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1800&q=85',
    file_type: 'image',
    status: 'published',
    is_featured: false,
    tags: ['Social Media', 'Carousel', 'Instagram', 'Cyberpunk'],
    client_name: 'Horizon Interactive',
    created_at: '2026-02-25T13:10:00Z'
  },
  {
    id: 'proj-008',
    title: 'Chronos Horology - Luxury Corporate Stationery & Foil Cards',
    description: 'Tactile corporate print collateral utilizing 600gsm cotton card stock, micro-debossed metallic copper foil, and hand-gilded edges for an exclusive Swiss watchmaker.',
    category_id: 'c0000006-0000-0000-0000-000000000006',
    category_name: 'Print Design',
    thumbnail_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1200&q=85',
    file_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1800&q=85',
    file_type: 'image',
    status: 'published',
    is_featured: false,
    tags: ['Business Cards', 'Luxury Print', 'Foil Stamp', 'Stationery'],
    client_name: 'Chronos Geneve',
    created_at: '2026-03-01T10:40:00Z'
  }
];

export const INITIAL_SERVICES = [
  {
    id: 'serv-1',
    title: 'Logo Design',
    iconName: 'PenTool',
    shortDescription: 'Memorable, conceptually sharp marks engineered for longevity and versatility across all digital and physical mediums.'
  },
  {
    id: 'serv-2',
    title: 'Brand Identity Design',
    iconName: 'Palette',
    shortDescription: 'Comprehensive design systems including color theory, bespoke typography, guidelines, and distinctive brand assets.'
  },
  {
    id: 'serv-3',
    title: 'Poster Design',
    iconName: 'Image',
    shortDescription: 'Striking large-format promotional and art posters that command attention with bold layouts and compelling typography.'
  },
  {
    id: 'serv-4',
    title: 'Flyer Design',
    iconName: 'Layers',
    shortDescription: 'High-impact commercial flyers crafted to capture immediate interest, drive event attendance, and accelerate sales.'
  },
  {
    id: 'serv-5',
    title: 'Social Media Advertising',
    iconName: 'Share2',
    shortDescription: 'Scroll-stopping ad creatives, carousel layouts, and feed campaigns optimized for maximum engagement and conversion.'
  },
  {
    id: 'serv-6',
    title: 'Brochure Design',
    iconName: 'BookOpen',
    shortDescription: 'Sophisticated multi-page corporate and marketing brochures with structured storytelling and refined editorial polish.'
  },
  {
    id: 'serv-7',
    title: 'Business Cards',
    iconName: 'CreditCard',
    shortDescription: 'Tactile, premium business cards utilizing specialty print finishes, foil accents, and distinctive layouts.'
  },
  {
    id: 'serv-8',
    title: 'Digital Graphics',
    iconName: 'Monitor',
    shortDescription: 'Vector assets, web graphics, digital banners, and interactive presentation decks designed for modern screens.'
  },
  {
    id: 'serv-9',
    title: 'Publication Design',
    iconName: 'FileText',
    shortDescription: 'Magazine layouts, annual reports, ebooks, and editorial catalogues created with rigorous typographic discipline.'
  }
];

export const INITIAL_MESSAGES = [
  {
    id: 'msg-001',
    sender_name: 'Sarah Jenkins',
    sender_email: 'sarah.jenkins@zenithmedia.co',
    sender_phone: '+1 415 555 2891',
    project_type: 'Brand Identity Design',
    message: 'Hi Victor, we love your portfolio at Victor Graphics. We are rebranding our digital media firm and need a full identity overhaul, logo, brand book, and social collateral. Looking to kick off next month.',
    is_read: false,
    created_at: '2026-03-01T15:20:00Z'
  },
  {
    id: 'msg-002',
    sender_name: 'David Omondi',
    sender_email: 'david@safariafrik.com',
    sender_phone: '+254 722 109 876',
    project_type: 'Logo Design & Packaging',
    message: 'Hello Victor! We are launching an artisan organic coffee brand and need a unique logo and pouch packaging design. Could you send over your pricing and estimated timeline?',
    is_read: true,
    created_at: '2026-02-27T09:40:00Z'
  }
];

