'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { fadeUp } from '@/lib/animations';
import * as api from '@/lib/api/programs';
import type { ProgramListItem, ProgramCategory } from '@/types/api';

export default function ProgramsPage() {
	const [programs, setPrograms] = useState<ProgramListItem[]>([]);
	const [categories, setCategories] = useState<ProgramCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				const [programsRes, categoriesRes] = await Promise.all([
					api.getPrograms({ page_size: 20 }),
					api.getCategories(),
				]);
				setPrograms(programsRes.items);
				setCategories(categoriesRes.filter(c => c.is_active));
			} catch (err) {
				setError('Failed to load programs');
				console.error(err);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	async function filterByCategory(categoryId: number | null) {
		setSelectedCategory(categoryId);
		try {
			setLoading(true);
			const res = await api.getPrograms({
				page_size: 20,
				category_id: categoryId || undefined,
			});
			setPrograms(res.items);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50/50">
				{/* ── Light & Airy Hero Section ── */}
				<section className="relative pt-20 pb-8 sm:pt-24 sm:pb-10 overflow-hidden bg-white border-b border-gray-100">
					{/* Subtle Background Gradients */}
					<div className="absolute inset-0 pointer-events-none">
						<div className="absolute -top-12 -right-12 w-[250px] h-[250px] rounded-full bg-hp-primary/5 blur-[50px]" />
						<div className="absolute top-1/2 -left-12 w-[200px] h-[200px] rounded-full bg-hp-accent/5 blur-[50px]" />
					</div>

					<div className="relative z-10 mx-auto max-w-3xl px-5 lg:px-8 text-center">
						<motion.div
							initial="hidden"
							animate="visible"
							variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
						>
							<motion.div variants={fadeUp} className="flex justify-center mb-3">
								<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-hp-bg-1 border border-hp-primary/10 text-[10px] font-bold uppercase tracking-widest hp-gradient-text shadow-sm">
									<Sparkles size={12} className="text-hp-primary" />
									Our Journey
								</span>
							</motion.div>
							<motion.h1
								variants={fadeUp}
								className="font-(family-name:--font-poppins) text-2xl sm:text-3xl md:text-4xl font-bold text-hp-text-dark leading-[1.1] tracking-tight"
							>
								Stories of{' '}
								<span className="font-(family-name:--font-playfair) italic text-transparent bg-clip-text bg-gradient-to-r from-hp-primary to-hp-accent">
									Impact
								</span>
							</motion.h1>
							<motion.p
								variants={fadeUp}
								className="mt-3 text-hp-text-light text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
							>
								Explore the initiatives that have touched lives and inspired minds. Every event is a step towards a more compassionate and empowered society.
							</motion.p>
						</motion.div>
					</div>
				</section>

				{/* ── Category Filters ── */}
				{categories.length > 0 && (
					<section className="py-8 bg-white border-b border-gray-100">
						<div className="mx-auto max-w-6xl px-5 lg:px-8">
							<div className="flex flex-wrap gap-3 justify-center">
								<button
									onClick={() => filterByCategory(null)}
									className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
										selectedCategory === null
											? 'bg-hp-primary text-white shadow-md'
											: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
									}`}
								>
									All Programs
								</button>
								{categories.map((cat) => (
									<button
										key={cat.id}
										onClick={() => filterByCategory(cat.id)}
										className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
											selectedCategory === cat.id
												? `${cat.color_class} text-white shadow-md`
												: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
										}`}
									>
										{cat.name}
									</button>
								))}
							</div>
						</div>
					</section>
				)}

				{/* ── Snake Timeline Layout ── */}
				<section className="relative py-16 sm:py-24 overflow-hidden">
					<div className="mx-auto max-w-5xl px-5 lg:px-8 relative">
						
						{/* Mobile Vertical Line */}
						{programs.length > 0 && (
							<div className="sm:hidden absolute left-[29px] top-4 bottom-4 w-[2px] bg-hp-primary/20 rounded-full z-0" />
						)}

						{loading ? (
							<div className="text-center py-20">
								<div className="inline-block h-8 w-8 border-4 border-hp-primary/20 border-t-hp-primary rounded-full animate-spin" />
								<p className="text-hp-text-light text-sm mt-4">Loading programs...</p>
							</div>
						) : error ? (
							<div className="text-center py-20">
								<p className="text-red-600 text-sm">{error}</p>
							</div>
						) : programs.length === 0 ? (
							<div className="text-center py-20">
								<p className="text-hp-text-light text-sm">More stories coming soon.</p>
							</div>
						) : (
							<div className="space-y-0 relative">
								{(() => {
									const snakeRows: { left?: ProgramListItem; right?: ProgramListItem }[] = [];
									for (let i = 0; i < programs.length; i += 2) {
										const p1 = programs[i];
										const p2 = programs[i + 1];
										const rowIndex = Math.floor(i / 2);
										const isEven = rowIndex % 2 === 0;

										if (isEven) {
											snakeRows.push({ left: p1, right: p2 });
										} else {
											snakeRows.push({ left: p2, right: p1 });
										}
									}

									const ProgramCard = ({ program }: { program?: ProgramListItem }) => {
										if (!program) return <div className="w-full max-w-sm hidden sm:block" />;

										const formattedDate = new Date(program.event_date).toLocaleDateString('en-IN', {
											day: '2-digit', month: 'short', year: 'numeric'
										});

										return (
											<div className="relative w-full max-w-sm ml-8 sm:ml-0">
												{/* Mobile Node */}
												<div className="sm:hidden absolute top-1/2 -translate-y-1/2 -left-8 w-3 h-3 rounded-full bg-white border-[2px] border-hp-primary shadow-sm z-20" />
												
												<article className="relative bg-white rounded-2xl p-2.5 sm:p-3 shadow-lg shadow-black-[0.03] border border-gray-100 hover:shadow-xl hover:shadow-hp-primary/10 transition-all duration-500 text-left group/card">
													<div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4">
														<Image
															src={program.featured_image}
															alt={program.title}
															fill
															className="object-cover transition-transform duration-1000 group-hover/card:scale-105"
															sizes="(max-width: 640px) 100vw, 40vw"
														/>
														<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
														<div className="absolute top-3 left-3 z-10">
															<span className={`px-2 py-1 rounded-lg text-[9px] font-bold text-white uppercase tracking-widest shadow-lg backdrop-blur-md border border-white/20 ${program.category_color}`}>
																{program.badge_label}
															</span>
														</div>
													</div>
													<div className="px-2 pb-2">
														<div className="flex items-center gap-1.5 mb-2 text-hp-text-light text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">
															{/* <Sparkles size={12} className="text-hp-primary" /> */}
															<span className="truncate max-w-[100px]">{program.location}</span>
															<span className="ml-auto flex items-center gap-1 whitespace-nowrap text-hp-primary/80 font-bold">
																<Calendar size={12} />
																{formattedDate}
															</span>
														</div>
														<h3 className="font-(family-name:--font-poppins) text-base sm:text-lg font-bold text-hp-text-dark mb-2 group-hover/card:text-hp-primary transition-colors leading-tight">
															{program.title}
														</h3>
														<p className="text-xs text-hp-text-light leading-relaxed mb-4 line-clamp-2">
															{program.short_description}
														</p>
														<Link
															href={`/programs/${program.slug}`}
															className="inline-flex items-center gap-1 text-[11px] font-bold text-hp-primary group-hover/card:text-hp-accent transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-hp-accent after:transition-all after:duration-300 group-hover/card:after:w-full"
														>
															Read Full Story
															<ArrowRight size={12} className="transition-transform group-hover/card:translate-x-1" />
														</Link>
													</div>
												</article>
											</div>
										);
									};

									return snakeRows.map((row, rowIndex) => {
										const isEven = rowIndex % 2 === 0;
										const isLastRow = rowIndex === snakeRows.length - 1;

										return (
											<motion.div
												key={`row-${rowIndex}`}
												initial={{ opacity: 0, y: 30 }}
												whileInView={{ opacity: 1, y: 0 }}
												viewport={{ once: true, amount: 0.1 }}
												transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
												className="relative w-full"
											>
												{/* Desktop Snake Segment */}
												{!isLastRow && (
													<div 
														className={`hidden sm:block absolute top-1/2 w-[60%] left-[20%] border-hp-primary/20 ${
															isEven 
																? 'border-t-[3px] border-r-[3px] rounded-tr-[3rem]' 
																: 'border-t-[3px] border-l-[3px] rounded-tl-[3rem]'
														}`}
														style={{ height: '100%' }}
													/>
												)}

												{/* Row Content */}
												<div className={`relative z-10 flex w-full sm:items-center sm:justify-between py-4 sm:py-16 ${
													isEven ? 'flex-col sm:flex-row' : 'flex-col-reverse sm:flex-row'
												}`}>
													
													{/* Desktop Nodes */}
													{row.left && <div className="hidden sm:block absolute top-1/2 -translate-y-1/2 left-[20%] w-4 h-4 rounded-full bg-white border-[3px] border-hp-primary shadow-sm z-20 -ml-2" />}
													{row.right && <div className="hidden sm:block absolute top-1/2 -translate-y-1/2 right-[20%] w-4 h-4 rounded-full bg-white border-[3px] border-hp-primary shadow-sm z-20 -mr-2" />}

													{/* Left Item */}
													<div className={`sm:w-[45%] flex sm:justify-center w-full mb-6 sm:mb-0 ${!row.left ? 'hidden sm:flex' : ''}`}>
														<ProgramCard program={row.left} />
													</div>

													{/* Right Item */}
													<div className={`sm:w-[45%] flex sm:justify-center w-full mb-6 sm:mb-0 ${!row.right ? 'hidden sm:flex' : ''}`}>
														<ProgramCard program={row.right} />
													</div>

												</div>
											</motion.div>
										);
									});
								})()}
							</div>
						)}
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
