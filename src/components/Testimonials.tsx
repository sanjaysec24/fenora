import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight, MessageSquareQuote, ShieldCheck } from "lucide-react";

const TESTIMONIALS = [
  {
    id: "test-1",
    name: "Sarah Jenkins",
    role: "VP of Engineering",
    company: "Synthetix Corp",
    avatar: "S",
    avatarColor: "bg-primary",
    content: "FENORA did not just build our platform; they engineered our entire technical strategy. Their agentic AI workflows decreased routing latencies by 42% in under 6 weeks. They operate with an elite level of discipline, type-safety, and design craft.",
    rating: 5,
    outcome: "Latency reduced by 42%"
  },
  {
    id: "test-2",
    name: "Michael Chang",
    role: "Chief Executive Officer",
    company: "Pulse Billing",
    avatar: "M",
    avatarColor: "bg-accent",
    content: "We struggled with scaling our billing architectures across multiple European jurisdictions. FENORA designed a multi-tenant isolation database and unified Stripe pipeline that handled over $180M seamlessly. They are our permanent fractional CTO.",
    rating: 5,
    outcome: "Processed $180M+ securely"
  },
  {
    id: "test-3",
    name: "David Miller",
    role: "Co-Founder",
    company: "AeroSpace Simulation",
    avatar: "D",
    avatarColor: "bg-foreground-muted",
    content: "The team's mastery of declarative infrastructure as code via GCP Terraform is exceptional. They automated our entire dev pipeline, bringing server spin-up times down to minutes with complete security rules. Highly recommended engineering group.",
    rating: 5,
    outcome: "Server provisioning under 5 mins"
  }
];

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[activeIdx];

  return (
    <section className="relative py-24 bg-background overflow-hidden z-10" id="testimonials">
      {/* Background visual indicators */}
      <div className="absolute top-[50%] right-[10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Block */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-mono tracking-widest text-accent font-bold uppercase block">
            Partner Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-foreground leading-tight">
            Trusted by Innovators.
          </h2>
          <p className="text-foreground-secondary text-sm md:text-base max-w-xl font-sans">
            Read how startups and enterprises leverage FENORA to build faster, deploy securely, and achieve sustainable competitive advantage.
          </p>
        </div>

        {/* Carousel & Bento Card layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch font-sans">
          {/* Main active testimonial card (7 cols) */}
          <div className="lg:col-span-8">
            <div className="p-8 md:p-12 rounded-3xl glass-panel relative overflow-hidden h-full flex flex-col justify-between">
              {/* Giant quote background icon */}
              <div className="absolute top-8 right-8 text-foreground/[0.03] pointer-events-none z-0">
                <MessageSquareQuote className="w-24 h-24" />
              </div>

              <div className="relative z-10 space-y-6">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 fill-accent text-accent" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-lg md:text-xl text-foreground font-medium leading-relaxed font-sans">
                  "{current.content}"
                </blockquote>
              </div>

              {/* Author Info */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-border pt-8 mt-8">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${current.avatarColor} text-white flex items-center justify-center font-bold text-lg`}>
                    {current.avatar}
                  </div>
                  <div>
                    <span className="text-base font-semibold text-foreground block">{current.name}</span>
                    <span className="text-xs text-foreground-secondary">{current.role} at <span className="text-foreground font-medium">{current.company}</span></span>
                  </div>
                </div>

                {/* Business outcome badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/15 border border-primary/25 self-start sm:self-center">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span className="text-xs font-mono font-bold text-accent uppercase">{current.outcome}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selector Sidebar / Stats card (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4 p-8 rounded-3xl glass-panel bg-surface">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-wider text-foreground-muted uppercase block">
                Partner Grid Navigation
              </span>

              <div className="space-y-2">
                {TESTIMONIALS.map((test, idx) => {
                  const isSelected = activeIdx === idx;
                  return (
                    <button
                      key={test.id}
                      onClick={() => setActiveIdx(idx)}
                      className={`w-full p-4 rounded-xl text-left border flex items-center justify-between transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "bg-surface-elevated text-foreground border-border"
                          : "bg-transparent border-transparent text-foreground-muted hover:text-foreground"
                      }`}
                      id={`testimonial-tab-${test.id}`}
                    >
                      <div className="space-y-0.5 font-sans">
                        <span className="font-semibold text-xs block">{test.name}</span>
                        <span className="text-[10px] text-foreground-secondary">{test.company}</span>
                      </div>

                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Carousel navigation controls */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-foreground-muted font-mono">
                <span>0{activeIdx + 1}</span>
                <span>/</span>
                <span>0{TESTIMONIALS.length}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-lg bg-surface-elevated/40 border border-border text-foreground-secondary hover:text-foreground transition-colors cursor-pointer"
                  id="testimonial-prev-btn"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-lg bg-surface-elevated/40 border border-border text-foreground-secondary hover:text-foreground transition-colors cursor-pointer"
                  id="testimonial-next-btn"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
