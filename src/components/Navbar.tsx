import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, Search, Activity, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FenoraLogo } from "./FenoraLogo";
import CommandCenter from "./CommandCenter";
import ThemeSwitcher, { MobileThemeSwitcher } from "./ThemeSwitcher";

interface NavbarProps {
  onStartProject: () => void;
  onNavigate?: (path: string) => void;
}

export default function Navbar({ onStartProject, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Command palette global key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandCenterOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    
    if (window.location.pathname !== "/") {
      if (onNavigate) {
        onNavigate("/");
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
      } else {
        window.location.href = `/#${id}`;
      }
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const navLinks: { label: string; target: string; isPath?: boolean }[] = [
    { label: "Services", target: "services" },
    { label: "Work", target: "work" },
    { label: "Process", target: "process" },
    { label: "Why FENORA", target: "why-choose" },
    { label: "FAQs", target: "faqs" }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border py-3"
            : "bg-transparent py-5"
        }`}
        id="app-navbar"
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Left: Brand Logo & Interactive Glow */}
          <div className="flex items-center gap-4 lg:gap-8 shrink-0">
            <button
              onClick={() => {
                if (onNavigate) {
                  onNavigate("/");
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="flex items-center gap-3 group cursor-pointer text-left relative focus:outline-none"
              id="navbar-logo-btn"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]">
                <FenoraLogo glow={isHovered} />
              </div>
            </button>

            {/* Desktop Systems Live Operational Badge */}
            <div 
              className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated/40 border border-border-subtle font-mono text-[9px] text-foreground-secondary select-none cursor-pointer hover:border-success/30 hover:bg-success/5 transition-all duration-300"
              id="live-systems-status-badge"
              onClick={() => setIsCommandCenterOpen(true)}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="text-success font-bold uppercase">Systems Operational</span>
              <span className="text-foreground-muted">//</span>
              <span>99.99% Uptime</span>
            </div>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  if (link.isPath && onNavigate) {
                    onNavigate("/" + link.target);
                  } else {
                    scrollToSection(link.target);
                  }
                }}
                className="text-xs lg:text-sm text-foreground-secondary hover:text-foreground transition-colors cursor-pointer relative py-1 group font-medium"
                id={`nav-link-${link.target}`}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </nav>

          {/* Right: Search command & Start Project CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search command center trigger pill */}
            <button
              onClick={() => setIsCommandCenterOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-surface hover:bg-surface-elevated border border-border text-xs text-foreground-secondary hover:text-foreground flex items-center gap-2 cursor-pointer transition-all duration-200 shadow-inner group"
              id="navbar-search-trigger-pill"
              title="Search commands (⌘K / Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-foreground-muted group-hover:text-accent transition-colors" />
              <span className="font-mono text-[10px] text-foreground-muted font-medium">Search</span>
              <kbd className="font-mono text-[9px] bg-surface-elevated border border-border px-1 py-0.2 rounded text-foreground-muted select-none">
                ⌘K
              </kbd>
            </button>
            
            <ThemeSwitcher />

            <button
              onClick={onStartProject}
              className="px-4 py-2 rounded-lg bg-foreground hover:bg-foreground-secondary text-background text-xs font-bold flex items-center gap-1 shadow-lg shadow-black/5 dark:shadow-white/5 cursor-pointer hover:-translate-y-0.5 transition-all duration-200 shrink-0 font-sans"
              id="navbar-cta-btn"
            >
              Start Project
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Search & Menu Toggle Buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsCommandCenterOpen(true)}
              className="p-2 rounded-lg bg-surface-elevated border border-border text-foreground-secondary"
              id="mobile-search-trigger"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-surface-elevated border border-border text-foreground-secondary hover:text-foreground cursor-pointer"
              id="mobile-nav-toggle"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[60px] bg-background/95 backdrop-blur-xl border-b border-border z-40 md:hidden p-6 shadow-2xl flex flex-col gap-6"
            id="mobile-nav-menu"
          >
            {/* Live infrastructure operational badge inside mobile drawer */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-elevated/40 border border-border font-mono text-[9px] text-foreground-secondary justify-center">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success"></span>
              </span>
              <span className="text-success font-bold uppercase">Systems Operational</span>
              <span className="text-foreground-muted">//</span>
              <span>99.99% Uptime</span>
            </div>

            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    if (link.isPath && onNavigate) {
                      setIsMobileMenuOpen(false);
                      onNavigate("/" + link.target);
                    } else {
                      scrollToSection(link.target);
                    }
                  }}
                  className="text-left py-2 text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors cursor-pointer"
                  id={`mobile-link-${link.target}`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <MobileThemeSwitcher />

            <div className="border-t border-border pt-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onStartProject();
                }}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white font-semibold text-center text-xs flex items-center justify-center gap-1 shadow-lg shadow-primary/20 cursor-pointer"
                id="mobile-navbar-cta"
              >
                Start Your Project
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Interactive Command Center Search Overlay */}
      <CommandCenter 
        isOpen={isCommandCenterOpen}
        onClose={() => setIsCommandCenterOpen(false)}
        onStartProject={onStartProject}
      />
    </>
  );
}
