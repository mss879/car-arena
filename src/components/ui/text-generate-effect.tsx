"use client";
import { useEffect, useMemo, useRef } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  lines,
  className,
  textClassName,
  filter = true,
  duration = 0.5,
  delay = 0,
  onComplete,
}: {
  words?: string;
  lines?: { text: string; className?: string }[];
  className?: string;
  textClassName?: string;
  filter?: boolean;
  duration?: number;
  delay?: number;
  onComplete?: () => void;
}) => {
  const [scope, animate] = useAnimate();

  // Stabilize onComplete in a ref so it never causes re-runs of the effect
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Stabilize contentLines so the effect doesn't re-trigger on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const linesKey = lines ? lines.map(l => l.text).join("|") : (words ?? "");
  const contentLines = useMemo(() => {
    if (lines) return lines;
    if (words) return words.split("\n").map(text => ({ text }));
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linesKey]);

  const totalWords = useMemo(
    () => contentLines.reduce((acc, line) => acc + line.text.split(" ").length, 0),
    [contentLines]
  );

  useEffect(() => {
    if (totalWords === 0) return;

    // Kick off the word-by-word animation for all spans within scope
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ?? 1,
        delay: stagger(0.2, { startDelay: delay }),
      }
    );

    // Fire onComplete after the last word finishes based on duration + stagger
    const total = delay + Math.max(0, (totalWords - 1) * 0.2) + (duration ?? 1);
    // Add a 500ms buffer to ensure the blur animation fully completes
    const id = window.setTimeout(() => {
      onCompleteRef.current?.();
    }, (total + 0.5) * 1000);

    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, totalWords, filter, duration, delay]);

  const renderContent = () => {
    return (
      <motion.div ref={scope} className="flex flex-col gap-1 md:gap-3">
        {contentLines.map((lineObj, lineIdx) => {
          const wordsInLine = lineObj.text.split(" ");
          return (
            <div key={`line-${lineIdx}`} className={cn(lineObj.className)}>
              {wordsInLine.map((word, wordIdx) => (
                <motion.span
                  key={`word-${lineIdx}-${wordIdx}`}
                  className="opacity-0"
                  style={{ filter: filter ? "blur(10px)" : "none" }}
                >
                  {word}{" "}
                </motion.span>
              ))}
            </div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-semibold", className)}>
      <div className={cn("mt-4", undefined)}>
        <div className={cn("text-white text-2xl leading-snug tracking-wide", textClassName)}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
