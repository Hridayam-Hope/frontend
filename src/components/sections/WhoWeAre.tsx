'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { fadeUp, slideInRight, staggerContainer } from '@/lib/animations';
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
		<span ref={ref} className="font-(family-name:--font-poppins) text-3xl font-bold hp-gradient-text sm:text-4xl md:text-5xl">
			{count}
			{suffix}
		</span>
	);
}

export default function WhoWeAre() {
	return (
		<section id="who-we-are" className="relative overflow-hidden bg-white py-16 sm:py-24 lg:py-28" aria-label="Who we are">
			{/* Decorative background elements to reduce whitespace visually */}
			<div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-hp-primary/5 blur-3xl" />
			<div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-3xl" />

			<div className="relative mx-auto max-w-7xl px-5 lg:px-8">
				<motion.div
					className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
				>
					{/* Content Side */}
					<motion.div className="space-y-6 sm:space-y-8" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
						<div className="space-y-4">
							<motion.span
								variants={fadeUp}
								className="inline-block px-3 py-1 rounded-full bg-hp-teal/10 hp-gradient-text text-[10px] font-bold uppercase tracking-widest mb-4"
							>
								{WHO_WE_ARE.eyebrow}
							</motion.span>

							<motion.h2
								variants={fadeUp}
								className="font-(family-name:--font-poppins) text-3xl font-bold leading-tight text-hp-text-dark sm:text-4xl lg:text-5xl"
							>
								{WHO_WE_ARE.headline}
							</motion.h2>
						</div>

						<motion.div
							variants={fadeUp}
							className="relative rounded-2xl border-l-4 border-hp-primary bg-hp-bg-1 p-5 shadow-sm sm:p-6 lg:rounded-3xl lg:p-8"
						>
							<p className="text-sm leading-relaxed text-hp-text-dark/80 sm:text-base sm:leading-loose">{WHO_WE_ARE.paragraph}</p>
						</motion.div>

						{/* Metrics row to fill space */}
						{/* <motion.div 
							variants={fadeUp} 
							className="grid grid-cols-3 gap-3 rounded-2xl sm:gap-6"
						>
							{WHO_WE_ARE.metrics.map((m) => (
								<div
									key={m.label}
									className="group flex flex-col justify-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-hp-primary/30 hover:shadow-md sm:p-5"
								>
									<Counter target={m.value} suffix={m.suffix} />
									<p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-hp-text-light transition-colors group-hover:text-hp-primary sm:mt-3 sm:text-xs">
										{m.label}
									</p>
								</div>
							))}
						</motion.div> */}

						<motion.div variants={fadeUp} className="pt-2">
							<SignatureButton href="/about" showIcon={false}>
								{WHO_WE_ARE.cta}
							</SignatureButton>
						</motion.div>
					</motion.div>

					{/* Image Side (Just One Image) */}
					<motion.div variants={slideInRight} className="hidden lg:block relative h-[400px] w-full sm:h-[500px] lg:h-[650px]">
						<div className="relative h-full w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5 lg:rounded-[3rem]">
							<Image
								src="/about-children.webp"
								alt="Hridayam Hope Foundation"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover transition-transform duration-1000 hover:scale-105"
								priority
							/>
							{/* Soft gradient overlay */}
							<div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-hp-primary/10 to-transparent lg:rounded-[3rem]" />
						</div>

						{/* Floating decorative element (Heart) */}
						<motion.div
							animate={{ y: [0, -10, 0] }}
							transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
							className="absolute -bottom-6 -left-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 sm:-bottom-8 sm:-left-8 sm:h-28 sm:w-28 sm:rounded-[2rem]"
						>
							<div className="flex h-full w-full items-center justify-center rounded-xl bg-hp-primary/10 sm:rounded-2xl">
								<Heart size={32} className="text-hp-primary sm:h-12 sm:w-12" />
							</div>
						</motion.div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
