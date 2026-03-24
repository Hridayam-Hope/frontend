'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { fadeUp } from '@/lib/animations';
import { ACTIVITIES } from '@/lib/constants';
import SignatureButton from '@/components/ui/SignatureButton';

export default function RecentPrograms() {
	return (
		<section
			id="recent-programs"
			className="relative overflow-hidden py-20 sm:py-32"
			style={{ backgroundColor: '#F8FAFC' }}
			aria-label="Recent programs masonry gallery"
		>
			{/* Soft background glow */}
			<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-hp-teal/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
			<div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-hp-blue/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

			<div className="mx-auto max-w-7xl px-5 lg:px-8">
				{/* Header */}
				<motion.div
					className="mx-auto mb-16 max-w-2xl text-center sm:mb-24"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
				>
					<motion.span
						variants={fadeUp}
						className="inline-block px-3 py-1 rounded-full bg-hp-teal/10 hp-gradient-text text-[10px] font-bold uppercase tracking-widest mb-4"
					>
						RECENT PROGRAMS
					</motion.span>
					<motion.h2
						variants={fadeUp}
						className="font-(family-name:--font-poppins) text-3xl font-bold text-hp-text-dark sm:text-4xl lg:text-5xl"
					>
						Moments That Matter
					</motion.h2>
					<motion.p variants={fadeUp} className="mt-4 text-sm text-hp-text-light sm:text-base max-w-lg mx-auto">
						A visual journey through our latest initiatives and community stories.
					</motion.p>
				</motion.div>

				{/* Centered Layout */}
				<div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
					{ACTIVITIES.map((activity, index) => (
						<motion.div
							key={activity.title}
							initial={{ opacity: 0, scale: 0.85, y: 40 }}
							whileInView={{ opacity: 1, scale: 1, y: 0 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{
								delay: (index % 3) * 0.05,
								duration: 0.6,
								type: 'spring',
								damping: 15,
								stiffness: 100,
							}}
							className="w-full max-w-sm lg:max-w-[380px]"
						>
							<article className="group relative overflow-hidden rounded-[2rem] bg-white shadow-xl transition-all duration-700 hover:shadow-2xl sm:rounded-[2.5rem]">
								{/* Image with Uniform Height */}
								<div className="relative overflow-hidden aspect-[4/5]">
									<Image
										src={activity.image}
										alt={activity.title}
										fill
										className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:blur-[6px]"
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									/>

									{/* Professional Overlay System */}

									{/* Default Shadow Gradient */}
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-700 group-hover:opacity-0" />

									{/* Hover Blur Reveal */}
									<div className="absolute inset-0 z-20 flex flex-col justify-end bg-black/40 p-5 opacity-0 backdrop-blur-md transition-all duration-700 group-hover:opacity-100 sm:p-8 pointer-events-none group-hover:pointer-events-auto">
										<div className="translate-y-8 transition-all duration-700 ease-[0.22, 1, 0.36, 1] group-hover:translate-y-0">
											<div className="flex items-center gap-2 mb-3 sm:mb-4">
												<span
													className={`px-2 py-0.5 rounded-lg text-[9px] font-bold text-white uppercase tracking-wider ${activity.badgeColor}`}
												>
													{activity.badge}
												</span>
												<div className="flex items-center gap-1.5 text-white/80 text-[10px] sm:text-[11px]">
													<Calendar size={12} />
													<span>{activity.meta}</span>
												</div>
											</div>

											<h3 className="font-(family-name:--font-poppins) text-lg font-bold text-white mb-2 leading-tight underline decoration-hp-teal/30 decoration-2 underline-offset-4 sm:text-xl sm:mb-3">
												{activity.title}
											</h3>

											<p className="text-[11px] leading-relaxed text-white/80 mb-4 line-clamp-3 sm:mb-6 sm:line-clamp-4">
												{activity.description}
											</p>

											<SignatureButton
												href={`/story/${activity.id}`}
												size="sm"
												showIcon={false}
												className="w-full !rounded-xl !bg-white !text-hp-text-dark hover:!bg-hp-teal hover:!text-white border-none shadow-2xl sm:!rounded-2xl"
											>
												Explore Story
											</SignatureButton>
										</div>
									</div>

									{/* Default State Branding (Bottom Left) */}
									<div className="absolute bottom-6 left-6 right-6 transition-all duration-700 group-hover:opacity-0 group-hover:translate-y-8 sm:bottom-8 sm:left-8 sm:right-8 pointer-events-none">
										<div className="flex items-center gap-2 mb-1.5 sm:mb-2 text-white/60">
											<div className="h-0.5 w-5 bg-current rounded-full" />
											<p className="text-[9px] font-bold uppercase tracking-[0.2em]">{activity.meta}</p>
										</div>
										<h3 className="font-(family-name:--font-poppins) text-base font-bold text-white drop-shadow-lg sm:text-lg">
											{activity.title}
										</h3>
									</div>

									{/* Static Badge */}
									<div className="absolute top-6 right-6 z-30 transition-all duration-700 pointer-events-none">
										<span
											className={`px-3 py-1.5 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest shadow-2xl backdrop-blur-sm border border-white/10 ${activity.badgeColor}`}
										>
											{activity.badge}
										</span>
									</div>
								</div>
							</article>
						</motion.div>
					))}
				</div>

				{/* Global CTA */}
				{/* <motion.div
					className="mt-16 text-center"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.5 }}
					variants={fadeUp}
				>
					<SignatureButton href="#" showIcon={false}>
						Explore More Moments
					</SignatureButton>
				</motion.div> */}
			</div>
		</section>
	);
}
