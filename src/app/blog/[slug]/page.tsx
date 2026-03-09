'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
	ArrowLeft,
	Share2,
	Calendar,
	Clock,
	User,
	ArrowRight,
	Heart,
	Tag,
	CheckCircle2,
	Twitter,
	Linkedin,
	Facebook,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SignatureButton from '@/components/ui/SignatureButton';
import { fadeUp, fadeIn, scaleIn, staggerContainer, slideInRight } from '@/lib/animations';
import { getBlogPost, getRelatedPosts, BLOG_POSTS, type BlogPost } from '@/lib/blog-data';

// ── Page Component ──────────────────────────────────────────────────

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = use(params);
	const router = useRouter();
	const post = getBlogPost(slug);

	if (!post) {
		return (
			<>
				<Header />
				<main className="flex min-h-screen items-center justify-center bg-gray-50">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center px-5"
					>
						<div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100">
							<span className="text-4xl">📖</span>
						</div>
						<h1 className="font-poppins text-2xl font-bold text-gray-900">Article Not Found</h1>
						<p className="mt-2 text-sm text-gray-500">
							The article you&apos;re looking for doesn&apos;t exist or has been moved.
						</p>
						<Link
							href="/blog"
							className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800"
						>
							<ArrowLeft size={14} />
							Back to Stories
						</Link>
					</motion.div>
				</main>
				<Footer />
			</>
		);
	}

	const related = getRelatedPosts(slug, 2);
	const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-IN', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	});

	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50">
				{/* ── Hero ── */}
				<ArticleHero post={post} formattedDate={formattedDate} />

				{/* ── Content ── */}
				<section className="relative py-12 sm:py-12">
					<div className="mx-auto max-w-7xl px-5 lg:px-8">
						<div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
							{/* ── Article Body (2 cols) ── */}
							<motion.article
								className="lg:col-span-2"
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, amount: 0.1 }}
								variants={staggerContainer}
							>
								{/* Highlight Quote */}
								<motion.div
									variants={fadeUp}
									className="mb-10 border-l-4 border-teal-400 bg-white rounded-r-xl py-5 px-6 shadow-sm ring-1 ring-gray-100/60"
								>
									<p className="font-playfair text-sm italic leading-relaxed text-gray-600 sm:text-base">
										{post.highlight}
									</p>
								</motion.div>

								{/* Content Blocks */}
								{post.content.map((block, index) => (
									<ContentBlock key={index} block={block} index={index} />
								))}

								{/* Join CTA */}
								<motion.div
									variants={fadeUp}
									className="mt-12 overflow-hidden rounded-2xl bg-linear-to-r from-[#f0f8f7] to-hp-bg-1 p-6 ring-1 ring-teal-100/60 sm:p-8"
								>
									<div className="flex items-start gap-3">
										<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100">
											<Heart size={16} className="text-teal-600 fill-teal-600" />
										</div>
										<div>
											<h3 className="font-poppins text-base font-bold text-gray-900 sm:text-lg">
												Join Our Mission
											</h3>
											<p className="mt-1.5 text-sm leading-relaxed text-gray-500">
												Your support can help us reach more communities and create lasting impact.
												Whether through donations or volunteering, every contribution matters.
											</p>
											<div className="mt-5 flex flex-wrap gap-3">
												<SignatureButton href="/donate" size="sm" showIcon={false}>
													Donate Now
												</SignatureButton>
												<Link
													href="/#newsletter"
													className="inline-flex items-center rounded-xl border-2 border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 sm:text-sm"
												>
													Volunteer
												</Link>
											</div>
										</div>
									</div>
								</motion.div>
							</motion.article>

							{/* ── Sidebar (1 col) ── */}
							<motion.aside
								className="space-y-6"
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, amount: 0.2 }}
								variants={{
									hidden: {},
									visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
								}}
							>
								<AuthorCard author={post.author} />
								<ShareCard slug={post.slug} title={post.title} />
								<CategoryCard category={post.category} />
							</motion.aside>
						</div>
					</div>
				</section>

				{/* ── Related Articles ── */}
				{related.length > 0 && <RelatedArticles posts={related} />}
			</main>
			<Footer />
		</>
	);
}

// ════════════════════════════════════════════════════════════════════
// Sub-components
// ════════════════════════════════════════════════════════════════════

function ArticleHero({ post, formattedDate }: { post: BlogPost; formattedDate: string }) {
	const router = useRouter();

	return (
		<section className="relative overflow-hidden pt-20">
			{/* Background gradient overlay */}
			<div className="absolute inset-0 bg-linear-to-b from-[#e8f0e8]/80 via-[#f0f4ef]/60 to-gray-50" />

			{/* Background image (blurred, subtle) */}
			<div className="absolute inset-0 opacity-20">
				<Image
					src={post.featuredImage}
					alt=""
					fill
					className="object-cover blur-sm"
					priority
				/>
			</div>

			{/* Top Bar */}
			<div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
				<motion.button
					onClick={() => router.push('/blog')}
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					whileHover={{ x: -4 }}
					className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
				>
					<ArrowLeft size={16} />
					Back
				</motion.button>
				<ShareButton slug={post.slug} title={post.title} />
			</div>

			{/* Hero Image */}
			<div className="relative z-10 mx-auto max-w-4xl px-5 pt-4 pb-8 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20, scale: 0.98 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 0.6, ease: 'easeOut' }}
					className="relative aspect-video overflow-hidden rounded-2xl shadow-xl sm:rounded-3xl"
				>
					<Image
						src={post.featuredImage}
						alt={post.title}
						fill
						className="object-cover"
						priority
						sizes="(max-width: 1024px) 100vw, 800px"
					/>
					{/* Gradient overlay at bottom */}
					<div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

					{/* Content overlay */}
					<div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
						{/* Category */}
						<motion.span
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="mb-3 inline-block rounded-lg bg-teal-500/90 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
						>
							{post.category}
						</motion.span>

						{/* Title */}
						<motion.h1
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.6 }}
							className="font-playfair text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
						>
							{post.title}
						</motion.h1>

						{/* Meta */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6 }}
							className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/70 sm:text-sm"
						>
							<span className="flex items-center gap-1">
								<User size={13} />
								{post.author.name}
							</span>
							<span className="h-1 w-1 rounded-full bg-white/40" />
							<span className="flex items-center gap-1">
								<Calendar size={13} />
								{formattedDate}
							</span>
							<span className="h-1 w-1 rounded-full bg-white/40" />
							<span className="flex items-center gap-1">
								<Clock size={13} />
								{post.readTime} min read
							</span>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}

function ContentBlock({
	block,
	index,
}: {
	block: BlogPost['content'][number];
	index: number;
}) {
	switch (block.type) {
		case 'heading':
			return (
				<motion.h2
					variants={fadeUp}
					className="font-playfair mt-10 mb-4 text-lg font-bold text-gray-900 sm:text-xl"
				>
					{block.text}
				</motion.h2>
			);
		case 'paragraph':
			return (
				<motion.p
					variants={fadeUp}
					className="mb-5 text-sm leading-[1.9] text-gray-600 sm:text-[15px]"
				>
					{block.text}
				</motion.p>
			);
		case 'quote':
			return (
				<motion.blockquote
					variants={fadeUp}
					className="my-8 border-l-4 border-teal-400 bg-teal-50/50 rounded-r-xl py-4 px-6"
				>
					<p className="font-playfair text-sm italic leading-relaxed text-gray-700 sm:text-base">
						{block.text}
					</p>
				</motion.blockquote>
			);
		case 'image':
			return (
				<motion.figure variants={fadeUp} className="my-8">
					<div className="relative aspect-video overflow-hidden rounded-xl">
						<Image
							src={block.src}
							alt={block.alt}
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 700px"
						/>
					</div>
					{block.caption && (
						<figcaption className="mt-2 text-center text-xs text-gray-400">
							{block.caption}
						</figcaption>
					)}
				</motion.figure>
			);
		default:
			return null;
	}
}

function AuthorCard({ author }: { author: BlogPost['author'] }) {
	return (
		<motion.div
			variants={slideInRight}
			className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100/80 sm:rounded-3xl"
		>
			<div className="p-6">
				<div className="flex items-center gap-3 mb-3">
					{/* Avatar */}
					<div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-teal-100 to-cyan-100">
						<User size={20} className="text-teal-600" />
					</div>
					<div>
						<p className="font-poppins text-sm font-bold text-gray-900">{author.name}</p>
						<p className="text-[11px] text-gray-400">{author.role}</p>
					</div>
				</div>
				<p className="text-xs leading-relaxed text-gray-500">{author.bio}</p>
			</div>
		</motion.div>
	);
}

function ShareCard({ slug, title }: { slug: string; title: string }) {
	const [copied, setCopied] = useState(false);
	const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : '';

	const handleCopyLink = () => {
		if (typeof navigator !== 'undefined') {
			navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const shareLinks = [
		{
			icon: Twitter,
			href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
			label: 'Twitter',
			color: 'hover:bg-sky-50 hover:text-sky-500',
		},
		{
			icon: Facebook,
			href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
			label: 'Facebook',
			color: 'hover:bg-blue-50 hover:text-blue-600',
		},
		{
			icon: Linkedin,
			href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
			label: 'LinkedIn',
			color: 'hover:bg-blue-50 hover:text-blue-700',
		},
	];

	return (
		<motion.div
			variants={slideInRight}
			className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100/80 sm:rounded-3xl"
		>
			<div className="p-6">
				<h3 className="font-poppins mb-4 text-sm font-bold text-gray-900">Share This Article</h3>
				<div className="flex items-center gap-2">
					{shareLinks.map((link) => (
						<a
							key={link.label}
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`Share on ${link.label}`}
							className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition-all duration-200 ${link.color}`}
						>
							<link.icon size={16} />
						</a>
					))}
					<button
						onClick={handleCopyLink}
						className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-gray-50 text-xs font-medium text-gray-500 transition-all duration-200 hover:bg-teal-50 hover:text-teal-600"
					>
						{copied ? (
							<>
								<CheckCircle2 size={14} className="text-emerald-500" />
								Copied!
							</>
						) : (
							<>
								<Share2 size={14} />
								Share Article
							</>
						)}
					</button>
				</div>
			</div>
		</motion.div>
	);
}

function ShareButton({ slug, title }: { slug: string; title: string }) {
	const [showMenu, setShowMenu] = useState(false);

	const handleShare = async () => {
		const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : '';
		if (navigator.share) {
			try {
				await navigator.share({ title, url });
			} catch {
				// user cancelled
			}
		} else {
			setShowMenu(!showMenu);
		}
	};

	return (
		<motion.button
			onClick={handleShare}
			initial={{ opacity: 0, x: 10 }}
			animate={{ opacity: 1, x: 0 }}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
		>
			<Share2 size={16} />
			Share
		</motion.button>
	);
}

function CategoryCard({ category }: { category: string }) {
	return (
		<motion.div
			variants={slideInRight}
			className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100/80 sm:rounded-3xl"
		>
			<div className="p-6">
				<div className="flex items-center gap-2 mb-3">
					<Tag size={14} className="text-teal-500" />
					<h3 className="font-poppins text-sm font-bold text-gray-900">Category</h3>
				</div>
				<Link
					href={`/blog?category=${category}`}
					className="inline-flex items-center rounded-lg bg-teal-50 px-3.5 py-1.5 text-xs font-semibold text-teal-700 ring-1 ring-teal-100 transition-all hover:bg-teal-100 hover:ring-teal-200"
				>
					{category}
				</Link>
			</div>
		</motion.div>
	);
}

function RelatedArticles({ posts }: { posts: BlogPost[] }) {
	return (
		<section className="border-t border-gray-100 bg-white py-12 sm:py-16">
			<div className="mx-auto max-w-7xl px-5 lg:px-8">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
					variants={staggerContainer}
				>
					<motion.h2
						variants={fadeUp}
						className="font-poppins mb-8 text-xl font-bold text-gray-900 sm:text-2xl"
					>
						Related Stories
					</motion.h2>

					<div className="grid gap-6 sm:grid-cols-2">
						{posts.map((post, i) => {
							const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-IN', {
								day: '2-digit',
								month: 'short',
							});

							return (
								<motion.div
									key={post.slug}
									variants={fadeUp}
									custom={i}
								>
									<Link href={`/blog/${post.slug}`} className="group block">
										<motion.div
											whileHover={{ y: -4 }}
											transition={{ duration: 0.3 }}
											className="flex overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-gray-100/80 transition-shadow duration-300 hover:shadow-md"
										>
											{/* Image */}
											<div className="relative w-1/3 min-h-40 overflow-hidden">
												<Image
													src={post.featuredImage}
													alt={post.title}
													fill
													className="object-cover transition-transform duration-500 group-hover:scale-105"
													sizes="200px"
												/>
												<div className="absolute top-2 left-2">
													<span className="rounded-md bg-teal-500/90 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
														{post.category}
													</span>
												</div>
											</div>

											{/* Content */}
											<div className="flex flex-1 flex-col justify-center p-5">
												<div className="mb-2 flex items-center gap-2 text-[10px] text-gray-400">
													<span className="flex items-center gap-1">
														<Calendar size={10} />
														{formattedDate}
													</span>
													<span className="flex items-center gap-1">
														<Clock size={10} />
														{post.readTime} min read
													</span>
												</div>
												<h3 className="font-poppins text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-teal-700">
													{post.title}
												</h3>
												<p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
													{post.excerpt}
												</p>
												<span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal-600 transition-all group-hover:gap-2">
													Read more
													<ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
												</span>
											</div>
										</motion.div>
									</Link>
								</motion.div>
							);
						})}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
