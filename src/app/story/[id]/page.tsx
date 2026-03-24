'use client';

import { useState } from 'react';
import { ACTIVITIES } from '@/lib/constants';
import { notFound, useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import {
	ArrowLeft,
	Calendar,
	MapPin,
	Users,
	TreePine,
	Sparkles,
	Heart,
	Share2,
	ArrowRight,
	CheckCircle2,
	Copy,
} from 'lucide-react';
import SignatureButton from '@/components/ui/SignatureButton';

// ── Extended story data for rich content ──
const STORY_DETAILS: Record<
	string,
	{
		location: string;
		date: string;
		volunteersCount: number;
		highlights: string[];
		fullStory: string;
		gallery: string[];
		quote?: { text: string; author: string };
	}
> = {
	'tree-plantation-drive-2026': {
		location: 'Bhimavaram, Andhra Pradesh',
		date: '11 March 2026',
		volunteersCount: 12,
		highlights: [
			'26 trees planted across the community',
			'Volunteers contributed from diverse backgrounds',
			'Native species selected for ecological sustainability',
			'Each tree symbolizes a volunteer\'s commitment',
		],
		fullStory: `Our Tree Plantation Drive was a beautiful expression of community care for the environment. Held in Bhimavaram on March 11, 2026, volunteers came together with a shared purpose: to give back to the earth.

Each of the 26 trees was planted on behalf of a volunteer, symbolizing their personal commitment to a greener future. The initiative focused on native species that are well-suited to the local climate, ensuring long-term ecological impact.

Beyond the planting itself, the event fostered meaningful connections between participants. Conversations about sustainability, environmental stewardship, and collective responsibility flowed naturally as hands worked the soil together.

This drive is just the beginning of our ongoing commitment to environmental protection. We believe that every tree planted today is a promise of cleaner air, richer biodiversity, and a healthier planet for generations to come.`,
		gallery: ['/program_1.webp'],
		quote: {
			text: 'Planting trees felt like a small step at first, but I later understood the impact it holds for the future and the responsibility it carries.',
			author: 'Ankith Pissay, Volunteer',
		},
	},
	'school-awareness-session-2026': {
		location: 'Bhimavaram, Andhra Pradesh',
		date: '11 March 2026',
		volunteersCount: 8,
		highlights: [
			'Interactive session with government school students',
			'Focus on social media awareness and digital safety',
			'Engaging activities to promote responsible online behavior',
			'Students empowered with knowledge for safer internet use',
		],
		fullStory: `Our School Awareness Session brought vital digital literacy education directly to government school students in Bhimavaram. In today's hyper-connected world, understanding how to navigate social media safely is no longer optional — it's essential.

The session was designed to be interactive and engaging, moving beyond traditional lectures into hands-on activities that resonated with young minds. Students explored topics like digital footprints, online privacy, responsible sharing, and identifying misinformation.

Our volunteer educators used relatable examples and real-world scenarios that made the concepts tangible and memorable. The energy in the room was electric as students asked questions, shared their own experiences, and committed to being more mindful digital citizens.

The impact of this session extends far beyond the classroom — each student carries this knowledge home, creating ripple effects across families and communities. This is how awareness transforms into lasting change.`,
		gallery: ['/program_2.webp'],
		quote: {
			text: 'Spreading awareness made me realize that even a message can shift how people think and act — and that gave my experience real meaning.',
			author: 'Bhanu Sai, Volunteer',
		},
	},
};

// ── Animation Variants ──
const fadeUp: Variants = {
	hidden: { opacity: 0, y: 30 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const scaleIn: Variants = {
	hidden: { opacity: 0, scale: 0.9 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function StoryPage() {
	const params = useParams();
	const id = params.id as string;
	const activity = ACTIVITIES.find((a) => a.id === id);

	if (!activity) {
		notFound();
	}

	const details = STORY_DETAILS[id];
	const otherStories = ACTIVITIES.filter((a) => a.id !== id);

	return (
		<>
			<Header />
			<main className="min-h-screen bg-[#F8FAFC]">
				{/* ── Immersive Hero Section ── */}
				<section className="relative overflow-hidden">
					{/* Full-width hero image */}
					<div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh]">
						<Image
							src={activity.image}
							alt={activity.title}
							fill
							className="object-cover"
							priority
							sizes="100vw"
						/>
						{/* Gradient overlays */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
						<div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

						{/* Back button - floating glass */}
						<motion.div
							className="absolute top-24 sm:top-28 left-5 lg:left-8 z-20"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3 }}
						>
							<Link
								href="/#recent-programs"
								className="group inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 text-white/90 text-sm font-medium transition-all hover:bg-white/20 hover:border-white/30"
							>
								<ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
								Back
							</Link>
						</motion.div>

						{/* Hero content overlay */}
						<div className="absolute bottom-0 left-0 right-0 z-10 pb-10 sm:pb-14 lg:pb-16">
							<motion.div
								className="mx-auto max-w-6xl px-5 lg:px-8"
								initial="hidden"
								animate="visible"
								variants={staggerContainer}
							>
								{/* Badge + Meta */}
								<motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 mb-4">
									<span
										className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-lg backdrop-blur-sm border border-white/10 ${activity.badgeColor}`}
									>
										{activity.badge}
									</span>
									<div className="flex items-center gap-4 text-white/70 text-sm">
										<span className="flex items-center gap-1.5">
											<Calendar size={14} />
											{details?.date || activity.meta}
										</span>
										<span className="flex items-center gap-1.5">
											<MapPin size={14} />
											{details?.location || 'Andhra Pradesh'}
										</span>
									</div>
								</motion.div>

								{/* Title */}
								<motion.h1
									variants={fadeUp}
									className="font-(family-name:--font-poppins) text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] max-w-3xl"
								>
									{activity.title}
								</motion.h1>

								{/* Subtitle */}
								<motion.p
									variants={fadeUp}
									className="mt-4 text-white/70 text-base sm:text-lg max-w-2xl leading-relaxed"
								>
									{activity.description}
								</motion.p>
							</motion.div>
						</div>
					</div>
				</section>

				{/* ── Quick Stats Bar ── */}
				{details && (
					<motion.section
						className="relative z-10 -mt-1"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						variants={staggerContainer}
					>
						<div className="mx-auto max-w-6xl px-5 lg:px-8">
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100/80 p-5 sm:p-6">
								<motion.div variants={scaleIn} className="flex items-center gap-3">
									<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
										<TreePine size={20} className="text-emerald-500" />
									</div>
									<div>
										<p className="text-lg font-bold text-hp-text-dark font-(family-name:--font-poppins)">
											{activity.badge === 'Environment' ? '26 Trees' : 'Students'}
										</p>
										<p className="text-[11px] text-hp-text-light">
											{activity.badge === 'Environment' ? 'Planted' : 'Reached'}
										</p>
									</div>
								</motion.div>
								<motion.div variants={scaleIn} className="flex items-center gap-3">
									<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
										<Users size={20} className="text-blue-500" />
									</div>
									<div>
										<p className="text-lg font-bold text-hp-text-dark font-(family-name:--font-poppins)">
											{details.volunteersCount}+
										</p>
										<p className="text-[11px] text-hp-text-light">Volunteers</p>
									</div>
								</motion.div>
								<motion.div variants={scaleIn} className="hidden sm:flex items-center gap-3">
									<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
										<Sparkles size={20} className="text-amber-500" />
									</div>
									<div>
										<p className="text-lg font-bold text-hp-text-dark font-(family-name:--font-poppins)">Direct</p>
										<p className="text-[11px] text-hp-text-light">Community Impact</p>
									</div>
								</motion.div>
							</div>
						</div>
					</motion.section>
				)}

				{/* ── Main Story Content ── */}
				<section className="py-16 sm:py-20">
					<div className="mx-auto max-w-6xl px-5 lg:px-8">
						<div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
							{/* Left: Full Story */}
							<motion.div
								className="lg:col-span-2"
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, amount: 0.1 }}
								variants={staggerContainer}
							>
								{/* Story text */}
								<motion.div variants={fadeUp}>
									<h2 className="font-(family-name:--font-poppins) text-2xl sm:text-3xl font-bold text-hp-text-dark mb-6">
										The Full{' '}
										<span className="font-(family-name:--font-playfair) italic hp-gradient-text">Story</span>
									</h2>
									<div className="space-y-5">
										{(details?.fullStory || activity.description)
											.split('\n\n')
											.map((paragraph, i) => (
												<p
													key={i}
													className="text-hp-text-light text-[15px] sm:text-base leading-[1.8]"
												>
													{paragraph}
												</p>
											))}
									</div>
								</motion.div>

								{/* Quote block */}
								{details?.quote && (
									<motion.blockquote
										variants={fadeUp}
										className="mt-12 relative bg-gradient-to-br from-hp-bg-1 to-hp-bg-2 rounded-2xl p-6 sm:p-8 border border-hp-accent/10"
									>
										<div className="absolute -top-4 left-6 sm:left-8">
											<div className="w-8 h-8 rounded-full hp-gradient-bg flex items-center justify-center shadow-lg shadow-hp-accent/20">
												<span className="text-white text-lg font-bold">"</span>
											</div>
										</div>
										<p className="font-(family-name:--font-playfair) text-hp-text-dark text-lg sm:text-xl italic leading-relaxed mt-2">
											{details.quote.text}
										</p>
										<footer className="mt-4 flex items-center gap-3">
											<div className="w-8 h-[2px] hp-gradient-bg rounded-full" />
											<cite className="not-italic text-sm font-semibold text-hp-text-light">
												{details.quote.author}
											</cite>
										</footer>
									</motion.blockquote>
								)}

								{/* Highlights */}
								{details?.highlights && (
									<motion.div variants={fadeUp} className="mt-12">
										<h3 className="font-(family-name:--font-poppins) text-xl font-bold text-hp-text-dark mb-5">
											Key Highlights
										</h3>
										<div className="grid sm:grid-cols-2 gap-3">
											{details.highlights.map((highlight, i) => (
												<motion.div
													key={i}
													initial={{ opacity: 0, x: -10 }}
													whileInView={{ opacity: 1, x: 0 }}
													viewport={{ once: true }}
													transition={{ delay: i * 0.08 }}
													className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
												>
													<div className="mt-0.5 w-6 h-6 rounded-lg hp-gradient-bg flex items-center justify-center flex-shrink-0">
														<span className="text-white text-xs font-bold">{i + 1}</span>
													</div>
													<p className="text-sm text-hp-text-dark/80 leading-relaxed">{highlight}</p>
												</motion.div>
											))}
										</div>
									</motion.div>
								)}
							</motion.div>

							{/* Right: Sidebar */}
							<motion.aside
								className="space-y-6"
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, amount: 0.1 }}
								variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }}
							>
								{/* Share / CTA Card */}
								<motion.div
									variants={fadeUp}
									className="sticky top-28 space-y-6"
								>
									{/* Support Card */}
									<div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100/80">
										<div className="hp-gradient-bg p-6 text-center">
											<Heart className="w-8 h-8 text-white/90 mx-auto mb-3" />
											<h3 className="font-(family-name:--font-poppins) text-lg font-bold text-white mb-1">
												Support Our Mission
											</h3>
											<p className="text-white/70 text-sm">
												Help us create more stories of impact
											</p>
										</div>
										<div className="p-5 space-y-3">
											{/* <SignatureButton
												href="/donate"
												size="sm"
												className="w-full justify-center"
											>
												Donate Now
											</SignatureButton> */}
											<Link
												href="/join-us"
												className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-hp-accent/20 text-hp-accent text-sm font-semibold hover:bg-hp-accent/5 transition-colors"
											>
												<Users size={16} />
												Become a Volunteer
											</Link>
										</div>
									</div>

									{/* Share Card */}
									<StoryShareCard title={activity.title} id={id} />

									{/* Info card */}
									{details && (
										<div className="bg-gradient-to-br from-hp-bg-1 to-hp-bg-2 rounded-2xl p-5 border border-hp-accent/10">
											<h3 className="font-(family-name:--font-poppins) text-sm font-bold text-hp-text-dark mb-3">
												Program Details
											</h3>
											<div className="space-y-3 text-sm">
												<div className="flex justify-between">
													<span className="text-hp-text-light">Date</span>
													<span className="font-semibold text-hp-text-dark">{details.date}</span>
												</div>
												<div className="h-px bg-hp-accent/10" />
												<div className="flex justify-between">
													<span className="text-hp-text-light">Location</span>
													<span className="font-semibold text-hp-text-dark text-right text-xs">{details.location}</span>
												</div>
												<div className="h-px bg-hp-accent/10" />
												<div className="flex justify-between">
													<span className="text-hp-text-light">Volunteers</span>
													<span className="font-semibold text-hp-text-dark">{details.volunteersCount}+</span>
												</div>
												<div className="h-px bg-hp-accent/10" />
												<div className="flex justify-between">
													<span className="text-hp-text-light">Category</span>
													<span
														className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-white uppercase ${activity.badgeColor}`}
													>
														{activity.badge}
													</span>
												</div>
											</div>
										</div>
									)}
								</motion.div>
							</motion.aside>
						</div>
					</div>
				</section>

				{/* ── Other Stories Section ── */}
				{otherStories.length > 0 && (
					<section className="py-16 sm:py-20 bg-white border-t border-gray-100">
						<motion.div
							className="mx-auto max-w-6xl px-5 lg:px-8"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.2 }}
							variants={staggerContainer}
						>
							<motion.div variants={fadeUp} className="text-center mb-10">
								<span className="inline-block px-3 py-1 rounded-full bg-hp-accent/10 hp-gradient-text text-[10px] font-bold uppercase tracking-widest mb-3">
									More Stories
								</span>
								<h2 className="font-(family-name:--font-poppins) text-2xl sm:text-3xl font-bold text-hp-text-dark">
									Explore More{' '}
									<span className="font-(family-name:--font-playfair) italic hp-gradient-text">Moments</span>
								</h2>
							</motion.div>

							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{otherStories.map((story, i) => (
									<motion.div key={story.id} variants={fadeUp}>
										<Link
											href={`/story/${story.id}`}
											className="group block bg-[#F8FAFC] rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-black/5 transition-all duration-500"
										>
											<div className="relative aspect-[4/3] overflow-hidden">
												<Image
													src={story.image}
													alt={story.title}
													fill
													className="object-cover transition-transform duration-700 group-hover:scale-110"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
												<span
													className={`absolute top-4 right-4 px-2.5 py-1 rounded-lg text-[9px] font-bold text-white uppercase tracking-wider ${story.badgeColor}`}
												>
													{story.badge}
												</span>
											</div>
											<div className="p-5">
												<p className="text-[11px] text-hp-text-light mb-2">{story.meta}</p>
												<h3 className="font-(family-name:--font-poppins) text-lg font-bold text-hp-text-dark mb-2 group-hover:text-hp-accent transition-colors">
													{story.title}
												</h3>
												<p className="text-sm text-hp-text-light line-clamp-2">{story.description}</p>
												<div className="mt-4 flex items-center gap-1.5 text-hp-accent text-sm font-semibold">
													Read Story
													<ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
												</div>
											</div>
										</Link>
									</motion.div>
								))}
							</div>
						</motion.div>
					</section>
				)}
			</main>
			<Footer />
		</>
	);
}

function StoryShareCard({ title, id }: { title: string; id: string }) {
	const [copied, setCopied] = useState(false);

	const getShareUrl = () => {
		if (typeof window !== 'undefined') {
			return `${window.location.origin}/story/${id}`;
		}
		return '';
	};

	const handleShare = (platform: string) => {
		const url = getShareUrl();
		const text = encodeURIComponent(title);
		const encodedUrl = encodeURIComponent(url);

		const shareUrls: Record<string, string> = {
			WhatsApp: `https://wa.me/?text=${text}%20${encodedUrl}`,
			Twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
			Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
		};

		window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
	};

	const handleCopyLink = async () => {
		const url = getShareUrl();
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			try {
				await navigator.clipboard.writeText(url);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			} catch {
				// fallback
			}
		}
	};

	return (
		<div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80">
			<div className="flex items-center gap-3 mb-4">
				<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
					<Share2 size={16} className="text-blue-500" />
				</div>
				<h3 className="font-(family-name:--font-poppins) text-base font-bold text-hp-text-dark">
					Share This Story
				</h3>
			</div>
			<p className="text-xs text-hp-text-light mb-4">
				Spread the word and inspire others to make a difference.
			</p>
			<div className="flex gap-2">
				{(['WhatsApp', 'Twitter', 'Facebook'] as const).map((platform) => (
					<button
						key={platform}
						onClick={() => handleShare(platform)}
						className="flex-1 py-2 rounded-xl bg-gray-50 text-xs font-semibold text-hp-text-light hover:bg-gray-100 transition-colors border border-gray-100"
					>
						{platform}
					</button>
				))}
			</div>
			<button
				onClick={handleCopyLink}
				className="mt-3 flex w-full items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-50 text-xs font-semibold text-hp-text-light hover:bg-gray-100 transition-colors border border-gray-100"
			>
				{copied ? (
					<>
						<CheckCircle2 size={13} className="text-emerald-500" />
						Link Copied!
					</>
				) : (
					<>
						<Copy size={13} />
						Copy Link
					</>
				)}
			</button>
		</div>
	);
}
