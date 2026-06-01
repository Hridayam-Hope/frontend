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
      slug: 'service-to-the-needy',
      badge: 'SERVICE',
      badgeColor: 'bg-hp-primary/10 text-hp-primary',
      title: 'Service to the Needy',
      description: 'Providing essential support to those in need.',
      image: '/do_1.webp',
      bullets: [
        'Distribution of food to underprivileged individuals and families.',
        'Providing books, stationery, and learning materials to students.',
        'Support for basic necessities during emergencies and crises.',
      ],
      details: 'Providing meals, essential supplies, and educational materials to those from disadvantaged backgrounds. Our rapid-response teams also deliver critical support during crises, ensuring no one is left behind in their time of greatest need.',
    },
    {
      slug: 'education-awareness',
      badge: 'EDUCATION',
      badgeColor: 'bg-blue-50 text-blue-600',
      title: 'Education & Awareness',
      description: 'Spreading knowledge and essential life skills.',
      image: '/do_2.webp',
      bullets: [
        'Awareness sessions for students, teenagers, and public.',
        'Health awareness programs (physical & mental).',
        'Ethical, age-appropriate sex education for teenagers.',
        'Campaigns on social values, ethics, and citizenship.',
      ],
      details: 'Equipping youth and the public with practical knowledge and essential life skills. We conduct interactive sessions on health, ethical values, and responsible citizenship to shape informed, empathetic community leaders.',
    },
    {
      slug: 'health-wellbeing',
      badge: 'HEALTH',
      badgeColor: 'bg-rose-50 text-rose-600',
      title: 'Health & Well-being',
      description: 'Prioritizing community wellness and preventative care.',
      image: '/do_3.webp',
      bullets: [
        'Health awareness drives in schools and communities.',
        'Seminars/workshops on hygiene, nutrition, and mental health.',
        'Promoting preventive healthcare and healthy lifestyles.',
      ],
      details: 'Focusing on preventive care and wellness through health drives, hygiene seminars, and mental health workshops. We empower individuals with the knowledge to make healthy lifestyles achievable and sustainable for all.',
    },
    {
      slug: 'social-reformation',
      badge: 'SOCIAL REFORM',
      badgeColor: 'bg-amber-50 text-amber-700',
      title: 'Social Reformation',
      description: 'Driving positive behavioral change in society.',
      image: '/awareness.webp',
      bullets: [
        'Programs that encourage social responsibility.',
        'Addressing issues through dialogue and community participation.',
        'Empowering youth to become active citizens.',
      ],
      details: 'Challenging harmful norms and sparking community dialogue to inspire positive behavioral change. By encouraging active citizenship and empowering youth voices, we foster a culture of deep, sustainable societal progress.',
    },
    {
      slug: 'environmental-protection',
      badge: 'ENVIRONMENT',
      badgeColor: 'bg-emerald-50 text-emerald-600',
      title: 'Environmental Protection',
      description: 'Protecting our planet for future generations.',
      image: '/about_4.webp',
      bullets: [
        'Promoting environment-friendly habits and sustainable living.',
        'Campaigns on waste management and plastic reduction.',
        'Tree plantation drives and eco-awareness activities.',
      ],
      details: 'Promoting hands-on environmental stewardship through tree plantations, waste management campaigns, and eco-awareness initiatives. We educate communities to adopt sustainable habits that safeguard our planet for future generations.',
    },
    {
      slug: 'technology-innovation',
      badge: 'TECH FOR GOOD',
      badgeColor: 'bg-violet-50 text-violet-600',
      title: 'Technology & Innovation',
      description: 'Bringing digital empowerment to communities.',
      image: '/program_1.webp',
      bullets: [
        'Providing simple tech solutions for social challenges.',
        'Promoting digital awareness and basic tech education.',
        'Using tech in education and awareness campaigns.',
      ],
      details: 'Bridging the digital divide by bringing practical tech solutions and basic digital literacy to underserved areas. We harness the power of technology to enhance education and awareness, ensuring everyone can thrive in the modern world.',
    },
  ],
} as const;

export const ABOUT_TEAM = {
  eyebrow: 'OUR TEAM',
  headline: 'Meet the',
  headlineAccent: 'Changemakers',
  subtitle:
    'Hridayam Hope is led by a small, hands-on team and powered by hundreds of volunteers, partners, and supporters.',
  badge: '30+ volunteers & community champions',
  members: [
    { name: 'Billa Manoj Manfred', address: 'Chennai' },
    { name: 'Pasumarthi Rupa Tharun', address: 'Eluru' },
    { name: 'Arepalli Asha', address: 'Bhimavaram' },
    { name: 'Kontipudi Vinoliya', address: 'Bhimavaram' },
    { name: 'Peddakotla William Keri', address: 'Guntur' },
    { name: 'Vigna Ramtej Telagarapu', address: 'Rajam' },
    { name: 'Natha Yemima', address: 'Tadepalligudem' },
    { name: 'Ankith Pissay', address: 'Chirala' },
    { name: 'Shaik Irfan', address: 'Nandyal' },
    { name: 'Balireddy John Prakash', address: 'Rajahmundry' },
    { name: 'Zaheer Khan', address: 'Guntur' },
    { name: 'Kuppala John William', address: 'Pedda Petta' },
    { name: 'Angel Kuppala', address: 'Akividu' },
    { name: 'Pydada Yogendra Shanmukha Sai', address: 'Kothapalli' },
    { name: 'Arumilli Vijay Babu', address: 'Eluru' },
    { name: 'Nandini V', address: 'Bhimavaram' },
    { name: 'Usharani', address: 'East Godavari' },
    { name: 'Penjarla Naga Adithya Somadha Sresty', address: 'Kovvada' },
    { name: 'Pathan Shahid', address: 'Bapatla' },
    { name: 'Ashok Luhar', address: 'Surat' },
    { name: 'Talathoti Keerthi Sree', address: 'Dhana Lakshmi Temple Street' },
    { name: 'Lal Satya Sai Thota', address: 'Akiveedu' },
    { name: 'Bhanu Sai Veera Ashok Babu Sonti', address: 'Nandigama' },
    { name: 'Nikshitha Naradasu', address: 'Bhimavaram' },
    { name: 'Gadepalli Sai Eswar Pranav', address: 'Bhimavaram' },
    { name: 'Triveni Chintha', address: 'Srikakulam' },
    { name: 'Majji Udhaya Kumar', address: 'Pathapatnam' },
    { name: 'Lokesh Gandhi Modalavalasa', address: 'Palakollu' },
    { name: 'Karthik Thonta', address: 'East Godavari' },
    { name: 'Mohan Narayanapuram', address: 'Guntur' },
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
