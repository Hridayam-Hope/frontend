'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { SEO_FAQS } from '@/lib/seo-constants';

export default function FAQ() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	return (
		<section className="bg-hp-bg-1/40 py-10 sm:py-20" aria-label="Frequently asked questions">
			<div className="mx-auto max-w-7xl px-5 lg:px-8">
				{/* Header */}
				<motion.div
					className="mx-auto mb-8 max-w-2xl text-center sm:mb-12"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
				>
					<motion.p
						variants={fadeUp}
						className="text-[10px] font-semibold uppercase tracking-[2px] hp-gradient-text sm:text-xs sm:tracking-[2.5px]"
					>
						FAQS
					</motion.p>
					<motion.h2
						variants={fadeUp}
						className="font-(family-name:--font-poppins) mt-2 text-2xl font-bold text-hp-text-dark sm:text-4xl"
					>
						Got Questions? We Have Answers
					</motion.h2>
					<motion.p variants={fadeUp} className="mt-2 text-sm text-hp-text-light sm:mt-3 sm:text-base">
						Find answers to common questions about our mission, programs, and how you can support.
					</motion.p>
				</motion.div>

				{/* Grid Accordion */}
				<motion.div
					className="grid gap-4 items-start sm:gap-6 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-6"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.1 }}
				>
					{SEO_FAQS.map((faq, i) => {
						const isOpen = openIndex === i;
						return (
							<motion.div 
								key={i} 
								variants={fadeUp}
								className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
									isOpen 
										? 'border-hp-primary/20 bg-white shadow-md' 
										: 'border-gray-200/60 bg-white/50 hover:border-hp-primary/10 hover:bg-white'
								}`}
							>
								<button
									onClick={() => setOpenIndex(isOpen ? null : i)}
									className="flex w-full items-center justify-between p-4 text-left sm:p-5"
									aria-expanded={isOpen}
								>
									<span className="pr-4 text-sm font-semibold text-hp-text-dark sm:text-base">
										{faq.question}
									</span>
									<span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
										isOpen ? 'bg-hp-primary text-white' : 'bg-gray-100 text-hp-text-light'
									}`}>
										{isOpen ? <Minus size={14} /> : <Plus size={14} />}
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
											<div className="px-4 pb-4 text-xs leading-relaxed text-hp-text-light sm:px-5 sm:pb-5 sm:text-sm lg:text-[15px]">
												<div className="h-px w-full bg-gray-100 mb-4" />
												{faq.answer}
											</div>
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
