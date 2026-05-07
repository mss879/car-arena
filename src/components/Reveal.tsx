import React, { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../lib/utils";

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  /** Element type to render (for semantics), defaults to 'div'. */
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  /** delay in ms */
  delay?: number;
  /** duration in ms */
  duration?: number;
  /** offset in px used for the translate distance */
  offset?: number;
  direction?: RevealDirection;
  /** if true, the element will animate only the first time it enters the viewport */
  once?: boolean;
  /** threshold for the intersection observer */
  threshold?: number;
  /** root margin for the intersection observer */
  rootMargin?: string;
}

/**
 * Reveal: a small scroll-reveal component using IntersectionObserver.
 * - Uses inline styles for smooth transform/opacity transitions.
 * - Respects prefers-reduced-motion.
 * - Provides simple delay/duration/direction controls.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 600,
  offset = 16,
  direction = "up",
  once = true,
  threshold = 0.12,
  rootMargin = "0px 0px -10% 0px",
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<any>(null);
  const [visible, setVisible] = useState(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once && node) observer.unobserve(node);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, prefersReducedMotion, rootMargin, threshold]);

  const initialTransform = useMemo(() => {
    if (direction === "none") return "none";
    switch (direction) {
      case "up":
        return `translate3d(0, ${offset}px, 0)`; // move up into place
      case "down":
        return `translate3d(0, -${offset}px, 0)`;
      case "left":
        return `translate3d(-${offset}px, 0, 0)`;
      case "right":
        return `translate3d(${offset}px, 0, 0)`;
      default:
        return "none";
    }
  }, [direction, offset]);

  const style: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : initialTransform,
    transitionProperty: "transform, opacity",
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
    transitionDelay: `${delay}ms`,
    willChange: "transform, opacity",
  };

  return (
    <Tag ref={ref} className={cn(className)} style={style}>
      {children}
    </Tag>
  );
}

export default Reveal;
