'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { ABOUT_PILLARS } from '@/lib/about-constants';

export default function SixPillars() {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: false,
		align: 'start',
		slidesToScroll: 1,
		breakpoints: {
			'(min-width: 640px)': { active: false },
		},
	});

	const [selectedIndex, setSelectedIndex] = useState(0);

	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		setSelectedIndex(emblaApi.selectedScrollSnap());
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		onSelect();
		emblaApi.on('select', onSelect);
		emblaApi.on('reInit', onSelect);
	}, [emblaApi, onSelect]);

	return (
		<section className="bg-hp-bg-1 py-16 sm:py-24" aria-label="Six pillars">
			<div className="mx-auto max-w-7xl px-5 lg:px-8">
				{/* Header */}
				<motion.div
					className="mx-auto mb-10 max-w-3xl text-center sm:mb-14"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
				>
					<motion.p variants={fadeUp} className="text-[10px] font-semibold uppercase tracking-[2.5px] hp-gradient-text sm:text-xs">
						{ABOUT_PILLARS.eyebrow}
					</motion.p>
					<motion.h2
						variants={fadeUp}
						className="font-(family-name:--font-poppins) mt-3 text-2xl font-bold leading-tight text-hp-text-dark sm:text-4xl lg:text-[42px]"
					>
						{ABOUT_PILLARS.headline}{' '}
						<span className="font-(family-name:--font-playfair) italic hp-gradient-text">{ABOUT_PILLARS.headlineAccent}</span>
					</motion.h2>
					<motion.p variants={fadeUp} className="mt-3 text-sm text-hp-text-light sm:mt-4 sm:text-base">
						{ABOUT_PILLARS.subtitle}
					</motion.p>
				</motion.div>

				{/* Grid / Mobile Carousel */}
				<motion.div
					className="overflow-hidden sm:overflow-visible"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.1 }}
					ref={emblaRef}
				>
					<div className="flex gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
						{ABOUT_PILLARS.pillars.map((pillar, index) => (
							<motion.div
								key={pillar.title}
								variants={fadeUp}
								className="relative flex-[0_0_85%] min-w-0 sm:flex-none overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
							>
								{/* Badge */}
								<span
									className={`inline-block rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider sm:text-[10px] ${pillar.badgeColor}`}
								>
									{pillar.badge}
								</span>

								{/* Title */}
								<h3 className="font-(family-name:--font-poppins) mt-3 text-sm font-bold text-hp-text-dark sm:text-lg lg:text-xl">
									{pillar.title}
								</h3>

								{/* Description */}
								<p className="mt-2 text-[13px] leading-relaxed text-hp-text-dark/70 sm:text-sm">{pillar.description}</p>

								{/* Bullets */}
								<ul className="mt-3 space-y-1 sm:mt-4">
									{pillar.bullets.map((b: string) => (
										<li key={b} className="flex items-start gap-2 text-xs text-hp-text-dark/60 sm:text-sm">
											<span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-hp-primary/40" />
											{b}
										</li>
									))}
								</ul>

								{/* Learn more */}
								<Link
									href={`/what-we-do#${pillar.slug}`}
									className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-hp-primary transition-colors hover:text-hp-accent sm:mt-5 sm:text-sm"
								>
									Learn more
									<ArrowRight size={14} />
								</Link>
							</motion.div>
						))}
					</div>

					{/* Navigation Controls (Dots) - Mobile Only */}
					<div className="mt-8 flex items-center justify-center sm:hidden">
						<div className="flex gap-2">
							{ABOUT_PILLARS.pillars.map((_, i) => (
								<button
									key={i}
									onClick={() => emblaApi?.scrollTo(i)}
									className={`h-1 rounded-full transition-all duration-300 ${
										i === selectedIndex ? 'w-6 hp-gradient-bg' : 'w-1.5 bg-gray-200'
									}`}
									aria-label={`Go to pillar ${i + 1}`}
								/>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
