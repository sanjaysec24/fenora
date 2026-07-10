import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Terminal, ArrowRight, Shield, Activity, 
  HelpCircle, Compass, Zap, Layers, Sparkles, X, CornerDownLeft
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  category: "Navigation" | "Core Services" | "Interactive Tools" | "Technologies";
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onStartProject: () => void;
}

export default function CommandCenter({ isOpen, onClose, onStartProject }: CommandCenterProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      // Autofocus input with slight timeout to allow entrance transitions
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Actions catalog
  const commands: CommandItem[] = [
    {
      id: "scope",
      title: "Launch Project Estimator",
      description: "Scope your product design, tech stack & budget",
      category: "Interactive Tools",
      icon: Sparkles,
      action: () => {
        onStartProject();
        onClose();
      }
    },
    {
      id: "srv-ai",
      title: "AI Engineering & LLMs",
      description: "Scale models, agent workflows & fine-tuning",
      category: "Core Services",
      icon: Terminal,
      action: () => {
        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
        onClose();
      }
    },
    {
      id: "srv-saas",
      title: "SaaS & Product Architecture",
      description: "High-performance full-stack web architectures",
      category: "Core Services",
      icon: Layers,
      action: () => {
        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
        onClose();
      }
    },
    {
      id: "srv-cloud",
      title: "Cloud Infrastructure & SecOps",
      description: "Multi-region Kubernetes, AWS, and GCP design",
      category: "Core Services",
      icon: Shield,
      action: () => {
        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
        onClose();
      }
    },
    {
      id: "eco",
      title: "Explore Technology Stack",
      description: "Interactive graph of Next.js, Supabase & Langchain",
      category: "Navigation",
      icon: Compass,
      action: () => {
        document.getElementById("ecosystem")?.scrollIntoView({ behavior: "smooth" });
        onClose();
      }
    },
    {
      id: "work",
      title: "Browse Case Studies",
      description: "View our selected global digital products",
      category: "Navigation",
      icon: Zap,
      action: () => {
        document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
        onClose();
      }
    },
    {
      id: "uptime",
      title: "View Network Infrastructure Status",
      description: "Live real-time performance and system checks",
      category: "Interactive Tools",
      icon: Activity,
      action: () => {
        const statsEl = document.getElementById("terminal-status-section");
        if (statsEl) {
          statsEl.scrollIntoView({ behavior: "smooth" });
        } else {
          document.getElementById("metrics")?.scrollIntoView({ behavior: "smooth" });
        }
        onClose();
      }
    },
    {
      id: "faq",
      title: "Read Client FAQs",
      description: "Answers about our process, IP ownership & timelines",
      category: "Navigation",
      icon: HelpCircle,
      action: () => {
        document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
        onClose();
      }
    },
    {
      id: "reload",
      title: "Trigger Boot Animation",
      description: "Rerun FENORA premium introductory sequence",
      category: "Interactive Tools",
      icon: Terminal,
      action: () => {
        window.location.reload();
      }
    }
  ];

  // Filtering based on search queries
  const filteredCommands = commands.filter((cmd) => {
    const searchStr = `${cmd.title} ${cmd.description} ${cmd.category}`.toLowerCase();
    return searchStr.includes(query.toLowerCase());
  });

  // Handle keyboard navigations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Handle clicking outside modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-background/80 backdrop-blur-md z-[99999] flex items-start justify-center pt-[12vh] px-4"
          id="command-palette-overlay"
        >
          <motion.div
            ref={containerRef}
            initial={{ scale: 0.97, y: 8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.97, y: 8, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl bg-background border border-border rounded-2xl overflow-hidden shadow-2xl flex flex-col relative"
            id="command-palette-window"
          >
            {/* Glowing Top Frame Accents */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none" />

            {/* Header Search Box Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border/40 relative">
              <Search className="w-5 h-5 text-foreground-secondary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search website..."
                className="w-full bg-transparent border-none outline-none text-foreground placeholder-foreground-muted/60 font-sans text-sm focus:ring-0 p-0"
              />
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono bg-surface-elevated/40 border border-border text-foreground-secondary px-1.5 py-0.5 rounded uppercase shadow-sm">
                  ESC
                </span>
                <button 
                  onClick={onClose}
                  className="p-1 rounded hover:bg-surface-elevated/40 text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List Body Area */}
            <div className="max-h-[380px] overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
              {filteredCommands.length > 0 ? (
                // Grouping entries dynamically by category
                Object.entries(
                  filteredCommands.reduce((acc, cmd) => {
                    if (!acc[cmd.category]) acc[cmd.category] = [];
                    acc[cmd.category].push(cmd);
                    return acc;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  }, {} as Record<string, CommandItem[]>)
                ).map(([category, items]) => (
                  <div key={category} className="space-y-1">
                    <div className="text-[9px] font-mono tracking-[0.2em] text-accent/80 font-bold uppercase px-3 pt-3 pb-1">
                      {category}
                    </div>
                    {items.map((item) => {
                      const ItemIcon = item.icon;
                      // Calculate global index in flat list to match selectedIndex
                      const globalIdx = filteredCommands.findIndex((c) => c.id === item.id);
                      const isSelected = selectedIndex === globalIdx;

                      return (
                        <div
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                            isSelected
                              ? "bg-surface-elevated/20 border border-border text-foreground"
                              : "border border-transparent text-foreground-secondary"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${
                              isSelected ? "bg-accent/15 text-accent" : "bg-surface-elevated/40 text-foreground-muted"
                            }`}>
                              <ItemIcon className="w-4 h-4" />
                            </div>
                            <div className="text-left font-sans">
                              <p className={`text-xs font-semibold ${isSelected ? "text-foreground" : "text-foreground-secondary"}`}>
                                {item.title}
                              </p>
                              <p className="text-[10px] text-foreground-muted font-medium mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <span className="flex items-center gap-1 text-[9px] font-mono text-accent tracking-wider font-bold bg-accent/10 border border-accent/20 px-2 py-0.5 rounded uppercase">
                                Action <CornerDownLeft className="w-2.5 h-2.5 inline" />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-foreground-muted space-y-2">
                  <Terminal className="w-8 h-8 mx-auto text-foreground-muted/60 animate-pulse" />
                  <p className="text-xs font-mono font-medium tracking-wide">
                    No results found for &quot;{query}&quot;
                  </p>
                  <p className="text-[10px] text-foreground-muted/80">
                    Try searching for &quot;SaaS&quot;, &quot;Globe&quot;, or &quot;AI&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Commands Bottom Info Status Bar */}
            <div className="border-t border-border/40 bg-surface/40 px-4 py-3 flex items-center justify-between text-[10px] font-mono text-foreground-muted">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="bg-surface-elevated/40 border border-border px-1 py-0.5 rounded">▲▼</span> Select
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-surface-elevated/40 border border-border px-1 py-0.5 rounded">⏎</span> Trigger
                </span>
              </div>
              <div className="text-accent/80 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                FENORA Terminal Shell V2.6
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
