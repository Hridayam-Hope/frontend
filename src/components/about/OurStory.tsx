'use client';

import { motion } from 'framer-motion';
import { MapPin, TrendingUp, Heart, Calendar } from 'lucide-react';
import { fadeUp, slideInLeft, slideInRight, staggerContainer } from '@/lib/animations';
import { ABOUT_STORY } from '@/lib/about-constants';

export default function OurStory() {
	return (
		<section className="bg-hp-bg-2 py-16 sm:py-24" aria-label="Our story">
			<div className="mx-auto max-w-7xl px-5 lg:px-8">
				<motion.div
					className="grid gap-10 lg:grid-cols-2 lg:gap-16"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.15 }}
				>
					{/* Left: Story */}
					<motion.div variants={slideInLeft} className="space-y-5">
						<p className="text-[10px] font-semibold uppercase tracking-[2.5px] hp-gradient-text sm:text-xs">{ABOUT_STORY.eyebrow}</p>
						<h2 className="font-(family-name:--font-poppins) text-2xl font-bold leading-tight text-hp-text-dark sm:text-3xl lg:text-4xl">
							{ABOUT_STORY.headline}
							<br />
							<span className="font-(family-name:--font-playfair) italic hp-gradient-text">{ABOUT_STORY.headlineItalic}</span>
						</h2>

						{ABOUT_STORY.paragraphs.map((p: string, i: number) => (
							<p key={i} className="text-sm leading-[1.8] text-hp-text-dark/80 sm:text-base">
								{p}
							</p>
						))}
					</motion.div>

					{/* Right: Info Cards  -  in gray frame */}
					<motion.div variants={slideInRight} className="rounded-[2rem] bg-gray-50 p-5 sm:rounded-[2.5rem] sm:p-7">
						<div className="space-y-4">
							{/* Since Card */}
							<motion.div
								whileHover={{ y: -4, scale: 1.01 }}
								transition={{ type: 'spring', stiffness: 300, damping: 25 }}
								className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6"
							>
								<div className="mb-3 flex items-center gap-2">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-hp-primary/10 transition-all duration-300 group-hover:bg-hp-primary/20 group-hover:scale-110">
										<Calendar size={16} className="text-hp-primary" />
									</div>
									<span className="text-[10px] font-bold uppercase tracking-wider text-hp-primary sm:text-xs">
										{ABOUT_STORY.infoCards.since.label}
									</span>
								</div>
								<p className="text-sm leading-relaxed text-hp-text-dark/70">{ABOUT_STORY.infoCards.since.text}</p>
							</motion.div>

							{/* Focus + Impact Row */}
							<div className="grid grid-cols-2 gap-4">
								<motion.div
									whileHover={{ y: -4, scale: 1.02 }}
									transition={{ type: 'spring', stiffness: 300, damping: 25 }}
									className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md"
								>
									<div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-hp-accent/10 transition-all duration-300 group-hover:bg-hp-accent/20 group-hover:scale-110">
										<MapPin size={16} className="text-hp-accent" />
									</div>
									<p className="font-(family-name:--font-poppins) text-sm font-semibold text-hp-text-dark">
										{ABOUT_STORY.infoCards.focus.label}
									</p>
									<p className="mt-1 text-xs text-hp-text-light">{ABOUT_STORY.infoCards.focus.text}</p>
								</motion.div>
								<motion.div
									whileHover={{ y: -4, scale: 1.02 }}
									transition={{ type: 'spring', stiffness: 300, damping: 25 }}
									className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md"
								>
									<div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 transition-all duration-300 group-hover:bg-emerald-100 group-hover:scale-110">
										<TrendingUp size={16} className="text-emerald-500" />
									</div>
									<p className="font-(family-name:--font-poppins) text-sm font-semibold text-hp-text-dark">
										{ABOUT_STORY.infoCards.impact.label}
									</p>
									<p className="mt-1 text-xs text-hp-text-light">{ABOUT_STORY.infoCards.impact.text}</p>
								</motion.div>
							</div>

							{/* Core Belief */}
							<motion.div
								whileHover={{ y: -4, scale: 1.01 }}
								transition={{ type: 'spring', stiffness: 300, damping: 25 }}
								className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6"
							>
								<div className="mb-2 flex items-center gap-2">
									<Heart size={14} className="text-hp-primary fill-hp-primary/20 transition-transform duration-300 group-hover:scale-125" />
									<span className="text-[10px] font-bold uppercase tracking-wider text-hp-text-light sm:text-xs">Core Belief</span>
								</div>
								<p className="font-(family-name:--font-playfair) text-base italic text-hp-text-dark sm:text-lg">
									{ABOUT_STORY.infoCards.belief}
								</p>
							</motion.div>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
