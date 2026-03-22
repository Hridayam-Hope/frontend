// ── About Page Content Constants ───────────────────────────────
// All text is centralized here for easy editing / CMS migration.

export const ABOUT_HERO = {
  eyebrow: 'ABOUT US',
  headline: 'Where',
  headlineAccent1: 'Compassion',
  headlineMiddle: 'Meets',
  headlineAccent2: 'Action',
  subtitle:
    "Since 2026, we've been transforming lives through education, healthcare, and sustainable development. Every initiative is powered by ordinary people who choose to care.",
} as const;

export const ABOUT_STORY = {
  eyebrow: 'OUR APPROACH',
  headline: 'Driven by Community,',
  headlineItalic: 'Guided by Impact',
  paragraphs: [
    'Hridayam Hope Foundation follows a people-centric approach by identifying real needs through community interaction.',
    'We collaborate with volunteers, educators, professionals, and institutions to implement ethical, practical, and impactful programs.',
    'Continuously evaluating activities to improve effectiveness and reach ensures our efforts create lasting change.',
  ],
  infoCards: {
    since: {
      label: 'TARGET BENEFICIARIES',
      text: 'Underprivileged individuals, families, school/college students, teenagers, and youth.',
    },
    focus: {
      label: 'Real Needs',
      text: 'Community interaction first.',
    },
    impact: {
      label: 'Practical',
      text: 'Ethical and impactful programs.',
    },
    belief: '"Touching lives, inspiring minds, and building a hopeful society."',
  },
} as const;

export const ABOUT_PURPOSE = {
  eyebrow: 'OUR PURPOSE',
  headline: 'Guided by',
  headlineAccent1: 'Vision',
  headlineMiddle: ', Driven by',
  headlineAccent2: 'Mission',
  mission: {
    label: 'MISSION',
    title: 'Our Mission',
    text: '',
    bullets: [
      'To serve the needy with love, dignity, and respect.',
      'To educate and create awareness among people, especially students and teenagers, on critical social, health, and environmental issues.',
      'To empower communities through education, technology, and social reform initiatives.',
      'To promote sustainable and environment-friendly practices for a healthier planet.',
    ]
  },
  vision: {
    label: 'VISION',
    title: 'Our Vision',
    text: 'To build a compassionate, informed, and inclusive society where every individual has access to basic needs, knowledge, dignity, and opportunities for growth.',
  },
} as const;

export const ABOUT_CORE_VALUES = {
  eyebrow: 'CORE VALUES',
  headline: 'The Principles',
  headlineAccent: 'We Stand By',
  subtitle: 'Our foundation operates on five non-negotiable pillars of humanity.',
  values: [
    {
      title: 'Compassion & Empathy',
      description: 'Serving humanity with a heartfelt approach.',
      icon: 'Heart' as const,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
    },
    {
      title: 'Integrity & Transparency',
      description: 'Upholding honesty and accountability in all activities.',
      icon: 'ShieldCheck' as const,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      title: 'Inclusiveness',
      description: 'Reaching out to all sections of society without discrimination.',
      icon: 'Users' as const,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      title: 'Awareness & Education',
      description: 'Belief that knowledge leads to empowerment.',
      icon: 'BookOpen' as const,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Sustainability',
      description: 'Focusing on long-term, eco-friendly solutions.',
      icon: 'Leaf' as const,
      color: 'text-teal-500',
      bg: 'bg-teal-50',
    },
  ]
} as const;

export const ABOUT_PILLARS = {
  eyebrow: 'WHAT WE DO',
  headline: 'Focus Areas &',
  headlineAccent: 'Activities',
  subtitle:
    'Dedicated initiatives to uplift communities, foster education, and build a sustainable future.',
  pillars: [
    {
      badge: 'SERVICE',
      badgeColor: 'bg-hp-primary/10 text-hp-primary',
      title: 'Service to the Needy',
      description: 'Providing essential support to those in need.',
      bullets: [
        'Distribution of food to underprivileged individuals and families.',
        'Providing books, stationery, and learning materials to students.',
        'Support for basic necessities during emergencies and crises.',
      ],
    },
    {
      badge: 'EDUCATION',
      badgeColor: 'bg-blue-50 text-blue-600',
      title: 'Education & Awareness Programs',
      description: 'Spreading knowledge and essential life skills.',
      bullets: [
        'Awareness sessions for students, teenagers, and public.',
        'Health awareness programs (physical & mental).',
        'Ethical, age-appropriate sex education for teenagers.',
        'Campaigns on social values, ethics, and citizenship.',
      ],
    },
    {
      badge: 'HEALTH',
      badgeColor: 'bg-rose-50 text-rose-600',
      title: 'Health & Well-being Initiatives',
      description: 'Prioritizing community wellness and preventative care.',
      bullets: [
        'Health awareness drives in schools and communities.',
        'Seminars/workshops on hygiene, nutrition, and mental health.',
        'Promoting preventive healthcare and healthy lifestyles.',
      ],
    },
    {
      badge: 'SOCIAL REFORM',
      badgeColor: 'bg-amber-50 text-amber-700',
      title: 'Social Reformation',
      description: 'Driving positive behavioral change in society.',
      bullets: [
        'Programs that encourage social responsibility.',
        'Addressing issues through dialogue and community participation.',
        'Empowering youth to become active citizens.',
      ],
    },
    {
      badge: 'ENVIRONMENT',
      badgeColor: 'bg-emerald-50 text-emerald-600',
      title: 'Environmental Protection',
      description: 'Protecting our planet for future generations.',
      bullets: [
        'Promoting environment-friendly habits and sustainable living.',
        'Campaigns on waste management and plastic reduction.',
        'Tree plantation drives and eco-awareness activities.',
      ],
    },
    {
      badge: 'TECH FOR GOOD',
      badgeColor: 'bg-violet-50 text-violet-600',
      title: 'Technology & Innovation',
      description: 'Bringing digital empowerment to communities.',
      bullets: [
        'Providing simple tech solutions for social challenges.',
        'Promoting digital awareness and basic tech education.',
        'Using tech in education and awareness campaigns.',
      ],
    },
  ],
} as const;

export const ABOUT_TEAM = {
  eyebrow: 'OUR TEAM',
  headline: 'Meet the',
  headlineAccent: 'Changemakers',
  subtitle:
    'Hridayam Hope is led by a small, hands-on team and powered by hundreds of volunteers, partners, and supporters.',
  badge: '500+ volunteers & community champions',
  members: [
    {
      name: 'TBA',
      role: 'Founder & President',
      bio: 'A visionary social entrepreneur with 15 years of experience in grassroots community development. TBA founded...',
      contact: 'Contact TBA',
    },
    {
      name: 'TBA',
      role: 'Director of Programs',
      bio: 'With a background in public policy and NGO management, TBA oversees all foundation programs and ensures maximum...',
      contact: 'Contact TBA',
    },
    {
      name: 'TBA',
      role: 'Head of Operations',
      bio: 'TBA brings operational excellence from his corporate experience to ensure smooth execution of all campaigns and...',
      contact: 'Contact TBA',
    },
    {
      name: 'TBA',
      role: 'Communications Lead',
      bio: 'A storyteller at heart, TBA ensures every success story reaches the world and inspires more people to join the cause.',
      contact: 'Contact TBA',
    },
  ],
} as const;

export const ABOUT_CTA = {
  headline: 'Be Part of the',
  headlineItalicAccent: 'Hridayam Hope',
  headlineBold: 'Family',
  subtitle:
    'Whether you can give time, skills, or resources \u2014 there is a place for you.',
  subtext:
    'Become a volunteer, start a fundraiser, or support a campaign that speaks to your heart.',
  primaryCta: 'Become a Volunteer',
  secondaryCta: 'Make a Donation',
  trust: [
    'Tax Benefit',
    '100% Transparent',
  ],
} as const;
