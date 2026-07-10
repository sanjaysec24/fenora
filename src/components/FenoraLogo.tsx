import React from "react";

interface LogoProps {
  className?: string;
  glow?: boolean;
}

/**
 * Highly polished vector SVG of the official FENORA "F" symbol.
 * Matches the curved aerodynamic structure of the uploaded brand mark.
 */
export function FenoraIcon({ className = "w-8 h-8", glow = false }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-300 ${
        glow ? "drop-shadow-[0_0_15px_rgba(14,165,233,0.65)] text-accent" : "text-foreground"
      }`}
      id="fenora-brand-icon-svg"
    >
      <path
        d="M 32.5 82.5 
           C 28.5 76.5, 29.0 50.0, 29.0 38.0 
           C 29.0 22.0, 42.0 15.0, 58.0 15.0 
           L 74.0 15.0 
           C 80.0 15.0, 84.0 18.5, 84.0 23.5 
           C 84.0 28.5, 80.0 31.5, 74.0 31.5 
           L 54.0 31.5 
           C 45.0 31.5, 42.0 34.5, 42.0 42.0 
           L 42.0 48.0 
           L 68.0 48.0 
           C 73.5 48.0, 77.0 51.0, 77.0 55.5 
           C 77.0 60.0, 73.5 63.0, 68.0 63.0 
           L 42.0 63.0 
           L 42.0 70.0 
           C 42.0 77.0, 36.5 82.5, 32.5 82.5 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Complete side-by-side Logo and Wordmark component.
 * Uses exact brand proportions and tracking for high perceived value.
 */
export function FenoraLogo({ className = "h-9", glow = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 group transition-all duration-300 ${className}`} id="fenora-full-logo">
      <FenoraIcon className="w-8 h-8 shrink-0 group-hover:scale-105 transition-transform duration-300" glow={glow} />
      <div className="flex flex-col justify-center text-left">
        <span className={`font-display font-bold tracking-tight text-lg leading-none ${
          glow ? "text-accent drop-shadow-[0_0_8px_rgba(14,165,233,0.4)]" : "text-foreground"
        }`}>
          FENORA
        </span>
        <span className="text-[9px] font-mono tracking-[0.2em] text-accent font-bold uppercase mt-0.5">
          Technologies
        </span>
      </div>
    </div>
  );
}

/**
 * Vertical, standalone large brand mark (F symbol on top, wordmark below).
 * Used in footers, loading screens, and central hub nodes.
 */
export function FenoraVerticalLogo({ className = "w-24", glow = false }: LogoProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4" id="fenora-vertical-logo">
      <FenoraIcon className="w-20 h-20" glow={glow} />
      <div className="space-y-1">
        <span className="font-display font-bold text-3xl tracking-wider text-foreground block">
          FENORA
        </span>
        <span className="text-xs font-mono tracking-[0.35em] text-accent font-bold uppercase block">
          Technologies
        </span>
      </div>
    </div>
  );
}
