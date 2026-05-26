'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
	ArrowLeft,
	Calendar,
	Share2,
	Briefcase,
	CheckCircle2,
	Tag,
	X,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileDonateButton from '@/components/layout/MobileDonateButton';
import { getPublicOpportunity, submitCareerApplication } from '@/lib/api/volunteers';
import { ApiError } from '@/lib/api/client';
import type { VolunteerOpportunityDetail } from '@/types/api';

export default function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const roleId = Number(id);
	const router = useRouter();
	const [job, setJob] = useState<VolunteerOpportunityDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [shareDone, setShareDone] = useState(false);
	const [showApplyForm, setShowApplyForm] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [duplicateMessage, setDuplicateMessage] = useState<string | null>(null);
	const [applyForm, setApplyForm] = useState({
		firstName: '',
		lastName: '',
		email: '',
		whyInterested: '',
		resumeLink: '',
	});

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

	function closeApplyForm() {
		setShowApplyForm(false);
		setSubmitError(null);
		setSubmitSuccess(false);
		setDuplicateMessage(null);
	}

	function handleApplyInputChange(field: 'firstName' | 'lastName' | 'email' | 'whyInterested' | 'resumeLink', value: string) {
		setApplyForm((prev) => ({ ...prev, [field]: value }));
		setSubmitError(null);
		setDuplicateMessage(null);
	}

	async function handleApplySubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSubmitError(null);
		setSubmitSuccess(false);

		if (!applyForm.resumeLink.trim()) {
			setSubmitError('Please provide a link to your resume (e.g. Google Drive).');
			return;
		}

		try {
			setIsSubmitting(true);
			await submitCareerApplication(roleId, {
				first_name: applyForm.firstName.trim(),
				last_name: applyForm.lastName.trim(),
				email: applyForm.email.trim(),
				why_interested: applyForm.whyInterested.trim(),
				resume_link: applyForm.resumeLink.trim(),
			});
			setSubmitSuccess(true);
			setApplyForm({
				firstName: '',
				lastName: '',
				email: '',
				whyInterested: '',
				resumeLink: '',
			});
		} catch (error) {
			console.error('Career application submit failed:', error);
			// If backend indicates duplicate submission, show a dedicated UI state
			if (error instanceof ApiError) {
				const msg = typeof error.getUserMessage === 'function' ? error.getUserMessage() : error.message;
				if (msg && msg.toLowerCase().includes('already submitted')) {
					setDuplicateMessage(msg);
				} else {
					setSubmitError(msg ?? 'Failed to submit application. Please try again.');
				}
			} else {
				setSubmitError(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
			}
		} finally {
			setIsSubmitting(false);
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
									</div>
								</div>

								<div className="space-y-3">
									<button
										type="button"
										onClick={() => setShowApplyForm(true)}
										className="inline-flex w-full items-center justify-center rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
									>
										Apply Now
									</button>
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

				{showApplyForm && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
						<div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-100 sm:p-8">
							<div className="mb-5 flex items-start justify-between gap-4">
								<div>
									<h2 className="font-poppins text-xl font-semibold text-gray-900">Apply for {job.title}</h2>
									<p className="mt-1 text-sm text-gray-500">Submit your details and we'll be in touch if shortlisted.</p>
								</div>
								<button
									type="button"
									onClick={closeApplyForm}
									className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
									aria-label="Close apply form"
								>
									<X size={16} />
								</button>
							</div>

							{duplicateMessage && (
								<div className="space-y-4">
									<p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-700 ring-1 ring-amber-100">{duplicateMessage}</p>
									<div className="flex items-center justify-end gap-3 pt-1">
										<button
											type="button"
											onClick={closeApplyForm}
											className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
										>
											Close
										</button>
									</div>
								</div>
							)}
							{!duplicateMessage && (
								<form className="space-y-4" onSubmit={handleApplySubmit}>
								<div className="grid gap-4 sm:grid-cols-2">
									<div>
										<label className="mb-1.5 block text-sm font-medium text-gray-700">First Name</label>
										<input
											type="text"
											value={applyForm.firstName}
											onChange={(e) => handleApplyInputChange('firstName', e.target.value)}
											required
											className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none ring-teal-500 transition focus:ring-2"
										/>
									</div>
									<div>
										<label className="mb-1.5 block text-sm font-medium text-gray-700">Last Name</label>
										<input
											type="text"
											value={applyForm.lastName}
											onChange={(e) => handleApplyInputChange('lastName', e.target.value)}
											required
											className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none ring-teal-500 transition focus:ring-2"
										/>
									</div>
								</div>

								<div>
									<label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
									<input
										type="email"
										value={applyForm.email}
										onChange={(e) => handleApplyInputChange('email', e.target.value)}
										required
										className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none ring-teal-500 transition focus:ring-2"
									/>
								</div>

								<div>
									<label className="mb-1.5 block text-sm font-medium text-gray-700">Resume Link (Google Drive or similar)</label>
									<input
										type="url"
										value={applyForm.resumeLink}
										onChange={(e) => handleApplyInputChange('resumeLink', e.target.value)}
										required
										placeholder="https://drive.google.com/..."
										className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none ring-teal-500 transition focus:ring-2"
									/>
								</div>

								<div>
									<label className="mb-1.5 block text-sm font-medium text-gray-700">Why are you interested for this role?</label>
									<textarea
										rows={4}
										value={applyForm.whyInterested}
										onChange={(e) => handleApplyInputChange('whyInterested', e.target.value)}
										required
										className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none ring-teal-500 transition focus:ring-2"
									/>
								</div>

								{submitError && (
									<p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">{submitError}</p>
								)}

								{submitSuccess && (
									<p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700 ring-1 ring-emerald-100">
										Application submitted successfully.
									</p>
								)}

								<div className="flex items-center justify-end gap-3 pt-1">
									<button
										type="button"
										onClick={closeApplyForm}
										className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={isSubmitting}
										className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-400"
									>
										{isSubmitting ? 'Submitting...' : 'Submit Application'}
									</button>
								</div>
							</form>
							)}
						</div>
					</div>
				)}
			</main>
			<Footer />
			<MobileDonateButton />
		</>
	);
}
