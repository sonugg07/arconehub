"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ArrowUpRight, CheckCircle2, Coins, Briefcase, Zap } from "lucide-react";

export function HeroOrbCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // Group for whole 3D object
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Core Orb / Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(4.2, 3);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x0044cc,
      emissive: 0x002277,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // Wireframe Lattice Overlay
    const wireGeo = new THREE.IcosahedronGeometry(4.3, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    mainGroup.add(wireMesh);

    // Floating Ring 1 (Electric Blue)
    const ring1Geo = new THREE.TorusGeometry(6.4, 0.08, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      transparent: true,
      opacity: 0.8,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    // Floating Ring 2 (Violet / Purple)
    const ring2Geo = new THREE.TorusGeometry(7.2, 0.06, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x9333ea,
      transparent: true,
      opacity: 0.7,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    mainGroup.add(ring2);

    // Floating Ring 3 (Outer Arc Cyan)
    const ring3Geo = new THREE.TorusGeometry(8.0, 0.04, 16, 120);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.6,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.y = Math.PI / 3;
    mainGroup.add(ring3);

    // Dynamic Particle Cloud
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x00d2ff);
    const color2 = new THREE.Color(0x8b5cf6);
    const color3 = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const radius = 5.5 + Math.random() * 5.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const mixedColor = Math.random() > 0.5 ? color1 : Math.random() > 0.3 ? color2 : color3;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleSystem);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1033, 3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00d2ff, 150, 50);
    pointLight1.position.set(12, 12, 15);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 120, 50);
    pointLight2.position.set(-12, -10, 10);
    scene.add(pointLight2);

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.6;
      mouseRef.current.targetY = y * 0.6;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize listener
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Lerp mouse
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Rotations
      mainGroup.rotation.y = elapsedTime * 0.15 + mouseRef.current.x;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.1) * 0.2 + mouseRef.current.y;

      ring1.rotation.z = elapsedTime * 0.2;
      ring2.rotation.y = -elapsedTime * 0.25;
      ring3.rotation.x = elapsedTime * 0.15;

      particleSystem.rotation.y = -elapsedTime * 0.08;

      // Pulsate scale slightly
      const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.02;
      coreMesh.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[540px] lg:h-[620px] flex items-center justify-center select-none overflow-visible">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 2.5D HUD Glass Cards with Layered Depth */}
      {/* Card 1: Payment Received */}
      <div className="absolute top-10 left-4 md:left-8 z-20 animate-float pointer-events-none">
        <div className="glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-glow-blue border border-cyan-400/30">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
            <Coins className="w-5 h-5 text-cyan-200" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider">Payment Received</div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>+250.00 USDC</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Arc</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Transaction Confirmed */}
      <div className="absolute bottom-12 left-6 md:left-14 z-20 animate-float-reverse pointer-events-none">
        <div className="glass-panel px-4 py-3 rounded-2xl flex items-center gap-3 border border-emerald-400/30 shadow-glass">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Sub-second Finality</div>
            <div className="text-[11px] text-slate-400">Confirmed in 380ms • Gas $0.0009</div>
          </div>
        </div>
      </div>

      {/* Card 3: Token ARCX Created */}
      <div className="absolute top-14 right-4 md:right-8 z-20 animate-float-slow pointer-events-none">
        <div className="glass-panel px-4 py-3 rounded-2xl flex items-center gap-3 border border-purple-400/30 shadow-glow-violet">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md">
            $ARCX
          </div>
          <div>
            <div className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">Token Created</div>
            <div className="text-sm font-bold text-white">10,000,000 ARCX</div>
          </div>
        </div>
      </div>

      {/* Card 4: New Job Escrow */}
      <div className="absolute bottom-16 right-4 md:right-10 z-20 animate-float pointer-events-none">
        <div className="glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-blue-400/30 shadow-glass">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-blue-300">Escrow Protected</div>
            <div className="text-xs font-bold text-white">5,000 USDC Locked</div>
          </div>
          <Zap className="w-4 h-4 text-arc-electric ml-1" />
        </div>
      </div>
    </div>
  );
}
