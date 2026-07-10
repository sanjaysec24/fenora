import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Plus, Minus, MessageCircle } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-1",
    question: "What scale of projects does FENORA typically engineer?",
    answer: "We primarily build solutions for venture-backed startups (from Seed to Series B) and enterprise innovation groups. Our projects generally range from high-fidelity interactive MVPs ($15k - $30k) to comprehensive, enterprise-ready full-stack architectures ($60k - $120k+)."
  },
  {
    id: "faq-2",
    question: "What is the typical timeline for a complete product launch?",
    answer: "Our agile engineering sprints allow us to deploy high-fidelity interactive prototypes in under 6 weeks. A standard full-stack SaaS platform or mobile application, starting from Discover through global CDN launch, typically spans 2 to 4 months."
  },
  {
    id: "faq-3",
    question: "Do you offer post-launch support and fractional CTO services?",
    answer: "Absolutely. We view our relationships as long-term partnerships. We provide dedicated SLA-backed support, continuous system instrumentation (Sentry/Datadog), and bi-weekly product improvement cycles. Many clients retain us as a fractional CTO force."
  },
  {
    id: "faq-4",
    question: "How do you manage intellectual property (IP) and security compliance?",
    answer: "We establish bilateral NDA documentation prior to our workshops. All code repositories, design workspaces, and database structures are 100% owned by your company upon completion. We build strict enterprise-grade security rules and follow SOC2 compliance patterns."
  },
  {
    id: "faq-5",
    question: "Can FENORA integrate with our existing APIs, data layers, or legacy backends?",
    answer: "Yes. Our engineering studio specializes in modern API-first headless architectures. We regularly build custom API gateways that unify legacy PostgreSQL/Oracle systems, modern microservices, external payment gateways, and agentic AI models."
  }
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="relative py-24 bg-background overflow-hidden z-10" id="faqs">
      {/* Background radial overlays */}
      <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6">
        {/* Header Block */}
        <div className="text-center space-y-4 mb-20">
          <span className="text-xs font-mono tracking-widest text-accent font-bold uppercase block">
            Frequently Asked Queries
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-foreground leading-tight">
            Queries and Specifications.
          </h2>
          <p className="text-foreground-secondary text-sm md:text-base max-w-lg mx-auto font-sans">
            Find answers to standard project parameters, timelines, security requirements, and long-term SLA integrations.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-border bg-surface-elevated/10 overflow-hidden transition-all duration-300"
                id={item.id}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-elevated/20 transition-colors"
                  id={`${item.id}-trigger`}
                >
                  <span className="text-sm md:text-base font-semibold text-foreground tracking-tight">
                    {item.question}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-surface-elevated/40 text-foreground-muted transition-all duration-300 ${
                    isOpen ? "rotate-180 text-accent" : ""
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Content Panels */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-xs md:text-sm text-foreground-secondary leading-relaxed border-t border-border pt-4 font-sans">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Custom prompt contact link */}
        <div className="text-center mt-12 p-6 rounded-2xl bg-surface/50 border border-border flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto font-sans">
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="p-2.5 rounded-xl bg-primary/10 text-accent">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-xs font-semibold text-foreground block">Have a unique technical challenge?</span>
              <span className="text-[10px] text-foreground-muted">Our engineering directors are available for custom consultations.</span>
            </div>
          </div>
          <a
            href="mailto:partner@fenora.tech"
            className="text-xs font-semibold font-mono text-accent hover:text-foreground transition-colors"
          >
            partner@fenora.tech &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
