'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@/lib/constants';
import SignatureButton from '@/components/ui/SignatureButton';

export default function Header() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 50);
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	const closeMobile = useCallback(() => setMobileOpen(false), []);

	// Lock body scroll when mobile menu is open
	useEffect(() => {
		document.body.style.overflow = mobileOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [mobileOpen]);

	return (
		<>
			<header
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
				}`}
			>
				<div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
					{/* Logo */}
					<Link href="/" className="relative z-10 flex-shrink-0">
						<Image
							src={scrolled ? '/logo-header.svg' : '/logo-mono.svg'}
							alt="Hridayam Hope Foundation"
							width={160}
							height={48}
							className="h-9 w-auto lg:h-12"
							priority
						/>
					</Link>

					{/* Desktop Nav */}
					<nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
						{NAV_LINKS.map((link) => (
							<Link
								key={link.label}
								href={link.href}
								className={`relative text-sm font-medium transition-colors duration-200 group ${
									scrolled ? 'text-hp-text-dark' : 'hp-gradient-text'
								}`}
							>
								{link.label}
								<span className="absolute -bottom-1 left-0 h-0.5 w-0 hp-gradient-bg transition-all duration-300 group-hover:w-full" />
							</Link>
						))}
					</nav>

					{/* Desktop CTA */}
					<SignatureButton href="/donate" className="hidden lg:inline-flex" showIcon={false}>
						Donate Now
					</SignatureButton>

					{/* Mobile Hamburger */}
					<button
						onClick={() => setMobileOpen((v) => !v)}
						className={`relative z-10 lg:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-hp-text-dark' : 'text-white'}`}
						aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
					>
						{mobileOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
			</header>

			{/* Mobile Drawer - Moved outside <header> for fixed positioning stability */}
			<AnimatePresence mode="wait">
				{mobileOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/60 z-[60] lg:hidden"
							onClick={closeMobile}
						/>
						{/* Drawer */}
						<motion.div
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							transition={{ type: 'spring', damping: 25, stiffness: 200 }}
							className="fixed top-0 right-0 bottom-0 w-80 bg-white/98 backdrop-blur-xl z-[70] shadow-2xl flex flex-col lg:hidden"
						>
							<div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
								<Image src="/logo-header.svg" alt="Hridayam Hope Foundation" width={120} height={36} className="h-8 w-auto" />
								<button onClick={closeMobile} className="p-2 text-gray-500" aria-label="Close menu">
									<X size={20} />
								</button>
							</div>

							<div className="flex-1 overflow-y-auto px-5 py-8">
								<p className="text-[10px] font-semibold text-hp-text-light uppercase tracking-widest mb-4 px-1">Navigation</p>
								<div className="flex flex-wrap gap-3">
									{NAV_LINKS.map((link) => (
										<Link
											key={link.label}
											href={link.href}
											onClick={closeMobile}
											className="px-5 py-2.5 rounded-2xl bg-hp-bg-1 text-hp-text-dark text-sm font-medium hover:bg-hp-primary/10 hover:text-hp-primary transition-all active:scale-95 whitespace-nowrap border border-gray-100/50"
										>
											{link.label}
										</Link>
									))}

									<SignatureButton
										href="#quick-impact"
										size="sm"
										showIcon={false}
										onClick={closeMobile}
										className="w-full mt-4 !rounded-2xl py-4 text-xs"
									>
										Donate Now
									</SignatureButton>
								</div>

								{/* Contact Quick Link */}
								<div className="mt-12 p-5 rounded-3xl bg-hp-bg-1 border border-gray-100 flex flex-col gap-2">
									<p className="text-xs font-semibold text-hp-text-dark">Need help?</p>
									<p className="text-[11px] text-hp-text-light">Our coordination team is here for any queries or support.</p>
									<Link href="#contact" onClick={closeMobile} className="text-hp-primary text-xs font-bold mt-1 flex items-center gap-1">
										Contact Us <span className="text-lg">→</span>
									</Link>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
