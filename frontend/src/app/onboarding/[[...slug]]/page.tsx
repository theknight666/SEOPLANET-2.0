import React from 'react';
import OnboardingWrapper from './OnboardingWrapper';

export function generateStaticParams() {
  return [{ slug: [] }];
}

export default function OnboardingPage() {
  return <OnboardingWrapper />;
}
