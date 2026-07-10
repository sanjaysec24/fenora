import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Award, Zap, Users, Code } from "lucide-react";

interface CountingNumberProps {
  value: number;
  decimals?: number;
  suffix?: string;
  duration?: number; // in seconds
}

function CountingNumber({ value, decimals = 0, suffix = "", duration = 2 }: CountingNumberProps) {
  const [currentValue, setCurrentValue] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(elementRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      
      setCurrentValue(progress * value);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [isInView, value, duration]);

  return (
    <span ref={elementRef}>
      {currentValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default function Metrics() {
  const metricsData = [
    {
      id: "metric-1",
      icon: Award,
      targetValue: 140,
      decimals: 0,
      suffix: "+",
      label: "Products Engineered",
      subText: "SaaS, Mobile, AI Platforms",
      color: "from-primary to-accent"
    },
    {
      id: "metric-2",
      icon: Code,
      targetValue: 32,
      decimals: 0,
      suffix: "",
      label: "Core Tech Stacks",
      subText: "React, Node.js, Python, GCP",
      color: "from-accent to-foreground"
    },
    {
      id: "metric-3",
      icon: Users,
      targetValue: 99.4,
      decimals: 1,
      suffix: "%",
      label: "Client Satisfaction",
      subText: "NPS Elite Rating Score",
      color: "from-primary to-accent"
    },
    {
      id: "metric-4",
      icon: Zap,
      targetValue: 8,
      decimals: 0,
      suffix: "+ Yrs",
      label: "Market Experience",
      subText: "Startups & Fortune 500s",
      color: "from-foreground to-foreground-secondary"
    }
  ];

  return (
    <section className="relative py-16 bg-background overflow-hidden z-10" id="metrics">
      <div className="max-w-7xl mx-auto px-6">
        {/* Border divider line */}
        <div className="w-full h-px bg-border mb-16" />

        {/* Section Heading Subtle label */}
        <div className="text-center mb-10">
          <span className="text-xs font-mono tracking-widest text-accent font-bold uppercase">
            FENORA Performance Indices
          </span>
        </div>

        {/* Bento Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {metricsData.map((item, index) => {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-6 md:p-8 rounded-2xl glass-panel glass-panel-hover overflow-hidden flex flex-col justify-between"
                id={item.id}
              >
                {/* Visual Glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none group-hover:bg-primary/10 transition-colors" />

                {/* Card Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="p-2.5 rounded-lg bg-surface-elevated/50 text-foreground-secondary">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-[10px] font-mono text-foreground-muted">
                    [0{index + 1}]
                  </span>
                </div>

                {/* Card Values */}
                <div>
                  <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${item.color}`}>
                      <CountingNumber 
                        value={item.targetValue} 
                        decimals={item.decimals} 
                        suffix={item.suffix} 
                      />
                    </span>
                  </h3>
                  <p className="text-sm font-semibold text-foreground tracking-tight">
                    {item.label}
                  </p>
                  <p className="text-xs text-foreground-secondary mt-1">
                    {item.subText}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom border divider line */}
        <div className="w-full h-px bg-border mt-16" />
      </div>
    </section>
  );
}
