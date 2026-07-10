import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Terminal, Shield, Cpu, RefreshCw, Layers, CheckCircle2 } from "lucide-react";

interface TerminalLine {
  text: string;
  type: "info" | "success" | "command" | "warning";
  delayMs: number;
}

const TERMINAL_SEQUENCE: TerminalLine[] = [
  { text: "fenora --init-infrastructure --production", type: "command", delayMs: 400 },
  { text: "Initializing secure multi-region VPC nodes... [OK]", type: "info", delayMs: 600 },
  { text: "Configuring LLM clusters on Gemini Pro & GCP... [OK]", type: "info", delayMs: 500 },
  { text: "Mounting database replicas across 3 availability zones...", type: "info", delayMs: 700 },
  { text: "Deploying production architecture artifacts to Cloud Run...", type: "info", delayMs: 800 },
  { text: "Securing OAuth 2.0 validation policies for global users...", type: "info", delayMs: 600 },
  { text: "Injecting edge caching handlers & CDN routes...", type: "info", delayMs: 400 },
  { text: "STATUS: LIVE (Multi-Region Cloud Active)", type: "success", delayMs: 500 }
];

export default function EngineeringTerminal() {
  const [activeLines, setActiveLines] = useState<TerminalLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sysCpu, setSysCpu] = useState(12);
  const [sysMemory, setSysMemory] = useState(3.4);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-150px" });

  // Real-time simulated indicators
  useEffect(() => {
    const interval = setInterval(() => {
      setSysCpu(Math.floor(Math.random() * 25) + 8);
      setSysMemory(parseFloat((Math.random() * 0.4 + 3.1).toFixed(2)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Trigger terminal typing and sequence loading
  useEffect(() => {
    if (!isInView) return;

    if (currentLineIndex < TERMINAL_SEQUENCE.length) {
      const line = TERMINAL_SEQUENCE[currentLineIndex];
      
      if (line.type === "command") {
        setIsTyping(true);
        let charIndex = 0;
        setTypedText("");
        
        const typeInterval = setInterval(() => {
          if (charIndex < line.text.length) {
            setTypedText((prev) => prev + line.text.charAt(charIndex));
            charIndex++;
          } else {
            clearInterval(typeInterval);
            setIsTyping(false);
            setActiveLines((prev) => [...prev, line]);
            setCurrentLineIndex((prev) => prev + 1);
          }
        }, 45);
        return () => clearInterval(typeInterval);
      } else {
        const timer = setTimeout(() => {
          setActiveLines((prev) => [...prev, line]);
          setCurrentLineIndex((prev) => prev + 1);
        }, line.delayMs);
        return () => clearTimeout(timer);
      }
    }
  }, [isInView, currentLineIndex]);

  const handleResetTerminal = () => {
    setActiveLines([]);
    setCurrentLineIndex(0);
    setTypedText("");
    setIsTyping(false);
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative py-20 bg-background border-b border-border overflow-hidden z-10" 
      id="terminal-status-section"
    >
      {/* Dynamic Background Glows */}
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] bg-primary/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      <div className="max-w-7xl mx-auto px-6 font-sans">
        {/* Title Block */}
        <div className="max-w-3xl mb-12 space-y-4">
          <span className="text-xs font-mono tracking-widest text-accent font-bold uppercase block">
            Infrastructure Console
          </span>
          <h2 className="text-2xl md:text-4xl font-display font-bold tracking-tight text-foreground leading-tight">
            Designed for Reliability. Engineered for Enterprise.
          </h2>
          <p className="text-foreground-secondary text-sm md:text-base max-w-2xl leading-relaxed font-sans">
            Take absolute control of your cloud assets and AI layers. Watch live system builds compile through our automated edge infrastructure pipelines.
          </p>
        </div>

        {/* Bento Board: Systems Terminal (Columns 1-8) and Cluster Health Stats (Columns 9-12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-sans">
          
          {/* Systems Terminal Frame */}
          <div className="lg:col-span-8 engineering-terminal-container bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl flex flex-col relative h-[380px] md:h-[420px]">
            {/* Top Bar Accent */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent pointer-events-none" />
            
            {/* Window Chrome Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-surface-elevated border-b border-border shrink-0 font-sans">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] font-mono text-foreground-muted ml-2 select-none font-bold">
                  root@fenora:~ (Edge Router V2)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleResetTerminal}
                  className="p-1 rounded hover:bg-surface-elevated/40 text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
                  title="Reset Sequence"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <span className="text-[9px] font-mono bg-accent/10 border border-accent/20 text-accent px-2 py-0.5 rounded font-bold">
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Terminal Screen Code Body */}
            <div className="flex-1 p-5 overflow-y-auto font-mono text-xs text-foreground space-y-2 select-text custom-scrollbar">
              <div className="text-foreground-muted text-[10px] pb-2 border-b border-border flex items-center justify-between font-bold">
                <span>SYSTEM CORE VERSION 12.4.9 (LINUX AMD64)</span>
                <span>UTC TIME: {new Date().toISOString().substring(0, 10)}</span>
              </div>

              {/* Sequence Output */}
              {activeLines.map((line, idx) => (
                <div key={idx} className="leading-relaxed">
                  {line.type === "command" && (
                    <p className="text-accent flex items-start gap-1.5 font-semibold">
                      <span>$</span>
                      <span>{line.text}</span>
                    </p>
                  )}
                  {line.type === "info" && (
                    <p className="text-foreground-secondary pl-4 flex items-start gap-2">
                      <span className="text-accent/50">&gt;&gt;</span>
                      <span>{line.text}</span>
                    </p>
                  )}
                  {line.type === "success" && (
                    <p className="text-success pl-4 font-bold flex items-center gap-2 bg-success/5 py-1 px-2.5 rounded border border-success/20 mt-3 shadow-[0_0_15px_rgba(22,163,74,0.1)]">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{line.text}</span>
                    </p>
                  )}
                </div>
              ))}

              {/* Dynamic typing line */}
              {isTyping && (
                <p className="text-accent flex items-center gap-1.5">
                  <span>$</span>
                  <span>{typedText}</span>
                  <span className="w-1.5 h-4 bg-accent inline-block animate-pulse shrink-0" />
                </p>
              )}

              {/* Waiting Cursor */}
              {!isTyping && currentLineIndex < TERMINAL_SEQUENCE.length && (
                <p className="text-accent/50 flex items-center gap-1.5 pl-4">
                  <span className="animate-pulse">_ Connecting compilation pipeline...</span>
                </p>
              )}
            </div>

            {/* Terminal Info Footer */}
            <div className="border-t border-border bg-background/40 px-4 py-2 flex items-center justify-between text-[9px] font-mono text-foreground-muted shrink-0 select-none font-bold">
              <span>Secure Shell: SSL AES-256-GCM</span>
              <span>Speed: 10 Gbps (Host v4)</span>
            </div>
          </div>

          {/* Cluster Status Metrics Column Panel */}
          <div className="lg:col-span-4 flex flex-col gap-4 font-sans">
            
            {/* Cluster Stats Container 1 */}
            <div className="p-6 rounded-2xl bg-surface border border-border hover:border-accent/20 transition-all duration-300 relative overflow-hidden flex flex-col justify-between flex-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-xl pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted font-bold">
                    Node Cluster Load
                  </span>
                  <Cpu className="w-4 h-4 text-accent" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-display font-bold tracking-tight text-foreground font-mono">
                    {sysCpu}%
                  </p>
                  <p className="text-[10px] text-foreground-secondary font-medium">
                    Average CPU Cluster usage across 12 zones
                  </p>
                </div>
              </div>
              <div className="w-full bg-surface-elevated/40 h-1.5 rounded-full overflow-hidden mt-4">
                <motion.div 
                  className="bg-accent h-full rounded-full" 
                  animate={{ width: `${sysCpu}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Cluster Stats Container 2 */}
            <div className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/20 transition-all duration-300 relative overflow-hidden flex flex-col justify-between flex-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted font-bold">
                    Memory Allocation
                  </span>
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-display font-bold tracking-tight text-foreground font-mono">
                    {sysMemory} GB
                  </p>
                  <p className="text-[10px] text-foreground-secondary font-medium">
                    Buffered caching active on global API server
                  </p>
                </div>
              </div>
              <div className="w-full bg-surface-elevated/40 h-1.5 rounded-full overflow-hidden mt-4">
                <motion.div 
                  className="bg-primary h-full rounded-full" 
                  animate={{ width: `${(sysMemory / 8) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Cluster Stats Container 3 */}
            <div className="p-5 rounded-2xl bg-surface border border-border flex items-center justify-between select-none">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-success/10 text-success">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">SSL Certification</p>
                  <p className="text-[10px] font-mono text-foreground-secondary uppercase font-bold">SHA-256 / AES VALIDATED</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-success bg-success/10 px-2 py-0.5 rounded border border-success/20 font-bold">
                SECURE
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
