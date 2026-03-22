'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { fadeUp } from '@/lib/animations';
import SignatureButton from '@/components/ui/SignatureButton';
import { subscribeToNewsletter } from '@/lib/api/newsletter';
import { ApiError } from '@/lib/api/client';

export default function Newsletter() {
	const [email, setEmail] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!email.trim()) return;

		setIsSubmitting(true);
		setMessage(null);
		setMessageType(null);

		try {
			const response = await subscribeToNewsletter({
				email: email.trim(),
				segments: ['general'],
			});
			setMessage(response.message || 'Subscription successful. Please check your email to confirm.');
			setMessageType('success');
			setEmail('');
		} catch (error) {
			if (error instanceof ApiError) {
				setMessage(error.message || 'Unable to subscribe right now. Please try again.');
			} else {
				setMessage('Unable to subscribe right now. Please try again.');
			}
			setMessageType('error');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section
			id="newsletter"
			className="relative overflow-hidden py-16 sm:py-24"
			style={{ backgroundColor: '#F8FAFC' }}
			aria-label="Newsletter signup"
		>
			{/* Cinematic Glows */}
			<div className="absolute top-1/2 left-1/4 h-64 w-64 -translate-y-1/2 rounded-full bg-hp-teal/20 blur-[100px] pointer-events-none" />
			<div className="absolute top-1/2 right-1/4 h-64 w-64 -translate-y-1/2 rounded-full bg-hp-blue/20 blur-[100px] pointer-events-none" />

			<div className="mx-auto max-w-5xl px-5 lg:px-8">
				<motion.div
					className="relative overflow-hidden rounded-[2.5rem] hp-gradient-bg p-8 text-white shadow-2xl sm:p-12 lg:p-16"
					initial={{ opacity: 0, scale: 0.95, y: 30 }}
					whileInView={{ opacity: 1, scale: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
				>
					{/* Card Background Pattern */}
					<div
						className="absolute inset-0 opacity-10 pointer-events-none"
						style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
					/>

					<div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
						{/* Text Content */}
						<div className="text-center lg:text-left">
							{/* <motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.2 }}
								className="flex items-center justify-center gap-2 mb-4 lg:justify-start"
							>
								<div className="flex -space-x-2">
									{[1, 2, 3].map((i) => (
										<div key={i} className="h-6 w-6 rounded-full border-2 border-hp-primary bg-gray-200" />
									))}
								</div>
								<p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Join 1,200+ supporters</p>
							</motion.div> */}

							<h2 className="font-(family-name:--font-poppins) text-3xl font-bold leading-tight sm:text-4xl">
								Get Monthly <br className="hidden sm:block" />
								<span className="text-hp-teal-light brightness-125">Impact Reports</span>
							</h2>

							<p className="mt-4 text-sm text-white/80 max-w-md mx-auto lg:mx-0">
								See exactly how your support creates change. Transparent, bi-monthly updates delivered to your inbox.
							</p>
						</div>

						{/* Form Container */}
						<div className="flex flex-col gap-4">
							<motion.form
								className="flex flex-col gap-3 sm:flex-row sm:items-center"
								onSubmit={handleSubmit}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
							>
								<div className="relative flex-1">
									<input
										type="email"
										required
										placeholder="your@email.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										disabled={isSubmitting}
										className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-sm text-black placeholder:text-black/40 backdrop-blur-md outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-white/30"
									/>
								</div>

								<SignatureButton
									type="submit"
									disabled={isSubmitting}
									showIcon={false}
									className="group !rounded-2xl !bg-white !text-hp-text-dark hover:!scale-[1.02] active:!scale-95 shadow-xl !py-4 transition-all"
								>
									{isSubmitting ? 'Subscribing...' : 'Subscribe'}
									<Send size={16} className="ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
								</SignatureButton>
							</motion.form>

							{message && (
								<p
									className={`text-xs sm:text-sm ${
										messageType === 'success' ? 'text-emerald-100' : 'text-rose-100'
									}`}
								>
									{message}
								</p>
							)}

							<div className="flex items-center justify-center gap-4 text-[10px] text-white/60 lg:justify-start">
								<p>✓ Monthly Insights</p>
								<p>✓ Case Studies</p>
								<p>✓ No Spam Ever</p>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
