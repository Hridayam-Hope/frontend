'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { BookOpen, Heart, Utensils, Users, Leaf, Laptop, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { PROGRAMS } from '@/lib/constants';
import SignatureButton from '@/components/ui/SignatureButton';

const iconMap = { BookOpen, Heart, Utensils, Users, Leaf, Laptop } as const;

export default function WhatWeDo() {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: false,
		align: 'start',
		slidesToScroll: 1,
		containScroll: 'trimSnaps',
	});

	const [canPrev, setCanPrev] = useState(false);
	const [canNext, setCanNext] = useState(true);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		setCanPrev(emblaApi.canScrollPrev());
		setCanNext(emblaApi.canScrollNext());
		setSelectedIndex(emblaApi.selectedScrollSnap());
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
								{PROGRAMS.map((prog) => {
									const Icon = iconMap[prog.icon as keyof typeof iconMap];
									return (
										<motion.div key={prog.title} variants={fadeUp} className="min-w-0 flex-[0_0_75%] sm:flex-[0_0_45%] lg:flex-[0_0_30%]">
											<div className="group relative aspect-[3/4] overflow-hidden rounded-3xl bg-hp-text-dark/5 shadow-md transition-all duration-500 sm:aspect-[3/4]">
												{/* Image */}
												<Image
													src={prog.image}
													alt={prog.title}
													fill
													className="object-cover transition-transform duration-700 group-hover:scale-110"
													sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
												/>

												{/* Gradient Overlay (Constant) */}
												<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

												{/* Icon Badge (Static) */}
												<div className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg z-10">
													<Icon size={20} className="text-white" />
												</div>

												{/* Slide-up Content */}
												<div className="absolute inset-x-0 bottom-0 z-20 p-4 transition-transform duration-500 sm:p-6">
													<div className="flex flex-col gap-2 rounded-2xl bg-black/40 p-3 backdrop-blur-xl border border-white/10 shadow-2xl sm:p-5 sm:gap-4">
														<h3 className="font-(family-name:--font-poppins) text-lg font-bold text-white sm:text-xl">{prog.title}</h3>
														{/* <p className="text-xs leading-relaxed text-white/80 sm:text-sm">
															{prog.description}
														</p> */}
														{/* <div className="translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
															<SignatureButton href="#" showIcon={false} size="sm" className="w-full !rounded-xl">
																Learn More
															</SignatureButton>
														</div> */}
													</div>
												</div>
											</div>
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
							{PROGRAMS.map((_, i) => (
								<button
									key={i}
									onClick={() => emblaApi?.scrollTo(i)}
									className={`h-1.5 rounded-full transition-all duration-300 ${
										i === selectedIndex ? 'w-8 hp-gradient-bg' : 'w-2 bg-gray-200 hover:bg-gray-300'
									}`}
									aria-label={`Go to program ${i + 1}`}
								/>
							))}
						</div>

						{/* Chevron Arrows - Right */}
						<div className="absolute right-0 flex gap-2 sm:gap-3">
							<button
								onClick={() => emblaApi?.scrollPrev()}
								disabled={!canPrev}
								className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100 text-hp-text-dark transition-all hover:bg-gray-50 hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none sm:h-11 sm:w-11 sm:rounded-2xl"
								aria-label="Previous programs"
							>
								<ChevronLeft size={20} />
							</button>
							<button
								onClick={() => emblaApi?.scrollNext()}
								disabled={!canNext}
								className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100 text-hp-text-dark transition-all hover:bg-gray-50 hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none sm:h-11 sm:w-11 sm:rounded-2xl"
								aria-label="Next programs"
							>
								<ChevronRight size={20} />
							</button>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
