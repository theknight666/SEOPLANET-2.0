"use client";
import dynamic from 'next/dynamic';

const OnboardingApp = dynamic(() => import('@/views/onboarding/OnboardingApp'), { ssr: false });

export default function OnboardingWrapper() {
  return (
    <div className="App">
      <OnboardingApp />
    </div>
  );
}
