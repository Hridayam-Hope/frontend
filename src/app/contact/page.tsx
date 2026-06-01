'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
	Mail,
	Phone,
	MessageSquare,
	MapPin,
	Clock,
	Instagram,
	Facebook,
	Linkedin,
	Youtube,
	Copy,
	Check,
	ArrowRight,
	ExternalLink,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileDonateButton from '@/components/layout/MobileDonateButton';
import { SITE_CONFIG } from '@/lib/seo-constants';
import { fadeUp, staggerContainer, scaleIn } from '@/lib/animations';
import Link from 'next/link';

// ══════════════════════════════════════════════════════════════════
// Component Definitions
// ══════════════════════════════════════════════════════════════════

export default function ContactPage() {
	return (
		<>
			<Header />
			<main className="min-h-screen bg-white">
				{/* Top padding to clear fixed header since no hero is used */}
				<div className="h-24 sm:h-32" />

				<section className="px-5 py-12 sm:py-20 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid gap-12 lg:grid-cols-2 lg:gap-20">
							{/* Left Column: Direct Communication */}
							<motion.div variants={fadeUp} className="space-y-10">
								<div>
									<motion.p variants={fadeUp} className="text-[10px] font-semibold uppercase tracking-[2.5px] hp-gradient-text sm:text-xs">
										Reach Out to Us
									</motion.p>
									<motion.h1 variants={fadeUp} className="font-poppins mt-3 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
										Let&apos;s Start a <span className="font-playfair italic hp-gradient-text">Conversation</span>
									</motion.h1>
									<p className="mt-5 max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
										Have questions about our programs or want to support our mission? Choose your preferred way to connect with us.
									</p>
								</div>

								{/* Contact Cards */}
								<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
									<ContactCard
										icon={MessageSquare}
										title="WhatsApp Us"
										value="Quick Support Chat"
										href={`https://wa.me/${SITE_CONFIG.contact.phone.replace('+', '')}`}
										label="Start Chat"
										color="teal"
									/>
									<ContactCard
										icon={Phone}
										title="Phone Number"
										value={SITE_CONFIG.contact.phone}
										href={`tel:${SITE_CONFIG.contact.phone}`}
										label="Call Now"
										copyValue={SITE_CONFIG.contact.phone}
										color="cyan"
									/>
									<ContactCard
										icon={Mail}
										title="Email Address"
										value={SITE_CONFIG.contact.email}
										href={`mailto:${SITE_CONFIG.contact.email}`}
										label="Send Email"
										hideActions
										color="blue"
									/>
									
								</div>

								{/* Social Media Grid */}
								<div className="rounded-3xl bg-gray-50 p-6 sm:p-8">
									<h3 className="font-poppins text-sm font-bold text-gray-900 sm:text-base">Follow Our Journey</h3>
									<p className="mt-1 text-xs text-gray-400">Stay updated with our latest activities</p>

									<div className="mt-6 flex flex-wrap gap-4">
										<SocialLink icon={Instagram} href={SITE_CONFIG.social.instagram} label="Instagram" />
										<SocialLink icon={Linkedin} href={SITE_CONFIG.social.linkedin} label="LinkedIn" />
										<SocialLink icon={Facebook} href={SITE_CONFIG.social.facebook} label="Facebook" />
										<SocialLink icon={Youtube} href={SITE_CONFIG.social.youtube} label="YouTube" />
									</div>
								</div>
							</motion.div>

							{/* Right Column: NGO Presence & Map */}
							<motion.div variants={fadeUp} className="space-y-8">
								{/* Address Card */}
								<div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-[#f8fafc] to-[#f1f5f9] p-8 shadow-sm ring-1 ring-gray-200/50 sm:rounded-[2.5rem] sm:p-10">
									<div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-blue-100/30 blur-3xl" />

									<div className="relative z-10 space-y-8">
										<div className="flex items-start gap-4">
											<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
												<MapPin size={22} className="text-blue-600" />
											</div>
											<div>
												<h3 className="font-poppins text-lg font-bold text-gray-900">Our Office</h3>
												<p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-base">
													{SITE_CONFIG.contact.address}
													<br />
													India
												</p>
											</div>
										</div>

										<div className="flex items-start gap-4">
											<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
												<Clock size={22} className="text-blue-600" />
											</div>
											<div>
												<h3 className="font-poppins text-lg font-bold text-gray-900">Office Hours</h3>
												<div className="mt-2 space-y-1 text-sm text-gray-500 sm:text-base">
													<p>Monday – Saturday: 9:00 AM – 6:00 PM</p>
													<p>Sunday: Closed</p>
												</div>
											</div>
										</div>

										<div className="pt-4">
											<Link
												href="/join-us"
												className="group flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all hover:bg-gray-50 hover:shadow-md"
											>
												<div className="flex items-center gap-4">
													<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
														<ArrowRight size={18} className="text-teal-600" />
													</div>
													<div>
														<p className="text-sm font-bold text-gray-900">Want to join us?</p>
														<p className="text-xs text-gray-400">Become a volunteer today</p>
													</div>
												</div>
												<ArrowRight size={16} className="text-gray-300 transition-transform group-hover:translate-x-1" />
											</Link>
										</div>
									</div>
								</div>
							</motion.div>
						</motion.div>
					</div>
				</section>
			</main>
			<Footer />
			{/* <MobileDonateButton /> */}
		</>
	);
}

// ══════════════════════════════════════════════════════════════════
// Sub-components
// ══════════════════════════════════════════════════════════════════

interface ContactCardProps {
	icon: any;
	title: string;
	value: string;
	href: string;
	label: string;
	copyValue?: string;
	hideActions?: boolean;
	color: 'teal' | 'blue' | 'cyan';
}

function ContactCard({ icon: Icon, title, value, href, label, copyValue, hideActions, color }: ContactCardProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = (e: React.MouseEvent) => {
		e.preventDefault();
		if (!copyValue) return;
		navigator.clipboard.writeText(copyValue);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const colorStyles = {
		teal: 'bg-teal-50 text-teal-600 ring-teal-100',
		blue: 'bg-blue-50 text-blue-600 ring-blue-100',
		cyan: 'bg-cyan-50 text-cyan-600 ring-cyan-100',
	};

	return (
		<Link
			href={href}
			target={href.startsWith('http') ? '_blank' : undefined}
			className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-100 hover:shadow-md min-w-0"
		>
			<div className="flex w-full items-center gap-4 min-w-0">
				<div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorStyles[color]} ring-1`}>
					<Icon size={20} />
				</div>
				<div className="min-w-0 flex-1">
					<p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{title}</p>
					<p className="truncate text-sm font-bold text-gray-900 sm:text-base" title={value}>{value}</p>
				</div>
			</div>

			{!hideActions && (
				<div className="flex shrink-0 items-center gap-2">
					{copyValue && (
						<motion.button
							whileTap={{ scale: 0.9 }}
							onClick={handleCopy}
							className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-gray-50 hover:text-blue-500"
							title="Copy to clipboard"
						>
							{copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
						</motion.button>
					)}
					<div className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-300 transition-colors group-hover:text-blue-500">
						<ExternalLink size={16} />
					</div>
				</div>
			)}
		</Link>
	);
}

function SocialLink({ icon: Icon, href, label }: { icon: any; href: string; label: string }) {
	return (
		<motion.a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			whileHover={{ y: -4 }}
			whileTap={{ scale: 0.95 }}
			className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm ring-1 ring-gray-100 transition-all hover:text-blue-600 hover:shadow-md hover:ring-blue-100"
			aria-label={label}
		>
			<Icon size={20} />
		</motion.a>
	);
}
