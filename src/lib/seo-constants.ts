// ── SEO / GEO / AEO Constants ──────────────────────────────────
// Centralized SEO data for structured markup, meta tags, and AI optimization.

export const SITE_CONFIG = {
  name: 'Hridayam Hope Foundation',
  shortName: 'Hridayam Hope',
  url: 'https://hridayamhopefoundation.com',
  domain: 'hridayamhopefoundation.com',
  locale: 'en_IN',
  themeColor: '#4886CF',
  foundingDate: '2024',
  description:
    'Hridayam Hope Foundation is a non-profit organization in Andhra Pradesh committed to serving humanity through education, health, environmental protection, and community empowerment. Volunteer with us today.',
  shortDescription:
    'Non-profit NGO in Andhra Pradesh serving humanity through education, health, and community empowerment.',
  keywords: [
    'NGO in Andhra Pradesh',
    'volunteer in Andhra Pradesh',
    'donate to NGO India',
    'Hridayam Hope Foundation',
    'non-profit organization India',
    'education NGO AP',
    'tree plantation Andhra Pradesh',
    'community empowerment India',
    'help needy families AP',
    'social welfare organization',
    'volunteer opportunities India',
    'food distribution NGO',
    'health awareness camps AP',
    'youth empowerment India',
  ],
  social: {
    facebook: 'https://www.facebook.com/share/18A876VpcB/',
    instagram: 'https://www.instagram.com/hridayam_hope_foundation',
    linkedin: 'https://www.linkedin.com/in/hridayam-hope-foundation/',
    youtube: 'https://www.youtube.com/@hridayamhopefoundation',
  },
  contact: {
    email: 'hridayamhopefoundation@gmail.com',
    phone: '+91-81217-02286',
    address: 'Andhra Pradesh, India',
    addressRegion: 'Andhra Pradesh',
    addressCountry: 'IN',
  },
  gtmId: 'GTM-PJJTM2WX',
} as const;

/** FAQ pairs used for FAQPage schema and future FAQ section (AEO). */
export const SEO_FAQS = [
  {
    question: 'How can I volunteer with Hridayam Hope Foundation?',
    answer:
      'You can volunteer by visiting our website and clicking "Become a Volunteer." We welcome individuals of all backgrounds to join our programs in education, health, environment, and community welfare across Andhra Pradesh.',
  },
  {
    question: 'What programs does Hridayam Hope Foundation run?',
    answer:
      'We run six core programs: Education & Awareness, Health & Well-being, Care for the Needy, Social Reformation, Environmental Protection, and Technology for Good. Each program is designed to create lasting impact in communities across Andhra Pradesh.',
  },
  {
    question: 'Where does Hridayam Hope Foundation operate?',
    answer:
      'We currently operate across Andhra Pradesh, India, with a focus on grassroots-level impact in both urban and rural communities.',
  },
  {
    question: 'How is my donation used by Hridayam Hope Foundation?',
    answer:
      'Every donation is used transparently. Funds go directly to program activities including food distribution, educational materials, tree plantation drives, health camps, and technology access for underserved youth. We maintain 100% transparency in fund usage.',
  },
  {
    question: 'How can I partner with Hridayam Hope Foundation as a business or organization?',
    answer:
      'We welcome CSR partnerships, institutional collaborations, and community partnerships. Contact us at hridayamhopefoundation@gmail.com or call +91-81217-02286 to discuss how we can work together for social impact.',
  },
] as const;
