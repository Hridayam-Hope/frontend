'use client';

import { motion } from 'framer-motion';
import { Target, Heart, ShieldCheck, Users, BookOpen, Leaf, Sparkles } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { ABOUT_CORE_VALUES } from '@/lib/about-constants';

const ICONS = {
	Heart,
	ShieldCheck,
	Users,
	BookOpen,
	Leaf,
};

export default function CoreValues() {
	return (
		<section className="bg-hp-bg-1 py-16 sm:py-24" aria-label="Core values">
			<div className="mx-auto max-w-7xl px-5 lg:px-8">
				{/* Header */}
				<motion.div
					className="mx-auto mb-12 max-w-3xl text-center sm:mb-16"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
				>
					<motion.p variants={fadeUp} className="text-[10px] font-semibold uppercase tracking-[2.5px] hp-gradient-text sm:text-xs">
						{ABOUT_CORE_VALUES.eyebrow}
					</motion.p>
					<motion.h2
						variants={fadeUp}
						className="font-(family-name:--font-poppins) mt-3 text-2xl font-bold leading-tight text-hp-text-dark sm:text-4xl lg:text-[42px]"
					>
						{ABOUT_CORE_VALUES.headline}{' '}
						<span className="font-(family-name:--font-playfair) italic hp-gradient-text">{ABOUT_CORE_VALUES.headlineAccent}</span>
					</motion.h2>
					<motion.p variants={fadeUp} className="mt-3 text-sm text-hp-text-light sm:mt-4 sm:text-base">
						{ABOUT_CORE_VALUES.subtitle}
					</motion.p>
				</motion.div>

				{/* Grid */}
				<motion.div
					className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-6"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.1 }}
				>
					{ABOUT_CORE_VALUES.values.map((value, idx) => {
						const Icon = ICONS[value.icon as keyof typeof ICONS] || Sparkles;
						const colSpanClass = idx < 3 ? 'lg:col-span-2' : 'lg:col-span-3';
						return (
							<motion.div
								key={value.title}
								variants={fadeUp}
								whileHover={{ y: -6, scale: 1.02 }}
								transition={{ type: 'spring', stiffness: 300, damping: 25 }}
								className={`group relative overflow-hidden rounded-3xl border-2 border-gray-100 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:col-span-1 ${colSpanClass}`}
							>
								{/* Top line gradient */}
								<div className="absolute top-0 left-0 right-0 h-1 hp-gradient-bg opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
								
								<div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${value.bg} transition-all duration-300 group-hover:scale-110`}>
									<Icon size={22} className={`${value.color} transition-transform duration-300 group-hover:rotate-12`} />
								</div>
								
								<h3 className="font-(family-name:--font-poppins) text-lg font-bold text-hp-text-dark sm:text-xl">
									{value.title}
								</h3>
								<p className="mt-2 text-sm leading-[1.8] text-hp-text-dark/70">
									{value.description}
								</p>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
}
