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

    const startTime = Date.now();

    const interval = setInterval(() => {
      if (!ctx) return;
      
      const elapsed = Date.now() - startTime;
      const t = (elapsed % 1000) / 1000; // 1s loop (Tailwind animate-ping duration)
      
      ctx.clearRect(0, 0, 32, 32);
      
      // Ping up to 75% of the time like Tailwind
      let progress = t / 0.75;
      if (progress > 1) progress = 1;
      
      // scale from 1 to 2, opacity from 0.6 to 0
      const baseRadius = 8;
      const currentRadius = baseRadius * (1 + progress); // Scale from 1x to 2x
      const currentOpacity = 0.6 * (1 - progress);
      
      // Draw ping ring
      ctx.beginPath();
      ctx.arc(16, 16, currentRadius, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(0, 255, 148, ${currentOpacity})`;
      ctx.fill();
      
      // Draw solid dot
      ctx.beginPath();
      ctx.arc(16, 16, baseRadius, 0, 2 * Math.PI);
      ctx.fillStyle = '#00FF94';
      ctx.fill();
      
      link.href = canvas.toDataURL("image/png");
      
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return null;
}
