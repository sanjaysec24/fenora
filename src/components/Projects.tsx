import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, CheckCircle2, TrendingUp, Sparkles, Database, Loader2 } from "lucide-react";
import { Project } from "../types";

interface ProjectsProps {
  onStartProject: () => void;
  onNavigate: (path: string) => void;
}

const DEFAULT_CATEGORIES = ["All", "AI Platforms", "Fintech SaaS", "Enterprise Cloud"];

const STATIC_FALLBACK_PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "Synthetix AI",
    slug: "synthetix-ai",
    category: "AI Platforms",
    description: "An intelligent autonomous multi-agent system coordinating real-time global logistics and automated task scheduling across four continents.",
    metrics: [
      { label: "Routing Latency", value: "-42%" },
      { label: "Operational Savings", value: "$2.4M/yr" },
      { label: "Agent Response", value: "< 1.2s" }
    ],
    techStack: ["Gemini API", "Python", "React", "pgvector", "Docker", "FastAPI"],
    businessProblem: "Legacy logistics scheduling took hours of manual, error-prone human intervention, leading to systemic container transport delays, severe route conflict bottlenecks, and over $5M in annual idle-capital waste.",
    technicalSolution: "Engineered a custom multi-agent orchestration architecture leveraging the @google/genai SDK, real-time spatial heuristics, pgvector semantic search, and robust Redis event state queues to autonomously resolve conflicts instantly.",
    businessOutcome: "Fully automated 80% of container routing workflows with zero human touchpoints. Tripled total weekly processing capacity with zero operational staff expansion.",
    color: "from-primary to-accent",
    imageAccent: "rgba(0, 102, 255, 0.2)",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800",
    featured: true,
    status: "published",
    order: 1
  },
  {
    id: "project-2",
    title: "Pulse Billing",
    slug: "pulse-billing",
    category: "Fintech SaaS",
    description: "A hardened, multi-tenant billing core processing enterprise subscriptions with real-time multi-region compliance audits.",
    metrics: [
      { label: "Transaction Volume", value: "$180M+" },
      { label: "API Latency Core", value: "< 35ms" },
      { label: "Tax Compliance", value: "100.0%" }
    ],
    techStack: ["Next.js", "Express", "PostgreSQL", "Redis", "Stripe API", "AWS Lambda"],
    businessProblem: "The client suffered from severe transaction drop-offs (8.4%) during multi-region traffic spikes. Inflexible ledger structures also delayed multi-state VAT taxation reporting by up to three business weeks.",
    technicalSolution: "Architected a dual-write transaction journal on PostgreSQL with high-throughput Redis caching layers, microsecond-latency serverless taxation workers, and automated asynchronous audit verification pipelines.",
    businessOutcome: "Reduced payment processing failures to exactly 0.02%. Boosted localized VAT compliance auditing velocity by 1,400%, letting leadership close financial periods same-day.",
    color: "from-accent to-foreground",
    imageAccent: "rgba(0, 229, 255, 0.15)",
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800",
    featured: true,
    status: "published",
    order: 2
  },
  {
    id: "project-3",
    title: "AeroSpace Engine",
    slug: "aerospace-engine",
    category: "Enterprise Cloud",
    description: "Ultra-secure container orchestration platform and visual command dashboard designed for distributed flight-dynamics simulation models.",
    metrics: [
      { label: "System Uptime", value: "99.999%" },
      { label: "Cluster Boot-up", value: "4.2 Min" },
      { label: "Security Incidents", value: "0" }
    ],
    techStack: ["Google Cloud Platform", "Terraform", "Kubernetes", "TypeScript", "gRPC"],
    businessProblem: "Defense-grade simulator engineers experienced extreme infrastructure queue blockages, waiting over 1.5 hours to provision test server nodes, severely throttling active flight validation cycles.",
    technicalSolution: "Designed secure, declarative, immutable Terraform cloud blueprints running inside Kubernetes clusters, using gRPC message brokers to stream telemetry metrics at sub-millisecond speeds.",
    businessOutcome: "Enabled flight engineers to spin up sandboxed simulations on-demand in under five minutes. Cut total cloud resource expenditures by 38% via custom scale-to-zero configurations.",
    color: "from-foreground to-foreground-muted",
    imageAccent: "rgba(255, 255, 255, 0.1)",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
    featured: true,
    status: "published",
    order: 3
  }
];

export default function Projects({ onStartProject, onNavigate }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<Project[]>(STATIC_FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);

  // Active sub-tabs state for each project
  const [activeTabs, setActiveTabs] = useState<Record<string, "problem" | "solution" | "outcome">>({});

  // Dynamic Category Extraction
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data: Project[] = await res.json();
          if (data && data.length > 0) {
            setProjects(data);

            // Re-compile categories list dynamically from active inventory
            const parsedCategories = ["All", ...Array.from(new Set(data.map(p => p.category)))];
            setCategories(parsedCategories);

            // Initialize default open tabs for new projects
            const initialTabs: Record<string, "problem" | "solution" | "outcome"> = {};
            data.forEach(p => {
              initialTabs[p.id] = "problem";
            });
            setActiveTabs(initialTabs);
          }
        }
      } catch (err) {
        console.error("Projects API request failed. Running off static seed records:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();

    // Setup an interval to support Real-Time automatic UI updates
    const interval = setInterval(loadProjects, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (projId: string, tab: "problem" | "solution" | "outcome") => {
    setActiveTabs(prev => ({
      ...prev,
      [projId]: tab
    }));
  };

  const filteredProjects = projects.filter(
    (p) => activeCategory === "All" || p.category.toLowerCase() === activeCategory.toLowerCase()
  );

  return (
    <section className="relative py-24 bg-background overflow-hidden z-10 border-t border-border" id="work">
      {/* Background radial glows */}
      <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-glow opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 font-sans">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-mono tracking-widest text-accent font-bold uppercase block">
              Case Studies & Outcomes
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-foreground leading-tight">
              Our Products in action.
            </h2>
            <p className="text-foreground-secondary text-sm md:text-base leading-relaxed font-sans">
              We focus entirely on engineering solutions that move key business metrics: decreasing database read latency, reducing cloud expenditures, and driving enterprise revenue.
            </p>
          </div>

          {/* Filter Toolbar (Linear/Vercel style) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface border border-border rounded-xl self-start md:self-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-foreground text-background shadow-md font-semibold"
                    : "text-foreground-secondary hover:text-foreground hover:bg-surface-elevated/40"
                }`}
                id={`filter-btn-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Listings */}
        <div className="space-y-12">
          {loading && projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
              <p className="text-xs font-mono text-foreground-muted tracking-widest uppercase">Fetching portfolio grid...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((proj, index) => {
                const currentTab = activeTabs[proj.id] || "problem";
                return (
                  <motion.div
                    key={proj.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, type: "spring", damping: 25 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 md:p-12 rounded-3xl glass-panel relative overflow-hidden group border border-border"
                    id={proj.id}
                  >
                    {/* Glowing background accent on hover */}
                    <div
                      className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 z-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 10% 20%, ${proj.imageAccent || "rgba(0, 102, 255, 0.2)"} 0%, rgba(10, 10, 10, 0) 60%)`
                      }}
                    />

                    {/* Left Column: Specs, Interactive Case-Study Details (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-8 relative z-10 font-sans">
                      <div className="space-y-6">
                        {/* Meta */}
                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-surface-elevated/40 border border-border text-foreground-secondary">
                            {proj.category}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-accent font-bold uppercase">
                            <TrendingUp className="w-3.5 h-3.5 animate-pulse" /> Verified Outcome
                          </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-1.5">
                          <h3 
                            onClick={() => onNavigate(`/projects/${proj.slug}`)}
                            className="text-2xl md:text-3xl font-display font-bold text-foreground group-hover:text-accent transition-colors cursor-pointer inline-flex items-center gap-2"
                          >
                            {proj.title}
                            <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-accent" />
                          </h3>
                          <p className="text-xs md:text-sm text-foreground-secondary leading-relaxed max-w-xl font-sans">
                            {proj.description}
                          </p>
                        </div>

                        {/* Premium Tab Selector for Challenge, Solution, Impact */}
                        <div className="border-b border-border pb-2 flex gap-4 text-xs font-mono overflow-x-auto">
                          <button
                            onClick={() => handleTabChange(proj.id, "problem")}
                            className={`pb-2 relative cursor-pointer font-bold shrink-0 ${
                              currentTab === "problem" ? "text-foreground border-b-2 border-accent" : "text-foreground-muted hover:text-foreground"
                            }`}
                          >
                            01. Business Problem
                          </button>
                          <button
                            onClick={() => handleTabChange(proj.id, "solution")}
                            className={`pb-2 relative cursor-pointer font-bold shrink-0 ${
                              currentTab === "solution" ? "text-foreground border-b-2 border-accent" : "text-foreground-muted hover:text-foreground"
                            }`}
                          >
                            02. Technical Solution
                          </button>
                          <button
                            onClick={() => handleTabChange(proj.id, "outcome")}
                            className={`pb-2 relative cursor-pointer font-bold shrink-0 ${
                              currentTab === "outcome" ? "text-foreground border-b-2 border-accent" : "text-foreground-muted hover:text-foreground"
                            }`}
                          >
                            03. Business Impact
                          </button>
                        </div>

                        {/* Tab Contents */}
                        <div className="min-h-[100px] py-2 font-sans">
                          <AnimatePresence mode="wait">
                            {currentTab === "problem" && (
                              <motion.div
                                key="prob"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="space-y-2"
                              >
                                <span className="text-[10px] font-mono uppercase text-foreground-muted block font-bold">The Operational Challenge</span>
                                <p className="text-xs md:text-sm text-foreground-secondary leading-relaxed">
                                  {proj.businessProblem}
                                </p>
                              </motion.div>
                            )}
                            {currentTab === "solution" && (
                              <motion.div
                                key="sol"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="space-y-2"
                              >
                                <span className="text-[10px] font-mono uppercase text-accent block font-bold">Custom Architecture Designed</span>
                                <p className="text-xs md:text-sm text-foreground-secondary leading-relaxed">
                                  {proj.technicalSolution}
                                </p>
                              </motion.div>
                            )}
                            {currentTab === "outcome" && (
                              <motion.div
                                key="out"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="space-y-2"
                              >
                                <span className="text-[10px] font-mono uppercase text-success block font-bold">Measurable Business Impact</span>
                                <p className="text-xs md:text-sm text-foreground-secondary leading-relaxed font-sans">
                                  {proj.businessOutcome}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                      </div>

                      {/* Stacks used */}
                      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border">
                        {proj.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-surface-elevated/40 border border-border text-foreground-secondary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Key performance metrics & Book button (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-center gap-4 relative z-10 lg:pl-8 border-t lg:border-t-0 lg:border-l border-border pt-8 lg:pt-0 font-sans">
                      
                      {/* Interactive Cover Asset Display */}
                      {proj.coverImage && (
                        <div 
                          onClick={() => onNavigate(`/projects/${proj.slug}`)}
                          className="w-full aspect-[2/1] rounded-2xl overflow-hidden border border-border cursor-pointer relative group-hover:border-accent/40 transition-colors shadow-lg mb-2"
                        >
                          <img 
                            src={proj.coverImage} 
                            alt={proj.title}
                            className="w-full h-full object-cover select-none filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
                        </div>
                      )}
                      
                      <span className="text-[10px] font-mono tracking-wider text-foreground-muted uppercase block mb-1 font-bold">
                        Key Performance Metrics
                      </span>

                      <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 font-sans">
                        {proj.metrics.map((m, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-xl bg-surface-elevated/15 border border-border hover:border-border-subtle transition-colors flex flex-col justify-between"
                          >
                            <span className="text-[10px] text-foreground-secondary font-semibold mb-1 truncate">{m.label}</span>
                            <span className={`text-xl md:text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r ${proj.color || "from-primary to-accent"}`}>
                              {m.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA to start project */}
                      <button
                        onClick={() => onNavigate(`/projects/${proj.slug}`)}
                        className="mt-4 w-full py-3.5 rounded-xl bg-surface-elevated/40 border border-border hover:bg-surface-elevated text-foreground font-semibold flex items-center justify-center gap-2 transition-all text-xs cursor-pointer hover:border-border-subtle"
                        id={`project-cta-${proj.id}`}
                      >
                        Inspect Deep Analytics & Case Study
                        <ArrowUpRight className="w-3.5 h-3.5 text-foreground-muted" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
