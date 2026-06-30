import React from 'react';
import PortfolioWrapper from './PortfolioWrapper';

export function generateStaticParams() {
  return [{ slug: [] }];
}

export default function PortfolioPage() {
  return <PortfolioWrapper />;
}
