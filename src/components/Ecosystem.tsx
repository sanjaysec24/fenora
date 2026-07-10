import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Terminal, Database, Server, Cpu, Cloud, Settings, 
  Layers, CheckCircle2, ShieldCheck, Flame, ArrowRight
} from "lucide-react";

interface TechNode {
  id: string;
  name: string;
  category: "frontend" | "backend" | "database" | "devops" | "ai";
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  useCase: string;
  perfMetric: string;
  bestPractices: string[];
}

const TECH_ECOSYSTEM: TechNode[] = [
  {
    id: "nextjs",
    name: "Next.js",
    category: "frontend",
    icon: Layers,
    description: "The leading React framework for high-performance production apps. Ideal for SEO-driven marketing pages and rich dynamic dashboards.",
    useCase: "Universal Server-Side Rendering (SSR), Incremental Static Regeneration (ISR), and native Edge routing.",
    perfMetric: "Sub-100ms Time to First Byte (TTFB)",
    bestPractices: ["App Router architecture", "Strict component-level streaming", "Edge runtime execution"]
  },
  {
    id: "react",
    name: "React 19+",
    category: "frontend",
    icon: Flame,
    description: "The world's standard library for highly responsive component design, dynamic layouts, and fast client-side state engines.",
    useCase: "Extremely interactive client dashboards, visual modeling systems, and real-time canvas interfaces.",
    perfMetric: "60 FPS hardware-accelerated animations",
    bestPractices: ["Concurrent rendering & transitions", "Strict modular extraction", "State preservation via LocalStorage"]
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "frontend",
    icon: Terminal,
    description: "Strict compile-time type safety preventing 98% of runtime application errors. Standardized across every line of our code.",
    useCase: "Enterprise codebases, safe refactoring, rich developer tooling, and structured API contracts.",
    perfMetric: "Zero-error TS Compiler strict compliance",
    bestPractices: ["No implicit-any parameters", "Strict discriminated unions", "Automated OpenAPI contract typing"]
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    icon: Server,
    description: "An asynchronous, event-driven JavaScript runtime built on Chrome's V8 engine, optimized for building highly scalable network APIs.",
    useCase: "Microservices, GraphQL gateway proxies, async message brokers, and streaming media pipelines.",
    perfMetric: "Up to 50k requests/sec per container instance",
    bestPractices: ["Non-blocking async/await loops", "Express/Fastify performance optimizations", "Native ES Module structures"]
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "database",
    icon: Database,
    description: "The world's most trusted, feature-rich open-source relational database. Engineered for absolute data integrity.",
    useCase: "Highly structured transaction logs, complex multi-table joins, and advanced relational schemas.",
    perfMetric: "99.999% ACID transactional durability",
    bestPractices: ["Optimized composite indexing", "Pgvector for semantic embeddings", "Read-replica replication structures"]
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "database",
    icon: Database,
    description: "An open-source Firebase alternative providing immediate PostgreSQL instances, real-time listeners, and safe Row-Level Security (RLS).",
    useCase: "High-velocity MVPs, instant secure DB endpoints, storage bucket assets, and real-time multiplayer states.",
    perfMetric: "<30ms real-time update sync replication",
    bestPractices: ["Granular PostgreSQL RLS policies", "Bespoke database edge functions", "JWT-authorized row constraints"]
  },
  {
    id: "docker",
    name: "Docker & K8s",
    category: "devops",
    icon: Settings,
    description: "Immutable application containers guaranteeing that what runs perfectly in our local workspace compiles flawlessly on your cloud cluster.",
    useCase: "Multi-region standardizing, isolated development, automated scaling, and unified devops pipelines.",
    perfMetric: "Sub-10s isolated cold-boot container startup",
    bestPractices: ["Multi-stage efficient Dockerfiles", "Non-root container user privilege", "Declarative Kubernetes manifest locks"]
  },
  {
    id: "aws",
    name: "AWS & GCP Cloud",
    category: "devops",
    icon: Cloud,
    description: "High-availability, SOC2-compliant enterprise cloud structures provisioned using declarative Terraform code.",
    useCase: "Global CDN asset serving, serverless cloud functions, auto-scaling clusters, and highly secure virtual networks.",
    perfMetric: "99.99% multi-region high availability SLA",
    bestPractices: ["Least-privilege IAM configuration", "Multi-region auto-failover groups", "Real-time CloudWatch security metrics"]
  },
  {
    id: "ai-models",
    name: "AI & LLM Systems",
    category: "ai",
    icon: Cpu,
    description: "State-of-the-art Generative AI integrations utilizing Gemini Flash, GPT-4o, Claude 3.5, and open weights models.",
    useCase: "Automated business workflows, customer context analyzers, smart data agents, and RAG search pipelines.",
    perfMetric: "Over 120 tokens/sec live streaming response",
    bestPractices: ["Safe server-side token custody", "Strict system-prompt guardrails", "Hybrid prompt cache caching strategies"]
  }
];

export default function Ecosystem() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("nextjs");
  const selectedNode = TECH_ECOSYSTEM.find(n => n.id === selectedNodeId) || TECH_ECOSYSTEM[0];

  return (
    <section className="relative py-24 bg-background overflow-hidden z-10 border-t border-border" id="ecosystem">
      {/* Background ambient details */}
      <div className="absolute top-[10%] left-[20%] w-[450px] h-[450px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Block */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-mono tracking-widest text-accent font-bold uppercase block">
            Ecosystem Radar
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-foreground leading-tight">
            Our Technology Stack.
          </h2>
          <p className="text-foreground-secondary text-base md:text-lg max-w-2xl leading-relaxed">
            We build exclusively with the industry's most robust, performant, and future-proof technologies to ensure your application scales without rewrite.
          </p>
        </div>

        {/* Dual Column Layout: Interactive selector and details panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Panel: Tech Orbit Grid (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 rounded-3xl glass-panel border border-border relative overflow-hidden bg-surface-elevated/10">
            <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted block mb-6">
                Interactive Technology Stack (Click Node to Inspect)
              </span>

              {/* Grouped Nodes */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {TECH_ECOSYSTEM.map((node) => {
                  const NodeIcon = node.icon;
                  const isSelected = node.id === selectedNodeId;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-300 relative group cursor-pointer flex flex-col justify-between h-28 md:h-32 ${
                        isSelected
                          ? "bg-primary/10 border-primary shadow-md shadow-primary/5"
                          : "bg-surface/20 border-border hover:border-border-subtle hover:bg-surface-elevated/40"
                      }`}
                      id={`tech-node-${node.id}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? "bg-primary/20 text-white" : "bg-surface-elevated/50 text-foreground-secondary group-hover:text-foreground"
                        } transition-colors`}>
                          <NodeIcon className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <span className="text-[8px] font-mono uppercase text-foreground-muted font-bold">
                          {node.category}
                        </span>
                      </div>
                      
                      <div className="mt-2">
                        <h4 className={`text-xs md:text-sm font-display font-semibold transition-colors ${
                          isSelected ? "text-accent" : "text-foreground-secondary group-hover:text-foreground"
                        }`}>
                          {node.name}
                        </h4>
                        <span className="text-[9px] font-mono text-foreground-muted group-hover:text-foreground-secondary block mt-0.5 truncate">
                          {node.perfMetric}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Live Stack connection indicators */}
            <div className="border-t border-border pt-6 mt-8 flex flex-wrap gap-4 items-center justify-between text-xs text-foreground-muted font-mono relative z-10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span>Type Compiler: strict mode active</span>
              </div>
              <div className="text-foreground-muted">
                Lighthouse target: <span className="text-accent">100/100</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Focused Technology Details (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 p-8 rounded-3xl glass-panel border border-border relative overflow-hidden flex flex-col justify-between"
                id={`tech-details-${selectedNode.id}`}
              >
                <div className="space-y-6">
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono tracking-wider uppercase text-accent bg-accent/10 px-2.5 py-1 rounded-full font-bold">
                        {selectedNode.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-foreground-muted">
                      SYSREF_{selectedNode.id.toUpperCase()}_01
                    </span>
                  </div>

                  {/* Node Name */}
                  <div className="space-y-2">
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
                      {selectedNode.name}
                    </h3>
                    <p className="text-xs font-mono text-accent font-bold uppercase">
                      🚀 {selectedNode.perfMetric}
                    </p>
                  </div>

                  {/* Node Description */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted">
                      Capability Description
                    </span>
                    <p className="text-xs md:text-sm text-foreground-secondary leading-relaxed">
                      {selectedNode.description}
                    </p>
                  </div>

                  {/* Primary Use-case */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted">
                      Primary Application Inside FENORA Products
                    </span>
                    <p className="text-xs md:text-sm text-foreground-secondary italic leading-relaxed">
                      "{selectedNode.useCase}"
                    </p>
                  </div>

                  {/* FENORA Best Practices */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted block">
                      FENORA Engineering Standards
                    </span>
                    <div className="space-y-2">
                      {selectedNode.bestPractices.map((bp, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-foreground-secondary">
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                          <span>{bp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scope this specific technology CTA */}
                <div className="pt-6 border-t border-border mt-8 flex justify-between items-center text-xs">
                  <span className="text-foreground-muted font-mono">Ready to integrate?</span>
                  <a
                    href="#scoper"
                    className="inline-flex items-center gap-1.5 font-bold tracking-wider text-accent hover:text-foreground transition-colors uppercase group"
                    onClick={(e) => {
                      e.preventDefault();
                      const cta = document.getElementById("cta-section") || document.getElementById("footer");
                      cta?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Configure Stack
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
