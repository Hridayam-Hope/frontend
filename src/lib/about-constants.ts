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
  stats: [
    { value: 12500, suffix: '+', label: 'Lives Touched' },
    { value: 45, suffix: '+', label: 'Communities' },
    { value: 500, suffix: '+', label: 'Volunteers' },
  ],
} as const;

export const ABOUT_STORY = {
  eyebrow: 'OUR STORY',
  headline: 'It Started with a Simple Question:',
  headlineItalic: '"What if we could help?"',
  paragraphs: [
    "In 2026, a small group of friends couldn't ignore the suffering around them. What began with a handful of meal distributions and tuition classes has grown into a multi-state movement for compassion in action.",
    'Today, we work alongside communities, schools, hospitals, and local leaders to ensure that no child is denied education, no family goes to bed hungry, and no village is left without basic healthcare and awareness.',
    'Every initiative is powered by ordinary people who believe that hope is a responsibility we all share.',
  ],
  infoCards: {
    since: {
      label: 'SINCE 2026',
      text: 'Serving communities across Delhi NCR, Rajasthan, Maharashtra, Karnataka and beyond through education, healthcare, environmental, social reformation, and technology for good.',
    },
    focus: {
      label: '6 Focus Areas',
      text: 'Holistic approach to community development.',
    },
    impact: {
      label: 'Growing Impact',
      text: 'Expanding reach every month.',
    },
    belief: '"Compassion is not a feeling \u2014 it is action."',
  },
} as const;

export const ABOUT_PURPOSE = {
  eyebrow: 'OUR PURPOSE',
  headline: 'Guided by',
  headlineAccent1: 'Purpose',
  headlineMiddle: ', Driven by',
  headlineAccent2: 'Impact',
  mission: {
    label: 'MISSION',
    title: 'To serve with heart and build dignified futures',
    text: 'We exist to identify the most vulnerable individuals and communities and respond with practical, compassionate, and sustainable support \u2014 from food and education to healthcare, livelihood, and awareness.',
  },
  vision: {
    label: 'VISION',
    title: 'A world where no one is invisible to compassion',
    text: 'We envision communities where every child learns, every family eats with dignity, every patient is seen, and every citizen feels empowered to care for people and the planet.',
  },
} as const;

export const ABOUT_PILLARS = {
  eyebrow: 'WHAT WE DO',
  headline: 'Six Pillars of',
  headlineAccent: 'Transformation',
  subtitle:
    'From daily meal drives to digital literacy, each program is designed with community ownership and long-term impact in mind.',
  pillars: [
    {
      badge: 'SERVICE',
      badgeColor: 'bg-hp-primary/10 text-hp-primary',
      title: 'Service to the Needy',
      description:
        'Providing food, clothing, shelter support, and emergency relief to the most vulnerable communities. Our daily meal programs and relief camps reach those who need it most.',
      bullets: [
        'Fed 10,000+ people through daily meal drives',
        'Distributed 10,000+ warm clothing items in winter',
      ],
    },
    {
      badge: 'EDUCATION',
      badgeColor: 'bg-blue-50 text-blue-600',
      title: 'Education & Awareness',
      description:
        'Bridging the education gap through school enrichment drives, scholarship programs, mentorship, and awareness campaigns on social issues.',
      bullets: [
        'Enrolled 3,000 children in school',
        'Provided scholarships to 500 meritorious students',
      ],
    },
    {
      badge: 'HEALTH',
      badgeColor: 'bg-rose-50 text-rose-600',
      title: 'Health & Well-being',
      description:
        'Organizing free medical camps, health awareness sessions, mental health support, and medicine distribution in underserved areas.',
      bullets: [
        'Conducted 120 free medical camps',
        'Provided healthcare to 15,000+ individuals',
      ],
    },
    {
      badge: 'SOCIAL REFORM',
      badgeColor: 'bg-amber-50 text-amber-700',
      title: 'Social Reformation',
      description:
        "Empowering marginalized communities through women's skill development, anti-discrimination programs, and social awareness initiatives.",
      bullets: [
        'Trained 200 women in vocational skills',
        'Conducted 50 awareness workshops',
      ],
    },
    {
      badge: 'ENVIRONMENT',
      badgeColor: 'bg-emerald-50 text-emerald-600',
      title: 'Environmental Protection',
      description:
        'Leading tree plantation drives, clean up campaigns, waste management programs, and environmental education to build a sustainable future.',
      bullets: [
        'Planted 8,000 trees across 5 states',
        'Organized 20 community clean-up drives',
      ],
    },
    {
      badge: 'TECH FOR GOOD',
      badgeColor: 'bg-violet-50 text-violet-600',
      title: 'Technology for Social Good',
      description:
        'Leveraging technology to bridge the digital divide \u2014 from digital literacy programs for rural youth to tech solutions for social challenges.',
      bullets: [
        'Trained 500 rural youth in digital skills',
        'Developed 5 community impact tools',
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
    '80G Tax Benefit',
    '100% Transparent',
    'Join 500+ Volunteers',
  ],
} as const;
