import React from "react";
import { cn } from "@/lib/utils";

type ScrollStackProps = {
	className?: string;
	children: React.ReactNode;
	/** Height offset at the top (e.g., navbar height). Default 7rem to match Navbar h-28. */
	topOffsetRem?: number;
	/** Optional sticky header rendered inside the scroll container but above panels. */
	stickyHeader?: React.ReactNode;
};

type PanelProps = {
	className?: string;
	children: React.ReactNode;
	/** Optional background classes (solid or gradient). Defaults to transparent. */
	overlayClassName?: string;
};

/**
 * ScrollStack: vertical scroll-snap container sized to viewport minus the navbar.
 * Children should be ScrollStack.Panel components for full-screen snap sections.
 */
export function ScrollStack({ className, children, topOffsetRem = 7, stickyHeader }: ScrollStackProps) {
	// Use a CSS var for the top offset and only apply fixed viewport height on md+.
	// Use small viewport units for mobile browsers to avoid URL bar issues.
	const heightStyle = { ["--topOffset" as any]: `${topOffsetRem}rem` } as React.CSSProperties;

	return (
		<div
			className={cn(
				"relative w-full overflow-y-auto overscroll-y-auto snap-y snap-proximity md:snap-mandatory scroll-smooth",
				// svh for mobile; vh for desktop to mirror original behavior
				"h-[calc(100svh_-_var(--topOffset))] md:h-[calc(100vh_-_var(--topOffset))]",
				// small, unobtrusive scrollbar styling (WebKit/Chromium only)
				"[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20",
				className
			)}
			style={heightStyle}
			aria-label="Scroll stack container"
			role="region"
		>
			{/* Optional sticky header rendered above panels but inside the scroll container */}
			{stickyHeader}

			{/* Ensure children (panels) match container height for perfect centering */}
			<div className="h-full">{children}</div>
			{/* Mobile handoff spacer: gives a tiny extra scroll so momentum can chain to the page after the last panel */}
			<div aria-hidden className="h-6 md:h-0" />
		</div>
	);
}

ScrollStack.Panel = function Panel({ className, children, overlayClassName }: PanelProps) {
	return (
				<section
					className={cn(
						"relative snap-start md:snap-center snap-always w-full",
						// Match container height for a full-screen slide experience
						"min-h-[620px] h-full",
				className
			)}
			aria-roledescription="snap panel"
		>
			{/* Background/Overlay layer (optional) */}
			{overlayClassName ? (
				<div className={cn("absolute inset-0 -z-10", overlayClassName)} aria-hidden />
			) : null}

			{/* Content area */}
			<div className="h-full w-full flex items-center">
				{children}
			</div>
		</section>
	);
};

export type { PanelProps as ScrollStackPanelProps };

export default ScrollStack;

