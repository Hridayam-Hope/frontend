'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Heart, BookOpen, Activity, Users, Leaf, Cpu, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileDonateButton from '@/components/layout/MobileDonateButton';
import SignatureButton from '@/components/ui/SignatureButton';
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
				<section className="relative overflow-hidden bg-linear-to-b from-[#e8f4f1] via-[#f0f8f7] to-gray-50 pt-28 pb-12 sm:pt-36 sm:pb-16">
					{/* Decorative background orbs */}
					<motion.div
						className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-linear-to-br from-teal-200/30 to-cyan-200/20 blur-3xl"
						animate={{
							y: [0, -15, 0],
							rotate: [0, 5, 0],
							transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' as const },
						}}
					/>
					<motion.div
						className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-linear-to-br from-blue-200/20 to-teal-200/15 blur-3xl"
						animate={{
							y: [0, 12, 0],
							rotate: [0, -3, 0],
							transition: { duration: 9, repeat: Infinity, ease: 'easeInOut' as const },
						}}
					/>

					<motion.div
						className="relative z-10 mx-auto max-w-4xl px-5 text-center lg:px-8"
						initial="hidden"
						animate="visible"
						variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
					>
						{/* Eyebrow */}
						<motion.div variants={scaleIn} className="mb-5 inline-flex">
							<span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-teal-700 shadow-sm ring-1 ring-teal-100 backdrop-blur-sm sm:text-xs">
								<Sparkles size={12} className="text-teal-500" />
								Our Focus Areas
							</span>
						</motion.div>

						{/* Headline */}
						<motion.h1
							variants={fadeUp}
							className="font-poppins text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-[3.5rem]"
						>
							What We{' '}
							<span className="font-playfair relative italic">
								<span className="hp-gradient-text">Do</span>
								<motion.svg
									className="absolute -bottom-2 left-0 w-full"
									viewBox="0 0 80 12"
									fill="none"
									initial={{ pathLength: 0, opacity: 0 }}
									animate={{ pathLength: 1, opacity: 1 }}
									transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
								>
									<motion.path
										d="M2 8 C20 2, 60 2, 78 8"
										stroke="url(#wwdGrad)"
										strokeWidth="3"
										strokeLinecap="round"
										initial={{ pathLength: 0 }}
										animate={{ pathLength: 1 }}
										transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
									/>
									<defs>
										<linearGradient id="wwdGrad" x1="0" y1="0" x2="80" y2="0">
											<stop offset="0%" stopColor="#4886cf" />
											<stop offset="100%" stopColor="#65bac1" />
										</linearGradient>
									</defs>
								</motion.svg>
							</span>
						</motion.h1>

						{/* Subtitle */}
						<motion.p
							variants={fadeUp}
							className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-gray-500 sm:mt-6 sm:text-base"
						>
							{ABOUT_PILLARS.subtitle}
						</motion.p>

						{/* Quick nav pills */}
						<motion.div
							variants={fadeUp}
							className="mt-8 flex flex-wrap items-center justify-center gap-2"
						>
							{ABOUT_PILLARS.pillars.map((pillar) => (
								<a
									key={pillar.slug}
									href={`#${pillar.slug}`}
									className="rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-xs font-medium text-gray-600 shadow-sm backdrop-blur-sm transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
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
				<section className="relative overflow-hidden bg-linear-to-b from-gray-50 via-[#f0f8f7] to-[#e8f4f1] py-16 sm:py-24">
					{/* Decorative background orbs */}
					<motion.div
						className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-linear-to-br from-teal-200/25 to-cyan-200/15 blur-3xl"
						animate={{
							y: [0, -12, 0],
							rotate: [0, 3, 0],
							transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' as const },
						}}
					/>
					<motion.div
						className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-linear-to-br from-blue-200/20 to-teal-200/15 blur-3xl"
						animate={{
							y: [0, 10, 0],
							rotate: [0, -3, 0],
							transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' as const },
						}}
					/>

					<motion.div
						className="relative z-10 mx-auto max-w-4xl px-5 lg:px-8 text-center"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
						variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
					>
						<motion.div variants={scaleIn} className="mb-5 inline-flex">
							<span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-teal-700 shadow-sm ring-1 ring-teal-100 backdrop-blur-sm sm:text-xs">
								<Heart size={12} className="fill-teal-500 text-teal-500" />
								Get Involved
							</span>
						</motion.div>
						<motion.h2
							variants={fadeUp}
							className="font-poppins text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
						>
							Be Part of the{' '}
							<span className="font-playfair italic hp-gradient-text">
								Change
							</span>
						</motion.h2>
						<motion.p
							variants={fadeUp}
							className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-gray-500 sm:mt-6 sm:text-base"
						>
							Whether you can give time, skills, or resources — there is a place for you. Join our mission to build a more compassionate and empowered society.
						</motion.p>
						<motion.div
							variants={fadeUp}
							className="mt-8 flex flex-wrap items-center justify-center gap-3"
						>
							<SignatureButton href="/join-us#volunteer-form" size="md">
								Become a Volunteer
							</SignatureButton>
							<Link
								href="/about"
								className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
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
