'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Heart } from 'lucide-react';

interface SignatureButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	href?: string;
	showIcon?: boolean;
	size?: 'sm' | 'md' | 'lg';
	variant?: 'default' | 'whatsapp';
	target?: string;
	rel?: string;
}

export default function SignatureButton({
	children,
	href,
	onClick,
	className = '',
	showIcon = true,
	size = 'md',
	variant = 'default',
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
					{variant === 'whatsapp' ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={size === 'sm' ? 14 : 18}
							height={size === 'sm' ? 14 : 18}
							viewBox="0 0 24 24"
							fill="currentColor"
							className="text-white/90"
						>
							<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
						</svg>
					) : (
						<Heart size={size === 'sm' ? 12 : 16} className="fill-current text-white/90" />
					)}
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

	const bgClass = variant === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#128C7E]' : 'hp-gradient-bg';
	const shadowClass = variant === 'whatsapp' 
		? 'shadow-[0_10px_20px_-5px_rgba(37,211,102,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(37,211,102,0.5)]' 
		: 'shadow-[0_10px_20px_-5px_rgba(101,186,193,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(101,186,193,0.5)]';

	const baseClasses = `
		group items-center justify-center whitespace-nowrap
		font-semibold text-white
		${bgClass}
		rounded-tl-[1.8rem] rounded-tr-lg rounded-br-[1.8rem] rounded-bl-lg
		${shadowClass}
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
