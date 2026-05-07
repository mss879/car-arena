import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the entire preloader container after the exit animation completes (~2.1s)
    const timer = setTimeout(() => {
      setIsVisible(false);
      // @ts-ignore
      window.isPreloaderComplete = true;
      // Dispatch an event so the hero video knows it can start playing
      window.dispatchEvent(new Event("preloaderComplete"));
    }, 2100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
          {/* Top Half of the "Garage Door" */}
          <motion.div
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.6, delay: 1.6, ease: [0.76, 0, 0.24, 1] }}
            className="absolute top-0 left-0 right-0 h-[50vh] bg-black border-b border-white/10"
          />
          {/* Bottom Half of the "Garage Door" */}
          <motion.div
            initial={{ y: "0%" }}
            animate={{ y: "100%" }}
            transition={{ duration: 0.6, delay: 1.6, ease: [0.76, 0, 0.24, 1] }}
            className="absolute bottom-0 left-0 right-0 h-[50vh] bg-black border-t border-white/10"
          />

          {/* Center Content Container */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 1.6 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* The Spark (Red Line Sweep) */}
            <motion.div
              initial={{ scaleX: 0, opacity: 1 }}
              animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 0.4, delay: 0, ease: "easeInOut" }}
              className="absolute h-[2px] w-[200vw] bg-red-600 origin-center shadow-[0_0_20px_rgba(220,38,38,1)]"
            />

            {/* "IMPORT." Flash */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 1.2] }}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
              className="absolute text-6xl sm:text-7xl md:text-8xl font-bold tracking-widest text-white uppercase italic"
            >
              IMPORT.
            </motion.h2>

            {/* "UPGRADE." Flash */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 1.2] }}
              transition={{ duration: 0.4, delay: 0.8, ease: "easeOut" }}
              className="absolute text-6xl sm:text-7xl md:text-8xl font-bold tracking-widest text-white uppercase italic"
            >
              UPGRADE.
            </motion.h2>

            {/* "DRIVE." Flash */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 1.2] }}
              transition={{ duration: 0.4, delay: 1.2, ease: "easeOut" }}
              className="absolute text-6xl sm:text-7xl md:text-8xl font-bold tracking-widest text-white uppercase italic"
            >
              DRIVE.
            </motion.h2>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
