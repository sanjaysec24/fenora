import React from "react";
import { motion } from "motion/react";

export default function HeroTechnicalBackground() {
  // Configured floating background particles for a calm cybernetic atmosphere
  const particles = [
    { id: 1, top: "25%", left: "45%", size: 3, delay: 0, duration: 15, xOffset: 25, yOffset: -40 },
    { id: 2, top: "60%", left: "55%", size: 2, delay: 2, duration: 18, xOffset: -30, yOffset: -50 },
    { id: 3, top: "40%", left: "75%", size: 4, delay: 4, duration: 14, xOffset: 15, yOffset: -35 },
    { id: 4, top: "75%", left: "35%", size: 3, delay: 1, duration: 16, xOffset: 35, yOffset: -30 },
    { id: 5, top: "15%", left: "80%", size: 2, delay: 5, duration: 20, xOffset: -20, yOffset: -45 },
    { id: 6, top: "85%", left: "70%", size: 3, delay: 3, duration: 12, xOffset: 15, yOffset: -25 },
  ];

  return (
    <div 
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none" 
      id="hero-technical-background"
    >
      {/* Dynamic Base Grid Pattern overlaying ambient gradients */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 z-10" />

      {/* Symmetrical High-Precision Radial Glows */}
      {/* Primary Glow (Cyan-Blue) right side */}
      <div 
        className="absolute top-[15%] right-[-5%] w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-primary/8 dark:bg-primary/10 blur-[130px] animate-pulse pointer-events-none z-0" 
        style={{ animationDuration: "8s" }}
      />
      {/* Accent Glow (Electric Cyan) bottom right */}
      <div 
        className="absolute bottom-[10%] right-[15%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-accent/6 dark:bg-accent/8 blur-[110px] animate-pulse pointer-events-none z-0" 
        style={{ animationDuration: "14s" }}
      />
      {/* Light Theme Specific Soft White Backwash to suppress too much dark glare */}
      <div className="absolute inset-0 bg-background/25 dark:bg-transparent z-10" />

      {/* High-Contrast Readability Gradient Overlay */}
      {/* Fades out as it goes right, protecting content left-aligned legibility */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[70%] bg-gradient-to-r from-background via-background/95 md:via-background/85 to-transparent z-20" />
      <div className="absolute inset-x-0 bottom-0 h-[25%] bg-gradient-to-t from-background to-transparent z-20" />

      {/* Drift Particles Overlay */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-accent/25 dark:bg-accent/30 shadow-[0_0_8px_var(--accent)]"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
          }}
          animate={{
            x: [0, p.xOffset, 0],
            y: [0, p.yOffset, 0],
            opacity: [0.15, 0.65, 0.15],
          }}
          transition={{
            repeat: Infinity,
            duration: p.duration,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Cinematic Enterprise-Scale SVG Engineering Schematic */}
      <svg
        className="absolute right-0 top-[10%] w-full md:w-[65%] h-[85%] z-15 opacity-80 dark:opacity-90 transition-opacity duration-500"
        viewBox="0 0 900 650"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMid meet"
      >
        {/* ==========================================
            BACKGROUND STATIC CIRCUIT PATHWAYS (Dull grey/border color)
           ========================================== */}
        <g stroke="currentColor" className="text-border/40 dark:text-border/60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Path 1: Load Balancer -> Data Ingress Pipeline */}
          <path d="M 120 325 L 240 325 L 240 180 L 340 180" />
          
          {/* Path 2: Load Balancer -> Ingress Authentication Shield */}
          <path d="M 120 325 L 210 325 L 210 470 L 300 470" />

          {/* Path 3: Data Ingress Pipeline -> Cognitive Core */}
          <path d="M 340 180 L 460 180 L 490 220 L 490 290 L 530 325" />

          {/* Path 4: Ingress Authentication Shield -> Cognitive Core */}
          <path d="M 300 470 L 430 470 L 470 420 L 470 350 L 530 325" />

          {/* Path 5: Cognitive Core -> GPU training Compute Cluster */}
          <path d="M 530 325 L 610 325 L 610 150 L 720 150" />

          {/* Path 6: Cognitive Core -> Real-Time API Engine */}
          <path d="M 530 325 L 750 325" />

          {/* Path 7: Cognitive Core -> High-Performance Vector DB */}
          <path d="M 530 325 L 590 325 L 590 500 L 700 500" />
          
          {/* Sub-circuit board line flourishes */}
          <path d="M 720 150 L 780 150 L 800 170" />
          <path d="M 700 500 L 770 500 L 790 480" />
          <path d="M 240 180 L 280 140" />
          <path d="M 210 470 L 170 510" />
        </g>

        {/* ==========================================
            DYNAMIC INTEL LIGHT TRAILS (High speed data streams)
           ========================================== */}
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Stream 1: Load Balancer -> Ingress */}
          <motion.path
            d="M 120 325 L 240 325 L 240 180 L 340 180"
            stroke="var(--accent)"
            strokeWidth="2"
            fill="none"
            initial={{ strokeDasharray: "20 180", strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -200 }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          />

          {/* Stream 2: Load Balancer -> Security Gate */}
          <motion.path
            d="M 120 325 L 210 325 L 210 470 L 300 470"
            stroke="var(--primary)"
            strokeWidth="2"
            fill="none"
            initial={{ strokeDasharray: "25 180", strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -200 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear", delay: 1 }}
          />

          {/* Stream 3: Ingress -> Cognitive Core */}
          <motion.path
            d="M 340 180 L 460 180 L 490 220 L 490 290 L 530 325"
            stroke="var(--accent)"
            strokeWidth="2.2"
            fill="none"
            initial={{ strokeDasharray: "30 250", strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -280 }}
            transition={{ repeat: Infinity, duration: 7, ease: "linear", delay: 0.5 }}
          />

          {/* Stream 4: Auth Gate -> Cognitive Core */}
          <motion.path
            d="M 300 470 L 430 470 L 470 420 L 470 350 L 530 325"
            stroke="var(--primary)"
            strokeWidth="2.2"
            fill="none"
            initial={{ strokeDasharray: "25 240", strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -265 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear", delay: 2 }}
          />

          {/* Stream 5: Core -> GPU Cluster */}
          <motion.path
            d="M 530 325 L 610 325 L 610 150 L 720 150"
            stroke="var(--accent)"
            strokeWidth="2.5"
            fill="none"
            initial={{ strokeDasharray: "40 300", strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -320 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear", delay: 1.5 }}
          />

          {/* Stream 6: Core -> Real-Time API */}
          <motion.path
            d="M 530 325 L 750 325"
            stroke="var(--primary)"
            strokeWidth="2.5"
            fill="none"
            initial={{ strokeDasharray: "35 220", strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -220 }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
          />

          {/* Stream 7: Core -> Vector DB */}
          <motion.path
            d="M 530 325 L 590 325 L 590 500 L 700 500"
            stroke="var(--accent)"
            strokeWidth="2.5"
            fill="none"
            initial={{ strokeDasharray: "40 320", strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -350 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear", delay: 3 }}
          />
        </g>

        {/* ==========================================
            SYSTEM ARTIFACT COGNITIVE HUB (Central Main Core)
           ========================================== */}
        <g id="cog-hub-central">
          {/* Ambient Glow Aura */}
          <motion.circle
            cx="530"
            cy="325"
            r="38"
            fill="var(--primary)"
            className="opacity-15 dark:opacity-20 blur-[8px]"
            animate={{ scale: [0.95, 1.15, 0.95] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
          
          {/* Core Hub Boundaries */}
          <circle cx="530" cy="325" r="24" fill="var(--background)" stroke="var(--primary)" strokeWidth="2.5" />
          
          {/* Inner Active Ring */}
          <motion.circle
            cx="530"
            cy="325"
            r="16"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            fill="none"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          />
          
          <circle cx="530" cy="325" r="8" fill="var(--accent)" className="opacity-80 animate-pulse" />
          <circle cx="530" cy="325" r="3" fill="white" />

          {/* Technical labels */}
          <text x="530" y="278" textAnchor="middle" className="fill-foreground font-mono text-[9px] font-bold tracking-[0.2em]">
            COGNITIVE_CORE
          </text>
          <text x="530" y="288" textAnchor="middle" className="fill-foreground-muted font-mono text-[7.5px] tracking-wide">
            FENORA_SYS_V2.6 // UP_TIME: OK
          </text>
        </g>

        {/* ==========================================
            PERIPHERAL ARCHITECTURE NODES (Distributed Systems)
           ========================================== */}

        {/* Ingress Gateway Node */}
        <g id="node-ingress">
          <circle cx="120" cy="325" r="8" fill="var(--background)" stroke="var(--primary)" strokeWidth="2" />
          <circle cx="120" cy="325" r="3" fill="var(--primary)" />
          
          <text x="120" y="308" textAnchor="middle" className="fill-foreground font-mono text-[8px] font-bold tracking-wider">
            API_INGRESS
          </text>
          <text x="120" y="343" textAnchor="middle" className="fill-foreground-muted font-mono text-[6.5px]">
            LB_ROUTING_EDGE
          </text>
        </g>

        {/* Ingest Pipeline Node */}
        <g id="node-pipeline">
          <rect x="328" y="168" width="24" height="24" rx="5" fill="var(--background)" stroke="var(--accent)" strokeWidth="2" />
          <motion.rect
            x="332" y="172" width="16" height="16" rx="3"
            fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 2"
            animate={{ rotate: -90 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          />
          <circle cx="340" cy="180" r="2" fill="var(--accent)" />

          <text x="340" y="153" textAnchor="middle" className="fill-foreground font-mono text-[8.5px] font-bold tracking-wider">
            DATA_PIPELINE
          </text>
          <text x="340" y="204" textAnchor="middle" className="fill-foreground-muted font-mono text-[7px]">
            AI_FEED_V4 // INGEST_OK
          </text>
        </g>

        {/* Authentication Shield Node */}
        <g id="node-auth">
          <circle cx="300" cy="470" r="11" fill="var(--background)" stroke="var(--primary)" strokeWidth="2" />
          {/* Inner polygonal lock shape */}
          <polygon points="300,465 304,469 304,475 296,475 296,469" fill="var(--primary)" className="opacity-80" />
          
          <text x="300" y="448" textAnchor="middle" className="fill-foreground font-mono text-[8.5px] font-bold tracking-wider">
            SHIELD_GATEWAY
          </text>
          <text x="300" y="493" textAnchor="middle" className="fill-foreground-muted font-mono text-[7px]">
            TLS_1.3 // SECURE
          </text>
        </g>

        {/* GPU Training Cluster Node */}
        <g id="node-gpu">
          <rect x="708" y="132" width="24" height="36" rx="4" fill="var(--background)" stroke="var(--accent)" strokeWidth="2" />
          {/* Small GPU graphic bars */}
          <line x1="714" y1="140" x2="726" y2="140" stroke="var(--accent)" strokeWidth="2" />
          <line x1="714" y1="146" x2="726" y2="146" stroke="var(--accent)" strokeWidth="2" />
          <line x1="714" y1="152" x2="726" y2="152" stroke="var(--accent)" strokeWidth="2" className="animate-pulse" />
          <line x1="714" y1="158" x2="722" y2="158" stroke="var(--accent)" strokeWidth="2" />

          <text x="720" y="115" textAnchor="middle" className="fill-foreground font-mono text-[8.5px] font-bold tracking-wider">
            GPU_CLUSTER_A100
          </text>
          <text x="720" y="180" textAnchor="middle" className="fill-foreground-muted font-mono text-[7px]">
            94.6% UTIL // TRAINING_NET
          </text>
        </g>

        {/* Real-Time API Engine */}
        <g id="node-api">
          <circle cx="750" cy="325" r="10" fill="var(--background)" stroke="var(--primary)" strokeWidth="2" />
          <motion.circle
            cx="750"
            cy="325"
            r="15"
            stroke="var(--primary)"
            strokeWidth="1"
            strokeDasharray="4 6"
            fill="none"
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.1, 0.6] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
          <circle cx="750" cy="325" r="4" fill="var(--primary)" />

          <text x="750" y="303" textAnchor="middle" className="fill-foreground font-mono text-[8.5px] font-bold tracking-wider">
            EDGE_API_ROUTER
          </text>
          <text x="750" y="348" textAnchor="middle" className="fill-foreground-muted font-mono text-[7px]">
            RT_INGRESS // LAT: 1.4ms
          </text>
        </g>

        {/* Vector DB Node */}
        <g id="node-vector">
          {/* Overlapping cylinders database visual */}
          <rect x="688" y="482" width="24" height="32" rx="4" fill="var(--background)" stroke="var(--accent)" strokeWidth="2" />
          <line x1="688" y1="492" x2="712" y2="492" stroke="var(--accent)" strokeWidth="1.5" />
          <line x1="688" y1="502" x2="712" y2="502" stroke="var(--accent)" strokeWidth="1.5" />
          <line x1="688" y1="512" x2="712" y2="512" stroke="var(--accent)" strokeWidth="1.5" />
          
          <circle cx="700" cy="497" r="1.5" fill="var(--accent)" className="animate-ping" />
          
          <text x="700" y="465" textAnchor="middle" className="fill-foreground font-mono text-[8.5px] font-bold tracking-wider">
            VECTOR_DB_MESH
          </text>
          <text x="700" y="528" textAnchor="middle" className="fill-foreground-muted font-mono text-[7px]">
            INDEX_ACTIVE // 24.8M VEC
          </text>
        </g>

        {/* ==========================================
            HUD ELECTRONIC TELEMETRY CARDS (Advanced SaaS dashboard)
           ========================================== */}
        {/* Telemetry Card Top-Right */}
        <g id="hud-telemetry-top">
          <rect x="620" y="15" width="220" height="65" rx="8" fill="var(--background)" stroke="var(--border)" strokeWidth="1" className="opacity-90 backdrop-blur-md" />
          <line x1="620" y1="35" x2="840" y2="35" stroke="var(--border)" strokeWidth="1" />
          
          <circle cx="635" cy="25" r="3" fill="var(--accent)" className="animate-pulse" />
          <text x="645" y="28" className="fill-foreground font-mono text-[8px] font-bold tracking-wider">
            SYSTEM_INTELLIGENCE // STATUS_OK
          </text>
          
          {/* Dashboard stats */}
          <text x="635" y="48" className="fill-foreground-secondary font-mono text-[7.5px]">
            AI MODEL ACCURACY: 99.84%
          </text>
          <text x="635" y="58" className="fill-foreground-secondary font-mono text-[7.5px]">
            INFERENCE LATENCY: 24ms
          </text>
          <text x="635" y="68" className="fill-foreground-secondary font-mono text-[7.5px]">
            CONNECTED ENDPOINTS: 14,809
          </text>
          
          {/* Subtle graph graphic */}
          <path d="M 780 65 L 795 55 L 810 60 L 825 45 L 835 50" stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>

        {/* Telemetry Card Bottom-Left */}
        <g id="hud-telemetry-bottom">
          <rect x="50" y="480" width="190" height="55" rx="8" fill="var(--background)" stroke="var(--border)" strokeWidth="1" className="opacity-90 backdrop-blur-md" />
          <line x1="50" y1="498" x2="240" y2="498" stroke="var(--border)" strokeWidth="1" />
          
          <circle cx="65" cy="489" r="3.5" fill="var(--primary)" />
          <text x="75" y="492" className="fill-foreground font-mono text-[8px] font-bold tracking-wider">
            FLOW_METRICS_DASH
          </text>

          <text x="65" y="512" className="fill-foreground-secondary font-mono text-[7.5px]">
            AVERAGE THROUGHPUT: 1.82 GBPS
          </text>
          <text x="65" y="522" className="fill-foreground-secondary font-mono text-[7.5px]">
            ERROR THRESHOLD: 0.0001%
          </text>
        </g>
      </svg>
    </div>
  );
}
