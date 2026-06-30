import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import locations from '@/data/locations.json';
import LandingPage from '@/views/LandingPage';

// Generate static params for Next.js to prerender all location pages at build time!
export async function generateStaticParams() {
  return locations.map((loc) => ({
    location: loc.slug,
  }));
}

// Dynamically generate the <title>, <meta>, and canonical tags for each location!
export async function generateMetadata({ params }: { params: Promise<{ location: string }> }): Promise<Metadata> {
  const p = await params;
  const locationData = locations.find((loc) => loc.slug === p.location);

  if (!locationData) {
    return {
      title: 'Location Not Found - SEO Planet',
    };
  }

  return {
    title: `SEO Agency in ${locationData.city} | Elite Digital Marketing for ${locationData.localIndustry}`,
    description: `Looking for the absolute best SEO agency in ${locationData.city}? SEO Planet dominates search rankings with algorithmic SEO for ${locationData.localIndustry} brands. Scale your revenue today.`,
    alternates: {
      canonical: `https://seoplanet.in/seo-agency-in-${locationData.slug}`,
    },
    openGraph: {
      title: `Top SEO Agency in ${locationData.city} | SEO Planet`,
      description: `Outrank your competitors in ${locationData.city} with our advanced AI SEO systems. ${locationData.competitorCount} businesses analyzed.`,
      url: `https://seoplanet.in/seo-agency-in-${locationData.slug}`,
      siteName: "SEO Planet",
      type: "website",
    }
  };
}

import Script from 'next/script';

export default async function LocationPage({ params }: { params: Promise<{ location: string }> }) {
  const p = await params;
  const locationData = locations.find((loc) => loc.slug === p.location);

  if (!locationData) {
    notFound();
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": `SEO Planet ${locationData.city}`,
    "image": "https://seoplanet.in/logo.png",
    "url": `https://seoplanet.in/seo-agency-in-${locationData.slug}`,
    "telephone": "+918796422715",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": locationData.city,
      "addressRegion": locationData.region,
      "addressCountry": locationData.country
    },
    "description": `Elite SEO and Digital Marketing Agency serving ${locationData.localIndustry} businesses in ${locationData.city}.`,
    "priceRange": "$$$"
  };

  return (
    <>
      <Script
        id={`schema-${locationData.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <LandingPage locationData={locationData} />
    </>
  );
}
