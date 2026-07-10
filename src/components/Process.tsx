import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Search, Compass, Cpu, Rocket, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";

const PROCESS_STEPS = [
  {
    phase: "01",
    id: "discovery",
    title: "Discovery Call",
    icon: Phone,
    duration: "Day 1",
    subtitle: "Initial Alignment & Tech Feasibility",
    description: "In-depth dialogue evaluating product goals, scope complexity, security demands, and choosing the perfect architecture paths. We determine immediate feasibility constraints.",
    deliverables: [
      "Custom Scoping & Resource Matrix",
      "Core Technology Recommendations",
      "High-Level Roadmap Estimates",
      "NDA Verification Protocols"
    ]
  },
  {
    phase: "02",
    id: "strategy",
    title: "Strategy",
    icon: Search,
    duration: "Week 1",
    subtitle: "Product Architecture & MVP Roadmap",
    description: "Bespoke workshops translating requirements into production-ready specifications. Mapping out relational schemas, microservice structures, and Gemini model interactions.",
    deliverables: [
      "Technical Architecture Blueprint",
      "Relational Database Schemas",
      "Interactive Epic Backlog Sprints",
      "Comprehensive Threat Model Review"
    ]
  },
  {
    phase: "03",
    id: "design",
    title: "Design",
    icon: Compass,
    duration: "Weeks 2 - 4",
    subtitle: "Interactive UI/UX & High-Fidelity Prototyping",
    description: "Designing gorgeous, premium user interfaces that build immediate user trust. Utilizing Figma tokens to create full-scale pixel-perfect interactive web layouts.",
    deliverables: [
      "Figma Component Design System",
      "High-Fidelity Interactive Prototypes",
      "Mobile/Desktop Adaptive Screen Layouts",
      "Conversion Funnel Micro-Animations"
    ]
  },
  {
    phase: "04",
    id: "development",
    title: "Development",
    icon: Cpu,
    duration: "Weeks 5 - 12",
    subtitle: "Type-Safe Engineering & AI Integration",
    description: "High-velocity production code written strictly in TypeScript. We execute database migration scripts, design server-side proxy routes, and build multi-agent loops.",
    deliverables: [
      "Type-safe React & Vite codebase",
      "Hardened Server-side Proxy APIs",
      "Intelligent Gemini LLM integrations",
      "95%+ component unit test coverages"
    ]
  },
  {
    phase: "05",
    id: "launch",
    title: "Launch",
    icon: Rocket,
    duration: "Week 13",
    subtitle: "Hardened Deployment & Compliance Audit",
    description: "Zero-downtime transition to production. We configure declarative Infrastructure as Code, audit access policies, and configure edge caches globally.",
    deliverables: [
      "Declarative AWS/GCP Terraform profiles",
      "Enterprise SOC2 security audits",
      "Global CDN caching integrations",
      "Zero-downtime blue-green rollouts"
    ]
  },
  {
    phase: "06",
    id: "scale",
    title: "Scale",
    icon: TrendingUp,
    duration: "Continuous",
    subtitle: "Continuous SLA Support & Multi-Agent Growth",
    description: "Proactive database indexing, real-time Sentry exception capturing, Core Web Vital speed optimization audits, and continuous feature expansion.",
    deliverables: [
      "Guaranteed uptime SLA monitoring",
      "Real-time Sentry & Sentry logging",
      "Core Web Vitals SEO optimization",
      "Bi-weekly modular feature sprints"
    ]
  }
];

export default function Process() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeStep = PROCESS_STEPS[selectedIdx];
  const StepIcon = activeStep.icon;

  return (
    <section className="relative py-24 bg-background overflow-hidden z-10 border-t border-border" id="process">
      {/* Background visual indicators */}
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-radial-glow opacity-35 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 font-sans">
        {/* Header Block */}
        <div className="max-w-3xl mb-20 space-y-4">
          <span className="text-xs font-mono tracking-widest text-accent font-bold uppercase block">
            Founder Journey
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-foreground leading-tight">
            From Blueprint to Global Scale.
          </h2>
          <p className="text-foreground-secondary text-base md:text-lg max-w-2xl leading-relaxed font-sans">
            A disciplined six-stage execution engineering lifecycle built for elite founders who refuse to compromise on technical architecture, speed, or design quality.
          </p>
        </div>

        {/* Process Stepper Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch font-sans">
          {/* Left Column: Horizontal Stepper Selector (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3 font-sans">
            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted block mb-2 font-bold">
              Journey Phases (Click to view deliverables)
            </span>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 font-sans">
              {PROCESS_STEPS.map((step, idx) => {
                const isSelected = selectedIdx === idx;
                const Icon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => setSelectedIdx(idx)}
                    className={`p-4 rounded-xl text-left border flex items-center justify-between transition-all duration-300 group cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border-primary text-foreground shadow-lg shadow-primary/5"
                        : "bg-surface border-border text-foreground-secondary hover:border-border-subtle hover:bg-surface-elevated/40"
                    }`}
                    id={`process-tab-${step.id}`}
                  >
                    <div className="flex items-center gap-3.5 font-sans">
                      <span className={`text-xs font-mono font-bold tracking-wider ${
                        isSelected ? "text-accent" : "text-foreground-muted group-hover:text-foreground"
                      }`}>
                        {step.phase}
                      </span>
                      <span className="text-xs md:text-sm font-semibold tracking-tight">
                        {step.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-sans">
                      <span className="text-[9px] font-mono text-foreground-muted hidden sm:inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                        {step.duration}
                      </span>
                      <Icon className={`w-4 h-4 shrink-0 ${
                        isSelected ? "text-accent" : "text-foreground-muted group-hover:text-foreground"
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Phase Overview card (7 cols) */}
          <div className="lg:col-span-7 flex flex-col font-sans">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 p-8 md:p-10 rounded-3xl glass-panel border border-border relative overflow-hidden flex flex-col justify-between"
                id={`process-detail-${activeStep.id}`}
              >
                {/* Visual Radial Backing */}
                <div className="absolute inset-0 bg-radial-glow-cyan opacity-25 pointer-events-none z-0" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between h-full items-stretch">
                  <div className="space-y-6 flex-1 flex flex-col justify-between font-sans">
                    <div className="space-y-4">
                      {/* Phase timing */}
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-[10px] font-mono uppercase bg-accent/10 border border-accent/20 text-accent px-2.5 py-1 rounded-full font-bold">
                          Phase {activeStep.phase}
                        </span>
                        <span className="text-xs text-foreground-secondary">
                          EXPECTED TIMELINE: {activeStep.duration}
                        </span>
                      </div>

                      {/* Phase Title */}
                      <div className="space-y-1">
                        <h3 className="text-xl md:text-2xl font-display font-bold text-foreground">
                          {activeStep.title}
                        </h3>
                        <p className="text-xs text-accent font-semibold">
                          {activeStep.subtitle}
                        </p>
                      </div>

                      {/* Phase Description */}
                      <p className="text-xs md:text-sm text-foreground-secondary leading-relaxed font-sans">
                        {activeStep.description}
                      </p>
                    </div>

                    {/* Progress navigation helper */}
                    {selectedIdx < PROCESS_STEPS.length - 1 ? (
                      <button
                        onClick={() => setSelectedIdx(selectedIdx + 1)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-accent hover:text-foreground transition-colors cursor-pointer"
                        id="process-next-phase-btn"
                      >
                        Advance to strategy phase
                        <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                      </button>
                    ) : (
                      <div className="text-xs font-mono text-foreground-muted">
                        🔄 Continuous expansion SLA active
                      </div>
                    )}
                  </div>

                  {/* Phase Deliverables List */}
                  <div className="w-full md:w-[250px] p-5 rounded-2xl bg-surface-elevated/15 border border-border space-y-4 flex flex-col justify-between font-sans">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider text-foreground-muted uppercase block pb-2 border-b border-border mb-3 font-bold">
                        Phase Deliverables
                      </span>

                      <div className="space-y-3 font-sans">
                        {activeStep.deliverables.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                            <span className="text-xs font-medium text-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border mt-4">
                      <span className="text-[9px] font-mono text-foreground-muted block uppercase">
                        Client Assurance
                      </span>
                      <span className="text-[10px] text-foreground-secondary font-semibold">
                        100% IP Assignment Guarantee
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
