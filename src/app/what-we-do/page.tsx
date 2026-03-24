'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Heart, BookOpen, Activity, Users, Leaf, Cpu } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { fadeUp, staggerContainer, scaleIn } from '@/lib/animations';
import { ABOUT_PILLARS } from '@/lib/about-constants';

const PILLAR_ICONS: Record<string, React.ReactNode> = {
	'service-to-the-needy': <Heart className="w-6 h-6" />,
	'education-awareness': <BookOpen className="w-6 h-6" />,
	'health-wellbeing': <Activity className="w-6 h-6" />,
	'social-reformation': <Users className="w-6 h-6" />,
	'environmental-protection': <Leaf className="w-6 h-6" />,
	'technology-innovation': <Cpu className="w-6 h-6" />,
};

const PILLAR_ACCENTS: Record<string, { gradient: string; iconBg: string; iconColor: string; borderAccent: string }> = {
	'service-to-the-needy': {
		gradient: 'from-hp-primary/5 to-hp-accent/5',
		iconBg: 'bg-hp-primary/10',
		iconColor: 'text-hp-primary',
		borderAccent: 'border-l-hp-primary',
	},
	'education-awareness': {
		gradient: 'from-blue-50/80 to-indigo-50/40',
		iconBg: 'bg-blue-50',
		iconColor: 'text-blue-600',
		borderAccent: 'border-l-blue-500',
	},
	'health-wellbeing': {
		gradient: 'from-rose-50/80 to-pink-50/40',
		iconBg: 'bg-rose-50',
		iconColor: 'text-rose-600',
		borderAccent: 'border-l-rose-500',
	},
	'social-reformation': {
		gradient: 'from-amber-50/80 to-orange-50/40',
		iconBg: 'bg-amber-50',
		iconColor: 'text-amber-700',
		borderAccent: 'border-l-amber-500',
	},
	'environmental-protection': {
		gradient: 'from-emerald-50/80 to-green-50/40',
		iconBg: 'bg-emerald-50',
		iconColor: 'text-emerald-600',
		borderAccent: 'border-l-emerald-500',
	},
	'technology-innovation': {
		gradient: 'from-violet-50/80 to-purple-50/40',
		iconBg: 'bg-violet-50',
		iconColor: 'text-violet-600',
		borderAccent: 'border-l-violet-500',
	},
};

export default function WhatWeDoPage() {
	// Scroll to hash on load
	useEffect(() => {
		const hash = window.location.hash.replace('#', '');
		if (hash) {
			setTimeout(() => {
				const el = document.getElementById(hash);
				if (el) {
					const headerOffset = 100;
					const elementPosition = el.getBoundingClientRect().top + window.scrollY;
					window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
				}
			}, 300);
		}
	}, []);

	return (
		<>
			<Header />
			<main className="min-h-screen bg-[#F8FAFC]">
				{/* ── Hero Section ── */}
				<section className="relative overflow-hidden bg-gradient-to-br from-[#1a2e4a] via-[#1e3a5f] to-[#0f2137] pt-32 pb-20 sm:pt-36 sm:pb-28">
					{/* Decorative elements */}
					<div className="absolute inset-0 overflow-hidden pointer-events-none">
						<div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-hp-primary/10 blur-3xl" />
						<div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-hp-accent/8 blur-3xl" />
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-hp-primary/5 blur-3xl" />
					</div>

					{/* Grid pattern overlay */}
					<div
						className="absolute inset-0 opacity-[0.03]"
						style={{
							backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
							backgroundSize: '40px 40px',
						}}
					/>

					<div className="relative z-10 mx-auto max-w-6xl px-5 lg:px-8">
						{/* Back nav */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
						>
							<Link
								href="/about"
								className="group inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 text-white/70 text-sm font-medium transition-all hover:bg-white/15 hover:text-white/90 mb-8"
							>
								<ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
								About Us
							</Link>
						</motion.div>

						<motion.div
							initial="hidden"
							animate="visible"
							variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
						>
							<motion.p
								variants={fadeUp}
								className="text-[10px] font-semibold uppercase tracking-[3px] text-hp-accent/80 sm:text-xs mb-4"
							>
								Our Focus Areas
							</motion.p>
							<motion.h1
								variants={fadeUp}
								className="font-(family-name:--font-poppins) text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-white leading-[1.1] max-w-3xl"
							>
								What We{' '}
								<span className="font-(family-name:--font-playfair) italic bg-gradient-to-r from-hp-primary to-hp-accent bg-clip-text text-transparent">
									Do
								</span>
							</motion.h1>
							<motion.p
								variants={fadeUp}
								className="mt-5 text-white/60 text-base sm:text-lg max-w-2xl leading-relaxed"
							>
								{ABOUT_PILLARS.subtitle}
							</motion.p>

							{/* Quick nav pills */}
							<motion.div
								variants={fadeUp}
								className="mt-8 flex flex-wrap gap-2"
							>
								{ABOUT_PILLARS.pillars.map((pillar) => (
									<a
										key={pillar.slug}
										href={`#${pillar.slug}`}
										className="rounded-full bg-white/8 backdrop-blur-sm border border-white/10 px-4 py-2 text-xs font-medium text-white/60 transition-all hover:bg-white/15 hover:text-white/90 hover:border-white/20"
										onClick={(e) => {
											e.preventDefault();
											const el = document.getElementById(pillar.slug);
											if (el) {
												const headerOffset = 100;
												const elementPosition = el.getBoundingClientRect().top + window.scrollY;
												window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
											}
										}}
									>
										{pillar.title}
									</a>
								))}
							</motion.div>
						</motion.div>
					</div>
				</section>

				{/* ── Focus Areas Detailed Sections ── */}
				<section className="py-16 sm:py-24">
					<div className="mx-auto max-w-6xl px-5 lg:px-8">
						<div className="space-y-16 sm:space-y-24">
							{ABOUT_PILLARS.pillars.map((pillar, index) => {
								const accent = PILLAR_ACCENTS[pillar.slug] || PILLAR_ACCENTS['service-to-the-needy'];
								const icon = PILLAR_ICONS[pillar.slug];
								const isEven = index % 2 === 0;

								return (
									<motion.div
										key={pillar.slug}
										id={pillar.slug}
										initial="hidden"
										whileInView="visible"
										viewport={{ once: true, amount: 0.15 }}
										variants={staggerContainer}
										className="scroll-mt-28"
									>
										{/* Section number + divider */}
										<motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
											<div className="flex h-10 w-10 items-center justify-center rounded-xl hp-gradient-bg shadow-lg shadow-hp-primary/15">
												<span className="text-white text-sm font-bold font-(family-name:--font-poppins)">
													{String(index + 1).padStart(2, '0')}
												</span>
											</div>
											<div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
										</motion.div>

										{/* Content card */}
										<motion.div
											variants={fadeUp}
											className={`relative rounded-3xl bg-white border border-gray-100/80 shadow-sm overflow-hidden ${isEven ? '' : ''}`}
										>
											{/* Accent top bar */}
											<div className="h-1 hp-gradient-bg" />

											<div className={`grid lg:grid-cols-5 gap-0 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
												{/* Left: Icon + Meta panel */}
												<div className={`lg:col-span-2 p-6 sm:p-8 lg:p-10 bg-gradient-to-br ${accent.gradient} ${isEven ? '' : 'lg:order-2'}`}>
													{/* Icon */}
													<div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${accent.iconBg} ${accent.iconColor} mb-5`}>
														{icon}
													</div>

													{/* Badge */}
													<span
														className={`inline-block rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider sm:text-[10px] ${pillar.badgeColor} mb-4`}
													>
														{pillar.badge}
													</span>

													{/* Title */}
													<h2 className="font-(family-name:--font-poppins) text-2xl sm:text-3xl font-bold text-hp-text-dark leading-tight mb-3">
														{pillar.title}
													</h2>

													{/* Short description */}
													<p className="text-hp-text-light text-sm sm:text-base leading-relaxed">
														{pillar.description}
													</p>

													{/* Bullets */}
													<ul className="mt-6 space-y-3">
														{pillar.bullets.map((b: string) => (
															<li key={b} className="flex items-start gap-3 text-sm text-hp-text-dark/70">
																<span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full hp-gradient-bg" />
																{b}
															</li>
														))}
													</ul>
												</div>

												{/* Right: Detailed content */}
												<div className={`lg:col-span-3 flex flex-col bg-white ${isEven ? '' : 'lg:order-1'}`}>
													{pillar.image && (
														<div className="relative w-full h-48 sm:h-64 lg:h-72 shrink-0 overflow-hidden">
															<Image
																src={pillar.image}
																alt={pillar.title}
																fill
																className="object-cover transition-transform duration-700 hover:scale-105"
															/>
														</div>
													)}
													<div className="hidden sm:flex p-6 sm:p-8 lg:p-10 flex-col justify-center flex-1">
														<h3 className="font-(family-name:--font-poppins) text-lg font-semibold text-hp-text-dark mb-4 flex items-center gap-2">
															<span className="w-6 h-[2px] hp-gradient-bg rounded-full" />
															In Detail
														</h3>
														<div className="space-y-4">
															{pillar.details.split('\n\n').map((paragraph: string, i: number) => (
																<p
																	key={i}
																	className="text-hp-text-light text-[15px] sm:text-base leading-[1.85]"
																>
																	{paragraph}
																</p>
															))}
														</div>
													</div>
												</div>
											</div>
										</motion.div>
									</motion.div>
								);
							})}
						</div>
					</div>
				</section>

				{/* ── CTA Section ── */}
				<section className="relative overflow-hidden bg-gradient-to-br from-[#1a2e4a] via-[#1e3a5f] to-[#0f2137] py-20 sm:py-28">
					{/* Decorative blobs */}
					<div className="absolute inset-0 pointer-events-none">
						<div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-hp-primary/10 blur-3xl" />
						<div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-hp-accent/10 blur-3xl" />
					</div>

					<motion.div
						className="relative z-10 mx-auto max-w-4xl px-5 lg:px-8 text-center"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
						variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
					>
						<motion.p
							variants={fadeUp}
							className="text-[10px] font-semibold uppercase tracking-[3px] text-hp-accent/70 sm:text-xs mb-4"
						>
							Get Involved
						</motion.p>
						<motion.h2
							variants={fadeUp}
							className="font-(family-name:--font-poppins) text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
						>
							Be Part of the{' '}
							<span className="font-(family-name:--font-playfair) italic bg-gradient-to-r from-hp-primary to-hp-accent bg-clip-text text-transparent">
								Change
							</span>
						</motion.h2>
						<motion.p
							variants={fadeUp}
							className="mt-5 text-white/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
						>
							Whether you can give time, skills, or resources — there is a place for you. Join our mission to build a more compassionate and empowered society.
						</motion.p>
						<motion.div
							variants={fadeUp}
							className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
						>
							<Link
								href="/join-us"
								className="group inline-flex items-center gap-2 rounded-full hp-gradient-bg px-8 py-3.5 text-white text-sm font-semibold shadow-lg shadow-hp-primary/25 transition-all hover:shadow-xl hover:shadow-hp-primary/30 hover:scale-[1.02]"
							>
								Become a Volunteer
								<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
							</Link>
							<Link
								href="/about"
								className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-8 py-3.5 text-white/80 text-sm font-semibold transition-all hover:bg-white/15 hover:text-white"
							>
								Learn About Us
							</Link>
						</motion.div>
					</motion.div>
				</section>
			</main>
			<Footer />
		</>
	);
}
