'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/animations';
import { QUICK_IMPACT } from '@/lib/constants';
import SignatureButton from '@/components/ui/SignatureButton';

export default function QuickImpact() {
	const [selected, setSelected] = useState<number | null>(null);

	return (
		<section id="quick-impact" className="bg-white py-12 sm:py-20" aria-label="Quick donation">
			<motion.div
				className="mx-auto max-w-xl px-5 text-center lg:px-8"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.3 }}
				variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
			>
				<motion.h2 variants={fadeUp} className="font-(family-name:--font-poppins) text-xl font-semibold hp-gradient-text sm:text-2xl">
					{QUICK_IMPACT.headline}
				</motion.h2>

				<motion.p variants={fadeUp} className="mt-2 text-xs text-hp-text-light sm:mt-3 sm:text-sm">
					{QUICK_IMPACT.subtext}
				</motion.p>

				{/* Amount Buttons */}
				<motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-8 sm:gap-3">
					{QUICK_IMPACT.amounts.map((amount, i) => (
						<button
							key={amount}
							onClick={() => setSelected(i)}
							className={`rounded-tl-2xl rounded-tr-md rounded-br-2xl rounded-bl-md border-2 px-4 py-2 text-xs font-semibold transition-all duration-200 sm:px-6 sm:py-2.5 sm:text-sm ${
								selected === i
									? 'hp-gradient-bg border-transparent text-white shadow-md'
									: 'border-hp-primary/30 text-hp-primary hover:border-hp-primary hover:bg-hp-bg-1'
							}`}
						>
							{amount}
						</button>
					))}
				</motion.div>

				{/* CTA */}
				<motion.div variants={fadeUp} className="mt-8">
					<SignatureButton href="#">{QUICK_IMPACT.cta}</SignatureButton>
				</motion.div>

				<motion.p variants={fadeUp} className="mt-3 text-[10px] text-hp-text-light sm:mt-4 sm:text-xs">
					{QUICK_IMPACT.disclaimer}
				</motion.p>
			</motion.div>
		</section>
	);
}
