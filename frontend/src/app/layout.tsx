import type { Metadata } from "next";
import { Unbounded, Inter, JetBrains_Mono } from "next/font/google";
import { CurrencyProvider } from "@/context/CurrencyContext";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SEO Planet | Premier Digital Marketing & SEO Agency",
  description: "SEO Planet is a premier digital marketing agency for the AI era. We pair algorithmic SEO, performance ads, and content systems to help ambitious brands win.",
  keywords: "SEO agency, digital marketing, algorithmic SEO, performance ads, content strategy, brand identity",
  applicationName: "SEO Planet",
  openGraph: {
    title: "SEO Planet | Premier Digital Marketing & SEO Agency",
    description: "SEO Planet is a premier digital marketing agency for the AI era.",
    url: "https://seoplanet.in",
    siteName: "SEO Planet",
    type: "website",
    images: [
      {
        url: "https://seoplanet.in/orbital-planet-bg.png",
        width: 1200,
        height: 630,
        alt: "SEO Planet Digital Marketing Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Planet | Premier Digital Marketing & SEO Agency",
    description: "SEO Planet is a premier digital marketing agency for the AI era.",
    images: ["https://seoplanet.in/orbital-planet-bg.png"],
  },
  alternates: {
    canonical: "https://seoplanet.in",
    languages: {
      "en": "https://seoplanet.in",
      "x-default": "https://seoplanet.in",
    },
  },
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#000000" />
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SEO Planet",
              "url": "https://seoplanet.in",
              "logo": "https://seoplanet.in/logo.png",
              "sameAs": [
                "https://twitter.com/seoplanet",
                "https://www.linkedin.com/company/seoplanet"
              ]
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-mono-pro">
        <Script src="/error-handler.js" strategy="beforeInteractive" />
        <Script src="https://assets.emergent.sh/scripts/emergent-main.js" strategy="lazyOnload" />
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
        <Script src="/analytics.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
