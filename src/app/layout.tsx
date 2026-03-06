import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Poppins, Playfair_Display } from 'next/font/google';
import { SITE_CONFIG } from '@/lib/seo-constants';
import './globals.css';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
});

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	variable: '--font-poppins',
});

const playfair = Playfair_Display({
	subsets: ['latin'],
	weight: ['400', '600'],
	variable: '--font-playfair',
});

// ── Rich Metadata ──────────────────────────────────────────────────
export const metadata: Metadata = {
	metadataBase: new URL(SITE_CONFIG.url),

	title: {
		default: `${SITE_CONFIG.name} — From the Heart, For Humanity`,
		template: `%s | ${SITE_CONFIG.name}`,
	},
	description: SITE_CONFIG.description,
	keywords: [...SITE_CONFIG.keywords],
	authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
	creator: SITE_CONFIG.name,
	publisher: SITE_CONFIG.name,

	icons: {
		icon: '/favicon.ico',
		apple: '/logo.webp',
	},

	// ── Canonical & Alternates ──
	alternates: {
		canonical: '/',
		languages: {
			'en-IN': '/',
			'te-IN': '/te',
			'hi-IN': '/hi',
		},
	},

	// ── Open Graph ──
	openGraph: {
		type: 'website',
		locale: SITE_CONFIG.locale,
		url: SITE_CONFIG.url,
		siteName: SITE_CONFIG.name,
		title: `${SITE_CONFIG.name} — From the Heart, For Humanity`,
		description: SITE_CONFIG.description,
		images: [
			{
				url: '/hero-girl-plant.webp',
				width: 1200,
				height: 630,
				alt: 'Hridayam Hope Foundation — Empowering communities in Andhra Pradesh',
			},
		],
	},

	// ── Twitter Card ──
	twitter: {
		card: 'summary_large_image',
		title: `${SITE_CONFIG.name} — From the Heart, For Humanity`,
		description: SITE_CONFIG.shortDescription,
		images: ['/hero-girl-plant.webp'],
	},

	// ── Robots ──
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},

	// ── Verification ──
	// verification: {
	// 	google: 'your-google-site-verification-code',
	// },

	// ── Category ──
	category: 'nonprofit',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				{/* Google Tag Manager */}
				<Script
					id="gtm-script"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${SITE_CONFIG.gtmId}');`,
					}}
				/>
			</head>
			<body className={`${inter.variable} ${poppins.variable} ${playfair.variable} ${inter.className}`}>
				{/* Google Tag Manager (noscript) */}
				<noscript>
					<iframe
						src={`https://www.googletagmanager.com/ns.html?id=${SITE_CONFIG.gtmId}`}
						height="0"
						width="0"
						style={{ display: 'none', visibility: 'hidden' }}
					/>
				</noscript>
				{children}
			</body>
		</html>
	);
}
