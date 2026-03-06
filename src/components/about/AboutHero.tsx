'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { ABOUT_HERO } from '@/lib/about-constants';

function Counter({ target, suffix }: { target: number; suffix: string }) {
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0.5 });
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!isInView) return;
		let start = 0;
		const duration = 2000;
		const step = Math.ceil(target / (duration / 16));
		const timer = setInterval(() => {
			start += step;
			if (start >= target) {
				setCount(target);
				clearInterval(timer);
			} else {
				setCount(start);
			}
		}, 16);
		return () => clearInterval(timer);
	}, [isInView, target]);

	return (
		<span ref={ref} className="font-(family-name:--font-poppins) text-3xl font-bold hp-gradient-text sm:text-5xl">
			{count.toLocaleString()}
			{suffix}
		</span>
	);
}

export default function AboutHero() {
	return (
		<section className="bg-white py-16 sm:py-24" aria-label="About hero">
			<div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
				<motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
					{/* Eyebrow */}
					{/* <motion.p variants={fadeUp} className="text-[10px] font-semibold uppercase tracking-[3px] hp-gradient-text sm:text-xs">
						{ABOUT_HERO.eyebrow}
					</motion.p> */}

					{/* Headline */}
					<motion.h1
						variants={fadeUp}
						className="font-(family-name:--font-poppins) mt-4 text-3xl font-bold leading-tight text-hp-text-dark sm:text-5xl lg:text-6xl"
					>
						{ABOUT_HERO.headline}{' '}
						<span className="font-(family-name:--font-playfair) italic hp-gradient-text">{ABOUT_HERO.headlineAccent1}</span>{' '}
						{ABOUT_HERO.headlineMiddle}{' '}
						<span className="font-(family-name:--font-playfair) italic hp-gradient-text">{ABOUT_HERO.headlineAccent2}</span>
					</motion.h1>

					{/* Subtitle */}
					<motion.p variants={fadeUp} className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-hp-text-light sm:mt-6 sm:text-base">
						{ABOUT_HERO.subtitle}
					</motion.p>
				</motion.div>

				{/* Stats */}
				<motion.div
					className="mt-12 grid grid-cols-3 gap-4 sm:mt-16 sm:gap-8"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
				>
					{ABOUT_HERO.stats.map((s: { value: number; suffix: string; label: string }) => (
						<motion.div key={s.label} variants={fadeUp} className="flex flex-col items-center">
							<Counter target={s.value} suffix={s.suffix} />
							<p className="mt-1 text-[10px] font-medium text-hp-text-light sm:mt-2 sm:text-sm">{s.label}</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
