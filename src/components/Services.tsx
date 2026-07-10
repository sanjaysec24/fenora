import { motion } from "motion/react";
import { Brain, Layers, Cpu, Paintbrush, Smartphone, Cloud, ArrowUpRight } from "lucide-react";

interface ServicesProps {
  onSelectService: (serviceId: string) => void;
}

const SERVICES = [
  {
    id: "ai",
    title: "AI Engineering",
    description: "Bespoke LLM integrations, conversational agents, custom fine-tuning, and vector-search embeddings built utilizing modern Gemini SDK systems.",
    icon: Brain,
    features: ["Intelligent multi-agent systems", "Retrieval Augmented Generation (RAG)", "Model fine-tuning & deployment", "Semantic search architectures"],
    gradient: "group-hover:border-primary/40 shadow-primary/5"
  },
  {
    id: "fullstack",
    title: "Full-Stack Development",
    description: "Robust, scalable, type-safe full-stack digital products engineered with Next.js, Node.js, and solid container infrastructures.",
    icon: Layers,
    features: ["Type-safe TypeScript APIs", "State management & caches", "Asynchronous task queues", "Payment gateways & subscriptions"],
    gradient: "group-hover:border-accent/40 shadow-accent/5"
  },
  {
    id: "saas",
    title: "SaaS Development",
    description: "From concept architecture to global deployment, we craft secure multi-tenant SaaS platforms with high compliance and modern analytics.",
    icon: Cpu,
    features: ["Multi-tenant db isolation", "Role-based access controls", "Real-time billing pipelines", "Performance instrumentation"],
    gradient: "group-hover:border-border shadow-foreground/5"
  },
  {
    id: "design",
    title: "UI/UX Design",
    description: "Stunning, high-end visual systems inspired by Apple and Stripe, focused on visual consistency, clear layouts, and conversion.",
    icon: Paintbrush,
    features: ["Design system architecture", "High-fidelity interactive mockups", "User flow & journey mapping", "Micro-interaction layouts"],
    gradient: "group-hover:border-primary/40 shadow-primary/5"
  },
  {
    id: "mobile",
    title: "Mobile Applications",
    description: "Polished cross-platform iOS and Android mobile apps leveraging native APIs, offline storage, and super smooth gesture engines.",
    icon: Smartphone,
    features: ["React Native / Expo ecosystems", "Biometric secure storages", "Push notification automation", "Local database sync pipelines"],
    gradient: "group-hover:border-accent/40 shadow-accent/5"
  },
  {
    id: "cloud",
    title: "Cloud Infrastructure",
    description: "Secure, high-availability Google Cloud and AWS systems provisioned via declarative Terraform scripts, complete with monitoring.",
    icon: Cloud,
    features: ["Infrastructure as Code (Terraform)", "Dockerized GKE container routing", "CI/CD automated release gates", "SOC2 compliance readiness"],
    gradient: "group-hover:border-border shadow-foreground/5"
  }
];

export default function Services({ onSelectService }: ServicesProps) {
  return (
    <section className="relative py-24 bg-background overflow-hidden z-10" id="services">
      {/* Background radial glows */}
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[30%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Block */}
        <div className="max-w-3xl mb-20 space-y-4">
          <span className="text-xs font-mono tracking-widest text-accent font-bold uppercase block">
            Capabilities Blueprint
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-foreground leading-tight">
            Premium Engineering for <br />
            Modern Enterprises.
          </h2>
          <p className="text-foreground-secondary text-base md:text-lg max-w-2xl leading-relaxed font-sans">
            We provide deep technological expertise across critical vectors of digital product development, delivering speed, scalability, and absolute type-safety.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {SERVICES.map((srv, index) => {
            const IconComponent = srv.icon;
            return (
              <motion.div
                key={srv.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                onClick={() => onSelectService(srv.id)}
                className={`p-8 rounded-2xl glass-panel group cursor-pointer transition-all duration-300 flex flex-col justify-between hover:scale-[1.02] border border-border hover:shadow-xl ${srv.gradient}`}
                id={`service-card-${srv.id}`}
              >
                <div>
                  {/* Icon & Index */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="p-3 rounded-xl bg-surface-elevated/40 text-accent group-hover:bg-primary/20 group-hover:text-foreground transition-all duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-foreground-muted font-medium">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-display font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs md:text-sm text-foreground-secondary leading-relaxed mb-6 font-sans">
                    {srv.description}
                  </p>

                  {/* Features bullet list */}
                  <div className="space-y-2 border-t border-border pt-5 mb-8">
                    {srv.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span className="text-xs text-foreground-secondary font-medium font-sans">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scope trigger button inside service */}
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-accent group-hover:text-foreground transition-colors uppercase pt-2">
                  Scope This Service
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
