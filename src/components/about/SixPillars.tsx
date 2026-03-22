'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { ABOUT_PILLARS } from '@/lib/about-constants';

export default function SixPillars() {
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

				{/* Grid */}
				<motion.div
					className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.1 }}
				>
					{ABOUT_PILLARS.pillars.map((pillar) => (
						<motion.div
							key={pillar.title}
							variants={fadeUp}
							whileHover={{ y: -6, scale: 1.01 }}
							transition={{ type: 'spring', stiffness: 300, damping: 25 }}
							className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:border-hp-primary/15 sm:p-6"
						>
							{/* Hover gradient line at top */}
							<div className="absolute top-0 left-0 right-0 h-0.5 hp-gradient-bg opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

							{/* Badge */}
							<span
								className={`inline-block rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider transition-transform duration-300 group-hover:scale-105 sm:text-[10px] ${pillar.badgeColor}`}
							>
								{pillar.badge}
							</span>

							{/* Title */}
							<h3 className="font-(family-name:--font-poppins) mt-3 text-lg font-bold text-hp-text-dark sm:text-xl">{pillar.title}</h3>

							{/* Description */}
							<p className="mt-2 text-sm leading-relaxed text-hp-text-dark/70">{pillar.description}</p>

							{/* Bullets */}
							<ul className="mt-3 space-y-1.5">
								{pillar.bullets.map((b: string) => (
									<li key={b} className="flex items-start gap-2 text-xs text-hp-text-dark/60 sm:text-sm">
										<span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-hp-primary/40 transition-colors duration-300 group-hover:bg-hp-primary" />
										{b}
									</li>
								))}
							</ul>

							{/* Learn more */}
							<a
								href="#"
								className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-hp-primary transition-colors hover:text-hp-accent sm:text-sm"
							>
								Learn more
								<ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
							</a>
						</motion.div>
					))}
				</motion.div>

				{/* Explore All Link */}
				{/* <motion.div
					className="mt-10 text-center sm:mt-14"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={fadeUp}
				>
					<motion.a
						href="#"
						whileHover={{ x: 4 }}
						className="inline-flex items-center gap-2 font-(family-name:--font-poppins) text-sm font-semibold text-hp-text-dark transition-colors hover:text-hp-primary sm:text-base"
					>
						Explore All Programs
						<ArrowRight size={16} />
					</motion.a>
				</motion.div> */}
			</div>
		</section>
	);
}
