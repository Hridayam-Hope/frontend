'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function MobileDonateButton() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => {
			// Show after scrolling past viewport height (hero)
			setVisible(window.scrollY > window.innerHeight);
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<AnimatePresence>
			{visible && (
				<motion.a
					href="#quick-impact"
					initial={{ y: 80, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 80, opacity: 0 }}
					transition={{ type: 'spring', damping: 20, stiffness: 200 }}
					className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full hp-gradient-bg px-5 py-3 text-sm font-semibold text-white shadow-xl lg:hidden animate-pulse-glow"
					aria-label="Donate now"
				>
					<Heart size={16} fill="white" />
					Donate
				</motion.a>
			)}
		</AnimatePresence>
	);
}
