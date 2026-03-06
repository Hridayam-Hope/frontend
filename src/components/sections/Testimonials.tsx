'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { fadeUp } from '@/lib/animations';
import { TESTIMONIALS } from '@/lib/constants';

export default function Testimonials() {
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
	const [selectedIndex, setSelectedIndex] = useState(0);

	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		setSelectedIndex(emblaApi.selectedScrollSnap());
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		onSelect();
		emblaApi.on('select', onSelect);

		// Auto-play every 5 seconds
		const interval = setInterval(() => {
			emblaApi.scrollNext();
		}, 5000);

		// Pause on hover
		const root = emblaApi.rootNode();
		const pause = () => clearInterval(interval);
		const resume = () => {};

		root.addEventListener('mouseenter', pause);
		root.addEventListener('mouseleave', resume);

		return () => {
			clearInterval(interval);
			root.removeEventListener('mouseenter', pause);
			root.removeEventListener('mouseleave', resume);
		};
	}, [emblaApi, onSelect]);

	return (
		<section id="testimonials" className="bg-white py-14 sm:py-24" aria-label="Testimonials">
			<div className="mx-auto max-w-3xl px-5 lg:px-8">
				{/* Header */}
				<motion.div
					className="mb-8 text-center sm:mb-12"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
				>
					<motion.p
						variants={fadeUp}
						className="text-[10px] font-semibold uppercase tracking-[2px] hp-gradient-text sm:text-xs sm:tracking-[2.5px]"
					>
						TESTIMONIALS
					</motion.p>
					<motion.h2
						variants={fadeUp}
						className="font-(family-name:--font-poppins) mt-2 text-2xl font-bold text-hp-text-dark sm:mt-3 sm:text-4xl lg:text-[40px]"
					>
						Voices of Hope
					</motion.h2>
				</motion.div>

				{/* Carousel */}
				<motion.div className="relative" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
					<div ref={emblaRef} className="overflow-hidden">
						<div className="flex">
							{TESTIMONIALS.map((t, i) => (
								<div key={i} className="min-w-0 flex-[0_0_100%] px-4">
									<div className="text-center">
										{/* Quote Icon */}
										<Quote size={32} className="mx-auto mb-4 sm:mb-6" style={{ color: '#65BAC1' }} />

										{/* Quote Text */}
										<p className="font-(family-name:--font-playfair) text-base leading-relaxed text-hp-text-dark italic sm:text-2xl">
											&ldquo;{t.quote}&rdquo;
										</p>

										{/* Attribution */}
										<div className="mt-5 flex flex-col items-center gap-2 sm:mt-8 sm:gap-3">
											<div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-hp-bg-1 sm:h-20 sm:w-20 sm:border-3">
												<Image src={t.image} alt={t.name} fill className="object-cover" sizes="80px" />
											</div>
											<div>
												<p className="font-(family-name:--font-poppins) text-sm font-semibold text-hp-text-dark sm:text-base">
													{' '}
													- {t.name}
												</p>
												<p className="text-xs text-hp-text-light sm:text-sm">{t.role}</p>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Navigation Arrows */}
					<button
						onClick={() => emblaApi?.scrollPrev()}
						className="absolute -left-2 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-hp-text-light transition-all hover:shadow-xl hover:text-hp-text-dark"
						aria-label="Previous testimonial"
					>
						<ChevronLeft size={20} />
					</button>
					<button
						onClick={() => emblaApi?.scrollNext()}
						className="absolute -right-2 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-hp-text-light transition-all hover:shadow-xl hover:text-hp-text-dark"
						aria-label="Next testimonial"
					>
						<ChevronRight size={20} />
					</button>

					{/* Dots */}
					<div className="mt-8 flex justify-center gap-2">
						{TESTIMONIALS.map((_, i) => (
							<button
								key={i}
								onClick={() => emblaApi?.scrollTo(i)}
								className={`h-2 rounded-full transition-all duration-300 ${
									i === selectedIndex ? 'w-8 hp-gradient-bg' : 'w-2 bg-gray-300 hover:bg-gray-400'
								}`}
								aria-label={`Go to testimonial ${i + 1}`}
							/>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
