'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
	Heart,
	Shield,
	FileCheck,
	Sparkles,
	CreditCard,
	Smartphone,
	Landmark,
	ChevronDown,
	ArrowRight,
	Gift,
	HandHeart,
	Users,
	CheckCircle2,
	Lock,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { fadeUp, staggerContainer, scaleIn, slideInRight } from '@/lib/animations';

// ── Constants ──────────────────────────────────────────────────────
const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000] as const;

const TRUST_BADGES = [
	{
		icon: Shield,
		title: '100% Secure',
		subtitle: 'Encrypted payment gateway',
		color: 'text-teal-500',
		bg: 'bg-teal-50',
	},
	{
		icon: Sparkles,
		title: 'Direct Impact',
		subtitle: '85% goes to programs',
		color: 'text-cyan-500',
		bg: 'bg-cyan-50',
	},
] as const;

const IMPACT_TIERS = [
	{
		amount: 500,
		icon: '🎁',
		description: 'Provides essentials for one beneficiary',
	},
	{
		amount: 2500,
		icon: '👨‍👩‍👧',
		description: 'Supports a family for a month',
	},
	{
		amount: 10000,
		icon: '🌟',
		description: 'Helps scale programs to new communities',
	},
] as const;

const PAYMENT_METHODS = [
	{
		id: 'upi',
		label: 'UPI',
		subtitle: 'Google Pay, PhonePe, Paytm',
		icon: Smartphone,
	},
	{
		id: 'card',
		label: 'Credit / Debit Card',
		subtitle: 'Visa, Mastercard, Rupay',
		icon: CreditCard,
	},
	{
		id: 'netbanking',
		label: 'Net Banking',
		subtitle: 'All major banks',
		icon: Landmark,
	},
] as const;

const FAQS = [
	{
		question: 'Is my donation tax-deductible?',
		answer: "Yes! We're registered under 80G. You'll receive a certificate via email.",
	},
	{
		question: 'How is my donation used?',
		answer: '85% goes directly to programs. View our transparency reports.',
	},
] as const;

// ── Animation Variants ─────────────────────────────────────────────
const cardHover = {
	rest: { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
	hover: {
		y: -4,
		boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
		transition: { duration: 0.3, ease: 'easeOut' },
	},
};

const pulseRing = {
	initial: { scale: 1, opacity: 0.5 },
	animate: {
		scale: [1, 1.5, 1],
		opacity: [0.5, 0, 0.5],
		transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
	},
};

const floatingOrb = {
	animate: {
		y: [0, -15, 0],
		rotate: [0, 5, 0],
		transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const },
	},
};

const shimmer = {
	initial: { x: '-100%' },
	animate: {
		x: '100%',
		transition: { duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' as const },
	},
};

// ── Main Component ──────────────────────────────────────────────────
export default function DonatePage() {
	const [selectedAmount, setSelectedAmount] = useState<number>(500);
	const [customAmount, setCustomAmount] = useState('');
	const [isCustom, setIsCustom] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState('upi');
	const [campaign, setCampaign] = useState('general');
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		message: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	const formRef = useRef<HTMLDivElement>(null);
	const isFormInView = useInView(formRef, { once: true, amount: 0.2 });

	const displayAmount = isCustom ? (parseInt(customAmount) || 0) : selectedAmount;

	const handleAmountSelect = (amount: number) => {
		setSelectedAmount(amount);
		setIsCustom(false);
		setCustomAmount('');
	};

	const handleCustomAmountChange = (value: string) => {
		const numericValue = value.replace(/[^0-9]/g, '');
		setCustomAmount(numericValue);
		setIsCustom(true);
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async () => {
		if (displayAmount <= 0) return;
		setIsSubmitting(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setIsSubmitting(false);
		setShowSuccess(true);
		setTimeout(() => setShowSuccess(false), 4000);
	};

	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50">
				{/* ── Hero Section ── */}
				<HeroSection />

				{/* ── Trust Badges ── */}
				<TrustBadges />

				{/* ── Main Content ── */}
				<section className="relative py-20 sm:py-24">
					<div className="mx-auto max-w-7xl px-5 lg:px-8">
						<div ref={formRef} className="grid gap-8 lg:grid-cols-3 lg:gap-12">
							{/* ── Left: Donation Form (2 cols) ── */}
							<motion.div
								className="lg:col-span-2"
								initial="hidden"
								animate={isFormInView ? 'visible' : 'hidden'}
								variants={staggerContainer}
							>
								<DonationFormCard
									selectedAmount={selectedAmount}
									customAmount={customAmount}
									isCustom={isCustom}
									paymentMethod={paymentMethod}
									campaign={campaign}
									formData={formData}
									displayAmount={displayAmount}
									isSubmitting={isSubmitting}
									showSuccess={showSuccess}
									onAmountSelect={handleAmountSelect}
									onCustomAmountChange={handleCustomAmountChange}
									onPaymentMethodChange={setPaymentMethod}
									onCampaignChange={setCampaign}
									onInputChange={handleInputChange}
									onSubmit={handleSubmit}
								/>
							</motion.div>

							{/* ── Right: Sidebar (1 col) ── */}
							<motion.div
								className="space-y-6"
								initial="hidden"
								animate={isFormInView ? 'visible' : 'hidden'}
								variants={{
									hidden: {},
									visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
								}}
							>
								<ImpactCard selectedAmount={displayAmount} />
								<OtherWaysCard />
								<FAQCard />
							</motion.div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}

// ════════════════════════════════════════════════════════════════════
// ── Sub-components ─────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════

function HeroSection() {
	return (
		<section className="relative overflow-hidden bg-linear-to-b from-[#e8f4f1] via-[#f0f8f7] to-gray-50 pt-28 pb-8 sm:pt-36 sm:pb-12">
			{/* Decorative orbs */}
			<motion.div
				className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-linear-to-br from-teal-200/40 to-cyan-200/30 blur-3xl"
				{...floatingOrb}
			/>
			<motion.div
				className="absolute -bottom-10 -right-16 h-56 w-56 rounded-full bg-linear-to-br from-blue-200/30 to-teal-200/20 blur-3xl"
				animate={{
					y: [0, 12, 0],
					rotate: [0, -3, 0],
					transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' as const },
				}}
			/>

			<motion.div
				className="relative z-10 mx-auto max-w-3xl px-5 text-center lg:px-8"
				initial="hidden"
				animate="visible"
				variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
			>
				{/* Eyebrow Badge */}
				<motion.div variants={scaleIn} className="mb-5 inline-flex">
					<span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-teal-700 shadow-sm ring-1 ring-teal-100 backdrop-blur-sm sm:text-xs">
						<Heart size={12} className="fill-teal-500 text-teal-500" />
						Make an Impact
					</span>
				</motion.div>

				{/* Headline */}
				<motion.h1
					variants={fadeUp}
					className="font-poppins text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-[3.5rem]"
				>
					Every Rupee{' '}
					<span className="font-playfair relative italic">
						<span className="hp-gradient-text">Creates Hope</span>
						{/* Underline decoration */}
						<motion.svg
							className="absolute -bottom-2 left-0 w-full"
							viewBox="0 0 200 12"
							fill="none"
							initial={{ pathLength: 0, opacity: 0 }}
							animate={{ pathLength: 1, opacity: 1 }}
							transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
						>
							<motion.path
								d="M2 8 C50 2, 150 2, 198 8"
								stroke="url(#underlineGrad)"
								strokeWidth="3"
								strokeLinecap="round"
								initial={{ pathLength: 0 }}
								animate={{ pathLength: 1 }}
								transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
							/>
							<defs>
								<linearGradient id="underlineGrad" x1="0" y1="0" x2="200" y2="0">
									<stop offset="0%" stopColor="#4886cf" />
									<stop offset="100%" stopColor="#65bac1" />
								</linearGradient>
							</defs>
						</motion.svg>
					</span>
				</motion.h1>

				{/* Subtitle */}
				<motion.p variants={fadeUp} className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-gray-500 sm:mt-6 sm:text-base">
					Your donation directly supports our programs and changes lives. Choose how you&apos;d like to contribute and join
					thousands of supporters creating lasting impact.
				</motion.p>
			</motion.div>
		</section>
	);
}

function TrustBadges() {
	return (
		<div className="relative z-10 -mt-1 bg-gray-50">
			<motion.div
				className="mx-auto max-w-3xl px-5 lg:px-8"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true }}
				variants={staggerContainer}
			>
				<div className="grid grid-cols-3 gap-3 sm:gap-5">
					{TRUST_BADGES.map((badge) => (
						<motion.div
							key={badge.title}
							variants={fadeUp}
							whileHover={{ y: -3, transition: { duration: 0.2 } }}
							className="group relative flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-gray-100/80 transition-shadow hover:shadow-md sm:gap-3 sm:p-6"
						>
							<div className={`flex h-10 w-10 items-center justify-center rounded-xl ${badge.bg} sm:h-12 sm:w-12`}>
								<badge.icon size={20} className={badge.color} />
							</div>
							<div>
								<p className="text-xs font-bold text-gray-900 sm:text-sm">{badge.title}</p>
								<p className="mt-0.5 text-[10px] text-gray-400 sm:text-xs">{badge.subtitle}</p>
							</div>
						</motion.div>
					))}
				</div>
			</motion.div>
		</div>
	);
}

// ── Donation Form Card ──────────────────────────────────────────────
interface DonationFormProps {
	selectedAmount: number;
	customAmount: string;
	isCustom: boolean;
	paymentMethod: string;
	campaign: string;
	formData: { name: string; email: string; phone: string; message: string };
	displayAmount: number;
	isSubmitting: boolean;
	showSuccess: boolean;
	onAmountSelect: (amount: number) => void;
	onCustomAmountChange: (value: string) => void;
	onPaymentMethodChange: (method: string) => void;
	onCampaignChange: (campaign: string) => void;
	onInputChange: (field: string, value: string) => void;
	onSubmit: () => void;
}

function DonationFormCard({
	selectedAmount,
	customAmount,
	isCustom,
	paymentMethod,
	campaign,
	formData,
	displayAmount,
	isSubmitting,
	showSuccess,
	onAmountSelect,
	onCustomAmountChange,
	onPaymentMethodChange,
	onCampaignChange,
	onInputChange,
	onSubmit,
}: DonationFormProps) {
	return (
		<motion.div
			variants={fadeUp}
			className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100/80 sm:rounded-3xl"
		>
			<div className="p-6 sm:p-8 lg:p-10">
				{/* ── Section Title ── */}
				<motion.div variants={fadeUp} className="mb-8">
					<h2 className="font-poppins text-xl font-bold text-gray-900 sm:text-2xl">
						Make Your{' '}
						<span className="font-playfair italic hp-gradient-text">Donation</span>
					</h2>
					<p className="mt-1.5 text-sm text-gray-400">
						Choose an amount and complete your donation in just a few steps.
					</p>
				</motion.div>

				{/* ── Amount Selection ── */}
				<motion.div variants={fadeUp} className="mb-8">
					<label className="mb-3 block text-sm font-semibold text-gray-700">Select Amount</label>
					<div className="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-3">
						{PRESET_AMOUNTS.map((amount) => (
							<motion.button
								key={amount}
								onClick={() => onAmountSelect(amount)}
								whileHover={{ scale: 1.04 }}
								whileTap={{ scale: 0.97 }}
								className={`relative overflow-hidden rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all duration-200 sm:px-4 sm:py-3.5 sm:text-base ${
									!isCustom && selectedAmount === amount
										? 'border-teal-400 bg-linear-to-br from-teal-50 to-cyan-50 text-teal-700 shadow-sm'
										: 'border-gray-200 text-gray-600 hover:border-teal-300 hover:bg-teal-50/50'
								}`}
							>
								{/* Selected indicator */}
								{!isCustom && selectedAmount === amount && (
									<motion.div
										layoutId="amountIndicator"
										className="absolute inset-0 rounded-xl ring-2 ring-teal-400"
										transition={{ type: 'spring', stiffness: 500, damping: 30 }}
									/>
								)}
								<span className="relative z-10">₹{amount.toLocaleString('en-IN')}</span>
							</motion.button>
						))}
					</div>

					{/* Custom Amount */}
					<div className="mt-4">
						<p className="mb-1.5 text-xs text-gray-400">Or enter custom amount</p>
						<div className="relative">
							<span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">₹</span>
							<input
								type="text"
								inputMode="numeric"
								placeholder="Enter amount"
								value={customAmount}
								onChange={(e) => onCustomAmountChange(e.target.value)}
								onFocus={() => setIsCustomFocus(true)}
								className={`w-full rounded-xl border-2 py-3 pl-8 pr-4 text-sm transition-all duration-200 placeholder:text-gray-300 focus:outline-none ${
									isCustom
										? 'border-teal-400 bg-teal-50/30 ring-2 ring-teal-400/20'
										: 'border-gray-200 hover:border-gray-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20'
								}`}
							/>
						</div>
					</div>
				</motion.div>

				{/* ── Your Details ── */}
				<motion.div variants={fadeUp} className="mb-8">
					<label className="mb-3 block text-sm font-semibold text-gray-700">Your Details</label>
					<div className="space-y-3">
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<FormInput
								placeholder="Full Name"
								value={formData.name}
								onChange={(v) => onInputChange('name', v)}
							/>
							<FormInput
								placeholder="Email Address"
								type="email"
								value={formData.email}
								onChange={(v) => onInputChange('email', v)}
							/>
						</div>
						<FormInput
							placeholder="Phone Number (Optional)"
							type="tel"
							value={formData.phone}
							onChange={(v) => onInputChange('phone', v)}
						/>
						<textarea
							placeholder="Leave a message (Optional)"
							value={formData.message}
							onChange={(e) => onInputChange('message', e.target.value)}
							rows={2}
							className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm transition-all duration-200 placeholder:text-gray-300 hover:border-gray-300 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 resize-y"
						/>
					</div>
				</motion.div>

				{/* ── Payment Method ── */}
				<motion.div variants={fadeUp} className="mb-8">
					<label className="mb-3 block text-sm font-semibold text-gray-700">Payment Method</label>
					<div className="space-y-2.5">
						{PAYMENT_METHODS.map((method) => (
							<motion.button
								key={method.id}
								onClick={() => onPaymentMethodChange(method.id)}
								whileHover={{ x: 2 }}
								whileTap={{ scale: 0.995 }}
								className={`group flex w-full items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-200 ${
									paymentMethod === method.id
										? 'border-teal-400 bg-linear-to-r from-teal-50/80 to-cyan-50/50 shadow-sm'
										: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
								}`}
							>
								{/* Radio circle */}
								<div
									className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
										paymentMethod === method.id ? 'border-teal-500 bg-teal-500' : 'border-gray-300'
									}`}
								>
									{paymentMethod === method.id && (
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											className="h-2 w-2 rounded-full bg-white"
										/>
									)}
								</div>

								{/* Icon */}
								<div
									className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
										paymentMethod === method.id ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
									}`}
								>
									<method.icon size={18} />
								</div>

								{/* Text */}
								<div>
									<p className={`text-sm font-semibold ${paymentMethod === method.id ? 'text-teal-800' : 'text-gray-700'}`}>
										{method.label}
									</p>
									<p className="text-[11px] text-gray-400">{method.subtitle}</p>
								</div>
							</motion.button>
						))}
					</div>
				</motion.div>

				{/* ── Submit Button ── */}
				<motion.div variants={fadeUp}>
					<motion.button
						onClick={onSubmit}
						disabled={isSubmitting || displayAmount <= 0}
						whileHover={displayAmount > 0 ? { scale: 1.01, y: -2 } : {}}
						whileTap={displayAmount > 0 ? { scale: 0.98 } : {}}
						className="group relative w-full overflow-hidden rounded-2xl py-4 text-base font-bold text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hp-gradient-bg hover:shadow-xl hover:shadow-teal-200/40 sm:py-5 sm:text-lg"
					>
						{/* Shimmer effect */}
						<motion.div
							className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
							variants={shimmer}
							initial="initial"
							animate="animate"
						/>

						<span className="relative z-10 flex items-center justify-center gap-2">
							{isSubmitting ? (
								<>
									<svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
									</svg>
									Processing...
								</>
							) : (
								<>
									<Heart size={18} className="fill-current" />
									Donate ₹{displayAmount.toLocaleString('en-IN')}
								</>
							)}
						</span>
					</motion.button>

					{/* Success Animation */}
					<AnimatePresence>
						{showSuccess && (
							<motion.div
								initial={{ opacity: 0, y: 10, height: 0 }}
								animate={{ opacity: 1, y: 0, height: 'auto' }}
								exit={{ opacity: 0, y: -10, height: 0 }}
								className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm font-medium text-emerald-700"
							>
								<CheckCircle2 size={16} />
								Thank you! Your donation has been received.
							</motion.div>
						)}
					</AnimatePresence>

					{/* Disclaimer */}
					<p className="mt-4 text-center text-[11px] text-gray-400">
						<Lock size={10} className="mr-1 inline-block" />
						By donating, you agree to our terms. You&apos;ll receive an tax receipt via email.
					</p>
				</motion.div>
			</div>
		</motion.div>
	);
}

// ── Form Input ──────────────────────────────────────────────────────
function FormInput({
	placeholder,
	type = 'text',
	value,
	onChange,
}: {
	placeholder: string;
	type?: string;
	value: string;
	onChange: (value: string) => void;
}) {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<div className="relative">
			<input
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm transition-all duration-200 placeholder:text-gray-300 hover:border-gray-300 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
			/>
			{/* Focus indicator line */}
			<motion.div
				className="absolute bottom-0 left-1/2 h-0.5 rounded-full hp-gradient-bg"
				initial={{ width: 0, x: '-50%' }}
				animate={isFocused ? { width: '50%', x: '-50%' } : { width: 0, x: '-50%' }}
				transition={{ duration: 0.3 }}
			/>
		</div>
	);
}

// ── Impact Card ─────────────────────────────────────────────────────
function getActiveTierIndex(amount: number): number {
	if (amount >= 10000) return 2;
	if (amount >= 2500) return 1;
	if (amount >= 500) return 0;
	return -1;
}

function ImpactCard({ selectedAmount }: { selectedAmount: number }) {
	const activeTierIndex = getActiveTierIndex(selectedAmount);

	return (
		<motion.div
			variants={slideInRight}
			className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100/80 sm:rounded-3xl"
		>
			{/* Header */}
			<div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
				<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50">
					<Gift size={18} className="text-teal-500" />
				</div>
				<h3 className="font-poppins text-base font-bold text-gray-900">Your Impact</h3>
			</div>

			{/* Impact Tiers */}
			<div className="px-6 py-5 space-y-4">
				{IMPACT_TIERS.map((tier, index) => {
					const isActive = index === activeTierIndex;
					return (
						<motion.div
							key={tier.amount}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.5 + index * 0.1 }}
							className={`flex items-start gap-3 rounded-xl p-3 transition-all duration-300 ${
								isActive ? 'bg-teal-50/70 ring-1 ring-teal-100' : 'opacity-60'
							}`}
						>
							<span className="text-xl">{tier.icon}</span>
							<div>
								<p className="text-sm font-bold text-gray-800">
									₹{tier.amount.toLocaleString('en-IN')}
									{index < IMPACT_TIERS.length - 1
										? ` – ₹${(IMPACT_TIERS[index + 1].amount - 1).toLocaleString('en-IN')}`
										: '+'}
								</p>
								<p className="text-xs text-gray-500">{tier.description}</p>
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* Progress Bar (visual only) */}
			<div className="border-t border-gray-100 px-6 py-4">
				<div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
					<span>Your generosity level</span>
					<span className="font-semibold text-teal-600">
						{selectedAmount >= 10000 ? 'Champion' : selectedAmount >= 2500 ? 'Hero' : 'Supporter'}
					</span>
				</div>
				<div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
					<motion.div
						className="h-full rounded-full hp-gradient-bg"
						initial={{ width: '0%' }}
						animate={{
							width: `${Math.min((selectedAmount / 10000) * 100, 100)}%`,
						}}
						transition={{ duration: 0.6, ease: 'easeOut' }}
					/>
				</div>
			</div>
		</motion.div>
	);
}

// ── Other Ways to Give ──────────────────────────────────────────────
function OtherWaysCard() {
	return (
		<motion.div variants={slideInRight} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100/80 sm:rounded-3xl">
			<h3 className="font-poppins mb-4 text-base font-bold text-gray-900">Other Ways to Give</h3>
			<div className="space-y-3">
				{[
					{
						title: 'Support a Campaign',
						subtitle: 'Choose a specific cause',
						icon: HandHeart,
						href: '/#recent-programs',
						gradient: 'from-amber-50 to-orange-50',
						iconColor: 'text-amber-500',
						borderColor: 'border-amber-200',
						hoverBorder: 'hover:border-amber-300',
					},
					{
						title: 'Volunteer Your Time',
						subtitle: 'Give your skills',
						icon: Users,
						href: '/#newsletter',
						gradient: 'from-teal-50 to-emerald-50',
						iconColor: 'text-teal-500',
						borderColor: 'border-teal-200',
						hoverBorder: 'hover:border-teal-300',
					},
				].map((item) => (
					<motion.div key={item.title} whileHover={{ x: 4, transition: { duration: 0.2 } }}>
						<Link
							href={item.href}
							className={`group flex items-center justify-between rounded-xl border-2 ${item.borderColor} ${item.hoverBorder} bg-linear-to-r ${item.gradient} p-4 transition-all duration-200`}
						>
							<div>
								<p className="text-sm font-bold text-gray-800">{item.title}</p>
								<p className="text-[11px] text-gray-400">{item.subtitle}</p>
							</div>
							<ArrowRight
								size={16}
								className={`${item.iconColor} transition-transform group-hover:translate-x-1`}
							/>
						</Link>
					</motion.div>
				))}
			</div>
		</motion.div>
	);
}

// ── FAQ Card ────────────────────────────────────────────────────────
function FAQCard() {
	return (
		<motion.div variants={slideInRight} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100/80 sm:rounded-3xl">
			<h3 className="font-poppins mb-4 text-base font-bold text-gray-900">Common Questions</h3>
			<div className="space-y-4">
				{FAQS.map((faq) => (
					<div key={faq.question}>
						<p className="text-sm font-semibold text-gray-700">{faq.question}</p>
						<p className="mt-1 text-xs leading-relaxed text-gray-400">
							{faq.answer.includes('transparency reports') ? (
								<>
									{faq.answer.split('View our')[0]}View our{' '}
									<Link href="#" className="text-teal-500 underline underline-offset-2 hover:text-teal-600 transition-colors">
										transparency reports
									</Link>
									.
								</>
							) : (
								faq.answer
							)}
						</p>
					</div>
				))}
			</div>
		</motion.div>
	);
}

// ── Helper: avoid "setIsCustomFocus is not defined" ─────────────────
// The custom amount input uses onFocus inline but we handle it via
// the isCustom state in the parent. A no-op is fine here.
function setIsCustomFocus(_: boolean) {
	// handled by parent state
}
