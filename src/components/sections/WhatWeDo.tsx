'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { ABOUT_PILLARS } from '@/lib/about-constants';

export default function WhatWeDo() {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: false,
		align: 'start',
		slidesToScroll: 1,
		containScroll: 'trimSnaps',
	});

	const [selectedIndex, setSelectedIndex] = useState(0);
	const [canPrev, setCanPrev] = useState(false);
	const [canNext, setCanNext] = useState(true);

	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		setSelectedIndex(emblaApi.selectedScrollSnap());
		setCanPrev(emblaApi.canScrollPrev());
		setCanNext(emblaApi.canScrollNext());
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		onSelect();
		emblaApi.on('select', onSelect);
		emblaApi.on('reInit', onSelect);
	}, [emblaApi, onSelect]);

	return (
		<section id="what-we-do" className="bg-white py-14 sm:py-28" aria-label="What we do">
			<div className="mx-auto max-w-7xl px-5 lg:px-8">
				{/* Header */}
				<motion.div
					className="mx-auto mb-10 max-w-2xl text-center sm:mb-14"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
				>
					<motion.p
						variants={fadeUp}
						className="text-[10px] font-semibold uppercase tracking-[2px] hp-gradient-text sm:text-xs sm:tracking-[2.5px]"
					>
						WHAT WE DO
					</motion.p>
					<motion.h2
						variants={fadeUp}
						className="font-(family-name:--font-poppins) mt-2 text-2xl font-bold text-hp-text-dark sm:mt-3 sm:text-4xl lg:text-[40px]"
					>
						Our Work, Rooted in Purpose
					</motion.h2>
					<motion.p variants={fadeUp} className="mt-3 text-sm text-hp-text-light sm:mt-4 sm:text-base">
						We drive real change through six core focus areas. Each initiative is designed to empower, educate, and inspire lasting
						transformation.
					</motion.p>
				</motion.div>

				{/* Carousel */}
				<motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
					<div className="relative">
						<div ref={emblaRef} className="overflow-hidden">
							<div className="flex gap-4 sm:gap-6">
								{ABOUT_PILLARS.pillars.map((pillar) => {
									return (
										<motion.div key={pillar.slug} variants={fadeUp} className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_32%]">
											<Link 
												href={`/what-we-do#${pillar.slug}`}
												className="group block"
											>
												<div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-50 border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl sm:rounded-[3rem]">
													<Image
														src={pillar.image}
														alt={pillar.title}
														fill
														className="object-cover transition-transform duration-700 group-hover:scale-105"
														sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 32vw"
													/>
												</div>
												<div className="mt-6 text-center sm:mt-8 px-2">
													<h3 className="font-(family-name:--font-poppins) text-lg font-bold text-hp-text-dark transition-colors group-hover:text-hp-primary sm:text-xl lg:text-2xl leading-tight">
														{pillar.title}
													</h3>
													<p className="mt-2 line-clamp-2 text-sm leading-relaxed text-hp-text-light sm:mt-3 sm:text-base">
														{pillar.description}
													</p>
												</div>
											</Link>
										</motion.div>
									);
								})}
							</div>
						</div>
					</div>

					{/* Navigation Controls (Dots & Arrows) */}
					<div className="mt-10 relative flex items-center justify-center sm:mt-16">
						{/* Dots (Pagination) - Center */}
						<div className="flex gap-2">
							{ABOUT_PILLARS.pillars.map((_, i) => (
								<button
									key={i}
									onClick={() => emblaApi?.scrollTo(i)}
									className={`h-1.5 rounded-full transition-all duration-300 ${
										i === selectedIndex ? 'w-8 hp-gradient-bg' : 'w-2 bg-gray-200 hover:bg-gray-300'
									}`}
									aria-label={`Go to ${ABOUT_PILLARS.pillars[i].title}`}
								/>
							))}
						</div>

						{/* Chevron Arrows - Right */}
						<div className="absolute right-0 hidden items-center gap-2 sm:flex">
							<button
								onClick={() => emblaApi?.scrollPrev()}
								disabled={!canPrev}
								className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-hp-text-dark transition-all hover:bg-hp-primary hover:text-white disabled:opacity-30 disabled:pointer-events-none"
								aria-label="Previous slide"
							>
								<ChevronLeft size={18} />
							</button>
							<button
								onClick={() => emblaApi?.scrollNext()}
								disabled={!canNext}
								className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-hp-text-dark transition-all hover:bg-hp-primary hover:text-white disabled:opacity-30 disabled:pointer-events-none"
								aria-label="Next slide"
							>
								<ChevronRight size={18} />
							</button>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
