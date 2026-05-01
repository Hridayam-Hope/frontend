'use client';

import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { fadeUp } from '@/lib/animations';
import { ACTIVITIES } from '@/lib/constants';

export default function ProgramsPage() {
	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50/50">
				{/* ── Light & Airy Hero Section ── */}
				<section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-white border-b border-gray-100">
					{/* Subtle Background Gradients */}
					<div className="absolute inset-0 pointer-events-none">
						<div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-hp-primary/5 blur-[80px]" />
						<div className="absolute top-1/2 -left-24 w-[400px] h-[400px] rounded-full bg-hp-accent/5 blur-[80px]" />
					</div>

					{/* Dot Pattern Overlay */}
					<div
						className="absolute inset-0 opacity-[0.4] pointer-events-none"
						style={{
							backgroundImage: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)',
							backgroundSize: '32px 32px',
						}}
					/>

					<div className="relative z-10 mx-auto max-w-5xl px-5 lg:px-8 text-center">
						<motion.div
							initial="hidden"
							animate="visible"
							variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
						>
							<motion.div variants={fadeUp} className="flex justify-center mb-6">
								<span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-hp-bg-1 border border-hp-primary/10 text-xs font-bold uppercase tracking-widest hp-gradient-text shadow-sm">
									<Sparkles size={14} className="text-hp-primary" />
									Our Journey
								</span>
							</motion.div>
							<motion.h1
								variants={fadeUp}
								className="font-(family-name:--font-poppins) text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-hp-text-dark leading-[1.1] tracking-tight"
							>
								Stories of{' '}
								<span className="font-(family-name:--font-playfair) italic text-transparent bg-clip-text bg-gradient-to-r from-hp-primary to-hp-accent">
									Impact
								</span>
							</motion.h1>
							<motion.p
								variants={fadeUp}
								className="mt-6 text-hp-text-light text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
							>
								Explore the initiatives that have touched lives and inspired minds. Every event is a step towards a more compassionate and empowered society.
							</motion.p>
						</motion.div>
					</div>
				</section>

				{/* ── Alternating Timeline Layout ── */}
				<section className="relative py-20 sm:py-32 overflow-hidden">
					<div className="mx-auto max-w-6xl px-5 lg:px-8 relative">
						
						{/* Vertical Timeline Line */}
						{(ACTIVITIES.length as number) > 0 && (
							<div className="absolute left-9 sm:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-hp-primary/20 via-hp-accent/20 to-transparent sm:-translate-x-1/2 rounded-full" />
						)}

						{(ACTIVITIES.length as number) === 0 ? (
							<div className="text-center py-20">
								<p className="text-hp-text-light text-lg">More stories coming soon.</p>
							</div>
						) : (
							<div className="space-y-16 sm:space-y-24">
								{ACTIVITIES.map((activity, index) => {
									const isEven = index % 2 === 0;

									return (
										<motion.div
											key={activity.id}
											initial={{ opacity: 0, y: 50 }}
											whileInView={{ opacity: 1, y: 0 }}
											viewport={{ once: true, amount: 0.2 }}
											transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
											className={`relative flex flex-col sm:flex-row items-center w-full group ${
												isEven ? '' : 'sm:flex-row-reverse'
											}`}
										>
											{/* Timeline Node */}
											<div className="absolute left-4 sm:left-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full hp-gradient-bg border-[4px] border-white shadow-md sm:-translate-x-1/2 z-10 transition-transform duration-500 group-hover:scale-125 top-10 sm:top-1/2 sm:-translate-y-1/2" />

											{/* Content Card Side */}
											<div
												className={`w-full pl-16 sm:pl-0 sm:w-[50%] ${
													isEven ? 'sm:pr-12 lg:pr-16' : 'sm:pl-12 lg:pl-16'
												}`}
											>
												<article className="group/card relative bg-white rounded-[2rem] p-3 sm:p-4 shadow-xl shadow-black-[0.03] border border-gray-100 hover:shadow-2xl hover:shadow-hp-primary/10 hover:border-hp-primary/20 transition-all duration-500 text-left">
													{/* Card Image */}
													<div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-[1.5rem] overflow-hidden mb-5 sm:mb-6">
														<Image
															src={activity.image}
															alt={activity.title}
															fill
															className="object-cover transition-transform duration-1000 group-hover/card:scale-105"
															sizes="(max-width: 640px) 100vw, 50vw"
														/>
														
														{/* Overlay Gradient for readability if needed */}
														<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
														
														<div className="absolute top-4 left-4 z-10">
															<span
																className={`px-3 py-1.5 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest shadow-lg backdrop-blur-md border border-white/20 ${activity.badgeColor}`}
															>
																{activity.badge}
															</span>
														</div>
													</div>

													{/* Card Content */}
													<div className="px-3 sm:px-4 pb-3 sm:pb-4">
														<div className="flex items-center gap-2 mb-3 text-hp-text-light text-xs font-semibold uppercase tracking-wider">
															<Calendar size={14} className="text-hp-primary" />
															<span>{activity.meta}</span>
														</div>
														<h3 className="font-(family-name:--font-poppins) text-2xl sm:text-3xl font-bold text-hp-text-dark mb-4 group-hover/card:text-hp-primary transition-colors leading-tight">
															{activity.title}
														</h3>
														<p className="text-sm sm:text-base text-hp-text-light leading-relaxed mb-6 sm:mb-8 line-clamp-3">
															{activity.description}
														</p>
														
														<div className="flex items-center justify-between">
															<Link
																href={`/programs/${activity.id}`}
																className="inline-flex items-center gap-2 text-sm font-bold text-hp-primary group-hover/card:text-hp-accent transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-hp-accent after:transition-all after:duration-300 group-hover/card:after:w-full"
															>
																Read Full Story
																<ArrowRight size={16} className="transition-transform group-hover/card:translate-x-1" />
															</Link>

															{/* Subtle decorative arrow that appears on hover */}
															<div className="w-10 h-10 rounded-full bg-hp-bg-1 flex items-center justify-center opacity-0 -translate-x-4 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-500">
																<ArrowRight size={18} className="text-hp-primary" />
															</div>
														</div>
													</div>
												</article>
											</div>

											{/* Empty Side Spacer */}
											<div className="hidden sm:block sm:w-[50%]" />
										</motion.div>
									);
								})}
							</div>
						)}
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
