import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Calendar, Building2, Tag, Globe, Github, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { Project } from "../types";

interface ProjectDetailProps {
  slug: string;
  onNavigate: (path: string) => void;
  onStartProject: () => void;
}

export default function ProjectDetail({ slug, onNavigate, onStartProject }: ProjectDetailProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/projects/by-slug/${slug}?includeDrafts=true`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Case study not found.");
          }
          throw new Error("Failed to load project details.");
        }
        const data = await res.json();
        setProject(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4" id="project-detail-loading">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-sm font-mono text-foreground-muted uppercase tracking-widest">Compiling Case Study...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4" id="project-detail-error">
        <div className="glass-panel border border-border p-8 rounded-2xl max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-xl font-display font-bold">Failed to load Case Study</h2>
          <p className="text-sm text-foreground-secondary leading-relaxed">
            {error || "The requested case study could not be located in our systems."}
          </p>
          <button
            onClick={() => onNavigate("/")}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-surface border border-border hover:bg-surface-elevated text-foreground text-xs font-mono transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Main Site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen relative font-sans selection:bg-primary selection:text-background text-foreground transition-colors duration-500 antialiased" id={`project-detail-${project.slug}`}>
      {/* Background ambient decorative flares */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-[30%] right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10">
        {/* Navigation back and quick breadcrumb */}
        <button
          onClick={() => onNavigate("/")}
          className="group mb-8 inline-flex items-center gap-2 text-xs font-mono text-foreground-secondary hover:text-foreground transition-colors cursor-pointer"
          id="btn-back-to-portfolio"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO PORTFOLIO</span>
        </button>

        {/* Cinematic Case Study Hero Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Hero Left: Title & Headline (7 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs px-3 py-1 rounded-full bg-surface-elevated/40 border border-border text-foreground-secondary font-mono font-medium">
                {project.category}
              </span>
              {project.featured && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> FEATURED PRODUCT
                </span>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight leading-tight text-foreground">
              {project.title}
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-foreground-secondary font-light max-w-2xl leading-relaxed">
              {project.description}
            </p>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-4 pt-2">
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-semibold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  <Globe className="w-4 h-4" /> Live Application <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground font-semibold text-xs hover:bg-surface active:scale-95 transition-all"
                >
                  <Github className="w-4 h-4" /> Repository <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Hero Right: Project Meta Dashboard Cards (4 cols) */}
          <div className="lg:col-span-4 bg-surface border border-border rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-foreground-secondary border-b border-border/40 pb-2">
              Project Parameters
            </h3>

            <div className="space-y-4 text-xs font-mono">
              {project.clientName && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-foreground-muted flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Client</span>
                  <span className="text-foreground font-semibold">{project.clientName}</span>
                </div>
              )}
              {project.industry && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-foreground-muted flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Industry</span>
                  <span className="text-foreground font-semibold">{project.industry}</span>
                </div>
              )}
              {project.startDate && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-foreground-muted flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Start Date</span>
                  <span className="text-foreground font-semibold">{project.startDate}</span>
                </div>
              )}
              {project.completionDate && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-foreground-muted flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Completed</span>
                  <span className="text-foreground font-semibold">{project.completionDate}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-1">
                <span className="text-foreground-muted flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Status</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase border ${
                  project.status === "published" 
                    ? "bg-success/10 border-success/20 text-success" 
                    : "bg-warning/10 border-warning/20 text-warning"
                }`}>
                  {project.status}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Cover Photo */}
        {project.coverImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-[40vh] md:h-[55vh] rounded-3xl overflow-hidden border border-border relative mb-16 shadow-xl"
            id="case-study-cover-container"
          >
            <img
              src={project.coverImage}
              alt={project.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none filter brightness-95"
            />
            {/* Ambient vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 pointer-events-none" />
          </motion.div>
        )}

        {/* Outcome Metrics Bento Grid */}
        <div className="mb-16">
          <h2 className="text-xs font-mono font-bold tracking-[0.25em] text-accent uppercase mb-6">
            // MEASURED KEY PERFORMANCE OUTCOMES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {project.metrics.map((metric, idx) => (
              <div
                key={idx}
                className="p-6 md:p-8 rounded-2xl bg-surface border border-border hover:border-border-subtle transition-all flex flex-col justify-between space-y-4"
              >
                <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase font-semibold">
                  {metric.label}
                </span>
                <span className={`text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r ${project.color || "from-primary to-accent"}`}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Engineering Case Study Narrative Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Left Column: Deep Narrative Breakdown (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* 1. Operational Challenge */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-accent">01 //</span>
                <h3 className="text-xl md:text-2xl font-display font-bold text-foreground">
                  The Operational Challenge
                </h3>
              </div>
              <p className="text-sm md:text-base text-foreground-secondary leading-relaxed font-sans">
                {project.businessProblem}
              </p>
            </div>

            {/* 2. Technical Solution */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-accent">02 //</span>
                <h3 className="text-xl md:text-2xl font-display font-bold text-foreground">
                  Custom Engineering Solution
                </h3>
              </div>
              <p className="text-sm md:text-base text-foreground-secondary leading-relaxed font-sans">
                {project.technicalSolution}
              </p>
            </div>

            {/* 3. Business Impact */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-success">03 //</span>
                <h3 className="text-xl md:text-2xl font-display font-bold text-foreground">
                  Strategic Business Outcomes
                </h3>
              </div>
              <p className="text-sm md:text-base text-foreground-secondary leading-relaxed font-sans">
                {project.businessOutcome}
              </p>
            </div>

          </div>

          {/* Right Column: Technology and Gallery Assets (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Tech stack container */}
            <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-foreground-secondary">
                TECHNOLOGY INVENTORY
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-foreground-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Image Gallery */}
            {project.galleryImages && project.galleryImages.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-foreground-secondary">
                  PROJECT CAPTURES
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {project.galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-video rounded-xl overflow-hidden border border-border hover:scale-105 transition-transform cursor-pointer"
                    >
                      <img
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Dynamic Inner Project Recommendation Section */}
        <div className="border-t border-border pt-16 text-center space-y-6">
          <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground">
            Have a similar product vision?
          </h2>
          <p className="text-sm md:text-base text-foreground-secondary max-w-xl mx-auto leading-relaxed">
            Let's design and engineer an enterprise-grade digital solution tailored to optimize your metrics and streamline workflows.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onStartProject}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent hover:brightness-110 active:scale-[0.98] text-white font-semibold shadow-lg shadow-primary/20 transition-all text-sm cursor-pointer"
            >
              Book Free Discovery Call
            </button>
            <button
              onClick={() => onNavigate("/")}
              className="px-8 py-4 rounded-xl bg-surface border border-border text-foreground font-semibold hover:bg-surface-elevated transition-all text-sm cursor-pointer"
            >
              Browse Other Cases
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
