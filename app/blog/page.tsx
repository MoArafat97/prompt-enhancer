import React from 'react';
import { Metadata } from 'next';
import { BlogListing } from './_components/BlogListing';

export const metadata: Metadata = {
  title: 'Blog | Prompt Enhancer',
  description: 'Discover the latest insights, tips, and techniques for prompt engineering and AI enhancement. Learn from experts and improve your prompt crafting skills.',
  keywords: [
    'prompt engineering',
    'AI prompts',
    'prompt optimization',
    'AI techniques',
    'prompt frameworks',
    'artificial intelligence',
    'machine learning',
    'prompt design',
    'AI best practices'
  ],
  openGraph: {
    title: 'Blog | Prompt Enhancer',
    description: 'Discover the latest insights, tips, and techniques for prompt engineering and AI enhancement.',
    type: 'website',
    url: '/blog',
    images: [
      {
        url: '/og-blog.png',
        width: 1200,
        height: 630,
        alt: 'Prompt Enhancer Blog'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Prompt Enhancer',
    description: 'Discover the latest insights, tips, and techniques for prompt engineering and AI enhancement.',
    images: ['/og-blog.png']
  },
  alternates: {
    canonical: '/blog'
  }
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-text-primary mb-8 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary bg-clip-text text-transparent">
                Prompt Engineering
              </span>
              <br />
              <span className="text-text-primary">Blog</span>
            </h1>
            <p className="text-xl sm:text-2xl text-text-secondary max-w-4xl mx-auto leading-relaxed font-light">
              Discover the latest insights, tips, and techniques for prompt engineering and AI enhancement.
              Learn from experts and improve your prompt crafting skills.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <BlogListing />
        </div>
      </section>
    </div>
  );
}
