'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Clock, User, ArrowRight, Heart } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SignatureButton from '@/components/ui/SignatureButton';
import { fadeUp, fadeIn, scaleIn, staggerContainer } from '@/lib/animations';
import {
	BLOG_CATEGORIES,
	BLOG_POSTS,
	getFeaturedPost,
	getFilteredPosts,
	type BlogCategory,
	type BlogPost,
} from '@/lib/blog-data';

// ── Animation helpers ───────────────────────────────────────────────
const cardVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const },
	}),
};

// ════════════════════════════════════════════════════════════════════
// Main Page
// ════════════════════════════════════════════════════════════════════

export default function BlogPage() {
	const [activeCategory, setActiveCategory] = useState<BlogCategory>('All');
	const [searchQuery, setSearchQuery] = useState('');

	const featured = getFeaturedPost();

	const filteredPosts = useMemo(() => {
		let posts = getFilteredPosts(activeCategory);
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			posts = posts.filter(
				(p) =>
					p.title.toLowerCase().includes(q) ||
					p.excerpt.toLowerCase().includes(q) ||
					p.category.toLowerCase().includes(q)
			);
		}
		return posts;
	}, [activeCategory, searchQuery]);

	// Non-featured posts for the grid
	const gridPosts = filteredPosts.filter((p) => !p.isFeatured || activeCategory !== 'All');

	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50">
				{/* ── Hero ── */}
				<HeroSection />

				{/* ── Filters & Search ── */}
				<section className="relative z-10 bg-white border-b border-gray-100">
					<div className="mx-auto max-w-7xl px-5 lg:px-8">
						<motion.div
							className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							variants={staggerContainer}
						>
							{/* Category Tabs */}
							<motion.div variants={fadeUp} className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
								{BLOG_CATEGORIES.map((cat) => (
									<button
										key={cat}
										onClick={() => setActiveCategory(cat)}
										className={`relative whitespace-nowrap rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm ${
											activeCategory === cat
												? 'text-white'
												: 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
										}`}
									>
										{activeCategory === cat && (
											<motion.div
												layoutId="categoryBubble"
												className="absolute inset-0 rounded-full hp-gradient-bg"
												transition={{ type: 'spring', stiffness: 400, damping: 28 }}
											/>
										)}
										<span className="relative z-10">{cat}</span>
									</button>
								))}
							</motion.div>

							{/* Search */}
							<motion.div variants={fadeUp} className="relative w-full sm:w-64">
								<Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
								<input
									type="text"
									placeholder="Search articles..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-400/20"
								/>
							</motion.div>
						</motion.div>
					</div>
				</section>

				{/* ── Featured Story ── */}
				{featured && activeCategory === 'All' && !searchQuery && (
					<FeaturedStory post={featured} />
				)}

				{/* ── All Stories Grid ── */}
				<section className="py-12 sm:py-16">
					<div className="mx-auto max-w-7xl px-5 lg:px-8">
						{/* Section Header */}
						<motion.div
							className="mb-8 flex items-end justify-between"
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							variants={fadeUp}
						>
							<h2 className="font-poppins text-xl font-bold text-gray-900 sm:text-2xl">
								{activeCategory === 'All' ? 'All Stories' : activeCategory}
							</h2>
							<span className="text-xs text-gray-400 sm:text-sm">
								{filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
							</span>
						</motion.div>

						{/* Grid */}
						<AnimatePresence mode="wait">
							<motion.div
								key={activeCategory + searchQuery}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
							>
								{gridPosts.length > 0 ? (
									<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
										{gridPosts.map((post, i) => (
											<ArticleCard key={post.slug} post={post} index={i} />
										))}
									</div>
								) : (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										className="flex flex-col items-center justify-center py-20 text-center"
									>
										<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
											<Search size={24} className="text-gray-400" />
										</div>
										<p className="text-sm font-medium text-gray-500">No articles found</p>
										<p className="mt-1 text-xs text-gray-400">Try a different search term or category</p>
									</motion.div>
								)}
							</motion.div>
						</AnimatePresence>
					</div>
				</section>

				{/* ── Share Your Story CTA ── */}
				<ShareStoryCTA />
			</main>
			<Footer />
		</>
	);
}

// ════════════════════════════════════════════════════════════════════
// Sub-components
// ════════════════════════════════════════════════════════════════════

function HeroSection() {
	return (
		<section className="relative overflow-hidden bg-linear-to-b from-[#f0f8f7] via-[#f6fbfb] to-white pt-28 pb-12 sm:pt-36 sm:pb-16">
			{/* Decorative blobs */}
			<motion.div
				className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-linear-to-br from-teal-100/40 to-cyan-100/30 blur-3xl"
				animate={{
					y: [0, -12, 0],
					rotate: [0, 3, 0],
					transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' as const },
				}}
			/>
			<motion.div
				className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-linear-to-br from-blue-100/30 to-teal-100/20 blur-3xl"
				animate={{
					y: [0, 10, 0],
					transition: { duration: 9, repeat: Infinity, ease: 'easeInOut' as const },
				}}
			/>

			<motion.div
				className="relative z-10 mx-auto max-w-3xl px-5 text-center lg:px-8"
				initial="hidden"
				animate="visible"
				variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
			>
				{/* Eyebrow */}
				<motion.p
					variants={scaleIn}
					className="mb-4 text-[10px] font-bold uppercase tracking-[3px] text-teal-600 sm:text-xs"
				>
					Stories & Insights
				</motion.p>

				{/* Headline */}
				<motion.h1
					variants={fadeUp}
					className="font-poppins text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl"
				>
					Stories from the{' '}
					<span className="font-playfair italic hp-gradient-text">Field</span>
				</motion.h1>

				{/* Animated underline */}
				<motion.div
					className="mx-auto mt-3 h-1 rounded-full hp-gradient-bg"
					initial={{ width: 0 }}
					animate={{ width: 80 }}
					transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
				/>

				{/* Subtitle */}
				<motion.p
					variants={fadeUp}
					className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-gray-500 sm:text-base"
				>
					Read about the lives we touch, the challenges we face, and the hope we create together.
				</motion.p>
			</motion.div>
		</section>
	);
}

function FeaturedStory({ post }: { post: BlogPost }) {
	const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-IN', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});

	return (
		<section className="py-10 sm:py-14">
			<div className="mx-auto max-w-7xl px-5 lg:px-8">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
					variants={staggerContainer}
				>
					<Link href={`/blog/${post.slug}`} className="group block">
						<motion.div
							variants={fadeUp}
							className="grid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100/80 transition-shadow duration-300 hover:shadow-lg sm:rounded-3xl lg:grid-cols-2"
						>
							{/* Image */}
							<div className="relative aspect-16/10 overflow-hidden lg:aspect-auto lg:min-h-85">
								<Image
									src={post.featuredImage}
									alt={post.title}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-105"
									sizes="(max-width: 1024px) 100vw, 50vw"
								/>
								{/* Category badge */}
								<div className="absolute top-4 left-4">
									<span className="rounded-lg bg-teal-500/90 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
										{post.category}
									</span>
								</div>
							</div>

							{/* Content */}
							<div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
								{/* Meta */}
								<p className="mb-2 text-[10px] font-bold uppercase tracking-[2px] text-teal-600">
									Featured Story
								</p>
								<div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-gray-400">
									<span className="flex items-center gap-1">
										<User size={12} />
										{post.author.name}
									</span>
									<span className="flex items-center gap-1">
										<Calendar size={12} />
										{formattedDate}
									</span>
									<span className="flex items-center gap-1">
										<Clock size={12} />
										{post.readTime} min read
									</span>
								</div>

								{/* Title */}
								<h3 className="font-poppins text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-teal-700 sm:text-2xl">
									{post.title}
								</h3>

								{/* Excerpt */}
								<p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-500">
									{post.excerpt}
								</p>

								{/* CTA */}
								<div className="mt-6">
									<span className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 transition-all group-hover:gap-2.5">
										Read full story
										<ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
									</span>
								</div>
							</div>
						</motion.div>
					</Link>
				</motion.div>
			</div>
		</section>
	);
}

function ArticleCard({ post, index }: { post: BlogPost; index: number }) {
	const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-IN', {
		day: '2-digit',
		month: 'short',
	});

	return (
		<motion.div
			custom={index}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.15 }}
			variants={cardVariants}
		>
			<Link href={`/blog/${post.slug}`} className="group block h-full">
				<motion.div
					whileHover={{ y: -6 }}
					transition={{ duration: 0.3, ease: 'easeOut' }}
					className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100/80 transition-shadow duration-300 hover:shadow-lg"
				>
					{/* Image */}
					<div className="relative aspect-16/10 overflow-hidden">
						<Image
							src={post.featuredImage}
							alt={post.title}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
						/>
						{/* Category */}
						<div className="absolute top-3 left-3">
							<span className="rounded-lg bg-teal-500/90 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
								{post.category}
							</span>
						</div>
					</div>

					{/* Body */}
					<div className="flex flex-1 flex-col p-5">
						{/* Meta */}
						<div className="mb-3 flex items-center gap-3 text-[11px] text-gray-400">
							<span className="flex items-center gap-1">
								<Calendar size={11} />
								{formattedDate}
							</span>
							<span className="flex items-center gap-1">
								<Clock size={11} />
								{post.readTime} min read
							</span>
						</div>

						{/* Title */}
						<h3 className="font-poppins text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-teal-700 sm:text-base">
							{post.title}
						</h3>

						{/* Excerpt */}
						<p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-500 sm:text-sm">
							{post.excerpt}
						</p>

						{/* Read more */}
						<div className="mt-4 pt-3 border-t border-gray-100">
							<span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 transition-all group-hover:gap-2">
								Read more
								<ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
							</span>
						</div>
					</div>
				</motion.div>
			</Link>
		</motion.div>
	);
}

function ShareStoryCTA() {
	return (
		<section className="bg-linear-to-b from-gray-50 to-[#f0f8f7] py-16 sm:py-24">
			<motion.div
				className="mx-auto max-w-2xl px-5 text-center lg:px-8"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.3 }}
				variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
			>
				{/* Eyebrow */}
				<motion.p
					variants={scaleIn}
					className="mb-3 text-[10px] font-bold uppercase tracking-[3px] text-teal-600 sm:text-xs"
				>
					Share Your Experience
				</motion.p>

				{/* Headline */}
				<motion.h2
					variants={fadeUp}
					className="font-poppins text-2xl font-bold leading-tight text-gray-900 sm:text-3xl md:text-4xl"
				>
					Want to Share{' '}
					<span className="font-playfair italic hp-gradient-text">Your Story</span>?
				</motion.h2>

				{/* Subtitle */}
				<motion.p
					variants={fadeUp}
					className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-500"
				>
					If you&apos;re a beneficiary, volunteer, or partner — we&apos;d love to hear from you. Your experience can
					inspire others.
				</motion.p>

				{/* CTA */}
				<motion.div variants={fadeUp} className="mt-8">
					<SignatureButton href="/#newsletter" showIcon={false}>
						Get in Touch <ArrowRight size={14} className="ml-1.5 inline-block" />
					</SignatureButton>
				</motion.div>
			</motion.div>
		</section>
	);
}
