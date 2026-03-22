'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, type Variants } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import { fadeUp, slideInLeft, slideInRight, staggerContainer } from '@/lib/animations';
import { WHO_WE_ARE } from '@/lib/constants';
import SignatureButton from '@/components/ui/SignatureButton';

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
			{count}
			{suffix}
		</span>
	);
}

const gridItemVariants: Variants = {
	hover: {
		y: -10,
		scale: 1.02,
		transition: { type: 'spring', stiffness: 300, damping: 20 },
	},
};

export default function WhoWeAre() {
	return (
		<section id="who-we-are" className="bg-hp-bg-2 py-14 sm:py-28" aria-label="Who we are">
			<div className="mx-auto max-w-7xl px-5 lg:px-8">
				<motion.div
					className="grid items-center gap-4 lg:grid-cols-5 lg:gap-16"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
				>
					{/* Interactive Grid  -  2/5 */}
					<motion.div variants={slideInLeft} className="order-2 lg:order-1 lg:col-span-2 mt-8 lg:mt-0">
						<div className="grid grid-cols-2 gap-3 sm:gap-6">
							{/* Column 1 */}
							<div className="space-y-3 sm:space-y-6">
								<motion.div
									whileHover="hover"
									variants={gridItemVariants}
									className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg ring-1 ring-hp-primary/10 sm:rounded-3xl"
								>
									<Image src="/about-joy.png" alt="Joyful children supported by Hridayam Hope" fill className="object-cover" />
								</motion.div>
								<motion.div
									whileHover="hover"
									variants={gridItemVariants}
									className="relative aspect-square overflow-hidden rounded-2xl shadow-lg ring-1 ring-hp-primary/10 sm:rounded-3xl"
								>
									<Image src="/about-sprout.webp" alt="Environmental sustainability initiative" fill className="object-cover" />
								</motion.div>
							</div>

							{/* Column 2 (Offset) */}
							<div className="space-y-3 pt-6 sm:space-y-6 sm:pt-12">
								<motion.div
									whileHover="hover"
									variants={gridItemVariants}
									className="relative aspect-square overflow-hidden rounded-2xl shadow-lg ring-1 ring-hp-primary/10 sm:rounded-3xl"
								>
									<Image src="/about-books.webp" alt="Education support program" fill className="object-cover" />
								</motion.div>
								<motion.div
									variants={gridItemVariants}
									className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg ring-1 ring-hp-primary/10 sm:rounded-3xl"
								>
									<Image src="/about_4.jpeg" alt="Education support program" fill className="object-cover" />
								</motion.div>
							</div>
						</div>
					</motion.div>

					{/* Content  -  3/5 */}
					<motion.div className="order-1 lg:order-2 space-y-4 sm:space-y-6 lg:col-span-3" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
						<motion.p
							variants={fadeUp}
							className="text-[10px] font-semibold uppercase tracking-[2px] hp-gradient-text sm:text-xs sm:tracking-[2.5px]"
						>
							{WHO_WE_ARE.eyebrow}
						</motion.p>

						<motion.h2
							variants={fadeUp}
							className="font-(family-name:--font-poppins) text-2xl font-bold leading-tight text-hp-text-dark sm:text-4xl lg:text-[40px]"
						>
							{WHO_WE_ARE.headline}
						</motion.h2>

						<motion.p variants={fadeUp} className="text-sm leading-[1.7] text-hp-text-dark/80 sm:text-base sm:leading-[1.8]">
							{WHO_WE_ARE.paragraph}
						</motion.p>

						{/* <motion.div variants={fadeUp} className="pt-2">
							<SignatureButton href="#">{WHO_WE_ARE.cta}</SignatureButton>
						</motion.div> */}
					</motion.div>
				</motion.div>

				{/* Impact Metrics */}
				{/* <motion.div
					className="mt-10 grid grid-cols-3 gap-2 sm:mt-16 sm:gap-6"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
				>
					{WHO_WE_ARE.metrics.map((m) => (
						<motion.div
							key={m.label}
							variants={fadeUp}
							whileHover={{
								y: -8,
								scale: 1.02,
								backgroundColor: 'rgba(255, 255, 255, 0.8)',
								boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
							}}
							transition={{ type: 'spring', stiffness: 300, damping: 20 }}
							className="group relative flex flex-col items-center justify-center rounded-2xl border border-hp-primary/5 p-4 transition-colors duration-300 hover:border-hp-primary/20 sm:p-6"
						>
							<div className="absolute inset-0 -z-10 rounded-2xl bg-white/40 opacity-0 transition-opacity duration-300 backdrop-blur-[2px] group-hover:opacity-100" />
							<Counter target={m.value} suffix={m.suffix} />
							<p className="mt-1 text-[10px] font-medium text-hp-text-light transition-colors group-hover:text-hp-primary sm:mt-2 sm:text-sm">
								{m.label}
							</p>
						</motion.div>
					))}
				</motion.div> */}
			</div>
		</section>
	);
}
