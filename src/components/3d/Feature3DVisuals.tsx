"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Base Canvas Helper
function createMiniRenderer(container: HTMLDivElement, width: number, height: number) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  return { scene, camera, renderer };
}

// 1. Pay Feature 3D Visual (Pulsing Payment Flow & Nodes)
export function Pay3DVisual() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 220;
    const height = mount.clientHeight || 180;
    const { scene, camera, renderer } = createMiniRenderer(mount, width, height);
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);

    // Node 1 (Sender)
    const nodeGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const nodeMat1 = new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      emissive: 0x0044aa,
      roughness: 0.2,
      metalness: 0.8,
    });
    const sender = new THREE.Mesh(nodeGeo, nodeMat1);
    sender.position.set(-2.2, 0, 0);
    group.add(sender);

    // Node 2 (Recipient)
    const nodeMat2 = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x4c1d95,
      roughness: 0.2,
      metalness: 0.8,
    });
    const recipient = new THREE.Mesh(nodeGeo, nodeMat2);
    recipient.position.set(2.2, 0, 0);
    group.add(recipient);

    // Connecting Stream Curve
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-2.2, 0, 0),
      new THREE.Vector3(0, 1.6, 0),
      new THREE.Vector3(2.2, 0, 0)
    );
    const points = curve.getPoints(50);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.6 });
    const line = new THREE.Line(lineGeo, lineMat);
    group.add(line);

    // Floating USDC Particle Coin on the curve
    const coinGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 24);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x0891b2,
      metalness: 0.9,
      roughness: 0.1,
    });
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.rotation.x = Math.PI / 2;
    group.add(coin);

    // Orbiting rings
    const ringGeo = new THREE.RingGeometry(0.9, 0.95, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    sender.add(ring1);

    const light = new THREE.PointLight(0xffffff, 40, 20);
    light.position.set(2, 4, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x0a1033, 2));

    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const t = (clock.getElapsedTime() * 0.5) % 1;
      const pos = curve.getPoint(t);
      coin.position.copy(pos);
      coin.rotation.z += 0.05;

      ring1.rotation.z += 0.02;
      group.rotation.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.2;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-44 flex items-center justify-center" />;
}

// 2. Swap Feature 3D Visual (Orbiting Token Spheres)
export function Swap3DVisual() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 220;
    const height = mount.clientHeight || 180;
    const { scene, camera, renderer } = createMiniRenderer(mount, width, height);
    camera.position.set(0, 3, 7.5);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);

    // Center Swap Core
    const coreGeo = new THREE.OctahedronGeometry(1.0, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      emissive: 0x0055ff,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Orbit Ring
    const orbitGeo = new THREE.TorusGeometry(2.4, 0.04, 16, 64);
    const orbitMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.5 });
    const orbit = new THREE.Mesh(orbitGeo, orbitMat);
    orbit.rotation.x = Math.PI / 2.5;
    group.add(orbit);

    // Token A (USDC - Blue)
    const tokenAGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const tokenAMat = new THREE.MeshStandardMaterial({ color: 0x00d2ff, emissive: 0x0284c7, metalness: 0.8, roughness: 0.2 });
    const tokenA = new THREE.Mesh(tokenAGeo, tokenAMat);
    group.add(tokenA);

    // Token B (ARCX - Violet)
    const tokenBGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const tokenBMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, emissive: 0x7e22ce, metalness: 0.8, roughness: 0.2 });
    const tokenB = new THREE.Mesh(tokenBGeo, tokenBMat);
    group.add(tokenB);

    const light = new THREE.PointLight(0xffffff, 40, 20);
    light.position.set(0, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x0a1033, 2));

    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      core.rotation.y = elapsed * 0.8;
      core.rotation.x = elapsed * 0.5;

      const angle = elapsed * 1.2;
      const radius = 2.4;
      tokenA.position.set(Math.cos(angle) * radius, Math.sin(angle) * 0.6, Math.sin(angle) * radius * 0.8);
      tokenB.position.set(Math.cos(angle + Math.PI) * radius, Math.sin(angle + Math.PI) * 0.6, Math.sin(angle + Math.PI) * radius * 0.8);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-44 flex items-center justify-center" />;
}

// 3. Launch Feature 3D Visual (Rotating 3D Token Coin with $ARCX)
export function Launch3DVisual() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 220;
    const height = mount.clientHeight || 180;
    const { scene, camera, renderer } = createMiniRenderer(mount, width, height);
    camera.position.set(0, 0, 6.5);

    const group = new THREE.Group();
    scene.add(group);

    // 3D Coin
    const coinGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.35, 48);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0x9333ea,
      emissive: 0x3b0764,
      metalness: 0.95,
      roughness: 0.15,
    });
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.rotation.x = Math.PI / 4;
    group.add(coin);

    // Rim Highlight
    const rimGeo = new THREE.TorusGeometry(1.82, 0.08, 16, 48);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      emissive: 0x0077aa,
      metalness: 0.9,
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 4;
    group.add(rim);

    // Halo Glow Ring
    const haloGeo = new THREE.TorusGeometry(2.3, 0.02, 16, 64);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.5 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    group.add(halo);

    const light = new THREE.PointLight(0x00d2ff, 50, 15);
    light.position.set(3, 3, 5);
    scene.add(light);

    const light2 = new THREE.PointLight(0xa855f7, 40, 15);
    light2.position.set(-3, -3, 3);
    scene.add(light2);

    scene.add(new THREE.AmbientLight(0x0f172a, 3));

    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      group.rotation.y = elapsed * 0.7;
      group.rotation.x = Math.sin(elapsed * 0.4) * 0.2;
      halo.rotation.z = -elapsed * 0.5;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-44 flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
        <span className="text-[11px] font-black tracking-widest text-cyan-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">$ARCX</span>
      </div>
    </div>
  );
}

// 4. Jobs Feature 3D Visual (Interconnected Escrow Bridge)
export function Jobs3DVisual() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 220;
    const height = mount.clientHeight || 180;
    const { scene, camera, renderer } = createMiniRenderer(mount, width, height);
    camera.position.set(0, 1.5, 7);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);

    // Client Node
    const clientGeo = new THREE.BoxGeometry(1.1, 1.1, 1.1);
    const clientMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.8, roughness: 0.2 });
    const client = new THREE.Mesh(clientGeo, clientMat);
    client.position.set(-2, 0, 0);
    group.add(client);

    // Talent Node
    const talentGeo = new THREE.BoxGeometry(1.1, 1.1, 1.1);
    const talentMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.8, roughness: 0.2 });
    const talent = new THREE.Mesh(talentGeo, talentMat);
    talent.position.set(2, 0, 0);
    group.add(talent);

    // Center Escrow Lock Core
    const lockGeo = new THREE.OctahedronGeometry(0.8, 0);
    const lockMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xb45309, metalness: 0.9, roughness: 0.1 });
    const lock = new THREE.Mesh(lockGeo, lockMat);
    group.add(lock);

    // Bridge Beams
    const beamGeo = new THREE.CylinderGeometry(0.06, 0.06, 4.2, 16);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.7 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.rotation.z = Math.PI / 2;
    group.add(beam);

    const light = new THREE.PointLight(0xffffff, 40, 20);
    light.position.set(0, 4, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x0f172a, 2.5));

    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      client.rotation.y = elapsed * 0.6;
      client.rotation.x = elapsed * 0.4;

      talent.rotation.y = -elapsed * 0.6;
      talent.rotation.x = -elapsed * 0.4;

      lock.rotation.y = elapsed * 1.2;
      group.rotation.y = Math.sin(elapsed * 0.5) * 0.25;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-44 flex items-center justify-center" />;
}

// 5. Company Feature 3D Visual (Multi-Tier Business Platform)
export function Company3DVisual() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 220;
    const height = mount.clientHeight || 180;
    const { scene, camera, renderer } = createMiniRenderer(mount, width, height);
    camera.position.set(0, 3.2, 7.5);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);

    // Platform Base
    const baseGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.3, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -1.2;
    group.add(base);

    // Tier 1 Card
    const cardGeo1 = new THREE.BoxGeometry(1.6, 0.12, 1.2);
    const cardMat1 = new THREE.MeshStandardMaterial({ color: 0x0066ff, metalness: 0.7, roughness: 0.3 });
    const card1 = new THREE.Mesh(cardGeo1, cardMat1);
    card1.position.set(-0.6, -0.2, 0.4);
    group.add(card1);

    // Tier 2 Card
    const cardGeo2 = new THREE.BoxGeometry(1.4, 0.12, 1.0);
    const cardMat2 = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.7, roughness: 0.3 });
    const card2 = new THREE.Mesh(cardGeo2, cardMat2);
    card2.position.set(0.6, 0.4, -0.3);
    group.add(card2);

    // Tier 3 Floating Diamond Core
    const coreGeo = new THREE.OctahedronGeometry(0.6, 0);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x00d2ff, emissive: 0x004488, metalness: 0.9, roughness: 0.1 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(0, 1.3, 0);
    group.add(core);

    const light = new THREE.PointLight(0xffffff, 50, 20);
    light.position.set(2, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x0a1033, 3));

    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      group.rotation.y = elapsed * 0.4;
      core.position.y = 1.3 + Math.sin(elapsed * 2) * 0.15;
      core.rotation.y = elapsed * 1.5;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-44 flex items-center justify-center" />;
}

// 6. Wallet Feature 3D Visual (Multi-Asset Vault)
export function Wallet3DVisual() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 220;
    const height = mount.clientHeight || 180;
    const { scene, camera, renderer } = createMiniRenderer(mount, width, height);
    camera.position.set(0, 1, 6.5);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);

    // 3D Glass Vault Card
    const cardGeo = new THREE.BoxGeometry(3.0, 1.9, 0.18);
    const cardMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a1638,
      emissive: 0x001144,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.9,
    });
    const card = new THREE.Mesh(cardGeo, cardMat);
    card.rotation.x = Math.PI / 10;
    card.rotation.y = -Math.PI / 8;
    group.add(card);

    // Floating Token 1 (USDC)
    const token1Geo = new THREE.CylinderGeometry(0.4, 0.4, 0.08, 24);
    const token1Mat = new THREE.MeshStandardMaterial({ color: 0x00d2ff, metalness: 0.9, roughness: 0.1 });
    const token1 = new THREE.Mesh(token1Geo, token1Mat);
    token1.position.set(-1.0, 0.8, 0.8);
    group.add(token1);

    // Floating Token 2 (ARCX)
    const token2Geo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 24);
    const token2Mat = new THREE.MeshStandardMaterial({ color: 0xc084fc, metalness: 0.9, roughness: 0.1 });
    const token2 = new THREE.Mesh(token2Geo, token2Mat);
    token2.position.set(1.2, -0.6, 0.9);
    group.add(token2);

    const light = new THREE.PointLight(0x00d2ff, 50, 15);
    light.position.set(3, 4, 6);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x0f172a, 2.5));

    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      group.rotation.y = Math.sin(elapsed * 0.6) * 0.3;
      group.rotation.x = Math.cos(elapsed * 0.4) * 0.15;

      token1.rotation.x = elapsed * 1.5;
      token1.rotation.y = elapsed * 1.0;

      token2.rotation.x = -elapsed * 1.3;
      token2.rotation.y = -elapsed * 0.8;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-44 flex items-center justify-center" />;
}
