'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
	ArrowLeft,
	Calendar,
	Clock3,
	Share2,
	Users,
	Briefcase,
	CheckCircle2,
	Tag,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileDonateButton from '@/components/layout/MobileDonateButton';
import { getPublicOpportunity } from '@/lib/api/volunteers';
import type { VolunteerOpportunityDetail } from '@/types/api';

export default function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const roleId = Number(id);
	const router = useRouter();
	const [job, setJob] = useState<VolunteerOpportunityDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [shareDone, setShareDone] = useState(false);

	useEffect(() => {
		let mounted = true;

		async function loadJob() {
			try {
				const data = await getPublicOpportunity(roleId);
				if (mounted) {
					setJob(data);
				}
			} catch (error) {
				console.error('Failed to load career detail:', error);
			} finally {
				if (mounted) {
					setLoading(false);
				}
			}
		}

		if (Number.isNaN(roleId)) {
			setLoading(false);
			return;
		}

		loadJob();
		return () => {
			mounted = false;
		};
	}, [roleId]);

	async function onShare() {
		const url = typeof window !== 'undefined' ? window.location.href : '';
		const title = job?.title ?? 'Career opportunity';

		try {
			if (navigator.share) {
				await navigator.share({ title, text: `Check out this role: ${title}`, url });
			} else {
				await navigator.clipboard.writeText(url);
				setShareDone(true);
				setTimeout(() => setShareDone(false), 1800);
			}
		} catch (error) {
			console.error('Share action failed:', error);
		}
	}

	if (loading) {
		return (
			<>
				<Header />
				<main className="flex min-h-screen items-center justify-center bg-gray-50 pt-24">
					<div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />
				</main>
				<Footer />
			</>
		);
	}

	if (!job) {
		return (
			<>
				<Header />
				<main className="min-h-screen bg-gray-50 pt-28">
					<div className="mx-auto max-w-3xl px-5 lg:px-8">
						<div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100">
							<h1 className="font-poppins text-2xl font-bold text-gray-900">Role not found</h1>
							<p className="mt-2 text-sm text-gray-500">
								This role may have closed or is no longer available.
							</p>
							<Link
								href="/careers"
								className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
							>
								<ArrowLeft size={14} />
								Back to careers
							</Link>
						</div>
					</div>
				</main>
				<Footer />
			</>
		);
	}

	const spotsLeft = Math.max(job.volunteers_needed - job.volunteers_accepted, 0);
	const eventDate = new Date(job.event_date).toLocaleDateString('en-IN', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	});

	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50 pt-24 sm:pt-28">
				<section className="mx-auto max-w-6xl px-5 pb-14 lg:px-8">
					<motion.button
						onClick={() => router.push('/careers')}
						className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
					>
						<ArrowLeft size={14} />
						Back to careers
					</motion.button>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45 }}
						className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100"
					>
						<div className="bg-linear-to-r from-[#0f766e] to-[#0e7490] px-6 py-7 text-white sm:px-9 sm:py-9">
							<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
								<Briefcase size={13} />
								Career Opportunity
							</div>
							<h1 className="font-poppins text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
								{job.title}
							</h1>
							<p className="mt-2 text-sm text-white/85 sm:text-base">
								Join us in delivering meaningful outcomes for communities.
							</p>
						</div>

						<div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-3 lg:p-10">
							<article className="lg:col-span-2">
								<h2 className="font-poppins text-lg font-semibold text-gray-900">Job Description</h2>
								<p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-600 sm:text-[15px]">
									{job.description}
								</p>

								<div className="mt-8 rounded-2xl bg-teal-50/70 p-5 ring-1 ring-teal-100">
									<h3 className="text-sm font-semibold text-teal-800">What to expect</h3>
									<ul className="mt-3 space-y-2 text-sm text-teal-900/90">
										<li className="flex items-start gap-2">
											<CheckCircle2 size={15} className="mt-0.5 shrink-0 text-teal-700" />
											Work directly with field teams and communities.
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle2 size={15} className="mt-0.5 shrink-0 text-teal-700" />
											Contribute to mission-driven programs with measurable outcomes.
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle2 size={15} className="mt-0.5 shrink-0 text-teal-700" />
											Collaborate in an impact-first culture.
										</li>
									</ul>
								</div>

								{job.required_skills.length > 0 && (
									<div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-gray-100">
										<h3 className="text-sm font-semibold text-gray-900">Skills needed</h3>
										<div className="mt-3 flex flex-wrap gap-2">
											{job.required_skills.map((skill) => (
												<span
													key={skill}
													className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
												>
													<Tag size={12} />
													{skill}
												</span>
											))}
										</div>
									</div>
								)}
							</article>

							<aside className="space-y-5">
								<div className="rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-100">
									<h3 className="text-sm font-semibold text-gray-900">Role Snapshot</h3>
									<div className="mt-4 space-y-3 text-sm text-gray-600">
										<p className="flex items-center gap-2">
											<Briefcase size={14} className="text-gray-400" />
											{job.work_mode === 'remote' ? 'Remote' : 'In-Office'}
										</p>
										<p className="flex items-center gap-2">
											<Calendar size={14} className="text-gray-400" />
											{eventDate}
										</p>
										<p className="flex items-center gap-2">
											<Clock3 size={14} className="text-gray-400" />
											{job.event_time} • {job.duration_hours} hours
										</p>
										<p className="flex items-center gap-2">
											<Users size={14} className="text-gray-400" />
											{spotsLeft} open spots
										</p>
									</div>
								</div>

								<div className="space-y-3">
									<Link
										href={`/join-us?opportunity=${job.id}`}
										className="inline-flex w-full items-center justify-center rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
									>
										Apply Now
									</Link>
									<button
										onClick={onShare}
										className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
									>
										<Share2 size={15} />
										{shareDone ? 'Link copied' : 'Share this role'}
									</button>
								</div>
							</aside>
						</div>
					</motion.div>
				</section>
			</main>
			<Footer />
			<MobileDonateButton />
		</>
	);
}
