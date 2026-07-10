import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FenoraIcon } from "./FenoraLogo";

interface LabelNode {
  id: string;
  text: string;
  x: number;
  y: number;
  visible: boolean;
}

export default function InteractiveGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projectedLabels, setProjectedLabels] = useState<LabelNode[]>([]);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current || !canvasRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 500;

    // --- Scene Setup ---
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.z = 11.5;

    // Renderer with High Performance & Antialiasing
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // Dynamic Radial Shadow Canvas Texture
    const createRadialShadowTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, "rgba(0, 0, 0, 0.75)");
        gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.25)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
      }
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    // --- Lighting ---
    // High-end premium product studio lighting
    const ambientLight = new THREE.AmbientLight(0x0a0d14, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(5, 5, 6);
    scene.add(keyLight);

    // Glowing cyan/electric-blue rim light
    const rimLightCyan = new THREE.DirectionalLight(0x00e5ff, 5.0);
    rimLightCyan.position.set(-6, 3, -4);
    scene.add(rimLightCyan);

    // Glowing deep blue rim light
    const rimLightBlue = new THREE.DirectionalLight(0x0066ff, 3.5);
    rimLightBlue.position.set(6, -4, -4);
    scene.add(rimLightBlue);

    // Overhead white highlight
    const overheadLight = new THREE.DirectionalLight(0xffffff, 1.5);
    overheadLight.position.set(0, 8, 2);
    scene.add(overheadLight);

    // --- 3D extruded F logo geometry ---
    const shape = new THREE.Shape();
    // Start: M 32.5 82.5
    shape.moveTo(-1.75, -3.25);

    // C 28.5 76.5, 29.0 50.0, 29.0 38.0
    shape.bezierCurveTo(-2.15, -2.65, -2.1, 0.0, -2.1, 1.2);

    // C 29.0 22.0, 42.0 15.0, 58.0 15.0
    shape.bezierCurveTo(-2.1, 2.8, -0.8, 3.5, 0.8, 3.5);

    // L 74.0 15.0
    shape.lineTo(2.4, 3.5);

    // C 80.0 15.0, 84.0 18.5, 84.0 23.5
    shape.bezierCurveTo(3.0, 3.5, 3.4, 3.15, 3.4, 2.65);

    // C 84.0 28.5, 80.0 31.5, 74.0 31.5
    shape.bezierCurveTo(3.4, 2.15, 3.0, 1.85, 2.4, 1.85);

    // L 54.0 31.5
    shape.lineTo(0.4, 1.85);

    // C 45.0 31.5, 42.0 34.5, 42.0 42.0
    shape.bezierCurveTo(-0.5, 1.85, -0.8, 1.55, -0.8, 0.8);

    // L 42.0 48.0
    shape.lineTo(-0.8, 0.2);

    // L 68.0 48.0
    shape.lineTo(1.8, 0.2);

    // C 73.5 48.0, 77.0 51.0, 77.0 55.5
    shape.bezierCurveTo(2.35, 0.2, 2.7, -0.1, 2.7, -0.55);

    // C 77.0 60.0, 73.5 63.0, 68.0 63.0
    shape.bezierCurveTo(2.7, -1.0, 2.35, -1.3, 1.8, -1.3);

    // L 42.0 63.0
    shape.lineTo(-0.8, -1.3);

    // L 42.0 70.0
    shape.lineTo(-0.8, -2.0);

    // C 42.0 77.0, 36.5 82.5, 32.5 82.5
    shape.bezierCurveTo(-0.8, -2.7, -1.35, -3.25, -1.75, -3.25);

    const extrudeSettings = {
      steps: 1,
      depth: 0.75,
      bevelEnabled: true,
      bevelThickness: 0.16,
      bevelSize: 0.08,
      bevelOffset: 0,
      bevelSegments: 5
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center(); // Perfect centering on center of gravity

    // Premium metallic ceramic material with glossy finish
    const monogramMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xfbfcfd,               // Crisp clean ceramic white
      metalness: 0.2,                // Slight technical metallic tint
      roughness: 0.08,               // Ultra smooth polish
      clearcoat: 1.0,                // Premium glassy glaze
      clearcoatRoughness: 0.04,      // Extremely clean reflection
      reflectivity: 1.0,
      ior: 1.56,                     // Refractive glass glaze index
    });

    const monogramMesh = new THREE.Mesh(geometry, monogramMaterial);
    scene.add(monogramMesh);

    // --- Soft Ambient Projection Shadow below floating logo ---
    const shadowTexture = createRadialShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.MultiplyBlending
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -3.5;
    scene.add(shadowMesh);

    // --- Elegant Concentric Orbit Rings ---
    const ring1Geo = new THREE.TorusGeometry(3.6, 0.015, 8, 140);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    scene.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(4.8, 0.01, 8, 140);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4.5;
    ring2.rotation.y = Math.PI / 8;
    scene.add(ring2);

    // --- Orbiting data packets ---
    const packet1Geo = new THREE.SphereGeometry(0.08, 16, 16);
    const packet1Mat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const packet1 = new THREE.Mesh(packet1Geo, packet1Mat);
    scene.add(packet1);

    const packet2Geo = new THREE.SphereGeometry(0.065, 16, 16);
    const packet2Mat = new THREE.MeshBasicMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const packet2 = new THREE.Mesh(packet2Geo, packet2Mat);
    scene.add(packet2);

    // --- Background blueprints grid layout ---
    const gridHelper = new THREE.GridHelper(26, 26, 0x111827, 0x111827);
    gridHelper.position.z = -5.5;
    gridHelper.rotation.x = Math.PI / 2.5;
    scene.add(gridHelper);

    // --- Particle field ---
    const starCount = 130;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSpeeds: number[] = [];

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 16;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
      starSpeeds.push(0.008 + Math.random() * 0.012);
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 0.035,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // Set loading off once compilation finishes
    setIsLoading(false);

    // --- Interactive Mouse Handlers & Interpolations ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (rect) {
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    // --- Floating labels in 3D Space ---
    const LABELS_DATA = [
      { id: "lbl-ai", text: "AI Engineering", pos: new THREE.Vector3(3.4, 2.0, 0.5) },
      { id: "lbl-fs", text: "Full Stack Systems", pos: new THREE.Vector3(-3.6, 0.8, 1.2) },
      { id: "lbl-saas", text: "SaaS Platforms", pos: new THREE.Vector3(3.6, -1.8, -0.8) },
      { id: "lbl-cloud", text: "Cloud Infrastructure", pos: new THREE.Vector3(-3.5, -2.0, 0.6) },
      { id: "lbl-genai", text: "GenAI Solutions", pos: new THREE.Vector3(0, 3.4, -1.0) }
    ];

    // --- Frame loop animation ---
    let animationId: number;
    let time = 0;
    let packetAngle1 = 0;
    let packetAngle2 = Math.PI;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.01;

      // Slow elegant floating animation
      const floatOffset = Math.sin(time * 1.4) * 0.22;
      monogramMesh.position.y = floatOffset;

      // Rotate shadows dynamically matching float offsets
      const shadowScale = 1 - floatOffset * 0.15;
      shadowMesh.scale.set(shadowScale, shadowScale, 1);
      shadowMesh.material.opacity = 0.55 - floatOffset * 0.12;

      // Parallax smooth interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Constant slow rotation + parallax tilts
      monogramMesh.rotation.y = time * 0.12 + targetX * 0.45;
      monogramMesh.rotation.x = targetY * 0.35;
      monogramMesh.rotation.z = Math.sin(time * 0.7) * 0.02;

      // Orbit data packets
      packetAngle1 += 0.012;
      packetAngle2 -= 0.009;

      const p1 = new THREE.Vector3(Math.cos(packetAngle1) * 3.6, Math.sin(packetAngle1) * 3.6, 0);
      p1.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 3);
      p1.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 6);
      packet1.position.copy(p1);

      const p2 = new THREE.Vector3(Math.cos(packetAngle2) * 4.8, Math.sin(packetAngle2) * 4.8, 0);
      p2.applyAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 4.5);
      p2.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 8);
      packet2.position.copy(p2);

      // Float background particles
      const positions = starGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < starCount; i++) {
        positions[i * 3 + 1] += starSpeeds[i];
        if (positions[i * 3 + 1] > 8) {
          positions[i * 3 + 1] = -8;
        }
      }
      starGeo.attributes.position.needsUpdate = true;

      // Project 3D coordinate floating labels into React overlay
      const tempV = new THREE.Vector3();
      const screenWidth = mountRef.current?.clientWidth || width;
      const screenHeight = mountRef.current?.clientHeight || height;

      const projected = LABELS_DATA.map((item) => {
        tempV.copy(item.pos);
        // Slightly sway label attachments
        tempV.y += Math.sin(time * 1.4 + item.pos.x) * 0.12;
        tempV.x += Math.cos(time * 1.1 + item.pos.y) * 0.10;

        tempV.project(camera);

        const x = (tempV.x * 0.5 + 0.5) * screenWidth;
        const y = (tempV.y * -0.5 + 0.5) * screenHeight;

        return {
          id: item.id,
          text: item.text,
          x,
          y,
          visible: tempV.z < 1
        };
      });

      setProjectedLabels(projected);
      renderer.render(scene, camera);
    };

    animate();

    // --- Responsive Handling ---
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height || 500;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });

    resizeObserver.observe(mountRef.current);

    // --- Cleanup Memory ---
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      resizeObserver.disconnect();

      // Dispose of geometries & materials
      geometry.dispose();
      monogramMaterial.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      packet1Geo.dispose();
      packet1Mat.dispose();
      packet2Geo.dispose();
      packet2Mat.dispose();
      starGeo.dispose();
      starMat.dispose();
      gridHelper.geometry.dispose();
      if (Array.isArray(gridHelper.material)) {
        gridHelper.material.forEach((m) => m.dispose());
      } else {
        gridHelper.material.dispose();
      }

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full select-none flex items-center justify-center overflow-hidden animate-fade-in"
      id="globe-container-viewport"
    >
      <style>{`
        @keyframes subtle-holo-float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) scale(1); }
          50% { transform: translate(-50%, -50%) translateY(-10px) scale(1.02); }
        }
        @keyframes radial-sonar-pulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        .animate-subtle-float {
          animation: subtle-holo-float 6s ease-in-out infinite;
        }
        .animate-radial-pulse {
          animation: radial-sonar-pulse 4s ease-in-out infinite;
        }
      `}</style>

      {/* Floating Glass Brand Core in front */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center pointer-events-none animate-subtle-float"
        id="globe-holographic-core"
      >
        <div className="relative flex flex-col items-center">
          {/* Beacon Cone of electric glow */}
          <div className="w-[1px] h-14 md:h-20 bg-gradient-to-b from-accent/30 via-accent/5 to-transparent blur-[0.5px]" />
          
          <div className="w-12 h-12 rounded-xl bg-[#06070a]/80 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-[0_0_25px_rgba(14,165,233,0.25)] relative">
            <div className="absolute inset-0 rounded-xl border border-accent/20 animate-radial-pulse" />
            <div className="scale-90">
              <FenoraIcon className="w-6 h-6 text-accent" glow={true} />
            </div>
          </div>
          
          <div className="mt-3 flex flex-col items-center">
            <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-white bg-[#06070a]/95 px-2.5 py-0.5 rounded-full border border-accent/30 shadow-[0_0_15px_rgba(14,165,233,0.15)] flex items-center gap-1.5 animate-pulse">
              <span className="w-1 h-1 rounded-full bg-accent" />
              FENORA CORE
            </span>
          </div>
        </div>
      </div>

      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 outline-none block" />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#06070a]/50 backdrop-blur-sm z-30 space-y-3">
          <div className="relative flex h-8 w-8">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-8 w-8 bg-accent/20 border border-accent flex items-center justify-center text-[10px] font-mono font-bold text-white">
              F
            </span>
          </div>
          <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
            Constructing 3D Core...
          </span>
        </div>
      )}

      {/* Projected Floating HUD Label overlays */}
      <div className="absolute inset-0 pointer-events-none z-20 w-full h-full overflow-hidden">
        {projectedLabels.map((lbl) => {
          const isHovered = hoveredLabel === lbl.id;
          return (
            <div
              key={lbl.id}
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              style={{
                left: `${lbl.x}px`,
                top: `${lbl.y}px`
              }}
              onMouseEnter={() => setHoveredLabel(lbl.id)}
              onMouseLeave={() => setHoveredLabel(null)}
              id={`hud-label-${lbl.id}`}
            >
              {/* Pulsing visual node point */}
              <div className="relative flex items-center justify-center w-6 h-6 cursor-pointer group">
                <span className="absolute inline-flex rounded-full h-2.5 w-2.5 bg-accent/30 group-hover:scale-150 transition-transform duration-300" />
                <span className="relative inline-flex rounded-full h-1 w-1 bg-accent" />

                {/* Elegant Minimalist Floating Card Tag */}
                <div
                  className={`absolute left-3.5 px-2.5 py-1 rounded-md border text-[8px] font-mono font-bold uppercase transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 shadow-md ${
                    isHovered
                      ? "bg-[#06070a] border-accent text-white scale-105 shadow-accent/10"
                      : "bg-[#06070a]/85 border-white/10 text-gray-400 opacity-75"
                  }`}
                >
                  <span className={`w-1 h-1 rounded-full ${isHovered ? "bg-accent animate-pulse" : "bg-gray-600"}`} />
                  <span>{lbl.text}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Ambient Instructions */}
      <div className="absolute bottom-3 right-4 text-[8px] font-mono text-gray-600 pointer-events-none z-20 text-right uppercase tracking-wider select-none">
        <div>▲ Intercept active</div>
        <div>Parallax hover system</div>
      </div>
    </div>
  );
}
