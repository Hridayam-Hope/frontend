'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { ABOUT_TEAM } from '@/lib/about-constants';

export default function MeetTheTeam() {
	return (
		<section className="bg-white px-5 py-16 sm:py-24 lg:px-8" aria-label="Our team">
			{/* Big gray card frame wrapping everything */}
			<div className="mx-auto max-w-7xl rounded-[2rem] bg-gray-50 px-6 py-12 sm:rounded-[2.5rem] sm:px-10 sm:py-16">
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
						whileHover={{ scale: 1.05 }}
						className="mt-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm transition-shadow duration-300 hover:shadow-md"
					>
						<Users size={14} className="text-hp-primary" />
						<span className="text-xs font-medium text-hp-text-dark sm:text-sm">{ABOUT_TEAM.badge}</span>
					</motion.div>
				</motion.div>

				{/* Team cards  -  inside the frame */}
				<motion.div
					className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.15 }}
				>
					{ABOUT_TEAM.members.map((member: { name: string; role: string; bio: string; contact: string }) => (
						<motion.div
							key={member.name}
							variants={fadeUp}
							whileHover={{ y: -8, scale: 1.02 }}
							transition={{ type: 'spring', stiffness: 300, damping: 22 }}
							className="group relative overflow-hidden rounded-3xl border-2 border-gray-100 bg-white p-6 text-center shadow-md sm:p-7"
						>
							{/* Decorative gradient on hover */}
							<div className="absolute top-0 left-0 right-0 h-1 hp-gradient-bg opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

							{/* Placeholder Avatar */}
							<div className="relative mx-auto mb-5">
								<motion.div
									whileHover={{ scale: 1.08 }}
									className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-hp-primary/20 to-hp-accent/20 ring-3 ring-gray-100 transition-all duration-300 group-hover:ring-hp-primary/30 sm:h-24 sm:w-24"
								/>
							</div>

							<h3 className="font-(family-name:--font-poppins) text-base font-bold text-hp-text-dark sm:text-lg">{member.name}</h3>
							<p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-hp-primary sm:text-xs">{member.role}</p>
							<p className="mt-3 text-xs leading-relaxed text-hp-text-dark/60 sm:text-sm">{member.bio}</p>

							{/* Contact link */}
							<motion.a
								href="#"
								whileHover={{ x: 4 }}
								className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-hp-primary transition-colors hover:text-hp-accent sm:text-sm"
							>
								{member.contact}
								<ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
							</motion.a>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
