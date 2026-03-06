'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { SEO_FAQS } from '@/lib/seo-constants';

export default function AboutFAQs() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	return (
		<section className="bg-white py-16 sm:py-24" aria-label="Frequently asked questions">
			<div className="mx-auto max-w-3xl px-5 lg:px-8">
				{/* Header */}
				<motion.div
					className="mb-8 sm:mb-12"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
				>
					<motion.p variants={fadeUp} className="text-[10px] font-semibold uppercase tracking-[2.5px] hp-gradient-text sm:text-xs">
						FAQS
					</motion.p>
					<motion.h2 variants={fadeUp} className="font-(family-name:--font-poppins) mt-3 text-2xl font-bold text-hp-text-dark sm:text-3xl">
						Frequently asked questions
					</motion.h2>
					<motion.p variants={fadeUp} className="mt-2 text-sm text-hp-text-light sm:text-base">
						Answers to common questions about donations, volunteering, our programs, and how we operate.
					</motion.p>
				</motion.div>

				{/* Accordion */}
				<motion.div
					className="divide-y divide-gray-100"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.1 }}
				>
					{SEO_FAQS.map((faq, i) => {
						const isOpen = openIndex === i;
						return (
							<motion.div key={i} variants={fadeUp}>
								<button
									onClick={() => setOpenIndex(isOpen ? null : i)}
									className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-hp-primary sm:py-5"
									aria-expanded={isOpen}
								>
									<span className="pr-4 text-sm font-semibold text-hp-text-dark sm:text-base">{faq.question}</span>
									<span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-hp-primary/10">
										{isOpen ? <Minus size={14} className="text-hp-primary" /> : <Plus size={14} className="text-hp-text-light" />}
									</span>
								</button>
								<AnimatePresence initial={false}>
									{isOpen && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: 'auto', opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.3, ease: 'easeInOut' }}
											className="overflow-hidden"
										>
											<p className="pb-4 text-sm leading-relaxed text-hp-text-dark/70 sm:pb-5 sm:text-base">{faq.answer}</p>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
}
