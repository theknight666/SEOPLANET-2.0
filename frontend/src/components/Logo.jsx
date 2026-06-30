import React from "react";

export default function Logo({ className = "", hideVersion = false }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="relative inline-block w-2.5 h-2.5">
        <span className="absolute inset-0 rounded-full bg-[#00FF94]" />
        <span className="absolute inset-0 rounded-full bg-[#00FF94] animate-ping opacity-60" />
      </span>
      <span className="font-display font-black tracking-tight text-white text-lg">
        SEO PLANET
      </span>
      {!hideVersion && (
        <span className="hidden sm:inline overline ml-3 text-[10px] text-white/40">
          v.2026
        </span>
      )}
    </div>
  );
}
