import { SITE_CONFIG, SEO_FAQS } from '@/lib/seo-constants';

/**
 * JSON-LD Structured Data for SEO/GEO/AEO.
 * Renders Organization, LocalBusiness, WebSite, and FAQPage schemas.
 * Place this component inside the homepage (or layout) to inject structured data.
 */
export default function JsonLd() {
	const organizationSchema = {
		'@context': 'https://schema.org',
		'@type': 'NGO',
		'@id': `${SITE_CONFIG.url}/#organization`,
		name: SITE_CONFIG.name,
		alternateName: SITE_CONFIG.shortName,
		url: SITE_CONFIG.url,
		logo: `${SITE_CONFIG.url}/logo.webp`,
		image: `${SITE_CONFIG.url}/hero-girl-plant.webp`,
		description: SITE_CONFIG.description,
		foundingDate: SITE_CONFIG.foundingDate,
		sameAs: [SITE_CONFIG.social.facebook, SITE_CONFIG.social.instagram, SITE_CONFIG.social.linkedin, SITE_CONFIG.social.youtube],
		contactPoint: {
			'@type': 'ContactPoint',
			telephone: SITE_CONFIG.contact.phone,
			email: SITE_CONFIG.contact.email,
			contactType: 'customer service',
			areaServed: 'IN',
			availableLanguage: ['English', 'Telugu', 'Hindi'],
		},
		address: {
			'@type': 'PostalAddress',
			addressRegion: SITE_CONFIG.contact.addressRegion,
			addressCountry: SITE_CONFIG.contact.addressCountry,
		},
		nonprofitStatus: 'Nonprofit501c3',
		keywords: SITE_CONFIG.keywords.join(', '),
	};

	const localBusinessSchema = {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		'@id': `${SITE_CONFIG.url}/#localbusiness`,
		name: SITE_CONFIG.name,
		url: SITE_CONFIG.url,
		telephone: SITE_CONFIG.contact.phone,
		email: SITE_CONFIG.contact.email,
		image: `${SITE_CONFIG.url}/logo.webp`,
		address: {
			'@type': 'PostalAddress',
			addressRegion: SITE_CONFIG.contact.addressRegion,
			addressCountry: SITE_CONFIG.contact.addressCountry,
		},
		sameAs: [SITE_CONFIG.social.facebook, SITE_CONFIG.social.instagram, SITE_CONFIG.social.linkedin, SITE_CONFIG.social.youtube],
	};

	const websiteSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${SITE_CONFIG.url}/#website`,
		name: SITE_CONFIG.name,
		url: SITE_CONFIG.url,
		description: SITE_CONFIG.shortDescription,
		inLanguage: ['en', 'te', 'hi'],
		publisher: { '@id': `${SITE_CONFIG.url}/#organization` },
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
			},
			'query-input': 'required name=search_term_string',
		},
	};

	const faqSchema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: SEO_FAQS.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer,
			},
		})),
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
		</>
	);
}
