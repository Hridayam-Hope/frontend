'use client';

import { motion } from 'framer-motion';
import { Target, Eye } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { ABOUT_PURPOSE } from '@/lib/about-constants';

export default function OurPurpose() {
	return (
		<section className="bg-white px-5 py-16 sm:py-24 lg:px-8" aria-label="Our purpose">
			<div className="relative mx-auto max-w-7xl">
				{/* Big gray card  -  the "frame" */}
				<div className="rounded-[2rem] bg-gray-50 px-6 pb-40 pt-12 sm:rounded-[2.5rem] sm:px-10 sm:pb-48 sm:pt-16 md:pb-36">
					<motion.div
						className="mx-auto max-w-3xl text-center"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
						variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
					>
						<motion.p variants={fadeUp} className="text-[10px] font-semibold uppercase tracking-[2.5px] hp-gradient-text sm:text-xs">
							{ABOUT_PURPOSE.eyebrow}
						</motion.p>
						<motion.h2
							variants={fadeUp}
							className="font-(family-name:--font-poppins) mt-3 text-2xl font-bold leading-tight text-hp-text-dark sm:text-4xl lg:text-[42px]"
						>
							{ABOUT_PURPOSE.headline}{' '}
							<span className="font-(family-name:--font-playfair) italic hp-gradient-text">{ABOUT_PURPOSE.headlineAccent1}</span>
							{ABOUT_PURPOSE.headlineMiddle}{' '}
							<span className="font-(family-name:--font-playfair) italic hp-gradient-text">{ABOUT_PURPOSE.headlineAccent2}</span>
						</motion.h2>
					</motion.div>
				</div>

				{/* Hanging cards  -  pulled up into the gray frame */}
				<motion.div
					className="-mt-28 relative z-10 mx-auto grid max-w-5xl gap-6 px-4 sm:-mt-36 sm:px-6 md:-mt-24 md:grid-cols-2 lg:gap-8"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
				>
					{/* Mission Card */}
					<motion.div
						variants={fadeUp}
						whileHover={{ y: -6, scale: 1.01 }}
						transition={{ type: 'spring', stiffness: 300, damping: 25 }}
						className="group relative overflow-hidden rounded-3xl border-2 border-gray-100 bg-white p-7 shadow-md sm:p-9"
					>
						{/* Decorative top accent */}
						<div className="absolute top-0 left-0 right-0 h-1 hp-gradient-bg opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

						{/* Icon circle */}
						<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-hp-primary/10 transition-all duration-300 group-hover:bg-hp-primary/20 group-hover:scale-110">
							<Target size={22} className="text-hp-primary transition-transform duration-300 group-hover:rotate-12" />
						</div>

						<div className="mb-2 inline-block rounded-full bg-hp-primary/8 px-3 py-1">
							<span className="text-[10px] font-bold uppercase tracking-wider text-hp-primary sm:text-xs">
								{ABOUT_PURPOSE.mission.label}
							</span>
						</div>
						<h3 className="font-(family-name:--font-poppins) text-xl font-bold text-hp-text-dark sm:text-2xl">
							{ABOUT_PURPOSE.mission.title}
						</h3>
						<p className="mt-3 text-sm leading-[1.8] text-hp-text-dark/70 sm:text-base">{ABOUT_PURPOSE.mission.text}</p>
					</motion.div>

					{/* Vision Card */}
					<motion.div
						variants={fadeUp}
						whileHover={{ y: -6, scale: 1.01 }}
						transition={{ type: 'spring', stiffness: 300, damping: 25 }}
						className="group relative overflow-hidden rounded-3xl border-2 border-gray-100 bg-white p-7 shadow-md sm:p-9"
					>
						{/* Decorative top accent */}
						<div className="absolute top-0 left-0 right-0 h-1 hp-gradient-bg opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

						{/* Icon circle */}
						<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-hp-accent/10 transition-all duration-300 group-hover:bg-hp-accent/20 group-hover:scale-110">
							<Eye size={22} className="text-hp-accent transition-transform duration-300 group-hover:rotate-12" />
						</div>

						<div className="mb-2 inline-block rounded-full bg-hp-accent/8 px-3 py-1">
							<span className="text-[10px] font-bold uppercase tracking-wider text-hp-accent sm:text-xs">{ABOUT_PURPOSE.vision.label}</span>
						</div>
						<h3 className="font-(family-name:--font-poppins) text-xl font-bold text-hp-text-dark sm:text-2xl">
							{ABOUT_PURPOSE.vision.title}
						</h3>
						<p className="mt-3 text-sm leading-[1.8] text-hp-text-dark/70 sm:text-base">{ABOUT_PURPOSE.vision.text}</p>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
