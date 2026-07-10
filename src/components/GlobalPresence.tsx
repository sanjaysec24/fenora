import React, { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Globe, Users, Network, Compass, Layers } from "lucide-react";

interface CityNode {
  id: string;
  name: string;
  region: string;
  localTimeStr: string;
  uptime: string;
  ping: string;
  xPercent: number; // coordinates for the visual world grid map
  yPercent: number;
}

const GLOBAL_OFFICES: CityNode[] = [
  { id: "sf", name: "San Francisco", region: "North America", localTimeStr: "PST (UTC-8)", uptime: "99.99%", ping: "22ms", xPercent: 18, yPercent: 32 },
  { id: "london", name: "London", region: "Europe", localTimeStr: "GMT (UTC+0)", uptime: "100%", ping: "14ms", xPercent: 48, yPercent: 24 },
  { id: "berlin", name: "Berlin", region: "Europe", localTimeStr: "CET (UTC+1)", uptime: "99.98%", ping: "18ms", xPercent: 54, yPercent: 26 },
  { id: "dubai", name: "Dubai", region: "Middle East", localTimeStr: "GST (UTC+4)", uptime: "100%", ping: "28ms", xPercent: 64, yPercent: 38 },
  { id: "bangalore", name: "Bangalore", region: "South Asia", localTimeStr: "IST (UTC+5.5)", uptime: "99.99%", ping: "35ms", xPercent: 72, yPercent: 46 },
  { id: "singapore", name: "Singapore", region: "Southeast Asia", localTimeStr: "SGT (UTC+8)", uptime: "99.99%", ping: "32ms", xPercent: 78, yPercent: 52 },
  { id: "tokyo", name: "Tokyo", region: "East Asia", localTimeStr: "JST (UTC+9)", uptime: "100%", ping: "41ms", xPercent: 86, yPercent: 33 }
];

export default function GlobalPresence() {
  const [selectedOffice, setSelectedOffice] = useState<CityNode>(GLOBAL_OFFICES[0]);

  return (
    <section className="relative py-24 bg-background border-b border-border overflow-hidden z-10" id="global-presence">
      {/* Background visual graphics */}
      <div className="absolute top-[30%] right-[10%] w-[550px] h-[550px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[450px] h-[450px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 font-sans">
        {/* Header content */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono tracking-widest text-accent font-bold uppercase block">
            Worldwide Network Operations
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-foreground leading-tight">
            Building Products For Global Teams.
          </h2>
          <p className="text-foreground-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-sans">
            From San Francisco to Tokyo, FENORA operates a highly reliable, low-latency deployment net. We align our developers and assets with your core operational regions.
          </p>
        </div>

        {/* Bento Board Panel Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch font-sans">
          
          {/* Left panel: World Grid Vector Map and Live Pulse Nodes (8 Columns) */}
          <div className="lg:col-span-8 p-6 md:p-8 rounded-2xl bg-surface border border-border relative overflow-hidden flex flex-col justify-between min-h-[360px] md:min-h-[460px]">
            {/* Ambient map backing lines */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            
            <div className="relative z-10 flex items-center justify-between border-b border-border pb-4 mb-4 select-none font-sans">
              <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted font-bold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-accent animate-spin-slow" />
                Intercontinental Connectivity Topology
              </span>
              <span className="text-[9px] font-mono text-success bg-success/10 px-2 py-0.5 rounded border border-success/20 font-bold uppercase animate-pulse">
                Global Routes Sync: Active
              </span>
            </div>

            {/* Visual World Interactive Canvas Map Container */}
            <div className="flex-1 relative w-full h-[220px] md:h-[300px] bg-background/30 rounded-xl border border-border overflow-hidden flex items-center justify-center">
              {/* World outline placeholder representation using SVG paths or stylish clean bento dots */}
              <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
                <svg className="w-full h-full text-foreground/40" viewBox="0 0 1000 500" fill="currentColor">
                  {/* Styled minimalist circles representing continents for sleek design */}
                  <circle cx="200" cy="180" r="100" />
                  <circle cx="500" cy="150" r="70" />
                  <circle cx="600" cy="220" r="50" />
                  <circle cx="750" cy="240" r="90" />
                  <circle cx="850" cy="170" r="60" />
                </svg>
              </div>

              {/* Dynamic Connecting Laser SVG Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                {GLOBAL_OFFICES.map((node, index) => {
                  if (index === 0) return null;
                  const prevNode = GLOBAL_OFFICES[index - 1];
                  return (
                    <motion.line
                      key={`line-${index}`}
                      x1={`${prevNode.xPercent}%`}
                      y1={`${prevNode.yPercent}%`}
                      x2={`${node.xPercent}%`}
                      y2={`${node.yPercent}%`}
                      stroke="var(--accent)"
                      opacity="0.18"
                      strokeWidth="0.8"
                      strokeDasharray="2,2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: index * 0.2 }}
                    />
                  );
                })}
              </svg>

              {/* Pulse indicators on nodes */}
              {GLOBAL_OFFICES.map((office) => {
                const isSelected = selectedOffice.id === office.id;
                return (
                  <button
                    key={office.id}
                    onClick={() => setSelectedOffice(office)}
                    className="absolute cursor-pointer group z-20"
                    style={{ left: `${office.xPercent}%`, top: `${office.yPercent}%` }}
                    id={`map-node-${office.id}`}
                  >
                    <span className="relative flex items-center justify-center">
                      {/* Active Ripple rings */}
                      <span className={`absolute inline-flex rounded-full bg-accent/40 transition-all ${
                        isSelected ? "w-6 h-6 animate-ping opacity-75" : "w-3 h-3 group-hover:animate-ping opacity-40"
                      }`} />
                      
                      {/* Central Pin Dot */}
                      <span className={`rounded-full transition-all duration-300 ${
                        isSelected ? "w-3 h-3 bg-accent" : "w-2 h-2 bg-foreground-muted group-hover:bg-foreground"
                      }`} />
                    </span>

                    {/* Pop-up Mini Label */}
                    <span className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 rounded bg-surface-elevated/95 border border-border text-[8px] font-mono tracking-wider font-semibold text-foreground pointer-events-none transition-all duration-300 whitespace-nowrap shadow-lg ${
                      isSelected ? "opacity-100 scale-100" : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
                    }`}>
                      {office.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Map bottom instructions indicator */}
            <div className="mt-4 flex items-center justify-between text-[9px] font-mono text-foreground-muted select-none font-bold">
              <span>Interactive Topology: Click nodes to inspect parameters</span>
              <span>Coordinates Ref: WGS84 Mercator Projection</span>
            </div>
          </div>

          {/* Right panel: Active selected city status parameters (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col justify-between p-6 md:p-8 rounded-2xl bg-surface border border-border relative overflow-hidden font-sans">
            {/* Top Bar Accent */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />
            
            <div className="space-y-6">
              {/* Region Label Header */}
              <div className="flex items-center justify-between border-b border-border pb-4 select-none">
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  Office Node Registry
                </span>
                <span className="text-[8px] font-mono text-foreground-muted uppercase font-bold">
                  NODEID_{selectedOffice.id.toUpperCase()}
                </span>
              </div>

              {/* City Name & Local Time parameters */}
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent shrink-0" />
                  {selectedOffice.name}
                </h3>
                <p className="text-xs font-mono text-foreground-secondary">
                  Timezone context: <span className="text-foreground font-medium">{selectedOffice.localTimeStr}</span>
                </p>
              </div>

              {/* Performance / Network stats parameters */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted font-bold">
                    System Uptime
                  </span>
                  <span className="text-xs font-mono text-success font-bold">
                    {selectedOffice.uptime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted font-bold">
                    Network Latency
                  </span>
                  <span className="text-xs font-mono text-accent font-bold">
                    {selectedOffice.ping}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted font-bold">
                    Developer Pod
                  </span>
                  <span className="text-xs font-mono text-foreground font-bold flex items-center gap-1">
                    <Users className="w-3 h-3 text-primary" />
                    Dedicated Pod
                  </span>
                </div>
              </div>

              {/* Informational description paragraph */}
              <p className="text-xs text-foreground-secondary leading-relaxed pt-2 font-sans">
                Our team in {selectedOffice.name} operates standard shifts aligning with the {selectedOffice.region} local business market, assuring seamless integration with your engineers and agile workflows.
              </p>
            </div>

            {/* Quick Action estimator link */}
            <div className="pt-6 mt-8 border-t border-border">
              <button 
                onClick={() => {
                  const scoperEl = document.getElementById("scoper") || document.getElementById("footer") || document.getElementById("cta-section");
                  scoperEl?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-2.5 rounded-lg bg-surface-elevated/40 border border-border hover:border-accent/40 text-[10px] font-mono text-foreground-secondary hover:text-foreground transition-all uppercase tracking-wider font-bold cursor-pointer"
                id="office-route-btn"
              >
                Route Project to {selectedOffice.name} Office
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
