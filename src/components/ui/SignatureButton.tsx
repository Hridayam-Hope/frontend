'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Heart } from 'lucide-react';

interface SignatureButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	href?: string;
	showIcon?: boolean;
	size?: 'sm' | 'md' | 'lg';
}

export default function SignatureButton({
	children,
	href,
	onClick,
	className = '',
	showIcon = true,
	size = 'md',
	...props
}: SignatureButtonProps) {
	const content = (
		<>
			{showIcon && (
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
					}}
					transition={{
						duration: 1.5,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
					className={`${size === 'sm' ? 'mr-1.5' : 'mr-2'} flex items-center justify-center`}
				>
					<Heart size={size === 'sm' ? 12 : 16} className="fill-current text-white/90" />
				</motion.div>
			)}
			{children}
		</>
	);

	const paddingClasses = {
		sm: 'px-3 py-1.5 text-[10px] sm:px-4 sm:py-2 sm:text-xs',
		md: 'px-6 py-3 text-sm sm:text-base',
		lg: 'px-8 py-4 text-base sm:text-lg',
	};

	const baseClasses = `
		group items-center justify-center whitespace-nowrap
		font-semibold text-white
		hp-gradient-bg
		rounded-tl-[1.8rem] rounded-tr-lg rounded-br-[1.8rem] rounded-bl-lg
		shadow-[0_10px_20px_-5px_rgba(101,186,193,0.3)]
		hover:shadow-[0_15px_30px_-5px_rgba(101,186,193,0.5)]
		transition-all duration-300 ease-out
		${paddingClasses[size]}
		${className.includes('flex') || className.includes('hidden') || className.includes('block') || className.includes('inline') ? className : `inline-flex ${className}`}
	`;

	const motionProps: HTMLMotionProps<'button' | 'a'> = {
		whileHover: { y: -4, scale: 1.02 },
		whileTap: { scale: 0.98 },
		...(props as any),
	};

	if (href) {
		return (
			<motion.a href={href} className={baseClasses} {...(motionProps as HTMLMotionProps<'a'>)}>
				{content}
			</motion.a>
		);
	}

	return (
		<motion.button onClick={onClick} className={baseClasses} {...(motionProps as HTMLMotionProps<'button'>)}>
			{content}
		</motion.button>
	);
}
