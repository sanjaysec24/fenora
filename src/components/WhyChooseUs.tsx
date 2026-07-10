import React from "react";
import { motion } from "motion/react";
import { 
  Award, Flame, Handshake, Zap, ShieldCheck, FileKey, 
  CloudLightning, HardHat, GitBranch, HeartHandshake, CheckCircle2 
} from "lucide-react";

export default function WhyChooseUs() {
  const pillars = [
    {
      id: "pillar-1",
      icon: Award,
      title: "Product-First Mindset",
      description: "We don't just write lines of code. We think like founders. We analyze user retention loops, advise on core features, optimize conversion paths, and align your product architecture with active growth metrics.",
      badge: "Founder-Aligned",
      bgOverlay: "radial-gradient(circle at 10% 20%, rgba(0, 229, 255, 0.1) 0%, transparent 60%)"
    },
    {
      id: "pillar-2",
      icon: Flame,
      title: "Fast Execution Cycles",
      description: "Sprints that actually ship. Our continuous deployment pipelines ensure feature additions go live securely and instantly. We eliminate process overhead to deliver high-velocity product increments.",
      badge: "High Velocity",
      bgOverlay: "radial-gradient(circle at 90% 80%, rgba(0, 102, 255, 0.08) 0%, transparent 60%)"
    },
    {
      id: "pillar-3",
      icon: ShieldCheck,
      title: "Premium Engineering Quality",
      description: "Bulletproof codebases. We maintain a strict zero-debt philosophy, utilizing typed compilers, comprehensive automated CI/CD unit testing, rigorous static analysis, and pristine design system tokens.",
      badge: "Zero-Debt Standard",
      bgOverlay: "radial-gradient(circle at 10% 80%, rgba(255, 255, 255, 0.04) 0%, transparent 60%)"
    },
    {
      id: "pillar-4",
      icon: Handshake,
      title: "Long-Term Partnership Model",
      description: "We are with you for the long haul. FENORA serves as a strategic fractional CTO force, scaling side-by-side with your funding rounds and seamlessly transitioning code control to your internal engineering hires.",
      badge: "CTO Sizing Support",
      bgOverlay: "radial-gradient(circle at 90% 20%, rgba(0, 102, 255, 0.1) 0%, transparent 60%)"
    }
  ];

  const trustSignals = [
    {
      title: "Enterprise-Grade Security",
      detail: "End-to-end HTTPS/WSS encryption, strict JSON Web Token row-level policies, and secure private environment vaults.",
      icon: ShieldCheck
    },
    {
      title: "NDA Friendly Collaboration",
      detail: "Comprehensive intellectual property (IP) protection, instant NDA assignments, and clean workspace isolation.",
      icon: FileKey
    },
    {
      title: "Scalable Cloud Infrastructure",
      detail: "Declarative auto-scaling container configurations, multi-region replication groups, and zero cold-start routing.",
      icon: CloudLightning
    },
    {
      title: "Long-Term Technical Support",
      detail: "Proactive uptime service SLAs, real-time error telemetry monitoring, and responsive hotfix deployment teams.",
      icon: HardHat
    },
    {
      title: "Modern Engineering Practices",
      detail: "Strict trunk-based branch architectures, automated code review linting gates, and modular component reuse rules.",
      icon: GitBranch
    }
  ];

  return (
    <section className="relative py-24 bg-background overflow-hidden z-10 border-t border-border" id="why-choose">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-20 space-y-4">
          <span className="text-xs font-mono tracking-widest text-accent font-bold uppercase block">
            The FENORA Advantage
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-foreground leading-tight">
            Why Founders Choose FENORA.
          </h2>
          <p className="text-foreground-secondary text-base md:text-lg max-w-2xl leading-relaxed font-sans">
            We bridge the gap between startup agility and enterprise resilience, delivering pristine product design coupled with hardened system architecture.
          </p>
        </div>

        {/* 2x2 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {pillars.map((item, index) => {
            const PillarIcon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 md:p-10 rounded-3xl glass-panel relative overflow-hidden group border border-border bg-surface-elevated/10"
                id={item.id}
              >
                {/* Background Glow */}
                <div
                  className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"
                  style={{ backgroundImage: item.bgOverlay }}
                />

                <div className="relative z-10 space-y-6">
                  {/* Badge & Icon Row */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-surface-elevated/40 text-accent group-hover:bg-primary/20 group-hover:text-foreground transition-all duration-300">
                      <PillarIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-surface-elevated/40 border border-border text-foreground-secondary px-2.5 py-1 rounded-md">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3">
                    <h3 className="text-xl md:text-2xl font-display font-bold text-foreground group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm text-foreground-secondary leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Hardened Trust Signals Section */}
        <div className="p-8 md:p-12 rounded-3xl border border-border bg-radial-glow relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 opacity-40 pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Header Subblock */}
            <div className="lg:col-span-4 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono uppercase font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Enterprise Grade Guard
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground">
                Hardened Safeguards.
              </h3>
              <p className="text-xs md:text-sm text-foreground-secondary leading-relaxed font-sans">
                Our code, processes, and infrastructure comply with the highest global compliance, security, and intellectual property standards.
              </p>
              
              <div className="pt-4 border-t border-border space-y-1.5 text-[10px] font-mono text-foreground-muted">
                <div>// COMPLIANCE READY: SOC2 TYPE II PREP</div>
                <div>// INTELLECTUAL PROPERTY: 100% ASSIGNED</div>
              </div>
            </div>

            {/* Right Trust Indicators Columns */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {trustSignals.map((signal, idx) => {
                const SignalIcon = signal.icon;
                return (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl bg-surface-elevated/20 border border-border hover:border-border-subtle transition-colors flex gap-4"
                  >
                    <div className="p-2.5 rounded-lg bg-accent/5 text-accent shrink-0 h-10 w-10 flex items-center justify-center">
                      <SignalIcon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs md:text-sm font-display font-bold text-foreground">
                        {signal.title}
                      </h4>
                      <p className="text-[11px] text-foreground-secondary leading-relaxed font-sans">
                        {signal.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
