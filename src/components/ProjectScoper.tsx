import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Sparkles, Send, Calendar, DollarSign, Clock, Layers, FileText } from "lucide-react";

interface ProjectScoperProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
}

interface SavedScope {
  id: string;
  service: string;
  budget: string;
  timeline: string;
  description: string;
  email: string;
  date: string;
  status: string;
  estimatedEffort: string;
  recommendedStack: string[];
}

const SERVICES_OPTIONS = [
  { id: "ai", label: "AI Engineering & Agent Integration", icon: Sparkles },
  { id: "fullstack", label: "Full-Stack Product Development", icon: Layers },
  { id: "saas", label: "SaaS Development & Scaling", icon: FileText },
  { id: "design", label: "Premium UI/UX Design", icon: FileText },
  { id: "mobile", label: "Cross-Platform Mobile Apps", icon: FileText },
  { id: "cloud", label: "Enterprise Cloud Infrastructure", icon: FileText },
];

const BUDGET_OPTIONS = [
  { id: "tier1", label: "$15,000 - $30,000", value: "medium" },
  { id: "tier2", label: "$30,000 - $60,000", value: "high" },
  { id: "tier3", label: "$60,000 - $120,000", value: "enterprise" },
  { id: "tier4", label: "$120,000+", value: "premium-enterprise" },
];

const TIMELINE_OPTIONS = [
  { id: "fast", label: "Under 6 Weeks", desc: "Express Delivery" },
  { id: "standard", label: "2 - 4 Months", desc: "Recommended Phase" },
  { id: "comprehensive", label: "4 - 6 Months", desc: "Iterative Release" },
];

export default function ProjectScoper({ isOpen, onClose, preselectedServiceId }: ProjectScoperProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedTimeline, setSelectedTimeline] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [submittedScope, setSubmittedScope] = useState<SavedScope | null>(null);
  const [savedScopes, setSavedScopes] = useState<SavedScope[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (preselectedServiceId) {
        setSelectedService(preselectedServiceId);
        setStep(2); // directly advance to budget step since service is preselected!
      } else {
        setSelectedService("");
        setStep(1);
      }
    }
  }, [isOpen, preselectedServiceId]);

  useEffect(() => {
    const loaded = localStorage.getItem("fenora_scopes");
    if (loaded) {
      try {
        setSavedScopes(JSON.parse(loaded));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Back button functionality
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleNext = () => {
    if (step === 1 && !selectedService) return;
    if (step === 2 && !selectedBudget) return;
    if (step === 3 && !selectedTimeline) return;
    setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail || !projectDescription) return;

    // Build some dynamic recommendations based on inputs
    const serviceLabel = SERVICES_OPTIONS.find(s => s.id === selectedService)?.label || selectedService;
    const budgetLabel = BUDGET_OPTIONS.find(b => b.id === selectedBudget)?.label || selectedBudget;
    const timelineLabel = TIMELINE_OPTIONS.find(t => t.id === selectedTimeline)?.label || selectedTimeline;

    let recommendedStack = ["React", "TypeScript", "Tailwind CSS"];
    let estimatedEffort = "Medium-scale agile sprint";

    if (selectedService === "ai") {
      recommendedStack = ["Google Gemini API", "Python / FastAPI", "LangChain", "Vector DB (Pinecone / pgvector)", "React"];
      estimatedEffort = "Advanced AI Engineering & Fine-tuning sprint";
    } else if (selectedService === "fullstack" || selectedService === "saas") {
      recommendedStack = ["Next.js", "Node.js (Express)", "PostgreSQL", "Redis", "Docker", "Stripe API"];
      estimatedEffort = "Multi-phase modular SaaS architecture";
    } else if (selectedService === "design") {
      recommendedStack = ["Figma Professional Workspace", "Framer Pro", "Tailwind Theme Tokens", "Storybook CSS Component Design"];
      estimatedEffort = "High-fidelity interactive prototype + Design System";
    } else if (selectedService === "mobile") {
      recommendedStack = ["React Native / Expo", "Tailwind (NativeWind)", "Firebase Auth", "Node.js Gateway", "App Store Connect Pipelines"];
      estimatedEffort = "Dual-platform native app architecture with headless API";
    } else if (selectedService === "cloud") {
      recommendedStack = ["Google Cloud Platform", "Terraform", "Kubernetes (GKE)", "GitHub Actions CI/CD", "Cloudflare Enterprise DNS"];
      estimatedEffort = "Secure multi-region infrastructure provisioning";
    }

    const newScope: SavedScope = {
      id: "FEN-" + Math.floor(Math.random() * 900000 + 100000),
      service: serviceLabel,
      budget: budgetLabel,
      timeline: timelineLabel,
      description: projectDescription,
      email: userEmail,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Analyzing Architectures",
      estimatedEffort,
      recommendedStack,
    };

    const updated = [newScope, ...savedScopes];
    setSavedScopes(updated);
    localStorage.setItem("fenora_scopes", JSON.stringify(updated));
    setSubmittedScope(newScope);

    // Sync to server-side Lead database
    fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        service: serviceLabel,
        budget: budgetLabel,
        timeline: timelineLabel,
        description: projectDescription,
        email: userEmail,
        phone: userPhone,
        estimatedEffort,
        recommendedStack
      })
    }).catch(err => console.error("Failed to sync lead server-side:", err));

    setStep(5);
  };

  const resetForm = () => {
    setStep(1);
    setSelectedService("");
    setSelectedBudget("");
    setSelectedTimeline("");
    setProjectDescription("");
    setUserEmail("");
    setUserPhone("");
    setSubmittedScope(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] cursor-pointer"
            id="scoper-backdrop"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-background border-l border-border z-[110] flex flex-col overflow-hidden text-foreground"
            id="scoper-panel"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-gradient-to-r from-background to-surface">
              <div className="font-sans">
                <span className="text-[10px] uppercase tracking-widest text-accent font-mono font-bold block mb-1">
                  Fenora Scoping Engine v2.0
                </span>
                <h3 className="text-xl font-display font-semibold tracking-tight text-foreground">
                  Start Your Project
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-surface-elevated/40 transition-colors text-foreground-secondary hover:text-foreground cursor-pointer"
                id="scoper-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            {step <= 4 && (
              <div className="h-1 bg-surface-elevated/40 w-full flex">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            )}

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 font-sans">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-lg font-display font-medium text-foreground mb-2">
                        What capability does your product need?
                      </h4>
                      <p className="text-sm text-foreground-secondary">
                        Select the primary area of development. Don't worry, we build hybrid full-stack solutions.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {SERVICES_OPTIONS.map((opt) => {
                        const isSelected = selectedService === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setSelectedService(opt.id)}
                            className={`p-4 rounded-xl text-left border flex items-start gap-4 transition-all duration-200 group cursor-pointer ${
                              isSelected
                                ? "bg-primary/10 border-primary text-foreground shadow-lg shadow-primary/5"
                                : "bg-surface border-border text-foreground-secondary hover:border-border-subtle hover:bg-surface-elevated/20"
                            }`}
                          >
                            <div className={`p-2.5 rounded-lg ${
                              isSelected ? "bg-primary/20 text-accent" : "bg-surface-elevated/40 text-foreground-muted group-hover:text-foreground"
                            }`}>
                              <opt.icon className="w-5 h-5" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="font-medium text-sm block text-foreground">{opt.label}</span>
                              <span className="text-xs text-foreground-secondary">Custom enterprise architecture workflow</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-lg font-display font-medium text-foreground mb-2">
                        What is your estimated investment budget?
                      </h4>
                      <p className="text-sm text-foreground-secondary">
                        This aligns our architectural planning, team distribution, and platform selection parameters.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {BUDGET_OPTIONS.map((opt) => {
                        const isSelected = selectedBudget === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setSelectedBudget(opt.id)}
                            className={`p-4 rounded-xl text-left border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "bg-primary/10 border-primary text-foreground"
                                : "bg-surface border-border text-foreground-secondary hover:border-border-subtle hover:bg-surface-elevated/20"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2.5 rounded-lg ${
                                isSelected ? "bg-primary/20 text-accent" : "bg-surface-elevated/40 text-foreground-muted"
                              }`}>
                                <DollarSign className="w-5 h-5" />
                              </div>
                              <span className="font-semibold text-sm text-foreground">{opt.label}</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected ? "bg-primary border-primary" : "border-border"
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 text-background" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-lg font-display font-medium text-foreground mb-2">
                        What is your ideal launch timeline?
                      </h4>
                      <p className="text-sm text-foreground-secondary">
                        We deploy highly optimized continuous integration flows to scale development velocity.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {TIMELINE_OPTIONS.map((opt) => {
                        const isSelected = selectedTimeline === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setSelectedTimeline(opt.id)}
                            className={`p-4 rounded-xl text-left border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "bg-primary/10 border-primary text-foreground"
                                : "bg-surface border-border text-foreground-secondary hover:border-border-subtle hover:bg-surface-elevated/20"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2.5 rounded-lg ${
                                isSelected ? "bg-primary/20 text-accent" : "bg-surface-elevated/40 text-foreground-muted"
                              }`}>
                                <Clock className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="font-medium text-sm block text-foreground">{opt.label}</span>
                                <span className="text-xs text-foreground-secondary">{opt.desc}</span>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected ? "bg-primary border-primary" : "border-border"
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 text-background" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div>
                      <h4 className="text-lg font-display font-medium text-foreground mb-1">
                        Tell us about your product concept
                      </h4>
                      <p className="text-xs text-foreground-secondary">
                        A few sentences on what you're building, target audience, and key technical challenges.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono tracking-wider text-foreground-muted uppercase font-bold">
                          Product Description
                        </label>
                        <textarea
                          required
                          value={projectDescription}
                          onChange={(e) => setProjectDescription(e.target.value)}
                          placeholder="e.g. We are building a modern SaaS platform that coordinates inventory logistics with intelligent routing algorithms..."
                          rows={4}
                          className="w-full p-4 rounded-xl bg-surface border border-border text-foreground placeholder-foreground-muted/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono tracking-wider text-foreground-muted uppercase font-bold">
                            Your Email Address
                          </label>
                          <input
                            type="email"
                            required
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="w-full p-3 rounded-xl bg-surface border border-border text-foreground placeholder-foreground-muted/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-mono tracking-wider text-foreground-muted uppercase font-bold">
                            Phone / Contact Handle (Optional)
                          </label>
                          <input
                            type="text"
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                            placeholder="e.g. +1 (555) 019-2834"
                            className="w-full p-3 rounded-xl bg-surface border border-border text-foreground placeholder-foreground-muted/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-primary to-accent hover:brightness-110 active:brightness-95 text-background font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all text-sm cursor-pointer"
                        id="scoper-submit-btn"
                      >
                        <Send className="w-4 h-4" />
                        Analyze & Generate Proposal
                      </button>
                    </form>
                  </motion.div>
                )}

                {step === 5 && submittedScope && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-2 py-4">
                      <div className="inline-flex p-3 rounded-full bg-accent/10 text-accent mb-2">
                        <Sparkles className="w-8 h-8 animate-pulse" />
                      </div>
                      <h4 className="text-xl font-display font-semibold text-foreground">
                        Project Architecture Compiled!
                      </h4>
                      <p className="text-sm text-foreground-secondary max-w-sm mx-auto">
                        We have logged your design requirements. An executive director from FENORA will contact you within 2 business hours.
                      </p>
                    </div>

                    {/* Generated Proposal Receipt Card */}
                    <div className="p-5 rounded-2xl border border-border bg-surface space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="font-mono text-xs text-accent font-bold">
                          PROPOSAL ID: {submittedScope.id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-accent border border-primary/30 font-mono font-bold">
                          Verified Architect
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                        <div>
                          <span className="text-foreground-secondary block font-mono font-bold">SERVICE</span>
                          <span className="text-foreground font-medium">{submittedScope.service}</span>
                        </div>
                        <div>
                          <span className="text-foreground-secondary block font-mono font-bold">TARGET BUDGET</span>
                          <span className="text-foreground font-medium">{submittedScope.budget}</span>
                        </div>
                        <div>
                          <span className="text-foreground-secondary block font-mono font-bold">TIMELINE</span>
                          <span className="text-foreground font-medium">{submittedScope.timeline}</span>
                        </div>
                        <div>
                          <span className="text-foreground-secondary block font-mono font-bold">CONTACT</span>
                          <span className="text-foreground font-medium truncate block max-w-[180px]">
                            {submittedScope.email}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <span className="text-foreground-secondary block text-xs font-mono font-bold">RECOMMENDED TECH STACK</span>
                        <div className="flex flex-wrap gap-1.5">
                          {submittedScope.recommendedStack.map((tech, i) => (
                            <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated border border-border text-foreground-secondary">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-surface-elevated/10 border border-border rounded-lg text-xs space-y-1 text-foreground-secondary">
                        <span className="text-accent font-mono font-bold block mb-1">
                          FENORA STRATEGY:
                        </span>
                        <p>{submittedScope.estimatedEffort}. We will prepare a blueprint detailing system services, custom API schemas, and deployment stages prior to our discovery call.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={resetForm}
                        className="flex-1 py-3 rounded-xl bg-surface-elevated/40 border border-border hover:bg-surface-elevated text-foreground font-medium text-xs transition-all cursor-pointer"
                        id="scoper-reset-btn"
                      >
                        Scope Another Project
                      </button>
                      <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-foreground text-background hover:opacity-90 font-medium text-xs transition-all cursor-pointer"
                        id="scoper-close-success-btn"
                      >
                        Back to Website
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sticky Actions in Drawer Footer */}
            {step <= 4 && (
              <div className="p-6 border-t border-border bg-background flex items-center justify-between font-sans">
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className={`px-4 py-2 text-xs font-semibold text-foreground-secondary hover:text-foreground transition-all ${
                    step === 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                  }`}
                  id="scoper-back-btn"
                >
                  Back
                </button>

                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        step === i ? "w-4 bg-accent" : "bg-surface-elevated"
                      }`}
                    />
                  ))}
                </div>

                {step < 4 ? (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-lg bg-foreground text-background hover:opacity-90 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    id="scoper-next-btn"
                  >
                    Next Step
                    <Calendar className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="w-[100px]" /> /* spacer */
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
