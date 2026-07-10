import React, { useState } from "react";
import { Mail, Phone, MapPin, Check } from "lucide-react";
import { FenoraLogo } from "./FenoraLogo";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
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

  return (
    <footer className="relative bg-background border-t border-border py-16 overflow-hidden z-10" id="app-footer">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-border">
          {/* Column 1: Brand Info (4 cols) */}
          <div className="md:col-span-4 space-y-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex flex-col items-start gap-1.5 group cursor-pointer text-left focus:outline-none"
              id="footer-logo-btn"
            >
              <div className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_var(--accent)]">
                <FenoraLogo className="h-9" />
              </div>
              <span className="text-[9px] font-mono text-foreground-muted tracking-wider uppercase font-bold mt-1">
                AI &amp; Full-Stack Product Engineering Studio
              </span>
            </button>

            <p className="text-xs text-foreground-secondary leading-relaxed max-w-sm font-sans">
              We engineer world-class, enterprise-grade AI algorithms, full-stack architectures, and custom SaaS networks. Powered by absolute technical excellence.
            </p>

            {/* Social Grid (Linear inspired raw links) */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <a href="https://github.com/fenoratech" target="_blank" rel="noreferrer" className="text-foreground-muted hover:text-foreground transition-colors">Github</a>
              <span className="text-border">/</span>
              <a href="https://linkedin.com/company/fenora" target="_blank" rel="noreferrer" className="text-foreground-muted hover:text-foreground transition-colors">LinkedIn</a>
              <span className="text-border">/</span>
              <a href="https://x.com/fenoratech" target="_blank" rel="noreferrer" className="text-foreground-muted hover:text-foreground transition-colors">X / Twitter</a>
            </div>
          </div>

          {/* Column 2: Navigation Links (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-foreground-secondary">
              Navigation
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              {["services", "work", "process", "why-choose", "faqs"].map((sec) => (
                <button
                  key={sec}
                  onClick={() => scrollToSection(sec)}
                  className="text-foreground-muted hover:text-foreground transition-colors text-left cursor-pointer uppercase font-mono tracking-wider"
                  id={`footer-link-${sec}`}
                >
                  {sec.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Contacts Info (3 cols) */}
          <div className="md:col-span-3 space-y-4 text-xs text-foreground-secondary">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-foreground-secondary">
              Studio Locations
            </h4>

            <div className="space-y-3 font-sans">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <span>One San Francisco Plaza, Suite 400<br />San Francisco, CA 94104</span>
              </div>

              <div className="flex items-center gap-2 border-t border-border pt-3">
                <Mail className="w-4 h-4 text-accent" />
                <a href="mailto:partner@fenora.tech" className="hover:text-foreground transition-colors">partner@fenora.tech</a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                <span>+1 (800) 555-FENORA</span>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter capture (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-foreground-secondary">
              FENORA Dispatch
            </h4>
            <p className="text-xs text-foreground-secondary leading-relaxed font-sans">
              Recieve technical post-mortems and architecture frameworks. No sales pitch.
            </p>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-1 font-sans">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 p-2.5 rounded-lg bg-surface border border-border text-foreground placeholder-foreground-muted focus:border-primary outline-none text-xs transition-all"
                />
                <button
                  type="submit"
                  className="px-3 rounded-lg bg-foreground text-background hover:bg-foreground-secondary text-xs font-bold transition-all cursor-pointer"
                  id="footer-newsletter-btn"
                >
                  Join
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 text-xs text-accent font-semibold font-sans">
                <Check className="w-4 h-4" /> Joined dispatch roster.
              </div>
            )}
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[10px] font-mono text-foreground-muted">
          <span>&copy; {new Date().getFullYear()} FENORA Technologies Inc. All Rights Reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-foreground-secondary transition-colors">Privacy Charter</a>
            <span>/</span>
            <a href="#terms" className="hover:text-foreground-secondary transition-colors">Service Level Agreements</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
