"use client";

import React from "react";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Deep Radial Glow 1 (Top Left Electric Blue) */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-arc-blue/20 via-arc-electric/10 to-transparent rounded-full blur-[140px]" />

      {/* Deep Radial Glow 2 (Center Right Violet Glow) */}
      <div className="absolute top-1/4 -right-40 w-[700px] h-[700px] bg-gradient-to-bl from-arc-violet/20 via-purple-600/10 to-transparent rounded-full blur-[160px]" />

      {/* Deep Radial Glow 3 (Bottom Left Cyan Ambient) */}
      <div className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] bg-gradient-to-tr from-cyan-500/15 via-blue-700/5 to-transparent rounded-full blur-[150px]" />

      {/* Futuristic Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

      {/* Moving Light Streaks (Horizontal Beam) */}
      <div className="absolute top-[28%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent" />
      <div className="absolute top-[68%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-40" />
    </div>
  );
}
