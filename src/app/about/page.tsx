import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileDonateButton from '@/components/layout/MobileDonateButton';
import AboutHero from '@/components/about/AboutHero';
import OurStory from '@/components/about/OurStory';
import OurPurpose from '@/components/about/OurPurpose';
import SixPillars from '@/components/about/SixPillars';
import MeetTheTeam from '@/components/about/MeetTheTeam';
import AboutFAQs from '@/components/about/AboutFAQs';
import AboutCTA from '@/components/about/AboutCTA';
import { SITE_CONFIG } from '@/lib/seo-constants';

export const metadata: Metadata = {
	title: 'About Us',
	description: `Learn about ${SITE_CONFIG.name}  -  our story, mission, team, and the six pillars driving community transformation across Andhra Pradesh.`,
	openGraph: {
		title: `About Us | ${SITE_CONFIG.name}`,
		description: `Discover how ${SITE_CONFIG.name} serves humanity through education, health, environmental protection, and community empowerment.`,
	},
};

export default function AboutPage() {
	return (
		<>
			<Header />
			<main>
				<AboutHero />
				<OurStory />
				<OurPurpose />
				<SixPillars />
				<MeetTheTeam />
				<AboutFAQs />
				<AboutCTA />
			</main>
			<Footer />
			<MobileDonateButton />
		</>
	);
}
