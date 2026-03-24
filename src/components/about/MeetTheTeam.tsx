'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Users } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { ABOUT_TEAM } from '@/lib/about-constants';

const INITIAL_VISIBLE_COUNT = 8;

export default function MeetTheTeam() {
	const [showAll, setShowAll] = useState(false);
	const visibleMembers = showAll ? ABOUT_TEAM.members : ABOUT_TEAM.members.slice(0, INITIAL_VISIBLE_COUNT);

	return (
		<section id="team" className="bg-white px-5 py-16 sm:py-24 lg:px-8" aria-label="Our team">
			<div className="mx-auto max-w-7xl">
				{/* Header */}
				<motion.div
					className="mx-auto mb-10 max-w-3xl text-center sm:mb-14"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
				>
					<motion.p variants={fadeUp} className="text-[10px] font-semibold uppercase tracking-[2.5px] hp-gradient-text sm:text-xs">
						{ABOUT_TEAM.eyebrow}
					</motion.p>
					<motion.h2
						variants={fadeUp}
						className="font-(family-name:--font-poppins) mt-3 text-2xl font-bold leading-tight text-hp-text-dark sm:text-4xl lg:text-[42px]"
					>
						{ABOUT_TEAM.headline}{' '}
						<span className="font-(family-name:--font-playfair) italic hp-gradient-text">{ABOUT_TEAM.headlineAccent}</span>
					</motion.h2>
					<motion.p variants={fadeUp} className="mt-3 text-sm text-hp-text-light sm:mt-4 sm:text-base">
						{ABOUT_TEAM.subtitle}
					</motion.p>

					{/* Badge */}
					<motion.div
						variants={fadeUp}
						className="mt-6 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50/50 px-4 py-2"
					>
						<Users size={14} className="text-hp-primary" />
						<span className="text-xs font-medium text-hp-text-dark sm:text-sm">{ABOUT_TEAM.badge}</span>
					</motion.div>
				</motion.div>

				{/* Compact Grid */}
				<motion.div
					className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<AnimatePresence mode="popLayout">
						{visibleMembers.map((member, index) => (
							<motion.div
								key={`${member.name}-${index}`}
								variants={fadeUp}
								layout
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95 }}
								whileHover={{ y: -4 }}
								className="group relative flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-hp-primary/20 hover:shadow-md"
							>
								{/* <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-hp-bg-1 text-hp-primary group-hover:bg-hp-primary group-hover:text-white transition-colors duration-300">
									<span className="text-sm font-bold">{member.name.charAt(0)}</span>
								</div> */}
								<div className="min-w-0">
									<h3 className="truncate font-(family-name:--font-poppins) text-[15px] font-bold text-hp-text-dark group-hover:text-hp-primary transition-colors">
										{member.name}
									</h3>
									<div className="mt-0.5 flex items-center gap-1 text-hp-text-light">
										<MapPin size={10} className="flex-shrink-0" />
										<p className="truncate text-[11px] leading-none sm:text-xs">
											{member.address}
										</p>
									</div>
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>

				{/* See More Button */}
				{ABOUT_TEAM.members.length > INITIAL_VISIBLE_COUNT && (
					<motion.div 
						className="mt-12 flex justify-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
					>
						<button
							onClick={() => setShowAll(!showAll)}
							className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-8 py-3 font-(family-name:--font-poppins) text-sm font-bold text-hp-text-dark transition-all hover:bg-gray-50 hover:text-hp-primary active:scale-95 shadow-sm hover:shadow-md"
						>
							{showAll ? 'Show Less' : `See All ${ABOUT_TEAM.members.length} Members`}
							<ChevronDown 
								size={18} 
								className={`transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} 
							/>
						</button>
					</motion.div>
				)}
			</div>
		</section>
	);
}
