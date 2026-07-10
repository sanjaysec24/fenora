import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Calendar, Clock, CheckCircle2, Sparkles } from "lucide-react";

interface CTAProps {
  onStartProject: () => void;
}

const AVAILABLE_DAYS = [
  { name: "Mon", date: "Jul 13", slots: ["09:00 AM", "11:30 AM", "02:00 PM"] },
  { name: "Tue", date: "Jul 14", slots: ["10:00 AM", "01:30 PM", "04:00 PM"] },
  { name: "Wed", date: "Jul 15", slots: ["09:30 AM", "11:00 AM", "03:00 PM"] },
  { name: "Thu", date: "Jul 16", slots: ["10:30 AM", "02:30 PM", "05:00 PM"] }
];

export default function CTA({ onStartProject }: CTAProps) {
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingCompleted, setBookingCompleted] = useState(false);

  const handleBookCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingEmail || !selectedSlot) return;
    setBookingCompleted(true);
    // Auto reset state after some time
    setTimeout(() => {
      setShowScheduler(false);
      setBookingCompleted(false);
      setSelectedSlot(null);
      setBookingEmail("");
    }, 5000);
  };

  const selectedDay = AVAILABLE_DAYS[selectedDayIdx];

  return (
    <section className="relative py-24 bg-background overflow-hidden z-10" id="final-cta">
      {/* Background radial overlays */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 z-0 pointer-events-none" />
      <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <div className="p-8 md:p-16 rounded-3xl glass-panel relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-mono tracking-widest text-accent font-bold uppercase block">
              Global Partnerships
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight">
              Let's Build the Future of Your Product.
            </h2>
            <p className="text-foreground-secondary text-sm md:text-base leading-relaxed font-sans">
              Whether you need to scale an existing SaaS pipeline, deploy advanced multi-agent AI ecosystems, or establish custom database security models, our elite engineering studio is ready.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={onStartProject}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent hover:brightness-110 active:scale-[0.98] text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/35 transition-all text-sm cursor-pointer hover:-translate-y-0.5"
                id="cta-start-project-btn"
              >
                Start Your Project
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowScheduler(!showScheduler)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface-elevated border border-border hover:bg-surface text-foreground font-semibold flex items-center justify-center gap-2 transition-all text-sm cursor-pointer"
                id="cta-schedule-call-btn"
              >
                <Calendar className="w-4 h-4 text-accent" />
                Book Discovery Call
              </button>
            </div>
          </div>

          {/* Interactive Scheduler Container */}
          <AnimatePresence>
            {showScheduler && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-12 p-6 md:p-8 rounded-2xl bg-surface/90 border border-border text-left space-y-6 max-w-2xl mx-auto relative z-20 font-sans"
                id="discovery-scheduler"
              >
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Book Your 15-Min Discovery Call</h3>
                    <p className="text-xs text-foreground-secondary">Select an available timeslot to meet with FENORA's Principal Architect.</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 border border-accent/30 text-accent font-mono font-bold">
                    SECURE CALL
                  </span>
                </div>

                {!bookingCompleted ? (
                  <div className="space-y-6">
                    {/* Days Selector */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase text-foreground-muted">1. SELECT DATE</span>
                      <div className="grid grid-cols-4 gap-2 font-sans">
                        {AVAILABLE_DAYS.map((day, idx) => (
                          <button
                            key={day.date}
                            onClick={() => {
                              setSelectedDayIdx(idx);
                              setSelectedSlot(null);
                            }}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                              selectedDayIdx === idx
                                ? "bg-primary/20 border-primary text-foreground"
                                : "bg-surface-elevated/30 border-border text-foreground-secondary hover:border-border-subtle hover:bg-surface-elevated/10"
                            }`}
                          >
                            <span className="text-[10px] uppercase font-mono block text-foreground-muted">{day.name}</span>
                            <span className="text-xs font-bold block">{day.date}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Slots Selector */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase text-foreground-muted">2. SELECT TIME SLOT (UTC-7 / PACIFIC)</span>
                      <div className="grid grid-cols-3 gap-2 font-sans">
                        {selectedDay.slots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              selectedSlot === slot
                                ? "bg-accent/20 border-accent text-accent font-bold"
                                : "bg-surface-elevated/30 border-border text-foreground-secondary hover:border-border-subtle hover:bg-surface-elevated/10"
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit email and Book */}
                    <form onSubmit={handleBookCall} className="space-y-4 border-t border-border pt-6">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="email"
                          required
                          placeholder="you@company.com"
                          value={bookingEmail}
                          onChange={(e) => setBookingEmail(e.target.value)}
                          className="flex-1 p-3 rounded-xl bg-surface border border-border text-foreground placeholder-foreground-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs transition-all font-sans"
                        />
                        <button
                          type="submit"
                          disabled={!selectedSlot}
                          className={`px-6 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                            selectedSlot
                              ? "bg-foreground text-background hover:bg-foreground-secondary cursor-pointer"
                              : "bg-surface-elevated text-foreground-muted cursor-not-allowed border border-border"
                          }`}
                        >
                          Book Selected Time
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="p-8 text-center space-y-3"
                  >
                    <div className="inline-flex p-3 rounded-full bg-accent/15 text-accent mb-2">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">Discovery Call Booked!</h4>
                    <p className="text-xs text-foreground-secondary max-w-sm mx-auto leading-relaxed">
                      We have logged your request. Calendar invitations and a video link for <strong>{selectedDay.name}, {selectedDay.date} at {selectedSlot}</strong> have been dispatched to <strong>{bookingEmail}</strong>.
                    </p>
                    <div className="text-[10px] text-foreground-muted font-mono">
                      (Resetting scheduler view shortly...)
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
