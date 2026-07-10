import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FenoraIcon } from "./FenoraLogo";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [shouldExit, setShouldExit] = useState(false);

  useEffect(() => {
    // Elegant incremental progress simulation
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setShouldExit(true);
          }, 450);
          return 100;
        }
        // Custom slowing down curve near the end for realistic initialization look
        const increment = prev > 80 ? Math.random() * 2 : Math.random() * 15 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (shouldExit) {
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 800); // Allow exit animations to finish
      return () => clearTimeout(exitTimer);
    }
  }, [shouldExit, onComplete]);

  return (
    <AnimatePresence>
      {!shouldExit && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 bg-background z-[9999] flex flex-col items-center justify-center overflow-hidden"
          id="global-brand-loading-screen"
        >
          {/* Subtle Ambient Radial Background Glow */}
          <div className="absolute inset-0 bg-radial-glow opacity-45 pointer-events-none" />
          <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          {/* Animated Vector Grid Accent */}
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />

          <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
            {/* Pulsing Glowing Logo Container */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-8"
              id="loader-logo-container"
            >
              {/* Pulsing external halos */}
              <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl animate-pulse scale-125" />
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(14, 165, 233, 0.15)",
                    "0 0 45px rgba(14, 165, 233, 0.35)",
                    "0 0 20px rgba(14, 165, 233, 0.15)"
                  ]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative bg-surface/40 border border-border p-6 rounded-3xl backdrop-blur-md"
              >
                <FenoraIcon className="w-20 h-20 text-foreground" glow={true} />
              </motion.div>
            </motion.div>

            {/* Typography */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2 mb-10"
              id="loader-text-container"
            >
              <h1 className="text-2xl font-display font-bold tracking-wider text-foreground">
                FENORA
              </h1>
              <p className="text-[10px] font-mono tracking-[0.4em] text-accent font-bold uppercase">
                Enterprise Router Core
              </p>
            </motion.div>

            {/* Premium Progress Bar Track */}
            <div className="w-48 h-1 bg-surface-elevated/40 border border-border rounded-full overflow-hidden relative mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            </div>

            {/* Dynamic Diagnostics Log Lines */}
            <div className="h-5 flex items-center justify-center">
              <span className="text-[9px] font-mono text-foreground-muted uppercase tracking-widest animate-pulse font-bold">
                {progress < 30 && "⚡ STAGE 1: Compiling Shaders..."}
                {progress >= 30 && progress < 60 && "🕸️ STAGE 2: Mapping Global Router Mesh..."}
                {progress >= 60 && progress < 90 && "🛡️ STAGE 3: Authenticating Secure Shells..."}
                {progress >= 90 && "🌐 STAGE 4: Syncing Fenora Core..."}
              </span>
            </div>
          </div>

          {/* Symmetrical Corner Accents */}
          <div className="absolute top-8 left-8 text-[8px] font-mono text-foreground-muted/60 tracking-wider font-bold">
            FENORA_SYS_V2.6 // ID: 82C38641
          </div>
          <div className="absolute bottom-8 right-8 text-[8px] font-mono text-foreground-muted/60 tracking-wider font-bold">
            LOCAL_PING: OK // STATUS: BOOTING
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
