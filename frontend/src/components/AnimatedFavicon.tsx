"use client";

import { useEffect } from "react";

export default function AnimatedFavicon() {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    if (!ctx) return;

    // Pre-render 10 frames to avoid heavy PNG compression on every tick
    const frames: string[] = [];
    const totalFrames = 10;
    
    for (let i = 0; i < totalFrames; i++) {
      const t = i / totalFrames; // 0 to 0.9
      ctx.clearRect(0, 0, 32, 32);
      
      let progress = t / 0.75;
      if (progress > 1) progress = 1;
      
      const baseRadius = 8;
      const currentRadius = baseRadius * (1 + progress);
      const currentOpacity = 0.6 * (1 - progress);
      
      ctx.beginPath();
      ctx.arc(16, 16, currentRadius, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(0, 255, 148, ${currentOpacity})`;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(16, 16, baseRadius, 0, 2 * Math.PI);
      ctx.fillStyle = '#00FF94';
      ctx.fill();
      
      // Use webp for faster compression if supported, fallback to png
      frames.push(canvas.toDataURL("image/webp", 0.5) || canvas.toDataURL("image/png"));
    }

    let frameIndex = 0;
    const interval = setInterval(() => {
      link.href = frames[frameIndex];
      frameIndex = (frameIndex + 1) % totalFrames;
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return null;
}
