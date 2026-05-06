'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Phone, MapPin, ChevronDown, ChevronUp, ArrowUp } from 'lucide-react';
import { FOOTER } from '@/lib/constants';

const socialLinks = [
	{ icon: Facebook, href: 'https://www.facebook.com/share/1bpsM4Nyxb/', label: 'Facebook' },
	{ icon: Instagram, href: 'https://www.instagram.com/hridayam_hope_foundation', label: 'Instagram' },
	{ icon: Linkedin, href: 'https://www.linkedin.com/in/hridayam-hope-foundation-a936143b3', label: 'LinkedIn' },
	{ icon: Youtube, href: 'https://youtube.com/@hridayamhopefoundation', label: 'YouTube' },
];

export default function Footer() {
	const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const toggleAccordion = (label: string) => {
		setActiveAccordion(activeAccordion === label ? null : label);
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const linkSections = [
		{ title: 'About', links: FOOTER.aboutLinks },
		{ title: 'Our Programs', links: FOOTER.programLinks },
		{ title: 'Join Us', links: FOOTER.joinLinks },
	];

	return (
		<footer id="footer" className="bg-[#0F1115] text-white selection:bg-hp-teal/30">
			{/* Top Gradient Border */}
			<div className="h-1 w-full hp-gradient-bg" />

			<div className="mx-auto max-w-7xl px-5 pt-16 pb-12 lg:px-8">
				<div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
					{/* Brand Column */}
					<div className="flex flex-col space-y-6 lg:col-span-4">
						<Link href="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
							<Image src="/logo-footer.svg" alt="Hridayam Hope Foundation" width={160} height={48} className="h-12 w-auto" />
						</Link>
						<p className="max-w-sm text-sm leading-relaxed text-white/60">{FOOTER.tagline}</p>
						<div className="flex items-center gap-4">
							{socialLinks.map(({ icon: Icon, href, label }) => (
								<a
									key={label}
									href={href}
									aria-label={label}
									target='__blank'
									className="group relative rounded-full bg-white/5 p-2.5 transition-all hover:bg-hp-teal"
								>
									<Icon size={16} className="text-white/80 group-hover:text-white" />
									<span className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 rounded-md bg-white px-2 py-1 text-[10px] font-bold text-hp-text-dark transition-transform group-hover:scale-100 italic">
										{label}
									</span>
								</a>
							))}
						</div>
					</div>

					{/* Navigation Columns */}
					<div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
						{linkSections.map((section) => (
							<div key={section.title} className="flex flex-col">
								{/* Desktop Header */}
								<h4 className="hidden font-(family-name:--font-poppins) mb-6 text-base font-bold hp-gradient-text lg:block">{section.title}</h4>

								{/* Mobile Header (Accordion Trigger) */}
								<button
									onClick={() => toggleAccordion(section.title)}
									className="flex w-full items-center justify-between border-b border-white/10 py-4 text-left font-bold lg:hidden"
								>
									<span>{section.title}</span>
									{activeAccordion === section.title ? (
										<ChevronUp size={18} className="text-hp-teal" />
									) : (
										<ChevronDown size={18} className="text-white/40" />
									)}
								</button>

								{/* Link List */}
								<AnimatePresence>
									{(activeAccordion === section.title || (isMounted && window.innerWidth >= 1024)) && (
										<motion.ul
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: 'auto', opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											className="flex flex-col space-y-3 overflow-hidden pt-4 lg:pt-0"
										>
											{section.links.map((link) => (
												<li key={link.label}>
													<Link
														href={link.href}
														className="group flex items-center text-sm text-white/50 transition-colors hover:text-white"
													>
														<span className="h-px w-0 bg-hp-teal transition-all" />
														{link.label}
													</Link>
												</li>
											))}
										</motion.ul>
									)}
								</AnimatePresence>
							</div>
						))}
					</div>
				</div>

				{/* Contact Bar - Refined Icon Layout */}
				<div className="mt-16 flex flex-col items-center gap-8 border-t border-white/5 pt-10 sm:flex-row sm:justify-between">
					<div className="flex flex-wrap justify-center gap-6 sm:gap-10">
						<a
							href={`mailto:${FOOTER.contact.email}`}
							className="group flex items-center gap-3 text-sm text-white/50 transition-all hover:text-white"
						>
							<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-hp-teal/20 group-hover:text-hp-teal">
								<Mail size={16} />
							</div>
							{FOOTER.contact.email}
						</a>
						<a
							href={`tel:${FOOTER.contact.phone}`}
							className="group flex items-center gap-3 text-sm text-white/50 transition-all hover:text-white"
						>
							<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-hp-teal/20 group-hover:text-hp-teal">
								<Phone size={16} />
							</div>
							{FOOTER.contact.phone}
						</a>
						<div className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-all cursor-default group">
							<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-hp-teal/20 group-hover:text-hp-teal">
								<MapPin size={16} />
							</div>
							<span className="max-w-[200px] leading-tight sm:max-w-none">{FOOTER.contact.address}</span>
						</div>
					</div>

					<button
						onClick={scrollToTop}
						className="group flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white/60 transition-all hover:bg-hp-teal hover:text-white hover:shadow-lg hover:shadow-hp-teal/30 active:scale-90"
						aria-label="Back to top"
					>
						<ArrowUp size={20} className="transition-transform group-hover:-translate-y-1" />
					</button>
				</div>
			</div>

			{/* Copyright Bar */}
			<div className="border-t border-white/5 bg-black/20">
				<div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 py-8 text-center text-[11px] font-medium text-white/30 sm:flex-row sm:justify-between sm:text-left lg:px-8">
					<p>© 2026 Hridayam Hope Foundation. Crafted with heart.</p>
					<div className="flex flex-wrap justify-center gap-x-6 gap-y-2 uppercase tracking-widest">
						{FOOTER.bottomLinks.map((link) => (
							<Link key={link.label} href={link.href} className="transition-colors hover:text-white/60">
								{link.label}
							</Link>
						))}
					</div>
					<p className="max-w-[250px] opacity-80 sm:max-w-none">{FOOTER.registrations}</p>
				</div>
			</div>
		</footer>
	);
}
