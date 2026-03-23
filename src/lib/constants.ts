// ── Homepage Content Constants ─────────────────────────────────
// All text is centralized here for easy editing / CMS migration.

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "What We Do", href: "/#what-we-do" },
  { label: "Campaigns", href: "/#recent-programs" },
  { label: "Blog & News", href: "/blog" },
  { label: "Join Us", href: "/join-us" },
  // { label: "Contact Us", href: "#footer" },
] as const;

export const HERO = {
  eyebrow: "From the Heart, For Humanity",
  headline: "Small acts of care can create powerful change.",
  subheadline:
    "Hridayam Hope Foundation is driven by compassion and action. When kindness creates awareness, lives transform.",
  paragraph:
    "We work at the grassroots - serving the needy, educating young minds, fostering social harmony, and empowering communities to build a better, more sustainable future. Join us in creating ripples of hope that last.",
  cta: {
    primary: "Donate Now",
    secondary: "Become a Volunteer",
    tertiary: "Learn More",
  },
} as const;

export const TRUST_ITEMS = [
  { icon: "ShieldCheck" as const, text: "Tax Exemption Available" },
  { icon: "Eye" as const, text: "100% Transparent Fund Usage" },
  { icon: "Award" as const, text: "Registered NGO Since 2024" },
] as const;

export const QUICK_IMPACT = {
  headline: "Make an Instant Impact",
  subtext: "Your ₹500 can feed a family for a week. Choose your contribution:",
  amounts: ["₹500", "₹1,000", "₹2,000", "Custom Amount"],
  cta: "Donate Now →",
  disclaimer:
    "Secure payment via Razorpay. Receipt & certificate emailed instantly.",
} as const;

export const WHO_WE_ARE = {
  eyebrow: "ABOUT US",
  headline: "Hridayam Hope Foundation",
  paragraph:
    "Hridayam Hope Foundation is a non-profit organization established with a deep sense of compassion and responsibility towards society. The word Hridayam means heart, symbolizing love, care, and empathy, while Hope reflects our commitment to creating positive change and a better future. The foundation works with the belief that serving the needy and creating awareness are the strongest pillars for sustainable social development.",
  cta: "Read Our Full Story →",
  metrics: [
    { value: 500, suffix: "+", label: "Lives Touched" },
    { value: 100, suffix: "+", label: "Trees Planted" },
    { value: 25, suffix: "+", label: "Programs" },
  ],
} as const;

export const PROGRAMS = [
  {
    title: "Service to the Needy",
    description:
      "Distribution of food to underprivileged individuals and families. Providing books, stationery, and learning materials to students in need. Support for basic necessities during emergencies and crises.",
    image: "/service.webp",
  },
  {
    title: "Education & Awareness Programs",
    description:
      "Awareness sessions for students, teenagers, and the general public. Health awareness programs focusing on physical and mental well-being. Sex education programs for teenagers. Campaigns on social values.",
    image: "/do_2.webp",
  },
  {
    title: "Health & Well-being Initiatives",
    description:
      "Health awareness drives in schools and communities. Collaboration with professionals for seminars and workshops on hygiene, nutrition, and mental health. Promoting preventive healthcare.",
    image: "/do_3.webp",
  },
  {
    title: "Social Reformation & Community Development",
    description:
      "Programs that encourage social responsibility and positive behavioral change. Initiatives to address social issues through dialogue, education, and community participation.",
    image: "/program-social.webp",
  },
  {
    title: "Environmental Protection & Sustainability",
    description:
      "Promoting environment-friendly habits and sustainable living. Awareness campaigns on waste management, plastic reduction, and conservation of natural resources. Tree plantation drives.",
    image: "/program-environment.webp",
  },
  {
    title: "Technology & Innovation for Social Good",
    description:
      "Providing simple and effective tech solutions for social challenges. Promoting digital awareness and developing technical education models for communities in need of awareness.",
    image: "/program-education.webp",
  },
] as const;

export const ACTIVITIES = [
  {
    image: "/program_1.webp",
    badge: "Environment",
    badgeColor: "bg-emerald-500",
    title: "Tree Plantation Drive",
    meta: "Bhimavaram | 11 March 2026",
    description:
      "Planted 26 trees on behalf of our volunteers.",
  },
  {
    image: "/program_2.webp",
    badge: "Education",
    badgeColor: "bg-blue-500",
    title: "School Awareness Session",
    meta: "Bhimavaram | 11 March 2026",
    description:
      "We have given awareness on social media to government school students.",
  },
  // {
  //   image: "/activity-support-family.webp",
  //   badge: "Care",
  //   badgeColor: "bg-rose-500",
  //   title: "Support for Families in Need",
  //   meta: "Dilsukhnagar | 1 February 2025",
  //   description:
  //     "Provided essential supplies and food to 20 families, offering dignity and support in difficult times.",
  // },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "I enjoyed being part of Hridayam through plantation and awareness activities, interacting with kids, spreading useful knowledge, and contributing to a greener, better future.",
    name: "Yogendra P",
    role: "Volunteer",
    image: "/testimonial-person.webp",
  },
  {
    quote:
      "This month's activities were meaningful and impactful, promoting environmental responsibility through plantation and spreading social awareness among students, while providing an enjoyable and inspiring experience.",
    name: "Asha",
    role: "Volunteer",
    image: "/testimonial-person.webp",
  },
  {
    quote:
      "Being part of Hridayam Hope Foundation has been meaningful, offering a positive, inspiring community where volunteering feels purposeful and truly special.",
    name: "Zaheer Khan",
    role: "Volunteer",
    image: "/testimonial-person.webp",
  },
  {
    quote:
      "Spreading awareness made me realize that even a message can shift how people think and act—and that gave my experience real meaning.",
    name: "Bhanu Sai",
    role: "Volunteer",
    image: "/testimonial-person.webp",
  },
  {
    quote:
      "Planting trees felt like a small step at first, but I later understood the impact it holds for the future and the responsibility it carries.",
    name: "Ankith Pissay",
    role: "Volunteer",
    image: "/testimonial-person.webp",
  },
] as const;

export const FOOTER = {
  tagline:
    "Building a compassionate, informed, and inclusive society where every individual has access to dignity and opportunities.",
  aboutLinks: [
    { label: "Our Mission", href: "#who-we-are" },
    { label: "Our Team", href: "#" },
    // { label: "Annual Reports", href: "#" },
    // { label: "Transparency", href: "#" },
    { label: "Contact Us", href: "#footer" },
  ],
  programLinks: [
    { label: "Education & Awareness", href: "#what-we-do" },
    { label: "Health & Well-being", href: "#what-we-do" },
    { label: "Care for the Needy", href: "#what-we-do" },
    { label: "Social Reformation", href: "#what-we-do" },
    { label: "Environmental Protection", href: "#what-we-do" },
    { label: "Technology for Good", href: "#what-we-do" },
  ],
  joinLinks: [
    { label: "Donate Now", href: "#" },
    { label: "Become a Volunteer", href: "#" },
    { label: "Join Our Team", href: "#" },
    { label: "Partner with Us", href: "#" },
    { label: "Request a Campaign", href: "#" },
  ],
  contact: {
    email: "hridayamhopefoundation@gmail.com",
    phone: "+917674028833",
    address: "Andhra Pradesh, India",
  },
  registrations: "",
  bottomLinks: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "Refund Policy", href: "#" },
  ],
} as const;
