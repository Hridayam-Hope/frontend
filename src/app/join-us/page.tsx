'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
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
	{
		id: 'donate',
		icon: Heart,
		title: 'Make a Donation',
		subtitle: 'Fund programs that matter',
		description: "Every rupee creates hope. Your donation directly supports education, healthcare, food distribution, and environmental initiatives across communities.",
		cta: 'Donate Now',
		href: '/donate',
		gradient: 'from-rose-500 to-pink-500',
		bgLight: 'bg-rose-50',
		borderColor: 'border-rose-200',
		iconColor: 'text-rose-600',
		stats: [
			{ value: '₹5L+', label: 'Funds Raised' },
			{ value: '500+', label: 'Lives Impacted' },
		],
	},
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
	{
		id: 'campaign',
		icon: Megaphone,
		title: 'Request a Campaign',
		subtitle: 'Bring change to your area',
		description: "Know a community that needs help? Request a campaign and we'll work with local volunteers to plan and execute a meaningful initiative in your area.",
		cta: 'Request Now',
		href: '#contact-section',
		gradient: 'from-amber-500 to-orange-500',
		bgLight: 'bg-amber-50',
		borderColor: 'border-amber-200',
		iconColor: 'text-amber-600',
		stats: [
			{ value: '25+', label: 'Campaigns Run' },
			{ value: '15+', label: 'Locations' },
		],
	},
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
					<Link
						href="/donate"
						className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
					>
						<Heart size={14} className="fill-current text-rose-400" />
						Donate Now
					</Link>
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
	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		phone: '',
		city: '',
		interest: '',
		availability: 'weekends',
		message: '',
	});
	const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	const formRef = useRef<HTMLElement>(null);
	const isInView = useInView(formRef, { once: true, amount: 0.1 });

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const toggleSkill = (skill: string) => {
		setSelectedSkills((prev) =>
			prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		await new Promise((r) => setTimeout(r, 2000));
		setIsSubmitting(false);
		setShowSuccess(true);
		setFormData({ fullName: '', email: '', phone: '', city: '', interest: '', availability: 'weekends', message: '' });
		setSelectedSkills([]);
		setTimeout(() => setShowSuccess(false), 5000);
	};

	return (
		<section ref={formRef} id="volunteer-form" className="bg-white py-16 sm:py-24">
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
						Fill out the form below and we&apos;ll be in touch within 48 hours.
					</motion.p>
				</motion.div>

				{/* Form */}
				<motion.form
					onSubmit={handleSubmit}
					initial="hidden"
					animate={isInView ? 'visible' : 'hidden'}
					variants={staggerContainer}
					className="overflow-hidden rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-100/80 sm:rounded-3xl sm:p-8 lg:p-10"
				>
					{/* Name + Email Row */}
					<motion.div variants={fadeUp} className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
						<FormField
							label="Full Name"
							required
							placeholder="Your full name"
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
					</motion.div>

					{/* Phone + City Row */}
					<motion.div variants={fadeUp} className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
						<FormField
							label="Phone Number"
							type="tel"
							placeholder="+91 XXXXX XXXXX"
							value={formData.phone}
							onChange={(v) => handleInputChange('phone', v)}
						/>
						<FormField
							label="City / Town"
							placeholder="Your city"
							value={formData.city}
							onChange={(v) => handleInputChange('city', v)}
						/>
					</motion.div>

					{/* Interest Area */}
					<motion.div variants={fadeUp} className="mb-5">
						<label className="mb-2 block text-sm font-semibold text-gray-700">
							Area of Interest
						</label>
						<div className="relative">
							<select
								value={formData.interest}
								onChange={(e) => handleInputChange('interest', e.target.value)}
								className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white py-3 pl-4 pr-10 text-sm text-gray-700 transition-all duration-200 hover:border-gray-300 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
							>
								<option value="">Select an area</option>
								<option value="education">Education & Awareness</option>
								<option value="health">Health & Well-being</option>
								<option value="environment">Environmental Protection</option>
								<option value="community">Community Care</option>
								<option value="digital">Digital & Content</option>
								<option value="any">Open to Anything</option>
							</select>
							<ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
						</div>
					</motion.div>

					{/* Skills */}
					<motion.div variants={fadeUp} className="mb-5">
						<label className="mb-2 block text-sm font-semibold text-gray-700">
							Your Skills <span className="font-normal text-gray-400">(select all that apply)</span>
						</label>
						<div className="flex flex-wrap gap-2">
							{SKILLS_OPTIONS.map((skill) => (
								<motion.button
									key={skill}
									type="button"
									onClick={() => toggleSkill(skill)}
									whileHover={{ scale: 1.04 }}
									whileTap={{ scale: 0.96 }}
									className={`rounded-lg border-2 px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:text-sm ${
										selectedSkills.includes(skill)
											? 'border-teal-400 bg-teal-50 text-teal-700'
											: 'border-gray-200 text-gray-500 hover:border-teal-300 hover:bg-teal-50/50'
									}`}
								>
									{selectedSkills.includes(skill) && (
										<CheckCircle2 size={12} className="mr-1 inline-block" />
									)}
									{skill}
								</motion.button>
							))}
						</div>
					</motion.div>

					{/* Availability */}
					<motion.div variants={fadeUp} className="mb-5">
						<label className="mb-2 block text-sm font-semibold text-gray-700">Availability</label>
						<div className="flex flex-wrap gap-3">
							{[
								{ id: 'weekdays', label: 'Weekdays' },
								{ id: 'weekends', label: 'Weekends' },
								{ id: 'both', label: 'Both' },
								{ id: 'flexible', label: 'Flexible' },
							].map((opt) => (
								<motion.button
									key={opt.id}
									type="button"
									onClick={() => handleInputChange('availability', opt.id)}
									whileHover={{ scale: 1.04 }}
									whileTap={{ scale: 0.96 }}
									className={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
										formData.availability === opt.id
											? 'border-teal-400 bg-teal-50 text-teal-700'
											: 'border-gray-200 text-gray-500 hover:border-teal-300'
									}`}
								>
									{opt.label}
								</motion.button>
							))}
						</div>
					</motion.div>

					{/* Message */}
					<motion.div variants={fadeUp} className="mb-8">
						<label className="mb-2 block text-sm font-semibold text-gray-700">
							Anything else? <span className="font-normal text-gray-400">(Optional)</span>
						</label>
						<textarea
							placeholder="Tell us why you'd like to volunteer, any prior experience, etc."
							value={formData.message}
							onChange={(e) => handleInputChange('message', e.target.value)}
							rows={3}
							className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-gray-300 hover:border-gray-300 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 resize-y"
						/>
					</motion.div>

					{/* Submit */}
					<motion.div variants={fadeUp}>
						<motion.button
							type="submit"
							disabled={isSubmitting || !formData.fullName || !formData.email}
							whileHover={formData.fullName && formData.email ? { scale: 1.01, y: -2 } : {}}
							whileTap={formData.fullName && formData.email ? { scale: 0.98 } : {}}
							className="group relative w-full overflow-hidden rounded-2xl py-4 text-base font-bold text-white shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 hp-gradient-bg hover:shadow-xl hover:shadow-teal-200/40 sm:py-5 sm:text-lg"
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
										<Send size={18} />
										Submit Application
									</>
								)}
							</span>
						</motion.button>

						{/* Success Message */}
						<AnimatePresence>
							{showSuccess && (
								<motion.div
									initial={{ opacity: 0, y: 10, height: 0 }}
									animate={{ opacity: 1, y: 0, height: 'auto' }}
									exit={{ opacity: 0, y: -10, height: 0 }}
									className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm font-medium text-emerald-700"
								>
									<CheckCircle2 size={16} />
									Application submitted! We&apos;ll reach out soon.
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
								href="tel:+918121702286"
								className="group flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
							>
								<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-teal-500/20">
									<Phone size={16} />
								</div>
								+91-81217-02286
							</a>
						</motion.div>

						{/* CTA Buttons */}
						<motion.div variants={fadeUp} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
							<SignatureButton href="#volunteer-form" size="md">
								Join as Volunteer
							</SignatureButton>
							<SignatureButton
								href="/donate"
								size="md"
								showIcon={false}
								className="bg-transparent! border border-white/20 hover:border-white/40 shadow-none!"
							>
								<Heart size={14} className="mr-2 fill-current text-white/70" />
								Support Our Work
							</SignatureButton>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
