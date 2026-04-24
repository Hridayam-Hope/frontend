'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
	Heart,
	HandHeart,
	Users,
	Handshake,
	Megaphone,
	ArrowRight,
	CheckCircle2,
	Calendar,
	Globe,
	BookOpen,
	Leaf,
	Sparkles,
	Send,
	Star,
	ChevronDown,
	MapPin,
	Clock,
	Shield,
	Mail,
	Phone,
	Briefcase,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileDonateButton from '@/components/layout/MobileDonateButton';
import SignatureButton from '@/components/ui/SignatureButton';
import { fadeUp, fadeIn, scaleIn, staggerContainer, slideInLeft, slideInRight } from '@/lib/animations';
import { submitVolunteerApplication } from '@/lib/api/volunteers';
import { useVolunteersStore } from '@/lib/stores/volunteers';
import { ApiError } from '@/lib/api/client';

// ══════════════════════════════════════════════════════════════════
// Constants
// ══════════════════════════════════════════════════════════════════

const WAYS_TO_JOIN = [
	{
		id: 'volunteer',
		icon: Users,
		title: 'Become a Volunteer',
		subtitle: 'Give your time & skills',
		description: 'Join our passionate team of volunteers making a real difference in communities across Andhra Pradesh. No experience needed — just a willing heart.',
		cta: 'Apply Now',
		href: '#volunteer-form',
		gradient: 'from-teal-500 to-cyan-500',
		bgLight: 'bg-teal-50',
		borderColor: 'border-teal-200',
		iconColor: 'text-teal-600',
		stats: [
			{ value: '50+', label: 'Active Volunteers' },
			{ value: '2,000+', label: 'Hours Contributed' },
		],
	},
	// {
	// 	id: 'donate',
	// 	icon: Heart,
	// 	title: 'Make a Donation',
	// 	subtitle: 'Fund programs that matter',
	// 	description: "Every rupee creates hope. Your donation directly supports education, healthcare, food distribution, and environmental initiatives across communities.",
	// 	cta: 'Donate Now',
	// 	href: '/donate',
	// 	gradient: 'from-rose-500 to-pink-500',
	// 	bgLight: 'bg-rose-50',
	// 	borderColor: 'border-rose-200',
	// 	iconColor: 'text-rose-600',
	// 	stats: [
	// 		{ value: '₹5L+', label: 'Funds Raised' },
	// 		{ value: '500+', label: 'Lives Impacted' },
	// 	],
	// },
	{
		id: 'partner',
		icon: Handshake,
		title: 'Partner with Us',
		subtitle: 'CSR & institutional collaboration',
		description: 'We welcome businesses, institutions, and organizations to partner with us for CSR initiatives, collaborative campaigns, and community programs.',
		cta: 'Get in Touch',
		href: '#contact-section',
		gradient: 'from-violet-500 to-purple-500',
		bgLight: 'bg-violet-50',
		borderColor: 'border-violet-200',
		iconColor: 'text-violet-600',
		stats: [
			{ value: '10+', label: 'Active Partners' },
			{ value: '25+', label: 'Joint Programs' },
		],
	},
	// {
	// 	id: 'campaign',
	// 	icon: Megaphone,
	// 	title: 'Request a Campaign',
	// 	subtitle: 'Bring change to your area',
	// 	description: "Know a community that needs help? Request a campaign and we'll work with local volunteers to plan and execute a meaningful initiative in your area.",
	// 	cta: 'Request Now',
	// 	href: '#contact-section',
	// 	gradient: 'from-amber-500 to-orange-500',
	// 	bgLight: 'bg-amber-50',
	// 	borderColor: 'border-amber-200',
	// 	iconColor: 'text-amber-600',
	// 	stats: [
	// 		{ value: '25+', label: 'Campaigns Run' },
	// 		{ value: '15+', label: 'Locations' },
	// 	],
	// },
] as const;

const VOLUNTEER_ROLES = [
	{
		icon: BookOpen,
		title: 'Education Volunteer',
		description: 'Teach and mentor students in underserved schools. Lead workshops on health, hygiene, and digital literacy.',
		commitment: '4-6 hrs/week',
		location: 'Various, AP',
	},
	{
		icon: Leaf,
		title: 'Environment Champion',
		description: 'Organize tree plantation drives, eco-awareness camps, and sustainable living workshops in communities.',
		commitment: '3-4 hrs/week',
		location: 'Field-based',
	},
	{
		icon: HandHeart,
		title: 'Community Care',
		description: 'Help with food distribution, clothing drives, and support for families facing hardship with dignity.',
		commitment: '3-5 hrs/week',
		location: 'Hyderabad & AP',
	},
	{
		icon: Globe,
		title: 'Digital & Content',
		description: 'Create content, manage social media, build websites, or help with graphic design — all remotely.',
		commitment: '2-4 hrs/week',
		location: 'Remote',
	},
] as const;

const VOLUNTEER_BENEFITS = [
	'Hands-on community impact',
	'Volunteering certificate & recognition',
	'Skill-building workshops',
	'Networking with like-minded changemakers',
	'Flexible schedules — weekdays or weekends',
	'Letter of recommendation for outstanding volunteers',
] as const;

const TESTIMONIALS = [
	{
		quote: "Volunteering with Hridayam has been life-changing. Seeing the direct impact on children's education keeps me inspired every day.",
		name: 'Priya Sharma',
		role: 'Education Volunteer',
	},
	{
		quote: 'The team is incredibly supportive. I started with just 2 hours a week and now I lead our tree plantation initiative in Chevella.',
		name: 'Rahul Menon',
		role: 'Environment Champion',
	},
	{
		quote: "As a remote volunteer, I was amazed at how connected I felt. My design work actually reaches real communities and I can see the results.",
		name: 'Ananya Das',
		role: 'Digital Volunteer',
	},
] as const;

const PROCESS_STEPS = [
	{ step: 1, title: 'Apply Online', description: 'Fill out the short form below — it takes less than 2 minutes.' },
	{ step: 2, title: 'Quick Call', description: "We'll have a brief call to understand your interests and availability." },
	{ step: 3, title: 'Orientation', description: 'Join a welcome session to learn about our programs and how you fit in.' },
	{ step: 4, title: 'Start Making Impact', description: 'Get matched to a role and start contributing right away!' },
] as const;

const SKILLS_OPTIONS = [
	'Teaching / Mentoring',
	'Event Management',
	'Social Media / Marketing',
	'Graphic Design',
	'Photography / Video',
	'Web Development',
	'Content Writing',
	'Healthcare',
	'Fundraising',
	'Community Outreach',
] as const;

// ══════════════════════════════════════════════════════════════════
// Main Page Component
// ══════════════════════════════════════════════════════════════════

export default function JoinUsPage() {
	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50">
				<HeroSection />
				<WaysToJoinSection />
				<VolunteerRolesSection />
				<ProcessSection />
				<TestimonialsSection />
				<VolunteerFormSection />
				<ContactSection />
			</main>
			<Footer />
			<MobileDonateButton />
		</>
	);
}

// ══════════════════════════════════════════════════════════════════
// Hero Section
// ══════════════════════════════════════════════════════════════════

function HeroSection() {
	return (
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
						Be Part of Something Bigger
					</span>
				</motion.div>

				{/* Headline */}
				<motion.h1
					variants={fadeUp}
					className="font-poppins text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-[3.5rem]"
				>
					Together, We Create{' '}
					<span className="font-playfair relative italic">
						<span className="hp-gradient-text">Lasting Change</span>
						<motion.svg
							className="absolute -bottom-2 left-0 w-full"
							viewBox="0 0 220 12"
							fill="none"
							initial={{ pathLength: 0, opacity: 0 }}
							animate={{ pathLength: 1, opacity: 1 }}
							transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
						>
							<motion.path
								d="M2 8 C60 2, 160 2, 218 8"
								stroke="url(#joinGrad)"
								strokeWidth="3"
								strokeLinecap="round"
								initial={{ pathLength: 0 }}
								animate={{ pathLength: 1 }}
								transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
							/>
							<defs>
								<linearGradient id="joinGrad" x1="0" y1="0" x2="220" y2="0">
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
					Whether you volunteer your time, donate to a cause, or partner with us — every contribution
					creates ripples of hope that reach communities across India.
				</motion.p>

				{/* Quick CTA Buttons */}
				<motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
					<SignatureButton href="#volunteer-form" size="md">
						Start Volunteering
					</SignatureButton>
					{/* <Link
						href="/donate"
						className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
					>
						<Heart size={14} className="fill-current text-rose-400" />
						Donate Now
					</Link> */}
				</motion.div>

				{/* Trust micro-stats */}
				<motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 sm:gap-8">
					{[
						{ icon: Users, text: '50+ Active Volunteers' },
						{ icon: Heart, text: '500+ Lives Impacted' },
						{ icon: Shield, text: 'Registered NGO' },
					].map((item) => (
						<span key={item.text} className="flex items-center gap-1.5">
							<item.icon size={13} className="text-teal-500" />
							{item.text}
						</span>
					))}
				</motion.div>
			</motion.div>
		</section>
	);
}

// ══════════════════════════════════════════════════════════════════
// Ways to Join Section
// ══════════════════════════════════════════════════════════════════

function WaysToJoinSection() {
	return (
		<section className="relative bg-white py-16 sm:py-24">
			<div className="mx-auto max-w-7xl px-5 lg:px-8">
				{/* Section Header */}
				<motion.div
					className="mx-auto mb-12 max-w-2xl text-center sm:mb-16"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
				>
					<motion.p variants={fadeUp} className="text-[10px] font-semibold uppercase tracking-[2.5px] hp-gradient-text sm:text-xs">
						How You Can Help
					</motion.p>
					<motion.h2
						variants={fadeUp}
						className="font-poppins mt-3 text-2xl font-bold leading-tight text-gray-900 sm:text-4xl"
					>
						Four Ways to Make a{' '}
						<span className="font-playfair italic hp-gradient-text">Difference</span>
					</motion.h2>
					<motion.p variants={fadeUp} className="mt-3 text-sm text-gray-500 sm:text-base">
						Choose how you&apos;d like to contribute. Every form of support matters.
					</motion.p>
				</motion.div>

				{/* Cards Grid */}
				<motion.div
					className="grid gap-6 sm:grid-cols-2 lg:gap-8"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.15 }}
				>
					{WAYS_TO_JOIN.map((way, index) => (
						<WayToJoinCard key={way.id} way={way} index={index} />
					))}
				</motion.div>
			</div>
		</section>
	);
}

function WayToJoinCard({ way, index }: { way: (typeof WAYS_TO_JOIN)[number]; index: number }) {
	const Icon = way.icon;

	return (
		<motion.div
			variants={fadeUp}
			whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
			className={`group relative overflow-hidden rounded-2xl border-2 ${way.borderColor} bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:rounded-3xl sm:p-8`}
		>
			{/* Top gradient line */}
			<div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${way.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

			{/* Icon + Title */}
			<div className="mb-4 flex items-start gap-4">
				<motion.div
					whileHover={{ rotate: 5, scale: 1.1 }}
					className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${way.bgLight}`}
				>
					<Icon size={22} className={way.iconColor} />
				</motion.div>
				<div className="min-w-0">
					<h3 className="font-poppins text-base font-bold text-gray-900 sm:text-lg">{way.title}</h3>
					<p className="text-xs text-gray-400">{way.subtitle}</p>
				</div>
			</div>

			{/* Description */}
			<p className="mb-5 text-sm leading-relaxed text-gray-500">{way.description}</p>

			{/* Stats */}
			<div className="mb-5 flex gap-4">
				{way.stats.map((stat) => (
					<div key={stat.label} className={`flex-1 rounded-xl ${way.bgLight} px-3 py-2.5 text-center`}>
						<p className={`font-poppins text-lg font-bold ${way.iconColor}`}>{stat.value}</p>
						<p className="text-[10px] text-gray-500">{stat.label}</p>
					</div>
				))}
			</div>

			{/* CTA */}
			{way.href.startsWith('#') ? (
				<a
					href={way.href}
					className={`inline-flex items-center gap-2 rounded-xl border-2 ${way.borderColor} px-5 py-2.5 text-sm font-semibold ${way.iconColor} transition-all duration-200 hover:${way.bgLight} group-hover:gap-3`}
				>
					{way.cta}
					<ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
				</a>
			) : (
				<Link
					href={way.href}
					className={`inline-flex items-center gap-2 rounded-xl border-2 ${way.borderColor} px-5 py-2.5 text-sm font-semibold ${way.iconColor} transition-all duration-200 group-hover:gap-3`}
				>
					{way.cta}
					<ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
				</Link>
			)}
		</motion.div>
	);
}

// ══════════════════════════════════════════════════════════════════
// Volunteer Roles Section
// ══════════════════════════════════════════════════════════════════

function VolunteerRolesSection() {
	return (
		<section className="bg-gray-50 py-16 sm:py-24">
			<div className="mx-auto max-w-7xl px-5 lg:px-8">
				{/* Header */}
				<motion.div
					className="mx-auto mb-12 max-w-2xl text-center sm:mb-16"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
				>
					<motion.p variants={fadeUp} className="text-[10px] font-semibold uppercase tracking-[2.5px] hp-gradient-text sm:text-xs">
						Volunteer Opportunities
					</motion.p>
					<motion.h2
						variants={fadeUp}
						className="font-poppins mt-3 text-2xl font-bold leading-tight text-gray-900 sm:text-4xl"
					>
						Find Your{' '}
						<span className="font-playfair italic hp-gradient-text">Perfect Role</span>
					</motion.h2>
					<motion.p variants={fadeUp} className="mt-3 text-sm text-gray-500 sm:text-base">
						We match your skills and interests to the right opportunity. Here are some roles actively seeking volunteers.
					</motion.p>
				</motion.div>

				{/* Role Cards */}
				<motion.div
					className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.15 }}
				>
					{VOLUNTEER_ROLES.map((role) => {
						const Icon = role.icon;
						return (
							<motion.div
								key={role.title}
								variants={fadeUp}
								whileHover={{ y: -8, scale: 1.02 }}
								transition={{ type: 'spring', stiffness: 300, damping: 22 }}
								className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:rounded-3xl"
							>
								{/* Hover gradient top bar */}
								<div className="absolute top-0 left-0 right-0 h-1 hp-gradient-bg opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

								{/* Icon */}
								<motion.div
									whileHover={{ rotate: 5 }}
									className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50"
								>
									<Icon size={22} className="text-teal-600" />
								</motion.div>

								<h3 className="font-poppins text-base font-bold text-gray-900">{role.title}</h3>
								<p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">{role.description}</p>

								{/* Meta info */}
								<div className="mt-4 flex flex-wrap gap-3 text-[10px] text-gray-400 sm:text-xs">
									<span className="flex items-center gap-1">
										<Clock size={11} />
										{role.commitment}
									</span>
									<span className="flex items-center gap-1">
										<MapPin size={11} />
										{role.location}
									</span>
								</div>

								{/* Apply link */}
								<a
									href="#volunteer-form"
									className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 transition-all duration-200 hover:gap-2.5 sm:text-sm"
								>
									Apply Now
									<ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
								</a>
							</motion.div>
						);
					})}
				</motion.div>

				{/* Benefits Bar */}
				<motion.div
					className="mt-12 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100/80 sm:mt-16 sm:rounded-3xl sm:p-8"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={fadeUp}
				>
					<h3 className="font-poppins mb-5 text-base font-bold text-gray-900 sm:text-lg">
						Why Volunteer With Us?
					</h3>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
						{VOLUNTEER_BENEFITS.map((benefit) => (
							<div key={benefit} className="flex items-start gap-2 rounded-xl bg-teal-50/50 p-3">
								<CheckCircle2 size={14} className="mt-0.5 shrink-0 text-teal-500" />
								<span className="text-xs leading-snug text-gray-600">{benefit}</span>
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
}

// ══════════════════════════════════════════════════════════════════
// How It Works / Process Section
// ══════════════════════════════════════════════════════════════════

function ProcessSection() {
	return (
		<section className="bg-white py-16 sm:py-24">
			<div className="mx-auto max-w-4xl px-5 lg:px-8">
				{/* Header */}
				<motion.div
					className="mx-auto mb-12 max-w-2xl text-center sm:mb-16"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
				>
					<motion.p variants={fadeUp} className="text-[10px] font-semibold uppercase tracking-[2.5px] hp-gradient-text sm:text-xs">
						Simple Process
					</motion.p>
					<motion.h2
						variants={fadeUp}
						className="font-poppins mt-3 text-2xl font-bold leading-tight text-gray-900 sm:text-4xl"
					>
						How to Get{' '}
						<span className="font-playfair italic hp-gradient-text">Started</span>
					</motion.h2>
				</motion.div>

				{/* Steps */}
				<motion.div
					className="relative"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
				>
					{/* Connecting line */}
					<div className="absolute left-6 top-0 bottom-0 hidden w-px bg-linear-to-b from-teal-200 via-teal-300 to-teal-200 sm:block lg:left-1/2 lg:-translate-x-px" />

					<div className="space-y-8 sm:space-y-12">
						{PROCESS_STEPS.map((step, index) => (
							<motion.div
								key={step.step}
								variants={fadeUp}
								className={`relative flex items-start gap-5 sm:gap-8 lg:gap-12 ${
									index % 2 === 1 ? 'lg:flex-row-reverse' : ''
								}`}
							>
								{/* Step number circle */}
								<motion.div
									whileHover={{ scale: 1.1, rotate: 5 }}
									className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white font-poppins text-lg font-bold text-teal-600 shadow-md ring-2 ring-teal-100 sm:h-14 sm:w-14"
								>
									{step.step}
									{/* Ping animation */}
									<motion.div
										className="absolute inset-0 rounded-2xl ring-2 ring-teal-400"
										animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
										transition={{ duration: 3, repeat: Infinity, delay: index * 0.5, ease: 'easeInOut' }}
									/>
								</motion.div>

								{/* Content */}
								<div className={`flex-1 rounded-2xl bg-gray-50 p-5 sm:p-6 ${index % 2 === 1 ? 'lg:text-right' : ''}`}>
									<h3 className="font-poppins text-base font-bold text-gray-900">{step.title}</h3>
									<p className="mt-1.5 text-sm text-gray-500">{step.description}</p>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
}

// ══════════════════════════════════════════════════════════════════
// Testimonials Section
// ══════════════════════════════════════════════════════════════════

function TestimonialsSection() {
	const [active, setActive] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setActive((prev) => (prev + 1) % TESTIMONIALS.length);
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	return (
		<section className="bg-gray-50 py-16 sm:py-24">
			<div className="mx-auto max-w-3xl px-5 lg:px-8">
				{/* Header */}
				<motion.div
					className="mb-10 text-center sm:mb-14"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
				>
					<motion.p variants={fadeUp} className="text-[10px] font-semibold uppercase tracking-[2.5px] hp-gradient-text sm:text-xs">
						Volunteer Stories
					</motion.p>
					<motion.h2
						variants={fadeUp}
						className="font-poppins mt-3 text-2xl font-bold text-gray-900 sm:text-4xl"
					>
						Hear from Our{' '}
						<span className="font-playfair italic hp-gradient-text">Changemakers</span>
					</motion.h2>
				</motion.div>

				{/* Testimonial Card */}
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={fadeUp}
					className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100/80 sm:rounded-3xl sm:p-10"
				>
					{/* Decorative quote mark */}
					<div className="absolute -top-2 -left-2 text-[80px] font-bold leading-none text-teal-100 opacity-60 select-none">
						&ldquo;
					</div>

					<AnimatePresence mode="wait">
						<motion.div
							key={active}
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -15 }}
							transition={{ duration: 0.4 }}
							className="relative z-10"
						>
							<p className="font-playfair text-base italic leading-relaxed text-gray-700 sm:text-xl">
								&ldquo;{TESTIMONIALS[active].quote}&rdquo;
							</p>
							<div className="mt-6 flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-teal-100 to-cyan-100">
									<Users size={18} className="text-teal-600" />
								</div>
								<div>
									<p className="font-poppins text-sm font-bold text-gray-900">{TESTIMONIALS[active].name}</p>
									<p className="text-xs text-gray-400">{TESTIMONIALS[active].role}</p>
								</div>
							</div>
						</motion.div>
					</AnimatePresence>

					{/* Dots */}
					<div className="mt-8 flex justify-center gap-2">
						{TESTIMONIALS.map((_, i) => (
							<button
								key={i}
								onClick={() => setActive(i)}
								className={`h-2 rounded-full transition-all duration-300 ${
									i === active ? 'w-8 hp-gradient-bg' : 'w-2 bg-gray-200 hover:bg-gray-300'
								}`}
								aria-label={`Go to testimonial ${i + 1}`}
							/>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
}

// ══════════════════════════════════════════════════════════════════
// Volunteer Application Form
// ══════════════════════════════════════════════════════════════════

function VolunteerFormSection() {
	const { skills, fetchSkills } = useVolunteersStore();
	
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({
		partnerType: 'individual',
		fullName: '',
		email: '',
		phone: '',
		dateOfBirth: '',
		address: '',
		city: '',
		state: '',
		postalCode: '',
		country: 'India',
		interests: '',
		availabilityWeekdays: false,
		availabilityWeekends: false,
		hoursPerWeek: 4,
		languages: [] as string[],
		// Org specific
		orgRegistrationNumber: '',
		websiteUrl: '',
		industry: '',
		orgType: '',
		contactPersonName: '',
		// Influencer specific
		socialHandle: '',
		platform: '',
		followerCount: 0,
		niche: '',
		// Emergency
		emergencyName: '',
		emergencyPhone: '',
		emergencyRel: '',
	});
	const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [warning, setWarning] = useState<string | null>(null);
	const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

	const formRef = useRef<HTMLElement>(null);
	const turnstileRef = useRef<HTMLDivElement>(null);
	const turnstileWidgetId = useRef<string | null>(null);
	const isInView = useInView(formRef, { once: true, amount: 0.1 });

	useEffect(() => {
		fetchSkills();
	}, [fetchSkills]);

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setError(null);
		setWarning(null);
	};

	const toggleSkill = (id: number) => {
		setSelectedSkillIds((prev) =>
			prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
		);
	};

	// ── Turnstile rendering ──────────────────────────────────────────
	const [turnstileReady, setTurnstileReady] = useState(false);

	const renderTurnstile = useCallback(() => {
		const el = turnstileRef.current;
		if (!el || !(window as any).turnstile) return;

		// Remove any previously rendered widget
		if (turnstileWidgetId.current) {
			try { (window as any).turnstile.remove(turnstileWidgetId.current); } catch {}
			turnstileWidgetId.current = null;
		}
		el.innerHTML = '';

		turnstileWidgetId.current = (window as any).turnstile.render(el, {
			sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
			callback: (token: string) => setTurnstileToken(token),
			'expired-callback': () => setTurnstileToken(null),
		});
	}, []);

	// Render Turnstile when step 4 is active AND script is loaded
	useEffect(() => {
		if (step !== 4) return;

		// Script already loaded → render immediately (with a micro-delay
		// so the DOM node is painted after AnimatePresence finishes)
		if ((window as any).turnstile) {
			const t = setTimeout(renderTurnstile, 150);
			return () => clearTimeout(t);
		}

		// Poll until the script finishes loading
		const interval = setInterval(() => {
			if ((window as any).turnstile) {
				clearInterval(interval);
				renderTurnstile();
			}
		}, 200);
		return () => clearInterval(interval);
	}, [step, turnstileReady, renderTurnstile]);

	const nextStep = () => setStep((s) => Math.min(s + 1, 4));
	const prevStep = () => setStep((s) => Math.max(s - 1, 1));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (step < 4) {
			nextStep();
			return;
		}

		if (!turnstileToken) {
			setError('Please complete the captcha verification.');
			return;
		}

		setIsSubmitting(true);
		setError(null);
		setWarning(null);

		try {
			const submitData: any = {
				partner_type: formData.partnerType,
				full_name: formData.fullName,
				email: formData.email,
				phone: formData.phone,
				address: formData.address,
				city: formData.city,
				state: formData.state,
				postal_code: formData.postalCode,
				country: formData.country,
				interests: formData.interests,
				turnstile_token: turnstileToken,
			};

			if (formData.partnerType === 'individual') {
				submitData.date_of_birth = formData.dateOfBirth;
				submitData.skill_ids = selectedSkillIds;
				submitData.availability_weekdays = formData.availabilityWeekdays;
				submitData.availability_weekends = formData.availabilityWeekends;
				submitData.hours_per_week = formData.hoursPerWeek;
				submitData.languages = formData.languages;
				submitData.emergency_contact_name = formData.emergencyName;
				submitData.emergency_contact_phone = formData.emergencyPhone;
				submitData.emergency_contact_relationship = formData.emergencyRel;
			} else if (formData.partnerType === 'organisation') {
				submitData.org_registration_number = formData.orgRegistrationNumber;
				submitData.website_url = formData.websiteUrl;
				submitData.industry = formData.industry;
				submitData.org_type = formData.orgType;
				submitData.contact_person_name = formData.contactPersonName;
			} else if (formData.partnerType === 'influencer') {
				submitData.social_handle = formData.socialHandle;
				submitData.platform = formData.platform;
				submitData.follower_count = formData.followerCount;
				submitData.niche = formData.niche;
			}

			await submitVolunteerApplication(submitData);

			setShowSuccess(true);
			setStep(1);
			setFormData({
				partnerType: 'individual',
				fullName: '', email: '', phone: '', dateOfBirth: '',
				address: '', city: '', state: '', postalCode: '', country: 'India',
				interests: '', availabilityWeekdays: false, availabilityWeekends: false,
				hoursPerWeek: 4, languages: [],
				orgRegistrationNumber: '', websiteUrl: '', industry: '', orgType: '', contactPersonName: '',
				socialHandle: '', platform: '', followerCount: 0, niche: '',
				emergencyName: '', emergencyPhone: '', emergencyRel: '',
			});
			setSelectedSkillIds([]);
			setTurnstileToken(null);
			// Reset turnstile widget if possible, or just let it refresh on next visit
			if ((window as any).turnstile) (window as any).turnstile.reset();

			setTimeout(() => setShowSuccess(false), 8000);
		} catch (err: any) {
			if (err instanceof ApiError) {
				if (err.message.includes('under review')) {
					setWarning(err.message);
				} else if (err.status === 409 || err.message.includes('already a registered')) {
					setWarning(err.message);
				} else {
					setError(err.message);
				}
			} else {
				setError('Something went wrong. Please try again later.');
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section ref={formRef} id="volunteer-form" className="bg-white py-16 sm:py-24">
			<Script
				src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
				strategy="lazyOnload"
				onReady={() => setTurnstileReady(true)}
			/>
			<div className="mx-auto max-w-3xl px-5 lg:px-8">
				{/* Header */}
				<motion.div
					className="mb-10 text-center sm:mb-14"
					initial="hidden"
					animate={isInView ? 'visible' : 'hidden'}
					variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
				>
					<motion.p variants={fadeUp} className="text-[10px] font-semibold uppercase tracking-[2.5px] hp-gradient-text sm:text-xs">
						Ready to Join?
					</motion.p>
					<motion.h2
						variants={fadeUp}
						className="font-poppins mt-3 text-2xl font-bold text-gray-900 sm:text-4xl"
					>
						Volunteer{' '}
						<span className="font-playfair italic hp-gradient-text">Application</span>
					</motion.h2>
					<motion.p variants={fadeUp} className="mt-3 text-sm text-gray-500 sm:text-base">
						Step {step} of 4: {
							step === 1 ? 'Identity & Type' :
							step === 2 ? 'Location & Core Info' :
							step === 3 ? (formData.partnerType === 'individual' ? 'Interests & Skills' : 'Partner Specifics') :
							'Review & Submit'
						}
					</motion.p>

					{/* Step Indicators */}
					<motion.div variants={fadeUp} className="mt-6 flex justify-center gap-2">
						{[1, 2, 3, 4].map((s) => (
							<div
								key={s}
								className={`h-1.5 rounded-full transition-all duration-300 ${
									s === step ? 'w-8 hp-gradient-bg' : s < step ? 'w-4 bg-teal-400' : 'w-4 bg-gray-200'
								}`}
							/>
						))}
					</motion.div>
				</motion.div>

				{/* Form */}
				<motion.form
					onSubmit={handleSubmit}
					initial="hidden"
					animate={isInView ? 'visible' : 'hidden'}
					variants={staggerContainer}
					className="overflow-hidden rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-100/80 sm:rounded-3xl sm:p-8 lg:p-10"
				>
					<AnimatePresence mode="wait">
						{step === 1 && (
							<motion.div
								key="step1"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								className="space-y-6"
							>
								{/* Partner Type Selection */}
								<div className="space-y-3">
									<label className="block text-sm font-semibold text-gray-700">
										How would you like to join? <span className="text-rose-400">*</span>
									</label>
									<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
										{[
											{ id: 'individual', label: 'Individual', icon: Users },
											{ id: 'organisation', label: 'Organisation', icon: Handshake },
											{ id: 'influencer', label: 'Influencer', icon: Megaphone },
										].map((type) => (
											<button
												key={type.id}
												type="button"
												onClick={() => handleInputChange('partnerType', type.id)}
												className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all duration-200 ${
													formData.partnerType === type.id
														? 'border-teal-400 bg-teal-50 text-teal-700 ring-4 ring-teal-400/10'
														: 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
												}`}
											>
												<type.icon size={20} className={formData.partnerType === type.id ? 'text-teal-600' : 'text-gray-400'} />
												<span className="text-xs font-bold sm:text-sm">{type.label}</span>
											</button>
										))}
									</div>
								</div>

								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<FormField
										label={formData.partnerType === 'organisation' ? 'Organisation Name' : 'Full Name'}
										required
										placeholder={formData.partnerType === 'organisation' ? 'Enter organisation name' : 'Your full name'}
										value={formData.fullName}
										onChange={(v) => handleInputChange('fullName', v)}
									/>
									<FormField
										label="Email Address"
										required
										type="email"
										placeholder="you@example.com"
										value={formData.email}
										onChange={(v) => handleInputChange('email', v)}
									/>
								</div>
								<FormField
									label="Phone Number"
									required
									type="tel"
									placeholder="+91 XXXXX XXXXX"
									value={formData.phone}
									onChange={(v) => handleInputChange('phone', v)}
								/>
							</motion.div>
						)}

						{step === 2 && (
							<motion.div
								key="step2"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								className="space-y-5"
							>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<FormField
										label={formData.partnerType === 'organisation' ? 'Office Address' : 'Residential Address'}
										required
										placeholder="House No, Street, Landmark"
										value={formData.address}
										onChange={(v) => handleInputChange('address', v)}
									/>
									{formData.partnerType !== 'organisation' && (
										<FormField
											label="Date of Birth"
											required
											type="date"
											value={formData.dateOfBirth}
											onChange={(v) => handleInputChange('dateOfBirth', v)}
											placeholder="YYYY-MM-DD"
										/>
									)}
								</div>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<FormField
										label="City / Town"
										required
										placeholder="Your city"
										value={formData.city}
										onChange={(v) => handleInputChange('city', v)}
									/>
									<FormField
										label="State"
										required
										placeholder="Andhra Pradesh"
										value={formData.state}
										onChange={(v) => handleInputChange('state', v)}
									/>
								</div>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<FormField
										label="Postal Code"
										required
										placeholder="5XXXXX"
										value={formData.postalCode}
										onChange={(v) => handleInputChange('postalCode', v)}
									/>
									<FormField
										label="Country"
										required
										placeholder="India"
										value={formData.country}
										onChange={(v) => handleInputChange('country', v)}
									/>
								</div>
							</motion.div>
						)}

						{step === 3 && (
							<motion.div
								key="step3"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								className="space-y-6"
							>
								{formData.partnerType === 'individual' ? (
									<div className="space-y-6">
										<div>
											<label className="mb-2 block text-sm font-semibold text-gray-700">
												Your Skills <span className="font-normal text-gray-400">(select all that apply)</span>
											</label>
											<div className="flex flex-wrap gap-2">
												{skills.map((skill) => (
													<motion.button
														key={skill.id}
														type="button"
														onClick={() => toggleSkill(skill.id)}
														whileHover={{ scale: 1.04 }}
														whileTap={{ scale: 0.96 }}
														className={`rounded-lg border-2 px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:text-sm ${
															selectedSkillIds.includes(skill.id)
																? 'border-teal-400 bg-teal-50 text-teal-700'
																: 'border-gray-200 text-gray-500 hover:border-teal-300 hover:bg-teal-50/50'
														}`}
													>
														{selectedSkillIds.includes(skill.id) && (
															<CheckCircle2 size={12} className="mr-1 inline-block" />
														)}
														{skill.name}
													</motion.button>
												))}
											</div>
										</div>

										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											<div>
												<label className="mb-2 block text-sm font-semibold text-gray-700">Availability</label>
												<div className="flex flex-col gap-2">
													<label className="flex items-center gap-2 text-sm text-gray-600">
														<input
															type="checkbox"
															checked={formData.availabilityWeekdays}
															onChange={(e) => handleInputChange('availabilityWeekdays', e.target.checked)}
															className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
														/>
														Weekdays
													</label>
													<label className="flex items-center gap-2 text-sm text-gray-600">
														<input
															type="checkbox"
															checked={formData.availabilityWeekends}
															onChange={(e) => handleInputChange('availabilityWeekends', e.target.checked)}
															className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
														/>
														Weekends
													</label>
												</div>
											</div>
											<FormField
												label="Hours/Week"
												type="number"
												required
												placeholder="4"
												value={formData.hoursPerWeek.toString()}
												onChange={(v) => handleInputChange('hoursPerWeek', parseInt(v) || 0)}
											/>
										</div>
									</div>
								) : formData.partnerType === 'organisation' ? (
									<div className="space-y-5">
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											<FormField
												label="Registration Number"
												placeholder="NGO/REG/12345"
												value={formData.orgRegistrationNumber}
												onChange={(v) => handleInputChange('orgRegistrationNumber', v)}
											/>
											<FormField
												label="Website URL"
												placeholder="https://your-org.org"
												value={formData.websiteUrl}
												onChange={(v) => handleInputChange('websiteUrl', v)}
											/>
										</div>
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											<FormField
												label="Industry"
												placeholder="Education, Healthcare, etc."
												value={formData.industry}
												onChange={(v) => handleInputChange('industry', v)}
											/>
											<FormField
												label="Organisation Type"
												placeholder="Non-profit, Trust, etc."
												value={formData.orgType}
												onChange={(v) => handleInputChange('orgType', v)}
											/>
										</div>
										<FormField
											label="Contact Person Name"
											required
											placeholder="Point of contact name"
											value={formData.contactPersonName}
											onChange={(v) => handleInputChange('contactPersonName', v)}
										/>
									</div>
								) : (
									<div className="space-y-5">
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											<FormField
												label="Primary Platform"
												required
												placeholder="Instagram, YouTube, etc."
												value={formData.platform}
												onChange={(v) => handleInputChange('platform', v)}
											/>
											<FormField
												label="Social Media Handle"
												required
												placeholder="@your_handle"
												value={formData.socialHandle}
												onChange={(v) => handleInputChange('socialHandle', v)}
											/>
										</div>
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											<FormField
												label="Follower Count"
												type="number"
												placeholder="5000"
												value={formData.followerCount.toString()}
												onChange={(v) => handleInputChange('followerCount', parseInt(v) || 0)}
											/>
											<FormField
												label="Focus Area / Niche"
												placeholder="Social Impact, Lifestyle, etc."
												value={formData.niche}
												onChange={(v) => handleInputChange('niche', v)}
											/>
										</div>
									</div>
								)}
							</motion.div>
						)}

						{step === 4 && (
							<motion.div
								key="step4"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								className="space-y-6"
							>
								<div className="space-y-2">
									<label className="block text-sm font-semibold text-gray-700">
										Tell us about your interests <span className="font-normal text-gray-400">(motivation, expertise, etc.)</span>
									</label>
									<textarea
										placeholder={formData.partnerType === 'individual' ? "Tell us why you'd like to join..." : "Describe how you'd like to partner with us..."}
										value={formData.interests}
										onChange={(e) => handleInputChange('interests', e.target.value)}
										rows={3}
										className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-gray-300 hover:border-gray-300 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 resize-y"
									/>
								</div>

								{formData.partnerType === 'individual' && (
									<div className="space-y-4 pt-4 border-t border-gray-100">
										<h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
											<Shield size={14} className="text-teal-500" />
											Emergency Contact <span className="font-normal text-[10px] text-gray-400 uppercase tracking-wider">(Optional)</span>
										</h4>
										<FormField
											label="Contact Name"
											placeholder="Full name"
											value={formData.emergencyName}
											onChange={(v) => handleInputChange('emergencyName', v)}
										/>
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											<FormField
												label="Emergency Phone"
												type="tel"
												placeholder="+91 XXXXX XXXXX"
												value={formData.emergencyPhone}
												onChange={(v) => handleInputChange('emergencyPhone', v)}
											/>
											<FormField
												label="Relationship"
												placeholder="Parent, Sibling, Friend"
												value={formData.emergencyRel}
												onChange={(v) => handleInputChange('emergencyRel', v)}
											/>
										</div>
									</div>
								)}
							</motion.div>
						)}
					</AnimatePresence>

					{/* Turnstile widget — kept outside AnimatePresence so the
					   DOM node always exists for the render() call */}
					<div
						className={`mt-6 flex flex-col items-center transition-all duration-300 ${
							step === 4 ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'
						}`}
					>
						<div className="pt-4 border-t border-gray-100 flex flex-col items-center w-full">
							<div ref={turnstileRef} className="min-h-[65px] min-w-[300px]" />
						</div>
					</div>

					{/* Navigation Buttons */}
					<motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3">
						<div className="flex gap-3">
							{step > 1 && (
								<button
									type="button"
									onClick={prevStep}
									className="flex-1 rounded-2xl border-2 border-gray-200 bg-white py-4 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 sm:text-base"
								>
									Back
								</button>
							)}
							<motion.button
								type="submit"
								disabled={isSubmitting}
								whileHover={{ scale: 1.01, y: -2 }}
								whileTap={{ scale: 0.98 }}
								className="group relative flex-[2] overflow-hidden rounded-2xl py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hp-gradient-bg hover:shadow-xl hover:shadow-teal-200/40 sm:py-5 sm:text-lg"
							>
								{/* Shimmer */}
								<motion.div
									className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
									initial={{ x: '-100%' }}
									animate={{ x: '100%' }}
									transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' as const }}
								/>

								<span className="relative z-10 flex items-center justify-center gap-2">
									{isSubmitting ? (
										<>
											<svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
											</svg>
											Submitting...
										</>
									) : (
										<>
											{step < 4 ? <ArrowRight size={18} /> : <Send size={18} />}
											{step < 4 ? 'Continue' : 'Submit Application'}
										</>
									)}
								</span>
							</motion.button>
						</div>

						{/* Messages */}
						<AnimatePresence>
							{error && (
								<motion.div
									initial={{ opacity: 0, y: 10, height: 0 }}
									animate={{ opacity: 1, y: 0, height: 'auto' }}
									exit={{ opacity: 0, y: -10, height: 0 }}
									className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
								>
									<Shield size={16} className="shrink-0" />
									{error}
								</motion.div>
							)}
							{warning && (
								<motion.div
									initial={{ opacity: 0, y: 10, height: 0 }}
									animate={{ opacity: 1, y: 0, height: 'auto' }}
									exit={{ opacity: 0, y: -10, height: 0 }}
									className="mt-4 flex flex-col items-center justify-center gap-1 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
								>
									<div className="flex items-center gap-2">
										<CheckCircle2 size={16} className="shrink-0" />
										{warning}
									</div>
									<p className="text-xs font-normal opacity-80">
										Need help? <a href="#contact-section" className="underline hover:text-amber-900">Contact our team</a>.
									</p>
								</motion.div>
							)}
							{showSuccess && !warning && (
								<motion.div
									initial={{ opacity: 0, y: 10, height: 0 }}
									animate={{ opacity: 1, y: 0, height: 'auto' }}
									exit={{ opacity: 0, y: -10, height: 0 }}
									className="mt-4 flex flex-col items-center justify-center gap-1 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
								>
									<div className="flex items-center gap-2">
										<Sparkles size={16} className="shrink-0" />
										Application successfully submitted!
									</div>
									<p className="text-xs font-normal opacity-80">We&apos;ll review your details and get back to you within 48 hours.</p>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</motion.form>
			</div>
		</section>
	);
}

// ── Form Field ──────────────────────────────────────────────────────
function FormField({
	label,
	placeholder,
	type = 'text',
	required = false,
	value,
	onChange,
}: {
	label: string;
	placeholder: string;
	type?: string;
	required?: boolean;
	value: string;
	onChange: (value: string) => void;
}) {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<div>
			<label className="mb-1.5 block text-sm font-semibold text-gray-700">
				{label}
				{required && <span className="text-rose-400"> *</span>}
			</label>
			<div className="relative">
				<input
					type={type}
					placeholder={placeholder}
					required={required}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-gray-300 hover:border-gray-300 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
				/>
				<motion.div
					className="absolute bottom-0 left-1/2 h-0.5 rounded-full hp-gradient-bg"
					initial={{ width: 0, x: '-50%' }}
					animate={isFocused ? { width: '50%', x: '-50%' } : { width: 0, x: '-50%' }}
					transition={{ duration: 0.3 }}
				/>
			</div>
		</div>
	);
}

// ══════════════════════════════════════════════════════════════════
// Contact Section
// ══════════════════════════════════════════════════════════════════

function ContactSection() {
	return (
		<section id="contact-section" className="bg-gray-50 px-5 py-16 sm:py-24 lg:px-8">
			<div className="relative mx-auto max-w-4xl overflow-hidden rounded-4xl bg-[#1a2438] px-6 py-14 sm:rounded-[2.5rem] sm:px-12 sm:py-20">
				{/* Radial glow */}
				<div className="pointer-events-none absolute top-1/2 left-1/2 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-hp-primary/10 blur-[120px]" />

				<div className="relative z-10 mx-auto max-w-2xl text-center">
					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
						variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
					>
						{/* Icon */}
						<motion.div
							variants={fadeUp}
							whileHover={{ scale: 1.1, rotate: 5 }}
							className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20"
						>
							<Mail size={24} className="text-white/80" />
						</motion.div>

						{/* Headline */}
						<motion.h2
							variants={fadeUp}
							className="font-poppins text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl"
						>
							Let&apos;s Build{' '}
							<span className="font-playfair italic hp-gradient-text">Hope Together</span>
						</motion.h2>

						<motion.p variants={fadeUp} className="mx-auto mt-4 max-w-lg text-sm text-white/70 sm:text-base">
							Have questions about volunteering, partnerships, or campaigns?
							We&apos;d love to hear from you.
						</motion.p>

						{/* Contact Info */}
						<motion.div variants={fadeUp} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
							<a
								href="mailto:hridayamhopefoundation@gmail.com"
								className="group flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
							>
								<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-teal-500/20">
									<Mail size={16} />
								</div>
								hridayamhopefoundation@gmail.com
							</a>
							<a
								href="tel:++91 76740 28833"
								className="group flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
							>
								<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-teal-500/20">
									<Phone size={16} />
								</div>
								+91-76740-28833
							</a>
						</motion.div>

						{/* CTA Buttons */}
						<motion.div variants={fadeUp} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
							<SignatureButton href="#volunteer-form" size="md">
								Join as Volunteer
							</SignatureButton>
							{/* <SignatureButton
								href="/donate"
								size="md"
								showIcon={false}
								className="bg-transparent! border border-white/20 hover:border-white/40 shadow-none!"
							>
								<Heart size={14} className="mr-2 fill-current text-white/70" />
								Support Our Work
							</SignatureButton> */}
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
