'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Calendar } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileDonateButton from '@/components/layout/MobileDonateButton';
import { getOpportunities } from '@/lib/api/volunteers';
import type { VolunteerOpportunity } from '@/types/api';

export default function CareersPage() {
	const [jobs, setJobs] = useState<VolunteerOpportunity[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;

		async function loadJobs() {
			try {
				const data = await getOpportunities();
				if (mounted) {
					setJobs(data);
				}
			} catch (err) {
				console.error('Failed to load careers:', err);
				if (mounted) {
					setError('Unable to load careers at the moment. Please try again shortly.');
				}
			} finally {
				if (mounted) {
					setLoading(false);
				}
			}
		}

		loadJobs();
		return () => {
			mounted = false;
		};
	}, []);

	const sortedJobs = useMemo(
		() =>
			[...jobs].sort(
				(a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
			),
		[jobs]
	);

	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50">
				<section className="relative overflow-hidden bg-linear-to-b from-[#e9f5f3] via-[#f4faf9] to-gray-50 pt-30 pb-12 sm:pt-36 sm:pb-16">
					<div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
					<div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" />

					<div className="relative z-10 mx-auto max-w-5xl px-5 text-center lg:px-8">
						<motion.div
							initial={{ opacity: 0, y: 24 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-teal-700 ring-1 ring-teal-100">
								<Briefcase size={13} />
								Careers
							</span>
							<h1 className="mt-5 font-poppins text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl">
								Open Roles to Create Real Impact
							</h1>
							<p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
								Explore our latest opportunities and join work that directly serves
								communities across Andhra Pradesh.
							</p>
						</motion.div>
					</div>
				</section>

				<section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
					{loading && (
						<div className="flex min-h-60 items-center justify-center">
							<div className="h-9 w-9 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />
						</div>
					)}

					{!loading && error && (
						<div className="rounded-2xl bg-red-50 p-6 text-center text-sm text-red-700 ring-1 ring-red-100">
							{error}
						</div>
					)}

					{!loading && !error && sortedJobs.length === 0 && (
						<div className="rounded-2xl bg-white p-10 text-center ring-1 ring-gray-100">
							<h2 className="font-poppins text-xl font-semibold text-gray-900">No open roles right now</h2>
							<p className="mt-2 text-sm text-gray-500">
								We are not hiring at the moment. Please check back soon.
							</p>
							<Link
								href="/join-us"
								className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
							>
								Join as Volunteer
								<ArrowRight size={14} />
							</Link>
						</div>
					)}

					{!loading && !error && sortedJobs.length > 0 && (
						<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
							{sortedJobs.map((job, index) => {
								const eventDate = new Date(job.event_date).toLocaleDateString('en-IN', {
									day: '2-digit',
									month: 'short',
									year: 'numeric',
								});

								return (
									<motion.article
										key={job.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.4, delay: index * 0.05 }}
										className="group flex h-full flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:-translate-y-1 hover:shadow-lg"
									>
										<div className="mb-4 flex items-start justify-between gap-3">
											<h2 className="font-poppins text-lg font-semibold leading-snug text-gray-900">
												{job.title}
											</h2>
											<div className="flex flex-col items-end gap-1">
												<span className="shrink-0 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold text-teal-700">
													{job.status}
												</span>
												<span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-700">
													{job.work_mode === 'remote' ? 'Remote' : 'In-Office'}
												</span>
											</div>
										</div>

										<p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
											{job.description}
										</p>

										<div className="mt-5 space-y-2.5 text-xs text-gray-500">
											<p className="flex items-center gap-2">
												<Calendar size={14} className="text-gray-400" />
												{eventDate}
											</p>
										</div>

										<Link
											href={`/careers/${job.id}`}
											className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition-all group-hover:gap-3"
										>
											View role details
											<ArrowRight size={14} />
										</Link>
									</motion.article>
								);
							})}
						</div>
					)}
				</section>
			</main>
			<Footer />
			<MobileDonateButton />
		</>
	);
}
