"use client";
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    };

    // initial measurement
    measure();

    // observe size changes of the content
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined" && ref.current) {
      ro = new ResizeObserver(() => measure());
      ro.observe(ref.current);
    }

    // fallback to window resize
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Grow the line steadily from near the start to near the end of the section
    offset: ["start 10%", "end 90%"],
  });

  // Map progress directly to height for consistent pacing
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  // Keep the line visible at all times to avoid perceived delay
  const opacityTransform = useTransform(scrollYProgress, [0, 0], [1, 1]);

  // smooth progress
  // Use direct transform for instant response (no spring lag)
  const smoothHeight = heightTransform;
  const smoothOpacity = opacityTransform;

  return (
    <div className="w-full bg-transparent font-sans md:px-10" ref={containerRef}>
      <div ref={ref} className="relative max-w-7xl mx-auto py-16 md:py-24">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-black flex items-center justify-center ring-1 ring-white/20">
                <div className="h-4 w-4 rounded-full bg-neutral-800 border border-neutral-700 p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-white">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-white">
                {item.title}
              </h3>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ type: "spring", stiffness: 160, damping: 22, mass: 0.6 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 supports-[backdrop-filter]:backdrop-blur-md p-5 md:p-6 ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_30px_rgba(0,0,0,0.35)]"
              >
                {/* glossy highlight */}
                <div className="pointer-events-none absolute inset-0 z-0 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_65%)]">
                  <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
                </div>
                <div className="relative z-[1] text-[rgba(230,208,144,0.85)] text-sm md:text-base">
                  {item.content}
                </div>
              </motion.div>
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-white/25 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: smoothHeight,
              opacity: smoothOpacity,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-white via-white to-transparent from-[0%] via-[12%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
