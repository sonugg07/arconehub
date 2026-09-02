"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Coin3DPreviewProps {
  symbol?: string;
  color?: string;
  size?: number;
  className?: string;
}

export function Coin3DPreview({
  symbol = "ARCX",
  color = "#8b5cf6",
  size = 220,
  className = "",
}: Coin3DPreviewProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef(color);
  colorRef.current = color;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = size;
    const height = size;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Coin Body
    const coinGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.35, 64);
    const coinMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(colorRef.current),
      emissive: new THREE.Color(colorRef.current).multiplyScalar(0.2),
      metalness: 0.92,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.rotation.x = Math.PI / 4;
    group.add(coin);

    // Rim
    const rimGeo = new THREE.TorusGeometry(1.72, 0.08, 16, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      emissive: 0x0055aa,
      metalness: 0.95,
      roughness: 0.1,
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 4;
    group.add(rim);

    // Halo ring
    const haloGeo = new THREE.TorusGeometry(2.1, 0.02, 16, 64);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.4 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    group.add(halo);

    // Lighting
    scene.add(new THREE.AmbientLight(0x0f172a, 3));
    const light1 = new THREE.PointLight(0xffffff, 40, 15);
    light1.position.set(3, 4, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x00d2ff, 35, 15);
    light2.position.set(-3, -3, 4);
    scene.add(light2);

    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Update color dynamically if changed
      coinMat.color.set(colorRef.current);
      coinMat.emissive.set(new THREE.Color(colorRef.current).multiplyScalar(0.25));

      group.rotation.y = elapsed * 0.9;
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
  }, [size]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div ref={mountRef} style={{ width: size, height: size }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
        <span className="text-sm font-black tracking-widest text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] px-2 py-0.5 rounded-md bg-black/30 backdrop-blur-sm border border-white/10">
          ${symbol || "ARC"}
        </span>
      </div>
    </div>
  );
}
