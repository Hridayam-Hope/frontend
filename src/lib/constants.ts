// ── Homepage Content Constants ─────────────────────────────────
// All text is centralized here for easy editing / CMS migration.

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#who-we-are" },
  { label: "What We Do", href: "#what-we-do" },
  { label: "Campaigns", href: "#recent-programs" },
  { label: "Blog & News", href: "#" },
  { label: "Join Us", href: "#newsletter" },
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
  { icon: "ShieldCheck" as const, text: "80G Tax Exemption Available" },
  { icon: "Eye" as const, text: "100% Transparent Fund Usage" },
  { icon: "Award" as const, text: "Registered NGO Since 2024" },
] as const;

export const QUICK_IMPACT = {
  headline: "Make an Instant Impact",
  subtext: "Your ₹500 can feed a family for a week. Choose your contribution:",
  amounts: ["₹500", "₹1,000", "₹2,000", "Custom Amount"],
  cta: "Donate Now →",
  disclaimer:
    "Secure payment via Razorpay. Receipt & 80G certificate emailed instantly.",
} as const;

export const WHO_WE_ARE = {
  eyebrow: "WHO WE ARE",
  headline: "Hridayam means Heart. Hope means Possibility.",
  paragraph:
    "Hridayam Hope Foundation is a non-profit organization committed to serving humanity with love, dignity, and purpose. We focus not only on helping people in need but also on fostering awareness, social responsibility, and positive behavioral change - especially among students and young adults. From food distribution and education support to eco-friendly initiatives and access to technology, we believe that awareness and compassion go hand in hand. Every life we touch is a step toward a stronger, more inclusive society.",
  cta: "Read Our Full Story →",
  metrics: [
    { value: 500, suffix: "+", label: "Lives Touched" },
    { value: 100, suffix: "+", label: "Trees Planted" },
    { value: 25, suffix: "+", label: "Programs" },
  ],
} as const;

export const PROGRAMS = [
  {
    title: "Education & Awareness",
    description:
      "Empowering students through interactive workshops on health, hygiene, and social responsibility.",
    image: "/program-education.webp",
    icon: "BookOpen" as const,
  },
  {
    title: "Health & Well-being",
    description:
      "Promoting better health outcomes through community wellness camps and awareness drives.",
    image: "/program-health.webp",
    icon: "Heart" as const,
  },
  {
    title: "Care for the Needy",
    description:
      "Providing essential food, clothing, and supplies to families facing hardship with dignity.",
    image: "/program-food.webp",
    icon: "Utensils" as const,
  },
  {
    title: "Social Reformation",
    description:
      "Building inclusive communities through dialogue, cultural programs, and youth engagement.",
    image: "/program-social.webp",
    icon: "Users" as const,
  },
  {
    title: "Environmental Protection",
    description:
      "Leading tree plantation drives and eco-friendly initiatives to protect our planet.",
    image: "/program-environment.webp",
    icon: "Leaf" as const,
  },
  {
    title: "Technology for Good",
    description:
      "Bridging the digital divide by providing tech access and digital literacy to underserved youth.",
    image: "/program-education.webp",
    icon: "Laptop" as const,
  },
] as const;

export const ACTIVITIES = [
  {
    image: "/activity-tree-plantation.webp",
    badge: "Environment",
    badgeColor: "bg-emerald-500",
    title: "Tree Plantation Drive",
    meta: "Chevella | 7 March 2025",
    description:
      "Planted 50 saplings with local volunteers, creating greener futures for the next generation.",
  },
  {
    image: "/activity-school-session.webp",
    badge: "Education",
    badgeColor: "bg-blue-500",
    title: "School Awareness Session",
    meta: "Hayathnagar | 15 February 2025",
    description:
      "Interactive session on health and hygiene reached 100+ students, empowering them with knowledge.",
  },
  {
    image: "/activity-support-family.webp",
    badge: "Care",
    badgeColor: "bg-rose-500",
    title: "Support for Families in Need",
    meta: "Dilsukhnagar | 1 February 2025",
    description:
      "Provided essential supplies and food to 20 families, offering dignity and support in difficult times.",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Hridayam Hope Foundation didn't just help us - they restored our dignity. Their compassionate approach made all the difference.",
    name: "Ramesh Kumar",
    role: "Parent, Beneficiary",
    image: "/testimonial-person.webp",
  },
  {
    quote:
      "Volunteering with Hridayam has been life-changing. Seeing the direct impact on children's education keeps me inspired every day.",
    name: "Priya Sharma",
    role: "Volunteer",
    image: "/testimonial-person.webp",
  },
  {
    quote:
      "Their tree plantation drives have transformed our neighbourhood. Hridayam proves that small initiatives can make a big difference.",
    name: "Ahmed Khan",
    role: "Community Member",
    image: "/testimonial-person.webp",
  },
] as const;

export const FOOTER = {
  tagline:
    "Building a compassionate, informed, and inclusive society where every individual has access to dignity and opportunities.",
  aboutLinks: [
    { label: "Our Mission", href: "#who-we-are" },
    { label: "Our Team", href: "#" },
    { label: "Annual Reports", href: "#" },
    { label: "Transparency", href: "#" },
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
    phone: "+91-81217-02286",
    address: "Andhra Pradesh, India",
  },
  registrations: "80G Registration: TBA | 12A Registration: TBA",
  bottomLinks: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "Refund Policy", href: "#" },
  ],
} as const;
