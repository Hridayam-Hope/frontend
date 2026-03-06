import type { Metadata } from 'next';
import { Inter, Poppins, Playfair_Display } from 'next/font/google';
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

export const metadata: Metadata = {
	title: 'Hridayam Hope Foundation  -  From the Heart, For Humanity',
	description:
		'Hridayam Hope Foundation is a non-profit organization committed to serving humanity with love, dignity, and purpose through education, health, and community empowerment.',
	icons: { icon: '/logo.webp' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={`${inter.variable} ${poppins.variable} ${playfair.variable} ${inter.className}`}>{children}</body>
		</html>
	);
}
