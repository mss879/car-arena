"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  textClassName,
  filter = true,
  duration = 0.5,
  onComplete,
}: {
  words: string;
  className?: string;
  textClassName?: string;
  filter?: boolean;
  duration?: number;
  onComplete?: () => void;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    // Kick off the word-by-word animation
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ?? 1,
        delay: stagger(0.2),
      }
    );

    // Fire onComplete after the last word finishes based on duration + stagger
    if (onComplete) {
      const total = Math.max(0, (wordsArray.length - 1) * 0.2) + (duration ?? 1);
      const id = window.setTimeout(() => onComplete?.(), total * 1000);
      return () => window.clearTimeout(id);
    }
  }, [scope, words, filter, duration, onComplete]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="opacity-0"
            style={{ filter: filter ? "blur(10px)" : "none" }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-semibold", className)}>
      <div className={cn("mt-4", undefined)}>
        <div className={cn("text-white text-2xl leading-snug tracking-wide", textClassName)}>
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
