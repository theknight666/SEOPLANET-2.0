"use client";
import dynamic from 'next/dynamic';

const PortfolioApp = dynamic(() => import('@/views/portfolio/PortfolioApp'), { ssr: false });

export default function PortfolioWrapper() {
  return <PortfolioApp />;
}
