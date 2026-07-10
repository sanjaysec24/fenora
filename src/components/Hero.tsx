import React from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import HeroTechnicalBackground from "./HeroTechnicalBackground";

interface HeroProps {
  onStartProject: () => void;
  onViewWork: () => void;
}

export default function Hero({ onStartProject, onViewWork }: HeroProps) {
  return (
    <section
      className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden bg-background"
      id="hero-section"
    >
      {/* Premium Cinematic Full-Width Technical Background (AI Network, Streams, Cloud HUD) */}
      <HeroTechnicalBackground />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-20">
        {/* Left Column Container: Constrained to max-w-3xl for perfect typographic line lengths and readability */}
        <div className="max-w-3xl space-y-8 text-left" id="hero-content-container">
          
          {/* Top Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-border"
            id="hero-badge"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-xs font-mono tracking-wider text-foreground-secondary font-semibold uppercase flex items-center gap-1.5">
              Now Accepting H2 Partner Applications <Sparkles className="w-3.5 h-3.5 text-accent inline" />
            </span>
          </motion.div>

          {/* Headline */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-[70px] font-display font-bold tracking-tight text-foreground leading-[1.08]"
              id="hero-title"
            >
              Engineering Intelligent <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground-secondary to-accent">
                Digital Products
              </span> <br />
              That Scale.
            </motion.h1>
          </div>

          {/* Subheadline (Deliver value prop within 5 seconds) */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-base sm:text-lg md:text-xl text-foreground-secondary max-w-xl leading-relaxed font-sans"
            id="hero-subheadline"
          >
            FENORA partners with startups and enterprises to design, engineer, and scale AI-powered digital products that create measurable business impact.
          </motion.p>

          {/* Call to Actions (Guiding to Start Project / Proposal) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            id="hero-cta-container"
          >
            <button
              onClick={onStartProject}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent hover:brightness-110 active:scale-[0.98] text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all text-sm cursor-pointer hover:-translate-y-0.5"
              id="hero-primary-cta"
            >
              Start Your Project
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={onViewWork}
              className="px-8 py-4 rounded-xl bg-surface-elevated border border-border hover:bg-surface active:scale-[0.98] text-foreground font-semibold flex items-center justify-center gap-2 transition-all text-sm cursor-pointer hover:border-border-subtle"
              id="hero-secondary-cta"
            >
              View Case Studies
            </button>
          </motion.div>

          {/* Micro Credibility Tags */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-6 border-t border-border grid grid-cols-3 gap-4 text-xs font-mono text-foreground-muted"
          >
            <div>
              <span className="text-foreground block font-sans font-semibold">NDA Friendly</span>
              <span>Collaboration Security</span>
            </div>
            <div>
              <span className="text-foreground block font-sans font-semibold">95%+ Coverage</span>
              <span>Standard Code Quality</span>
            </div>
            <div>
              <span className="text-foreground block font-sans font-semibold">Zero-Debt</span>
              <span>Engineering Philosophy</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
