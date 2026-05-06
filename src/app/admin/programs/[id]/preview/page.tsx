"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProgramsStore } from "@/lib/stores/programs";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { renderMarkdown } from "@/lib/markdown";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  TreePine,
  Sparkles,
  Heart,
  Share2,
  ArrowRight,
  CheckCircle2,
  Copy,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
} from "lucide-react";
import Button from "@/components/ui/Button";
import type { ProgramMedia, ProgramQuote } from "@/types/api";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ProgramPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { programCache, detailLoading, fetchProgram } = useProgramsStore();

  const programId = parseInt(id, 10);
  const program = programCache[programId];

  useEffect(() => {
    if (programId) fetchProgram(programId);
  }, [programId, fetchProgram]);

  if (detailLoading && !program) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-500">Program not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Preview Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push(`/admin/programs/${programId}`)}
            >
              ← Back to Edit
            </Button>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Preview Mode</h2>
              <p className="text-xs text-gray-500">This is how your program will appear on the public site</p>
            </div>
          </div>
          {program.status === "draft" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full font-medium">
                Draft - Not Published
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Public Preview Content */}
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh]">
            <Image
              src={program.featured_image}
              alt={program.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 z-10 pb-10 sm:pb-14 lg:pb-16">
              <motion.div
                className="mx-auto max-w-6xl px-5 lg:px-8"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-lg backdrop-blur-sm border border-white/10 ${program.category_color}`}
                  >
                    {program.badge_label}
                  </span>
                  <div className="flex items-center gap-4 text-white/70 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(program.event_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {program.location}
                    </span>
                  </div>
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  className="font-(family-name:--font-poppins) text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] max-w-3xl"
                >
                  {program.title}
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  className="mt-4 text-white/70 text-base sm:text-lg max-w-2xl leading-relaxed"
                >
                  {program.short_description}
                </motion.p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <motion.section
          className="relative z-10 -mt-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100/80 p-5 sm:p-6">
              {program.trees_planted && (
                <motion.div variants={scaleIn} className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                    <TreePine size={20} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-hp-text-dark font-(family-name:--font-poppins)">
                      {program.trees_planted} Trees
                    </p>
                    <p className="text-[11px] text-hp-text-light">Planted</p>
                  </div>
                </motion.div>
              )}
              <motion.div variants={scaleIn} className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <Users size={20} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-hp-text-dark font-(family-name:--font-poppins)">
                    {program.volunteers_count}+
                  </p>
                  <p className="text-[11px] text-hp-text-light">Volunteers</p>
                </div>
              </motion.div>
              <motion.div variants={scaleIn} className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
                  <Sparkles size={20} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-hp-text-dark font-(family-name:--font-poppins)">
                    {program.beneficiaries_count || program.people_reached || "Direct"}
                  </p>
                  <p className="text-[11px] text-hp-text-light">
                    {program.beneficiaries_count
                      ? "Beneficiaries"
                      : program.people_reached
                      ? "People Reached"
                      : "Community Impact"}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Story Content */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
              <motion.div
                className="lg:col-span-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeUp}>
                  <h2 className="font-(family-name:--font-poppins) text-2xl sm:text-3xl font-bold text-hp-text-dark mb-6">
                    The Full{" "}
                    <span className="font-(family-name:--font-playfair) italic hp-gradient-text">Story</span>
                  </h2>
                  <div
                    className="rich-content"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(program.full_story) }}
                  />
                </motion.div>

                {program.quotes && program.quotes.length > 0 && (
                  <motion.div variants={fadeUp} className="mt-12">
                    <QuoteCarousel quotes={program.quotes} />
                  </motion.div>
                )}

                {program.highlights && program.highlights.length > 0 && (
                  <motion.div variants={fadeUp} className="mt-12">
                    <h3 className="font-(family-name:--font-poppins) text-xl font-bold text-hp-text-dark mb-5">
                      Key Highlights
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {program.highlights.map((highlight, i) => (
                        <motion.div
                          key={highlight.id}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="mt-0.5 w-6 h-6 rounded-lg hp-gradient-bg flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">{i + 1}</span>
                          </div>
                          <p className="text-sm text-hp-text-dark/80 leading-relaxed">{highlight.text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {program.media && program.media.length > 0 && (
                  <motion.div variants={fadeUp} className="mt-12">
                    <MediaGallery media={program.media} title={program.title} />
                  </motion.div>
                )}
              </motion.div>

              {/* Sidebar */}
              <motion.aside
                className="space-y-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }}
              >
                <motion.div variants={fadeUp} className="sticky top-28 space-y-6">
                  <div className="bg-gradient-to-br from-hp-bg-1 to-hp-bg-2 rounded-2xl p-5 border border-hp-accent/10">
                    <h3 className="font-(family-name:--font-poppins) text-sm font-bold text-hp-text-dark mb-3">
                      Program Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-hp-text-light">Date</span>
                        <span className="font-semibold text-hp-text-dark">
                          {new Date(program.event_date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="h-px bg-hp-accent/10" />
                      <div className="flex justify-between">
                        <span className="text-hp-text-light">Location</span>
                        <span className="font-semibold text-hp-text-dark text-right text-xs">
                          {program.location}
                        </span>
                      </div>
                      <div className="h-px bg-hp-accent/10" />
                      <div className="flex justify-between">
                        <span className="text-hp-text-light">Volunteers</span>
                        <span className="font-semibold text-hp-text-dark">{program.volunteers_count}+</span>
                      </div>
                      <div className="h-px bg-hp-accent/10" />
                      <div className="flex justify-between">
                        <span className="text-hp-text-light">Category</span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-white uppercase ${program.category_color}`}
                        >
                          {program.badge_label}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.aside>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// ── Quote Carousel ────────────────────────────────────────────────────────────
function QuoteCarousel({ quotes }: { quotes: ProgramQuote[] }) {
	const [idx, setIdx] = useState(0);
	const [paused, setPaused] = useState(false);
	const [dir, setDir] = useState(1);

	useEffect(() => {
		if (quotes.length <= 1 || paused) return;
		const t = setInterval(() => {
			setDir(1);
			setIdx((i) => (i + 1) % quotes.length);
		}, 4500);
		return () => clearInterval(t);
	}, [quotes.length, paused]);

	const go = (next: number) => {
		setDir(next > idx ? 1 : -1);
		setIdx(next);
	};

	const q = quotes[idx];

	return (
		<div
			className="relative bg-gradient-to-br from-hp-bg-1 to-hp-bg-2 rounded-2xl p-6 sm:p-8 border border-hp-accent/10 overflow-hidden"
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			{/* decorative quote mark */}
			<div className="absolute -top-4 left-6 sm:left-8">
				<div className="w-8 h-8 rounded-full hp-gradient-bg flex items-center justify-center shadow-lg shadow-hp-accent/20">
					<span className="text-white text-lg font-bold">"</span>
				</div>
			</div>

			<AnimatePresence mode="wait" custom={dir}>
				<motion.div
					key={idx}
					custom={dir}
					initial={{ opacity: 0, x: dir * 40 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: dir * -40 }}
					transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
					className="mt-2 min-h-[80px]"
				>
					<p className="font-(family-name:--font-playfair) text-hp-text-dark text-lg sm:text-xl italic leading-relaxed">
						{q.text}
					</p>
					<footer className="mt-4 flex items-center gap-3">
						<div className="w-8 h-[2px] hp-gradient-bg rounded-full flex-shrink-0" />
						<cite className="not-italic text-sm font-semibold text-hp-text-light">
							{q.author_name}
							{q.author_role && `, ${q.author_role}`}
						</cite>
					</footer>
				</motion.div>
			</AnimatePresence>

			{quotes.length > 1 && (
				<div className="mt-6 flex items-center justify-between">
					<div className="flex gap-1.5">
						{quotes.map((_, i) => (
							<button
								key={i}
								onClick={() => go(i)}
								className={`h-1.5 rounded-full transition-all duration-300 ${
									i === idx ? 'w-5 hp-gradient-bg' : 'w-1.5 bg-hp-accent/25'
								}`}
								aria-label={`Go to quote ${i + 1}`}
							/>
						))}
					</div>
					<div className="flex gap-1">
						<button
							onClick={() => go((idx - 1 + quotes.length) % quotes.length)}
							className="p-1.5 rounded-lg hover:bg-white/60 transition-colors text-hp-text-light"
							aria-label="Previous quote"
						>
							<ChevronLeft size={16} />
						</button>
						<button
							onClick={() => go((idx + 1) % quotes.length)}
							className="p-1.5 rounded-lg hover:bg-white/60 transition-colors text-hp-text-light"
							aria-label="Next quote"
						>
							<ChevronRight size={16} />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

// ── Media Gallery ─────────────────────────────────────────────────────────────
function MediaGallery({ media, title }: { media: ProgramMedia[]; title: string }) {
	const [lightbox, setLightbox] = useState<number | null>(null);

	// Close on Escape, navigate with arrow keys
	useEffect(() => {
		if (lightbox === null) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setLightbox(null);
			if (e.key === 'ArrowRight') setLightbox((i) => ((i ?? 0) + 1) % media.length);
			if (e.key === 'ArrowLeft') setLightbox((i) => ((i ?? 0) - 1 + media.length) % media.length);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [lightbox, media.length]);

	const sorted = [...media].sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
	const count = sorted.length;

	// Grid layout classes
	const gridClass =
		count === 1 ? 'grid-cols-1' :
		count === 2 ? 'grid-cols-2' :
		'grid-cols-2 sm:grid-cols-3';

	return (
		<>
			<h3 className="font-(family-name:--font-poppins) text-xl font-bold text-hp-text-dark mb-5">
				Photo Gallery
			</h3>

			<div className={`grid ${gridClass} gap-3`}>
				{sorted.map((item, i) => {
					const isFeatured = item.is_featured || (i === 0 && count >= 3);
					return (
						<div
							key={item.id}
							className={`group relative overflow-hidden rounded-xl cursor-pointer bg-gray-100 ${
								isFeatured && count >= 3 ? 'row-span-2 col-span-1' : ''
							}`}
							style={{ aspectRatio: isFeatured && count >= 3 ? '3/4' : '4/3' }}
							onClick={() => setLightbox(i)}
						>
							<img
								src={item.image_url}
								alt={item.alt_text || `${title} photo ${i + 1}`}
								className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
								<ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
							</div>
							{item.is_featured && (
								<div className="absolute top-2 left-2 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
									★ Featured
								</div>
							)}
							{item.caption && (
								<div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
									<p className="text-white text-xs leading-snug">{item.caption}</p>
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Lightbox */}
			<AnimatePresence>
				{lightbox !== null && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
						onClick={() => setLightbox(null)}
					>
						{/* Close */}
						<button
							className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
							onClick={() => setLightbox(null)}
							aria-label="Close"
						>
							<X size={20} />
						</button>

						{/* Prev */}
						{media.length > 1 && (
							<button
								className="absolute left-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
								onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + media.length) % media.length); }}
								aria-label="Previous"
							>
								<ChevronLeft size={24} />
							</button>
						)}

						{/* Image */}
						<motion.div
							key={lightbox}
							initial={{ opacity: 0, scale: 0.92 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.92 }}
							transition={{ duration: 0.25 }}
							className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center"
							onClick={(e) => e.stopPropagation()}
						>
							<img
								src={sorted[lightbox].image_url}
								alt={sorted[lightbox].alt_text || title}
								className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
							/>
							{sorted[lightbox].caption && (
								<p className="mt-3 text-white/70 text-sm text-center">{sorted[lightbox].caption}</p>
							)}
							<p className="mt-2 text-white/40 text-xs">{lightbox + 1} / {sorted.length}</p>
						</motion.div>

						{/* Next */}
						{media.length > 1 && (
							<button
								className="absolute right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
								onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % media.length); }}
								aria-label="Next"
							>
								<ChevronRight size={24} />
							</button>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
