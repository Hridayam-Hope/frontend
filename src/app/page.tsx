import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import WhoWeAre from '@/components/sections/WhoWeAre';
import WhatWeDo from '@/components/sections/WhatWeDo';
import RecentPrograms from '@/components/sections/RecentPrograms';
import Testimonials from '@/components/sections/Testimonials';
import Newsletter from '@/components/sections/Newsletter';
// import MobileDonateButton from '@/components/layout/MobileDonateButton';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import SixPillars from '@/components/about/SixPillars';

export default function Home() {
	return (
		<>
			<JsonLd />
			<Header />
			<main>
				<Hero />
				<WhoWeAre />
				{/* <WhatWeDo /> */}
				<SixPillars />
				<RecentPrograms />
				<Testimonials />
				<Newsletter />
			</main>
			<Footer />
			{/* <MobileDonateButton /> */}
		</>
	);
}
