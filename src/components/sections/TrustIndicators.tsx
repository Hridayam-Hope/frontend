'use client';

import { ShieldCheck, Eye, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { TRUST_ITEMS } from '@/lib/constants';

const iconMap = { ShieldCheck, Eye, Award } as const;

export default function TrustIndicators() {
	return (
		<section
			id="trust"
			className="py-6 sm:py-10"
			style={{ background: 'linear-gradient(135deg, #EDF3FA 0%, #EFF8F9 100%)' }}
			aria-label="Trust indicators"
		>
			<motion.div
				className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5 sm:flex-row sm:justify-center sm:gap-12 lg:gap-20 lg:px-8"
				variants={staggerContainer}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.3 }}
			>
				{TRUST_ITEMS.map((item) => {
					const Icon = iconMap[item.icon];
					return (
						<motion.div key={item.text} variants={fadeUp} className="flex items-center gap-2 sm:gap-3">
							<div className="flex h-8 w-8 items-center justify-center rounded-full sm:h-11 sm:w-11 hp-gradient-bg">
								<Icon size={16} className="text-white sm:[&]:w-5 sm:[&]:h-5" />
							</div>
							<span className="text-xs font-medium text-hp-text-light sm:text-sm">{item.text}</span>
						</motion.div>
					);
				})}
			</motion.div>
		</section>
	);
}
