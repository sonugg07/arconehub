"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ArcOneLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  taglineText?: string;
  asLink?: boolean;
  href?: string;
  iconOnly?: boolean;
}

export function ArcOneLogo({
  className,
  size = "md",
  showTagline = false,
  taglineText = "ONE HUB. EVERYTHING ONCHAIN.",
  asLink = true,
  href = "/",
  iconOnly = false,
}: ArcOneLogoProps) {
  const sizeMap = {
    sm: { icon: 28, text: "text-base", tracking: "tracking-wider", tagline: "text-[9px]" },
    md: { icon: 38, text: "text-xl", tracking: "tracking-wider", tagline: "text-[10px]" },
    lg: { icon: 48, text: "text-2xl", tracking: "tracking-widest", tagline: "text-xs" },
    xl: { icon: 64, text: "text-3xl", tracking: "tracking-widest", tagline: "text-xs" },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={cn("inline-flex items-center gap-3 select-none group", className)}>
      {/* 3D Glass Arc Icon */}
      <div className="relative flex items-center justify-center shrink-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-arc-blue via-arc-violet to-arc-electric rounded-xl blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-300" />
        <div 
          className="relative rounded-xl overflow-hidden bg-gradient-to-b from-[#0e1638] to-[#060919] border border-white/20 p-1 flex items-center justify-center shadow-glass"
          style={{ width: currentSize.icon, height: currentSize.icon }}
        >
          {/* SVG Vector AH Bridge Glyph */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(0,114,255,0.6)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logoBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D2FF" />
                <stop offset="60%" stopColor="#0066FF" />
                <stop offset="100%" stopColor="#0044CC" />
              </linearGradient>
              <linearGradient id="logoVioletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#7928CA" />
              </linearGradient>
              <linearGradient id="logoArchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D2FF" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>

            {/* Left 'A' Stem */}
            <path
              d="M 28 82 L 48 18 L 54 18 L 54 82 L 44 82 L 44 38 L 33 82 Z"
              fill="url(#logoBlueGrad)"
            />
            {/* Right 'H' Stem */}
            <path
              d="M 68 34 C 68 30 74 30 74 34 L 74 82 L 64 82 L 64 42 C 64 36 68 36 68 34 Z"
              fill="url(#logoVioletGrad)"
            />
            {/* Bridging Arch */}
            <path
              d="M 24 64 C 44 48 64 48 76 60 C 66 52 46 54 30 68 Z"
              fill="url(#logoArchGrad)"
            />
          </svg>
        </div>
      </div>

      {!iconOnly && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center">
            <span className={cn("font-extrabold uppercase font-sans text-white", currentSize.text, currentSize.tracking)}>
              ARC<span className="text-white">ONE</span>
            </span>
            <span className={cn("font-extrabold uppercase font-sans bg-gradient-to-r from-arc-electric to-arc-violet bg-clip-text text-transparent ml-1.5", currentSize.text, currentSize.tracking)}>
              HUB
            </span>
          </div>
          {showTagline && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-3 h-[1.5px] bg-arc-electric" />
              <span className={cn("font-medium tracking-widest text-slate-400 uppercase", currentSize.tagline)}>
                {taglineText}
              </span>
              <span className="w-3 h-[1.5px] bg-arc-violet" />
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href={href} className="inline-flex focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
