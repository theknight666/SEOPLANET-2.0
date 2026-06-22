"use client";
import React from 'react';
import dynamic from 'next/dynamic';

// Next.js SSR tries to render the component server-side, but it might use window/document.
// To ensure it runs entirely on the client:
const OnboardingApp = dynamic(() => import('@/views/onboarding/OnboardingApp'), { ssr: false });

export function generateStaticParams() {
  return [{ slug: [] }];
}

export default function OnboardingPage() {
  return (
    <div className="App">
      <OnboardingApp />
    </div>
  );
}
