import React from "react";
import { 
  Layers, Flame, Terminal, Server, Database, Settings, Cloud, Cpu, ArrowUpRight
} from "lucide-react";

interface TechItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const TECHNOLOGIES: TechItem[] = [
  { name: "Next.js", icon: Layers, color: "text-foreground" },
  { name: "React 19", icon: Flame, color: "text-[#61DAFB]" },
  { name: "TypeScript", icon: Terminal, color: "text-[#3178C6]" },
  { name: "Node.js", icon: Server, color: "text-[#339933]" },
  { name: "PostgreSQL", icon: Database, color: "text-[#4169E1]" },
  { name: "Supabase", icon: Database, color: "text-[#3ECF8E]" },
  { name: "Docker", icon: Settings, color: "text-[#2496ED]" },
  { name: "AWS Services", icon: Cloud, color: "text-[#FF9900]" },
  { name: "Kubernetes", icon: Settings, color: "text-[#326CE5]" },
  { name: "OpenAI Models", icon: Cpu, color: "text-[#10A37F]" },
  { name: "Gemini Pro", icon: Cpu, color: "text-[#1A73E8]" },
  { name: "LangChain", icon: Layers, color: "text-[#F1C40F]" }
];

export default function TechMarquee() {
  return (
    <section className="relative py-12 bg-background overflow-hidden z-10 border-b border-border" id="tech-marquee">
      {/* Visual background details */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-24 bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-24 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Outer wrapper with subtle border frames */}
      <div className="relative w-full border-y border-border/40 bg-surface/40 py-6 backdrop-blur-sm">
        {/* Infinite marquee continuous loop wrapper */}
        <div className="flex overflow-hidden select-none" style={{ maskImage: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)' }}>
          {/* Track 1 */}
          <div className="flex gap-12 shrink-0 animate-infinite-marquee items-center min-w-full">
            {TECHNOLOGIES.map((tech, i) => {
              const TechIcon = tech.icon;
              return (
                <div 
                  key={`marquee-1-${i}`} 
                  className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-surface-elevated/10 hover:bg-surface-elevated/40 border border-border hover:border-accent/40 transition-all duration-300 shadow-sm group cursor-pointer shrink-0"
                >
                  <div className={`p-1.5 rounded-lg bg-surface-elevated/30 transition-colors group-hover:bg-surface-elevated/60 ${tech.color}`}>
                    <TechIcon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-foreground-secondary group-hover:text-foreground transition-colors tracking-wide">
                    {tech.name}
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-foreground-muted opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all duration-300" />
                </div>
              );
            })}
          </div>

          {/* Duplicate Track 2 for seamless loop */}
          <div className="flex gap-12 shrink-0 animate-infinite-marquee items-center min-w-full" aria-hidden="true">
            {TECHNOLOGIES.map((tech, i) => {
              const TechIcon = tech.icon;
              return (
                <div 
                  key={`marquee-2-${i}`} 
                  className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-surface-elevated/10 hover:bg-surface-elevated/40 border border-border hover:border-accent/40 transition-all duration-300 shadow-sm group cursor-pointer shrink-0"
                >
                  <div className={`p-1.5 rounded-lg bg-surface-elevated/30 transition-colors group-hover:bg-surface-elevated/60 ${tech.color}`}>
                    <TechIcon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-foreground-secondary group-hover:text-foreground transition-colors tracking-wide">
                    {tech.name}
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-foreground-muted opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all duration-300" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes infinite-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-infinite-marquee {
          animation: infinite-marquee 35s linear infinite;
        }
        .animate-infinite-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
