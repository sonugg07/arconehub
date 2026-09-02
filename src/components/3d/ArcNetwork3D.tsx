"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function ArcNetwork3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // Node Positions
    const nodeCount = 36;
    const nodePositions: THREE.Vector3[] = [];
    const nodeMeshes: THREE.Mesh[] = [];

    const nodeGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const nodeMat1 = new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      emissive: 0x0055ff,
      metalness: 0.8,
      roughness: 0.2,
    });
    const nodeMat2 = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x6d28d9,
      metalness: 0.8,
      roughness: 0.2,
    });

    for (let i = 0; i < nodeCount; i++) {
      const radius = 6.5 + Math.random() * 2.5;
      const theta = (i / nodeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const phi = Math.acos((Math.random() * 2 - 1) * 0.7);

      const pos = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );

      nodePositions.push(pos);

      const mat = i % 2 === 0 ? nodeMat1 : nodeMat2;
      const mesh = new THREE.Mesh(nodeGeo, mat);
      mesh.position.copy(pos);
      networkGroup.add(mesh);
      nodeMeshes.push(mesh);
    }

    // Connect close nodes with lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
    });

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 5.2) {
          const lineGeo = new THREE.BufferGeometry().setFromPoints([
            nodePositions[i],
            nodePositions[j],
          ]);
          const line = new THREE.Line(lineGeo, lineMaterial);
          networkGroup.add(line);
        }
      }
    }

    // Center Core (Arc Settlement Engine)
    const hubGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const hubMat = new THREE.MeshStandardMaterial({
      color: 0x0044cc,
      emissive: 0x002288,
      wireframe: true,
      metalness: 0.9,
    });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    networkGroup.add(hub);

    // Pulsing Rings
    const ringGeo = new THREE.TorusGeometry(3.6, 0.04, 16, 80);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.6 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    networkGroup.add(ring);

    // Lighting
    scene.add(new THREE.AmbientLight(0x0a1033, 3));
    const light1 = new THREE.PointLight(0x00d2ff, 60, 30);
    light1.position.set(10, 10, 10);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x8b5cf6, 50, 30);
    light2.position.set(-10, -10, 10);
    scene.add(light2);

    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      networkGroup.rotation.y = elapsed * 0.12;
      networkGroup.rotation.x = Math.sin(elapsed * 0.08) * 0.15;

      hub.rotation.y = -elapsed * 0.3;
      hub.rotation.z = elapsed * 0.2;

      ring.rotation.z = elapsed * 0.25;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(reqId);
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-[380px] lg:h-[460px] flex items-center justify-center cursor-grab" />;
}
