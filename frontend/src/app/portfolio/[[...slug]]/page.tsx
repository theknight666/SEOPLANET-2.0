"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const PortfolioApp = dynamic(() => import('@/views/portfolio/PortfolioApp'), { ssr: false });

export function generateStaticParams() {
  return [{ slug: [] }];
}

export default function PortfolioPage() {
  return <PortfolioApp />;
}
