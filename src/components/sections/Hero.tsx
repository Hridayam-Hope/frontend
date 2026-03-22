'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { fadeUp, fadeIn } from '@/lib/animations';
import { HERO } from '@/lib/constants';
import SignatureButton from '@/components/ui/SignatureButton';

export default function Hero() {
	return (
		<section id="hero" className="relative overflow-hidden bg-[#1a2438]" aria-label="Hero">
			{/* Dark gradient base */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#1a2438] via-[#1a2438] to-[#1a2438]/60" />

			{/* Hero image  -  sits naturally on the right */}
			<div className="absolute inset-0">
				<Image
					src="/hero.jpeg"
					alt="A child planting a sapling  -  hope in action"
					fill
					className="object-cover object-right"
					priority
					sizes="100vw"
				/>
				{/* Gradient overlay: solid dark on left, fading to transparent on right */}
				<div
					className="absolute inset-0"
					style={{
						background:
							'linear-gradient(to right, #1a2438 0%, #1a2438 10%, rgba(26,36,56,0.85) 20%, rgba(26,36,56,0.4) 50%, rgba(26,36,56,0.2) 100%)',
					}}
				/>
			</div>

			{/* Content */}
			<motion.div
				className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 py-24 lg:px-8"
				initial="hidden"
				animate="visible"
				variants={{
					visible: { transition: { staggerChildren: 0.15 } },
				}}
			>
				<div className="w-full max-w-xl lg:max-w-2xl">
					{/* Eyebrow */}
					<motion.p
						variants={fadeIn}
						className="mb-3 text-[10px] font-semibold uppercase tracking-[3px] sm:text-xs"
						style={{
							color: 'transparent',
							backgroundImage: 'linear-gradient(318.92deg, #65BAC1 20.44%, #9DD5DB 86.52%)',
							WebkitBackgroundClip: 'text',
							backgroundClip: 'text',
						}}
					>
						{HERO.eyebrow}
					</motion.p>

					{/* Headline */}
					<motion.h1
						variants={fadeUp}
						className="font-(family-name:--font-poppins) text-[26px] font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-[56px] lg:leading-[1.15]"
					>
						{HERO.headline}
					</motion.h1>

					{/* Subheadline */}
					<motion.p variants={fadeUp} className="mt-4 text-[13px] leading-relaxed text-white/80 sm:mt-6 sm:text-lg">
						{HERO.subheadline}
					</motion.p>

					{/* Paragraph */}
					<motion.p variants={fadeUp} className="mt-3 text-xs leading-[1.8] text-white/60 sm:mt-4 sm:text-base">
						{HERO.paragraph}
					</motion.p>

					{/* Italic tagline */}
					<motion.p variants={fadeUp} className="font-(family-name:--font-playfair) mt-4 text-sm italic text-white/70 sm:mt-5 sm:text-base">
						Because hope begins in the heart.
					</motion.p>
				</div>
			</motion.div>

			{/* Floating CTA Dock */}
			<div className="absolute bottom-15 left-1/2 -translate-x-1/2 z-20 w-[calc(0%-2.5rem)] max-w-2xl sm:bottom-12">
				<motion.div
					variants={fadeUp}
					initial="hidden"
					animate="visible"
					className="flex items-center justify-center gap-1.5 rounded-2xl bg-black/40 p-1.5 backdrop-blur-md ring-1 ring-white/10 sm:gap-4 sm:rounded-3xl sm:p-3"
				>
					<SignatureButton
						href="#quick-impact"
						size="sm"
						showIcon={false}
						className="flex-1 !rounded-tl-2xl !rounded-br-2xl !rounded-tr-md !rounded-bl-md"
					>
						{HERO.cta.primary}
					</SignatureButton>

					<SignatureButton
						href="#volunteer"
						size="sm"
						showIcon={false}
						className="flex-1 !bg-transparent !shadow-none border border-white/20 hover:border-white/40 !rounded-tl-2xl !rounded-br-2xl !rounded-tr-md !rounded-bl-md"
					>
						Become a Volunteer
					</SignatureButton>

					<SignatureButton
						href="#who-we-are"
						size="sm"
						showIcon={false}
						className="flex-1 !bg-transparent !shadow-none border border-white/20 hover:border-white/40 !rounded-tl-2xl !rounded-br-2xl !rounded-tr-md !rounded-bl-md"
					>
						Explore Our Work
					</SignatureButton>
				</motion.div>
			</div>
		</section>
	);
}
