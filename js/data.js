/**
 * VERVE Creator Economy Platform - Data Layer & Persistence
 * Manages seed data, schema definitions, and localStorage synchronization.
 */

const STORAGE_KEYS = {
  CREATORS: 'verve_creators_v1',
  POSTS: 'verve_posts_v1',
  DEALS: 'verve_deals_v1',
  TRANSACTIONS: 'verve_transactions_v1',
  ACTIVE_ROLE: 'verve_active_role_v1',
  ACTIVE_CREATOR_ID: 'verve_active_creator_id_v1',
  SAVED_CREATORS: 'verve_saved_creators_v1'
};

const DEFAULT_CREATORS = [{
  id: 'creator_1',
  name: 'Elena Vance',
  handle: '@elenavance',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  tagline: 'Tech & Lifestyle UGC Specialist | High-converting 4K vertical video',
  bio: 'Award-winning digital creator and commercial storyteller. I help consumer tech, productivity apps, and modern lifestyle brands turn viewers into lifelong customers through authentic, cinematic short-form content.',
  location: 'San Francisco, CA & Remote',
  rating: 4.96,
  reviewCount: 42,
  startingRate: 350,
  isOpenForHires: true,
  stats: {
    followers: '520K',
    totalImpressions: '38.5M',
    avgEngagement: '5.8%',
    completedDeals: 64
  },
  socials: {
    tiktok: '280k',
    instagram: '160k',
    youtube: '80k'
  },
  badges: ['Top Rated Pro', 'Fast Delivery 48h', 'Commercial Verified'],
  niches: ['Tech & AI', 'Lifestyle', 'Productivity'],
  services: [
    {
      id: 'srv_1',
      title: 'Quick UGC Hook Video (30-60s)',
      deliveryDays: 3,
      revisions: 2,
      price: 350,
      description: '1x 4K vertical short optimized for TikTok & Reels. Includes 2 hook variations, high-energy edits, captions, and commercial sound licensing.',
      features: ['2 High-converting hooks', 'Full 4K vertical editing', 'Native caption overlay', '14-day ad usage rights']
    },
    {
      id: 'srv_2',
      title: 'Multi-Platform Growth Bundle',
      deliveryDays: 5,
      revisions: 3,
      price: 850,
      popular: true,
      description: '2x High-converting short-form videos + 5 high-res lifestyle product photography stills for organic and paid ad creative.',
      features: ['2x 4K Vertical Videos (30-60s)', '5 High-Res Product Photos (RAW + Color Graded)', 'Raw B-roll library included', '30-day Spark Ads authorization', 'Scriptwriting & concept development']
    },
    {
      id: 'srv_3',
      title: 'Full 360° Brand Product Launch',
      deliveryDays: 10,
      revisions: 'Unlimited',
      price: 1650,
      description: 'Comprehensive campaign creative package: 1 long-form review (YouTube), 3 vertical reels, 10 photo assets, and 90-day global digital usage rights.',
      features: ['1x In-depth YouTube integration (4-8 min)', '3x Multi-hook TikTok / Reels creatives', '10 Studio-grade product stills', '90-day whitelisting & Spark Ads rights', 'A/B testing hooks and CTA scripts']
    }
  ],
  portfolio: [
    {
      id: 'port_1',
      title: 'Nordic Sound ANC Wireless Earbuds',
      client: 'Nordic Sound Labs',
      category: 'UGC Video',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      metrics: { views: '1.8M', ctr: '6.4%', roas: '4.2x' },
      description: 'Created 3 vertical video concepts highlighting ANC noise cancellation in noisy city commutes. The top-performing asset generated $180k in attributed sales within 21 days.',
      tags: ['Consumer Tech', 'Paid Ads', '4K Vertical']
    },
    {
      id: 'port_2',
      title: 'Aura Minimalist Ergonomic Desk Setup',
      client: 'Aura Studio',
      category: 'Photography',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
      metrics: { views: '840K', ctr: '4.9%', roas: '3.8x' },
      description: 'Curated editorial photo series and aesthetic desk setup reel demonstrating cable management and ambient smart lighting features.',
      tags: ['Productivity', 'Design', 'Organic Viral']
    },
    {
      id: 'port_3',
      title: 'Nova AI Productivity Copilot Launch',
      client: 'Nova Systems',
      category: 'Sponsored Reels',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      metrics: { views: '2.4M', ctr: '8.1%', roas: '5.6x' },
      description: 'Interactive screen demonstration and relatable comedic skit showing how Nova AI automates 10 hours of manual spreadsheet work every week.',
      tags: ['B2B SaaS', 'Viral Skit', 'Conversion']
    }
  ],
  reviews: [
    {
      brand: 'Lumina Tech Labs',
      author: 'Marcus Vance, VP Marketing',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Elena delivered above and beyond. Her hooks converted at 2.4x our benchmark within the first 48 hours of our ad spend.'
    },
    {
      brand: 'Nova Audio Co.',
      author: 'Sarah Jenkins, Brand Lead',
      rating: 5,
      date: '1 month ago',
      comment: 'Super fast turnaround, pristine 4K video quality, and communicative every step of the way. Rebooking her for our Q4 push!'
    }
  ]
},
{
  id: 'creator_2',
  name: 'Marco Silva',
  handle: '@marcosilvafilms',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
  tagline: 'Cinematic Travel, Outdoor Gear & Commercial Director',
  bio: 'Passionate outdoor filmmaker combining cinema-grade color grading with breathtaking nature visuals. Specializing in high-end automotive, adventure gear, and apparel campaigns.',
  location: 'Denver, CO & Worldwide',
  rating: 4.98,
  reviewCount: 38,
  startingRate: 600,
  isOpenForHires: true,
  stats: {
    followers: '340K',
    totalImpressions: '24.1M',
    avgEngagement: '6.4%',
    completedDeals: 47
  },
  socials: {
    tiktok: '140k',
    instagram: '150k',
    youtube: '50k'
  },
  badges: ['Pro Director', '4K Cinema Drone', 'Global Traveler'],
  niches: ['Lifestyle', 'Fitness & Wellness', 'Tech & AI'],
  services: [
    {
      id: 'srv_201',
      title: 'Cinematic Product Reel (4K Drone + Cinema)',
      deliveryDays: 7,
      revisions: 2,
      price: 650,
      description: 'Epic outdoor environment shoot featuring your product with RED camera color grade, cinematic sound design, and drone landscape shots.',
      features: ['4K Cinema Camera + FPV Drone', 'Sound Design & Custom SFX', 'Color graded in DaVinci Resolve', 'Commercial perpetual license']
    },
    {
      id: 'srv_202',
      title: 'Multi-Episode Adventure Campaign',
      deliveryDays: 14,
      revisions: 3,
      price: 1800,
      popular: true,
      description: 'Complete 3-part micro docu-series highlighting brand ethos, product durability in extreme conditions, and lifestyle appeal.',
      features: ['3x Cinematic 60s Videos', '8 High-End Editorial Stills', 'Full BTS Footage Reel', 'Spark Ads Whitelisting Rights']
    }
  ],
  portfolio: [
    {
      id: 'port_201',
      title: 'Alpine Peak Waterproof Jacket Expedition',
      client: 'Kailas Outdoor',
      category: 'Cinematic Video',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      metrics: { views: '1.4M', ctr: '5.2%', roas: '3.9x' },
      description: 'Shot in the Swiss Alps during snow storms to demonstrate fabric waterproofing and breathability in real mountaineering conditions.',
      tags: ['Outdoor Gear', 'Cinematic', 'Drone']
    },
    {
      id: 'port_202',
      title: 'Terra Trek Electric Overlander Commercial',
      client: 'Terra EV',
      category: 'Cinematic Video',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      metrics: { views: '2.9M', ctr: '7.3%', roas: '4.8x' },
      description: 'High-octane desert trail commercial showcasing dual motors, suspension dynamics, and solar charging capabilities.',
      tags: ['Automotive', 'Adventure', '4K HDR']
    }
  ],
  reviews: [
    {
      brand: 'Kailas Outdoor',
      author: 'Dmitri Rostov, CMO',
      rating: 5,
      date: '3 weeks ago',
      comment: 'The visual fidelity Marco achieves is Hollywood-tier. Our campaign broke historical engagement records.'
    }
  ]
},
{
  id: 'creator_3',
  name: 'Aaliyah Patel',
  handle: '@aaliyahglows',
  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  coverImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
  tagline: 'Clean Beauty, Skincare Chemist & Editorial Aesthetician',
  bio: 'Biochemistry graduate turned beauty creator. I break down ingredients, scientific efficacy, and luxury aesthetic routines with transparent, unfiltered reviews.',
  location: 'New York, NY',
  rating: 4.95,
  reviewCount: 51,
  startingRate: 450,
  isOpenForHires: true,
  stats: {
    followers: '780K',
    totalImpressions: '52.0M',
    avgEngagement: '7.2%',
    completedDeals: 82
  },
  socials: {
    tiktok: '450k',
    instagram: '260k',
    youtube: '70k'
  },
  badges: ['Beauty Expert', 'Science-Backed', 'Sephora Squad'],
  niches: ['Fashion & Beauty', 'Lifestyle', 'Fitness & Wellness'],
  services: [
    {
      id: 'srv_301',
      title: 'Ingredient Breakdown & GRWM Routine',
      deliveryDays: 4,
      revisions: 2,
      price: 450,
      description: 'In-depth TikTok/Reel analyzing active ingredients, texture shots, application demo, and honest wear test.',
      features: ['Macro 4K texture shots', 'Science-backed ingredient explanation', 'Natural lighting skin wear test', 'Dedicated story shoutout']
    },
    {
      id: 'srv_302',
      title: 'Hero Skincare Launch + Sephora Whitelist',
      deliveryDays: 7,
      revisions: 3,
      price: 1200,
      popular: true,
      description: 'Comprehensive campaign package with organic post, 3 ad variations, product photography, and 60 days ad rights.',
      features: ['1 Organic Main Feed Post', '3 High-Hook Paid Ad Iterations', '6 Editorial Stills', '60-day Paid Ads Whitelisting']
    }
  ],
  portfolio: [
    {
      id: 'port_301',
      title: 'Botanica Barrier Repair Peptide Serum',
      client: 'Botanica Skincare',
      category: 'UGC Video',
      image: 'https://images.unsplash.com/photo-1608248597359-0524458b6883?auto=format&fit=crop&w=800&q=80',
      metrics: { views: '3.1M', ctr: '8.9%', roas: '6.2x' },
      description: 'Microscope active ingredient demo explaining ceramide replenishment. Sold out the product inventory across 18 retail stores.',
      tags: ['Clean Beauty', 'Skincare', 'Conversion Engine']
    }
  ],
  reviews: [
    {
      brand: 'Botanica Labs',
      author: 'Claire Dupont',
      rating: 5,
      date: '1 month ago',
      comment: 'Aaliyah’s authenticity is unmatched. Her audience trusts her deeply, and our ROI reflected that from day one.'
    }
  ]
},
{
  id: 'creator_4',
  name: 'Jin Woo',
  handle: '@jinwoo3d',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  tagline: '3D Motion Design & Futuristic Product Visualization',
  bio: 'Cinema4D & Octane artist crafting surreal, hyper-realistic product animations and kinetic typography loops for high-growth tech brands and web3 projects.',
  location: 'Tokyo & Remote',
  rating: 4.99,
  reviewCount: 29,
  startingRate: 750,
  isOpenForHires: true,
  stats: {
    followers: '210K',
    totalImpressions: '18.2M',
    avgEngagement: '8.4%',
    completedDeals: 35
  },
  socials: {
    tiktok: '85k',
    instagram: '95k',
    youtube: '30k'
  },
  badges: ['3D Wizard', 'Motion Awardee', 'Houdini Certified'],
  niches: ['Gaming & 3D', 'Tech & AI', 'Design'],
  services: [
    {
      id: 'srv_401',
      title: 'Seamless 3D Product Exploded Loop (15s)',
      deliveryDays: 8,
      revisions: 3,
      price: 750,
      description: 'Custom 3D CAD model rendering with dynamic lighting, exploded view of internal hardware, and hyper-smooth 60fps physics.',
      features: ['High-poly 3D modeling/texturing', 'Exploded component animation', '4K 60fps export in ProRes & MP4', 'Sound design synched to motion']
    }
  ],
  portfolio: [
    {
      id: 'port_401',
      title: 'AeroZero Titanium Mechanical Watch 3D',
      client: 'Aero Chrono',
      category: '3D/Design',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      metrics: { views: '1.2M', ctr: '9.4%', roas: '5.1x' },
      description: 'Microscopic 3D escapement animation and liquid titanium casing morphing into the finished timepiece.',
      tags: ['Cinema4D', 'Octane Render', 'Luxury Tech']
    }
  ],
  reviews: [
    {
      brand: 'Aero Chrono',
      author: 'Kenji Sato, Design Director',
      rating: 5,
      date: '2 months ago',
      comment: 'Jin’s 3D renders look more real than the physical prototype itself. A true master of digital motion.'
    }
  ]
},
{
  id: 'creator_5',
  name: 'Chloe Bennet',
  handle: '@chloefitwellness',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
  tagline: 'Holistic Strength, Biohacking & Athletic Performance',
  bio: 'Kinesiology specialist and hybrid athlete helping functional beverage, smart wearables, and wellness brands craft authentic evidence-based content.',
  location: 'Austin, TX',
  rating: 4.93,
  reviewCount: 34,
  startingRate: 400,
  isOpenForHires: true,
  stats: {
    followers: '430K',
    totalImpressions: '29.3M',
    avgEngagement: '6.1%',
    completedDeals: 52
  },
  socials: {
    tiktok: '240k',
    instagram: '140k',
    youtube: '50k'
  },
  badges: ['Certified Coach', 'High Energy', 'Athletic Model'],
  niches: ['Fitness & Wellness', 'Lifestyle', 'Tech & AI'],
  services: [
    {
      id: 'srv_501',
      title: 'Workout Integration + Performance Review',
      deliveryDays: 4,
      revisions: 2,
      price: 400,
      description: 'High-energy gym or outdoor workout video incorporating your energy drink, fitness wearable, or athletic apparel in action.',
      features: ['Real sweat & training performance', 'Bio-metric stats overlay', 'Product discount code callout', 'Cross-posted to IG Stories']
    }
  ],
  portfolio: [
    {
      id: 'port_501',
      title: 'PulseHydrate Electrolyte 30-Day Protocol',
      client: 'Pulse Fuel',
      category: 'UGC Video',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      metrics: { views: '1.9M', ctr: '7.8%', roas: '4.4x' },
      description: 'Real training day vlog highlighting cramp prevention and VO2 max improvement with PulseHydrate.',
      tags: ['Athletic Performance', 'Supplements', 'TikTok Viral']
    }
  ],
  reviews: [
    {
      brand: 'Pulse Fuel',
      author: 'Tyler Ross, Growth Lead',
      rating: 5,
      date: '3 weeks ago',
      comment: 'Authentic energy and incredible sales velocity. We saw a 38% bump in DTC subscriptions.'
    }
  ]
}
];

const DEFAULT_POSTS = [
  {
    id: 'post_101',
    creatorId: 'creator_1',
    creatorName: 'Elena Vance',
    creatorHandle: '@elenavance',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    timestamp: '2 hours ago',
    badge: 'Creator Drop',
    title: 'How we hit 1.8M views with a $350 UGC Video: Full Breakdown 🎬',
    content: 'A lot of brands think UGC needs to look low-effort to be authentic. Here is the framework we tested with Nordic Sound that beat their previous agency ads by 420% in ROAS:\n\n1. The 1.2-second visceral audio hook (cutting directly to high-gain street noise vs silence when ANC toggles).\n2. Problem agitation: dropping the subway commute pain point.\n3. Micro-pacing: cut every 1.4 seconds with zero dead air.\n\nSwipe through the raw timeline and lighting setup! 👇',
    mediaUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
    mediaType: 'image',
    tags: ['UGCStrategy', 'BrandGrowth', 'BehindTheScenes'],
    likes: 342,
    tipsCount: 18,
    tipsAmount: 245,
    isLiked: false,
    isLocked: false,
    unlockPrice: 0,
    isUnlocked: true,
    comments: [
      { id: 'c_1', user: 'Lumina Creative', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', text: 'That audio transition trick was genius. Immediate hook.', time: '1h ago' },
      { id: 'c_2', user: 'Apex Brands', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80', text: 'Just sent you a proposal for our upcoming wireless mic launch Elena! 🚀', time: '35m ago' }
    ]
  },
  {
    id: 'post_102',
    creatorId: 'creator_1',
    creatorName: 'Elena Vance',
    creatorHandle: '@elenavance',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    timestamp: '1 day ago',
    badge: 'Exclusive Asset',
    title: '🔒 2026 High-Converting UGC Notion Script Templates + DaVinci PowerGrades',
    content: 'My private workspace template including 12 tested hook formulas, client onboarding brief sheets, and my 4K DaVinci Resolve color grade LUT pack used across all my tech campaigns. Unlock to download the project files directly!',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    mediaType: 'image',
    tags: ['CreatorToolkit', 'NotionTemplates', 'LUTs'],
    likes: 518,
    tipsCount: 42,
    tipsAmount: 420,
    isLiked: true,
    isLocked: true,
    unlockPrice: 15,
    isUnlocked: false,
    comments: [
      { id: 'c_3', user: 'VideoPro_Sam', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=100&q=80', text: 'Unlocked this morning — the contract templates alone saved me thousands.', time: '14h ago' }
    ]
  },
  {
    id: 'post_103',
    creatorId: 'creator_2',
    creatorName: 'Marco Silva',
    creatorHandle: '@marcosilvafilms',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    timestamp: '2 days ago',
    badge: 'Commercial Reel',
    title: 'Surviving -14°C in the Rockies: New Kailas Winter Campaign Preview ❄️',
    content: 'Behind the scenes of our 4-day backcountry trek for the Kailas waterproof jacket campaign. Tested drone battery thermal heaters, rigged custom gimbal rain jackets, and captured 100% natural lighting. Brand was thrilled with the final cut.',
    mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    mediaType: 'image',
    tags: ['CinematicFilmmaking', 'OutdoorGear', 'Kailas'],
    likes: 890,
    tipsCount: 31,
    tipsAmount: 390,
    isLiked: false,
    isLocked: false,
    unlockPrice: 0,
    isUnlocked: true,
    comments: [
      { id: 'c_4', user: 'North Peak Co', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', text: 'Incredible cinematography as always Marco! Looking forward to collaborating.', time: '1d ago' }
    ]
  },
  {
    id: 'post_104',
    creatorId: 'creator_4',
    creatorName: 'Jin Woo',
    creatorHandle: '@jinwoo3d',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    timestamp: '3 days ago',
    badge: '3D Render',
    title: 'Cybernetic Watch Mechanism Animation - Cinema4D & Redshift breakdown',
    content: 'Exploring mechanical tolerances and refraction shaders for modern luxury horology. What internal gear motion do you want to see dissected next?',
    mediaUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    mediaType: 'image',
    tags: ['3DAnimation', 'Redshift', 'MotionDesign'],
    likes: 724,
    tipsCount: 25,
    tipsAmount: 310,
    isLiked: false,
    isLocked: false,
    unlockPrice: 0,
    isUnlocked: true,
    comments: []
  }
];

const DEFAULT_DEALS = [
  {
    id: 'deal_101',
    brandName: 'Apex Brands',
    brandLogo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    brandContact: 'david@apexbrands.io',
    creatorId: 'creator_1',
    creatorName: 'Elena Vance',
    title: 'TitanPro Wireless Smart Mic - UGC Launch Campaign',
    deliverables: '2x 4K Vertical TikTok/Reels videos demonstrating sound clarity in street conditions, plus 5 lifestyle still photos for paid Meta ads.',
    budget: 850,
    escrowStatus: 'held_in_escrow', // held_in_escrow, released, refunded
    status: 'in_progress', // pending_approval, in_progress, under_review, completed, declined
    createdAt: '2026-09-28',
    deadline: '2026-10-10',
    notes: 'Please highlight the AI noise canceling switch in the first 2 seconds.',
    deliverableUrl: '',
    timeline: [
      { step: 'Proposal Sent', date: 'Sep 28, 2026', done: true },
      { step: 'Escrow Funded ($850.00)', date: 'Sep 28, 2026', done: true },
      { step: 'Creator Accepted', date: 'Sep 29, 2026', done: true },
      { step: 'Draft Submission', date: 'Target: Oct 08', done: false },
      { step: 'Payment Release', date: 'Pending Review', done: false }
    ]
  },
  {
    id: 'deal_102',
    brandName: 'Lumina Audio',
    brandLogo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    brandContact: 'partnerships@luminaaudio.com',
    creatorId: 'creator_1',
    creatorName: 'Elena Vance',
    title: 'Nordic Sound ANC Headphones - Q4 Brand Ambassador',
    deliverables: '1x Dedicated 4K review video, 3 vertical teaser cutdowns, and full 90-day Spark Ads authorization.',
    budget: 1650,
    escrowStatus: 'released',
    status: 'completed',
    createdAt: '2026-09-12',
    deadline: '2026-09-25',
    notes: 'Delivered ahead of schedule. Outstanding engagement stats!',
    deliverableUrl: 'https://dropbox.com/sh/mock_delivery_lumina_elena',
    timeline: [
      { step: 'Proposal Sent', date: 'Sep 12, 2026', done: true },
      { step: 'Escrow Funded ($1,650.00)', date: 'Sep 12, 2026', done: true },
      { step: 'Creator Accepted', date: 'Sep 13, 2026', done: true },
      { step: 'Draft Approved', date: 'Sep 22, 2026', done: true },
      { step: 'Payment Released', date: 'Sep 23, 2026', done: true }
    ]
  },
  {
    id: 'deal_103',
    brandName: 'Zenith Health & Tech',
    brandLogo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
    brandContact: 'collabs@zenithhealth.co',
    creatorId: 'creator_1',
    creatorName: 'Elena Vance',
    title: 'Smart Ring Health Tracker - Organic TikTok Feature',
    deliverables: '1x 45s day-in-the-life sleep recovery tracking reel with custom tracking link in bio.',
    budget: 450,
    escrowStatus: 'held_in_escrow',
    status: 'under_review',
    createdAt: '2026-09-30',
    deadline: '2026-10-06',
    notes: 'Elena submitted the draft cut for final brand approval. Awaiting client review.',
    deliverableUrl: 'https://vimeo.com/mock_preview_zenith_ring_v1',
    timeline: [
      { step: 'Proposal Sent', date: 'Sep 30, 2026', done: true },
      { step: 'Escrow Funded ($450.00)', date: 'Sep 30, 2026', done: true },
      { step: 'Creator Accepted', date: 'Oct 01, 2026', done: true },
      { step: 'Draft Submitted', date: 'Oct 02, 2026', done: true },
      { step: 'Brand Review & Release', date: 'Awaiting Brand Action', done: false }
    ]
  },
  {
    id: 'deal_104',
    brandName: 'CloudPeak Gear',
    brandLogo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    brandContact: 'marketing@cloudpeak.org',
    creatorId: 'creator_2',
    creatorName: 'Marco Silva',
    title: 'Ultralight Titanium Camp Stove Cinematic Short',
    deliverables: '1x 4K Cinematic drone reel highlighting mountain stove boil test.',
    budget: 650,
    escrowStatus: 'held_in_escrow',
    status: 'in_progress',
    createdAt: '2026-10-01',
    deadline: '2026-10-15',
    notes: 'Shooting in Rocky Mountains next week.',
    deliverableUrl: '',
    timeline: [
      { step: 'Proposal Sent', date: 'Oct 01, 2026', done: true },
      { step: 'Escrow Funded ($650.00)', date: 'Oct 01, 2026', done: true },
      { step: 'Creator Accepted', date: 'Oct 02, 2026', done: true },
      { step: 'Draft Submission', date: 'Pending', done: false },
      { step: 'Payment Release', date: 'Pending', done: false }
    ]
  }
];

const DEFAULT_TRANSACTIONS = [
  {
    id: 'tx_101',
    type: 'brand_deal',
    title: 'Brand Deal Completed: Lumina Audio',
    dealId: 'deal_102',
    amount: 1650.00,
    direction: 'credit',
    date: 'Sep 23, 2026',
    status: 'Completed',
    icon: 'briefcase'
  },
  {
    id: 'tx_102',
    type: 'tip',
    title: 'Viewer Tip from @sarah_creative',
    amount: 25.00,
    direction: 'credit',
    date: 'Oct 01, 2026',
    status: 'Completed',
    icon: 'heart'
  },
  {
    id: 'tx_103',
    type: 'content_unlock',
    title: 'Exclusive Notion Script Template Unlock (x4)',
    amount: 60.00,
    direction: 'credit',
    date: 'Oct 02, 2026',
    status: 'Completed',
    icon: 'lock-open'
  },
  {
    id: 'tx_104',
    type: 'payout',
    title: 'Payout to Bank of America (••• 4891)',
    amount: 1200.00,
    direction: 'debit',
    date: 'Sep 15, 2026',
    status: 'Transferred',
    icon: 'bank'
  }
];

class StorageManager {
  static init() {
    if (!localStorage.getItem(STORAGE_KEYS.CREATORS)) {
      localStorage.setItem(STORAGE_KEYS.CREATORS, JSON.stringify(DEFAULT_CREATORS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(DEFAULT_POSTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DEALS)) {
      localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(DEFAULT_DEALS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(DEFAULT_TRANSACTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, 'creator');
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_CREATOR_ID)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CREATOR_ID, 'creator_1');
    }
    if (!localStorage.getItem(STORAGE_KEYS.SAVED_CREATORS)) {
      localStorage.setItem(STORAGE_KEYS.SAVED_CREATORS, JSON.stringify(['creator_2', 'creator_4']));
    }
  }

  // --- Role Management ---
  static getActiveRole() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) || 'creator';
  }

  static setActiveRole(role) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
  }

  static getActiveCreatorId() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_CREATOR_ID) || 'creator_1';
  }

  static setActiveCreatorId(id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CREATOR_ID, id);
  }

  // --- Creators ---
  static getCreators() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CREATORS);
      return data ? JSON.parse(data) : DEFAULT_CREATORS;
    } catch (e) {
      console.error('Error reading creators from storage:', e);
      return DEFAULT_CREATORS;
    }
  }

  static getCreatorById(id) {
    const list = this.getCreators();
    return list.find(c => c.id === id) || list[0];
  }

  static saveCreators(creators) {
    localStorage.setItem(STORAGE_KEYS.CREATORS, JSON.stringify(creators));
  }

  static addPortfolioItem(creatorId, item) {
    const creators = this.getCreators();
    const creator = creators.find(c => c.id === creatorId);
    if (!creator) return false;

    const newItem = {
      id: 'port_' + Date.now(),
      ...item
    };
    if (!creator.portfolio) creator.portfolio = [];
    creator.portfolio.unshift(newItem);
    this.saveCreators(creators);
    return newItem;
  }

  static addService(creatorId, service) {
    const creators = this.getCreators();
    const creator = creators.find(c => c.id === creatorId);
    if (!creator) return false;

    const newService = {
      id: 'srv_' + Date.now(),
      ...service
    };
    if (!creator.services) creator.services = [];
    creator.services.push(newService);
    this.saveCreators(creators);
    return newService;
  }

  // --- Bookmarks / Saved Creators ---
  static getSavedCreatorIds() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_CREATORS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static toggleSaveCreator(creatorId) {
    let saved = this.getSavedCreatorIds();
    const index = saved.indexOf(creatorId);
    let isSaved = false;
    if (index > -1) {
      saved.splice(index, 1);
      isSaved = false;
    } else {
      saved.push(creatorId);
      isSaved = true;
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_CREATORS, JSON.stringify(saved));
    return isSaved;
  }

  // --- Posts ---
  static getPosts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POSTS);
      return data ? JSON.parse(data) : DEFAULT_POSTS;
    } catch (e) {
      console.error('Error reading posts:', e);
      return DEFAULT_POSTS;
    }
  }

  static savePosts(posts) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }

  static addPost(postData) {
    const posts = this.getPosts();
    const activeCreator = this.getCreatorById(this.getActiveCreatorId());

    const newPost = {
      id: 'post_' + Date.now(),
      creatorId: activeCreator.id,
      creatorName: activeCreator.name,
      creatorHandle: activeCreator.handle,
      creatorAvatar: activeCreator.avatar,
      timestamp: 'Just now',
      badge: postData.badge || 'New Drop',
      title: postData.title,
      content: postData.content,
      mediaUrl: postData.mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      mediaType: postData.mediaType || 'image',
      tags: postData.tags || ['CreatorWork'],
      likes: 0,
      tipsCount: 0,
      tipsAmount: 0,
      isLiked: false,
      isLocked: postData.isLocked || false,
      unlockPrice: postData.unlockPrice || 0,
      isUnlocked: !postData.isLocked,
      comments: []
    };

    posts.unshift(newPost);
    this.savePosts(posts);
    return newPost;
  }

  static toggleLikePost(postId) {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    post.isLiked = !post.isLiked;
    post.likes = post.isLiked ? (post.likes + 1) : Math.max(0, post.likes - 1);
    this.savePosts(posts);
    return post;
  }

  static tipPost(postId, amount, note, senderName = 'Brand Supporter') {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    post.tipsCount = (post.tipsCount || 0) + 1;
    post.tipsAmount = (post.tipsAmount || 0) + Number(amount);

    if (note) {
      if (!post.comments) post.comments = [];
      post.comments.push({
        id: 'c_' + Date.now(),
        user: senderName,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        text: `💰 Tipped $${Number(amount).toFixed(2)}: "${note}"`,
        time: 'Just now'
      });
    }

    this.savePosts(posts);

    // Record in transactions
    this.addTransaction({
      type: 'tip',
      title: `Tip from ${senderName}`,
      amount: Number(amount),
      direction: 'credit',
      status: 'Completed',
      icon: 'heart'
    });

    return post;
  }

  static unlockPost(postId) {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    post.isUnlocked = true;
    this.savePosts(posts);

    // Record in transactions
    this.addTransaction({
      type: 'content_unlock',
      title: `Content Unlock: "${post.title.substring(0, 30)}..."`,
      amount: post.unlockPrice || 10,
      direction: 'credit',
      status: 'Completed',
      icon: 'lock-open'
    });

    return post;
  }

  static addComment(postId, text, userName = 'Community Member') {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    if (!post.comments) post.comments = [];
    const newComment = {
      id: 'c_' + Date.now(),
      user: userName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      text,
      time: 'Just now'
    };
    post.comments.push(newComment);
    this.savePosts(posts);
    return newComment;
  }

  // --- Brand Deals & Escrow ---
  static getDeals() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEALS);
      return data ? JSON.parse(data) : DEFAULT_DEALS;
    } catch (e) {
      console.error('Error reading deals:', e);
      return DEFAULT_DEALS;
    }
  }

  static saveDeals(deals) {
    localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
  }

  static addDeal(dealData) {
    const deals = this.getDeals();
    const newDeal = {
      id: 'deal_' + Date.now(),
      brandName: dealData.brandName || 'Apex Media Group',
      brandLogo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      brandContact: dealData.brandContact || 'campaigns@apexgroup.io',
      creatorId: dealData.creatorId,
      creatorName: dealData.creatorName,
      title: dealData.title,
      deliverables: dealData.deliverables,
      budget: Number(dealData.budget),
      escrowStatus: 'held_in_escrow',
      status: 'pending_approval',
      createdAt: new Date().toISOString().split('T')[0],
      deadline: dealData.deadline || '2026-10-30',
      notes: dealData.notes || '',
      deliverableUrl: '',
      timeline: [
        { step: 'Proposal Sent', date: 'Today', done: true },
        { step: `Escrow Funded ($${Number(dealData.budget).toFixed(2)})`, date: 'Today', done: true },
        { step: 'Creator Acceptance', date: 'Pending', done: false },
        { step: 'Deliverables Review', date: 'Pending', done: false },
        { step: 'Payment Release', date: 'Pending', done: false }
      ]
    };

    deals.unshift(newDeal);
    this.saveDeals(deals);
    return newDeal;
  }

  static updateDealStatus(dealId, newStatus, extraData = {}) {
    const deals = this.getDeals();
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return null;

    deal.status = newStatus;

    if (newStatus === 'in_progress') {
      const t = deal.timeline.find(s => s.step.includes('Creator Acceptance') || s.step.includes('Creator Accepted'));
      if (t) { t.done = true; t.date = 'Accepted'; }
    } else if (newStatus === 'under_review') {
      deal.deliverableUrl = extraData.deliverableUrl || deal.deliverableUrl;
      const t = deal.timeline.find(s => s.step.includes('Draft') || s.step.includes('Deliverables Review'));
      if (t) { t.done = true; t.date = 'Submitted for Review'; }
    } else if (newStatus === 'completed') {
      deal.escrowStatus = 'released';
      const t = deal.timeline.find(s => s.step.includes('Payment Release') || s.step.includes('Payment Released'));
      if (t) { t.done = true; t.date = 'Funds Released'; }

      // Add credit transaction to Creator
      this.addTransaction({
        type: 'brand_deal',
        title: `Deal Payout: ${deal.brandName} - "${deal.title.substring(0, 24)}..."`,
        dealId: deal.id,
        amount: Number(deal.budget),
        direction: 'credit',
        status: 'Completed',
        icon: 'briefcase'
      });
    }

    this.saveDeals(deals);
    return deal;
  }

  // --- Transactions & Financials ---
  static getTransactions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : DEFAULT_TRANSACTIONS;
    } catch {
      return DEFAULT_TRANSACTIONS;
    }
  }

  static saveTransactions(txs) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
  }

  static addTransaction(txData) {
    const txs = this.getTransactions();
    const newTx = {
      id: 'tx_' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...txData
    };
    txs.unshift(newTx);
    this.saveTransactions(txs);
    return newTx;
  }

  static getWalletSummary(creatorId = 'creator_1') {
    const deals = this.getDeals().filter(d => d.creatorId === creatorId);
    const txs = this.getTransactions();

    let totalEarned = 0;
    let withdrawn = 0;
    let inEscrow = 0;

    deals.forEach(d => {
      if (d.status === 'in_progress' || d.status === 'under_review') {
        inEscrow += Number(d.budget || 0);
      }
    });

    txs.forEach(t => {
      if (t.direction === 'credit') {
        totalEarned += Number(t.amount || 0);
      } else if (t.direction === 'debit') {
        withdrawn += Number(t.amount || 0);
      }
    });

    const availableBalance = Math.max(0, totalEarned - withdrawn);

    return {
      totalEarned,
      withdrawn,
      availableBalance,
      inEscrow,
      dealsCompletedCount: deals.filter(d => d.status === 'completed').length,
      activeDealsCount: deals.filter(d => d.status === 'in_progress' || d.status === 'under_review').length
    };
  }

  static requestPayout(amount, bankDetails) {
    const summary = this.getWalletSummary();
    const withdrawAmount = Number(amount);

    if (withdrawAmount <= 0 || withdrawAmount > summary.availableBalance) {
      return { success: false, message: 'Invalid or insufficient available balance' };
    }

    const tx = this.addTransaction({
      type: 'payout',
      title: `Payout to ${bankDetails.method || 'Bank'} (${bankDetails.account || '•••• 4891'})`,
      amount: withdrawAmount,
      direction: 'debit',
      status: 'Transferred',
      icon: 'bank'
    });

    return { success: true, transaction: tx };
  }

  static resetToDefaults() {
    localStorage.removeItem(STORAGE_KEYS.CREATORS);
    localStorage.removeItem(STORAGE_KEYS.POSTS);
    localStorage.removeItem(STORAGE_KEYS.DEALS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.SAVED_CREATORS);
    this.init();
  }
}

// Auto initialize on load
StorageManager.init();

// Export for app usage
window.StorageManager = StorageManager;
