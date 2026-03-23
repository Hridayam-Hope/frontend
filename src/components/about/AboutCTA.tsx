'use client';

import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Eye, Users } from 'lucide-react';
import { fadeUp } from '@/lib/animations';
import { ABOUT_CTA } from '@/lib/about-constants';
import SignatureButton from '@/components/ui/SignatureButton';

export default function AboutCTA() {
	return (
		<section className="bg-white px-5 py-16 sm:py-24 lg:px-8" aria-label="Call to action">
			{/* Contained dark rounded card */}
			<div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-[#1a2438] px-6 py-14 sm:rounded-[2.5rem] sm:px-12 sm:py-20">
				{/* Subtle radial glow */}
				<div className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-hp-primary/10 blur-[120px]" />

				<div className="relative z-10 mx-auto max-w-2xl text-center">
					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
						variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
					>
						{/* Heart icon */}
						<motion.div
							variants={fadeUp}
							whileHover={{ scale: 1.1, rotate: 5 }}
							className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20"
						>
							<Heart size={24} className="text-white/80 fill-white/20" />
						</motion.div>

						{/* Headline */}
						<motion.h2
							variants={fadeUp}
							className="font-(family-name:--font-poppins) text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl"
						>
							{ABOUT_CTA.headline}{' '}
							<span className="font-(family-name:--font-playfair) italic hp-gradient-text">{ABOUT_CTA.headlineItalicAccent}</span>
							<br />
							<span className="font-(family-name:--font-playfair) italic">{ABOUT_CTA.headlineBold}</span>
						</motion.h2>

						{/* Subtitle */}
						<motion.p variants={fadeUp} className="mx-auto mt-4 max-w-lg text-sm text-white/70 sm:text-base">
							{ABOUT_CTA.subtitle}
						</motion.p>
						<motion.p variants={fadeUp} className="mx-auto mt-2 max-w-lg text-xs text-white/50 sm:text-sm">
							{ABOUT_CTA.subtext}
						</motion.p>

						{/* CTAs */}
						<motion.div variants={fadeUp} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
							<SignatureButton href="#" size="md">
								{ABOUT_CTA.primaryCta}
							</SignatureButton>
							{/* <SignatureButton
								href="#"
								size="md"
								showIcon={false}
								className="!bg-transparent border border-white/20 hover:border-white/40 !shadow-none"
							>
								<Heart size={14} className="mr-2 fill-current text-white/70" />
								{ABOUT_CTA.secondaryCta}
							</SignatureButton> */}
						</motion.div>

						{/* Trust Indicators */}
						<motion.div
							variants={fadeUp}
							className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[10px] text-white/50 sm:gap-6 sm:text-xs"
						>
							{ABOUT_CTA.trust.map((item: string, i: number) => {
								const icons = [ShieldCheck, Eye, Users];
								const Icon = icons[i] || ShieldCheck;
								return (
									<span key={item} className="flex items-center gap-1.5">
										<Icon size={12} />
										{item}
									</span>
								);
							})}
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
