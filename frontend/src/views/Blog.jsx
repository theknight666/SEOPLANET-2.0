import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#05050A] text-white flex flex-col">
      <Navigation />
      <main className="flex-grow flex items-center justify-center py-32 px-6">
        <div className="max-w-3xl text-center">
          <p className="overline mb-4 text-[#00FF94]">[00X] · Insights</p>
          <h1 className="font-display text-4xl sm:text-6xl font-black mb-6">
            Our <span className="neon-text italic font-light">Blog</span> is coming soon.
          </h1>
          <p className="font-mono-pro text-white/60">
            We are currently building comprehensive guides and insights on algorithmic SEO, performance ads, and content systems. Check back later!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
