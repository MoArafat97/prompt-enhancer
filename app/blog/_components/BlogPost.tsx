"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark, Tag, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BLOG_POSTS } from './BlogListing';
import remarkGfm from 'remark-gfm';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    publishedAt?: string;
    date?: string; // Legacy support
    readTime: string;
    category: string;
    tags: string[];
    featuredImage?: string;
    slug?: string;
    metaDescription?: string;
    keywords?: string[];
    relatedSlugs?: string[];
  };
}

// Smart routing utility function
function useSmartRouting() {
  const router = useRouter();
  const { user } = useAuth();

  const navigateToApp = () => {
    if (user) {
      // User is authenticated - go to dashboard
      router.push('/dashboard/workspace');
    } else {
      // User is not authenticated - go to homepage
      router.push('/');
    }
  };

  return { navigateToApp, isAuthenticated: !!user };
}

// Markdown Link Component with smart routing
function MarkdownLink({ href, children, ...props }: any) {
  const { navigateToApp } = useSmartRouting();
  const router = useRouter();

  const isExternal = href?.startsWith('http');
  const isInternal = href?.startsWith('/');
  const isHomepageLink = href === '/';

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-primary hover:text-brand-primary/80 transition-colors inline-flex items-center gap-1"
        {...props}
      >
        {children}
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  }

  if (isHomepageLink) {
    // Use smart routing for homepage links (these are likely CTAs)
    return (
      <button
        onClick={navigateToApp}
        className="text-brand-primary hover:text-brand-primary/80 transition-colors cursor-pointer font-semibold"
        {...props}
      >
        {children}
      </button>
    );
  }

  if (isInternal) {
    return (
      <button
        onClick={() => router.push(href)}
        className="text-brand-primary hover:text-brand-primary/80 transition-colors cursor-pointer"
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <a href={href} className="text-brand-primary hover:text-brand-primary/80 transition-colors" {...props}>
      {children}
    </a>
  );
}

// Author Bio Component with smart routing
function AuthorBio({ post }: { post: BlogPostProps['post'] }) {
  const { navigateToApp } = useSmartRouting();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="mt-16 p-8 bg-gradient-to-br from-surface-secondary/80 to-surface-tertiary/60 rounded-2xl border border-surface-tertiary/40 backdrop-blur-sm"
    >
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
          {post.author.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-text-primary mb-3">
            {post.author}
          </h3>
          <p className="text-text-secondary leading-relaxed mb-6">
            Expert in prompt engineering and AI optimization. Passionate about helping others
            unlock the full potential of AI through better prompting techniques.
          </p>
          <div className="pt-6 border-t border-surface-tertiary/50">
            <p className="text-text-secondary leading-relaxed">
              Want to apply these techniques to your own prompts?{' '}
              <button
                onClick={navigateToApp}
                className="text-brand-primary hover:text-brand-primary/80 underline underline-offset-2 transition-all duration-300 font-semibold hover:scale-105 inline-block"
              >
                Try our prompt enhancement tool
              </button>
              {' '}to see these frameworks in action.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Subtle CTA Component - Value-first approach with smart routing
function SoftCTA({
  context,
  suggestion,
  linkText = "explore the tool",
  type = "inline"
}: {
  context: string;
  suggestion: string;
  linkText?: string;
  type?: "inline" | "section";
}) {
  const { navigateToApp } = useSmartRouting();

  if (type === "inline") {
    return (
      <div className="my-8 p-6 bg-gradient-to-r from-surface-secondary/60 to-surface-tertiary/40 border-l-4 border-brand-primary/50 rounded-r-xl backdrop-blur-sm">
        <p className="text-text-secondary leading-relaxed text-base">
          <span className="text-text-primary font-semibold">{context}</span> {suggestion}{' '}
          <button
            onClick={navigateToApp}
            className="text-brand-primary hover:text-brand-primary/80 underline underline-offset-2 transition-all duration-300 font-semibold hover:scale-105 inline-block"
          >
            {linkText}
          </button>
          {' '}to see these concepts in action.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-10 p-8 bg-gradient-to-br from-surface-secondary/80 to-surface-tertiary/60 border border-surface-tertiary/60 rounded-2xl backdrop-blur-sm shadow-xl"
    >
      <div className="space-y-4">
        <p className="text-text-secondary leading-relaxed text-lg">
          <span className="text-text-primary font-semibold">{context}</span> {suggestion}
        </p>
        <button
          onClick={navigateToApp}
          className="inline-flex items-center gap-3 text-brand-primary hover:text-brand-primary/80 transition-all duration-300 font-semibold text-lg group hover:scale-105"
        >
          {linkText}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

// Function to subtly insert contextual CTAs into content
function insertSubtleCTAs(content: string, postTitle: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let sectionCount = 0;
  let hasInsertedMidCTA = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    result.push(line);

    // Count sections (headers)
    if (line.startsWith('##') && !line.startsWith('###')) {
      sectionCount++;

      // Insert subtle mid-content CTA after examples section (usually around section 4-5)
      if (sectionCount === 4 && !hasInsertedMidCTA &&
          (line.toLowerCase().includes('example') || line.toLowerCase().includes('practice') || line.toLowerCase().includes('application'))) {
        result.push('');
        result.push('{{CONTEXTUAL_CTA}}');
        result.push('');
        hasInsertedMidCTA = true;
      }
    }

    // Replace aggressive "Ready to" sections with subtle suggestions
    if (line.includes('Ready to') || line.includes('## Ready')) {
      result.splice(-1, 1); // Remove the "Ready to" line
      result.push('');
      result.push('{{SOFT_CONCLUSION}}');
      result.push('');
    }
  }

  return result.join('\n');
}

// Function to render content with subtle CTAs
function renderContentWithSubtleCTAs(content: string, postTitle: string) {
  const contentWithCTAs = insertSubtleCTAs(content, postTitle);
  const parts = contentWithCTAs.split(/{{(CONTEXTUAL_CTA|SOFT_CONCLUSION)}}/);

  return parts.map((part, index) => {
    if (part === 'CONTEXTUAL_CTA') {
      return (
        <SoftCTA
          key={`cta-${index}`}
          context="Now that you've seen these examples in action,"
          suggestion="you might find it helpful to experiment with these patterns yourself. Feel free to"
          linkText="try our interactive tool"
          type="inline"
        />
      );
    }

    if (part === 'SOFT_CONCLUSION') {
      return (
        <SoftCTA
          key={`cta-${index}`}
          context="Want to put these concepts into practice?"
          suggestion="Our prompt enhancement tool includes all the frameworks covered in this guide, making it easy to apply what you've learned."
          linkText="Explore the tool"
          type="section"
        />
      );
    }

    if (part && part.trim()) {
      return (
        <ReactMarkdown
          key={`content-${index}`}
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const inline = !match;
              return !inline && match ? (
                <SyntaxHighlighter
                  style={tomorrow}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            table({ children, ...props }: any) {
              return (
                <div className="overflow-x-auto my-6">
                  <table className="w-full border-collapse bg-surface-secondary rounded-lg overflow-hidden shadow-lg" {...props}>
                    {children}
                  </table>
                </div>
              );
            },
            thead({ children, ...props }: any) {
              return (
                <thead className="bg-surface-tertiary" {...props}>
                  {children}
                </thead>
              );
            },
            th({ children, ...props }: any) {
              return (
                <th className="text-text-primary font-semibold p-4 text-left border-b border-surface-tertiary" {...props}>
                  {children}
                </th>
              );
            },
            td({ children, ...props }: any) {
              return (
                <td className="text-text-secondary p-4 border-b border-surface-tertiary/50" {...props}>
                  {children}
                </td>
              );
            },
            tr({ children, ...props }: any) {
              return (
                <tr className="hover:bg-surface-tertiary/30 transition-colors" {...props}>
                  {children}
                </tr>
              );
            },
            a: MarkdownLink,
          }}
        >
          {part}
        </ReactMarkdown>
      );
    }

    return null;
  });
}

export function BlogPost({ post }: BlogPostProps) {
  const router = useRouter();

  // Handle legacy date property and provide fallbacks
  const publishedDate = post.publishedAt || post.date || '2024-01-01';
  const featuredImage = post.featuredImage || '/blog/default-featured.jpg';
  const slug = post.slug || post.id;

  // Generate JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription || post.excerpt,
    "image": featuredImage,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Prompt Enhancer",
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png"
      }
    },
    "datePublished": publishedDate,
    "dateModified": publishedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://promptenhancer.com/blog/${slug}`
    },
    "keywords": post.keywords?.join(", ") || post.tags.join(", "),
    "articleSection": post.category,
    "wordCount": post.content.split(' ').length
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-8 px-4 sm:px-6 lg:px-8 border-b border-surface-tertiary">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 text-center"
          >
            {/* Category Badge */}
            <div>
              <span className="px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-text-primary leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-text-primary via-brand-primary to-text-primary bg-clip-text text-transparent">
                {post.title}
              </span>
            </h1>

            {/* Excerpt */}
            <p className="text-xl sm:text-2xl text-text-secondary leading-relaxed max-w-4xl mx-auto font-light">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-text-muted">
              <div className="flex items-center gap-3 px-4 py-2 bg-surface-secondary/50 rounded-full backdrop-blur-sm">
                <User className="w-5 h-5 text-brand-primary" />
                <span className="font-semibold text-text-secondary">{post.author}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-surface-secondary/50 rounded-full backdrop-blur-sm">
                <Calendar className="w-5 h-5 text-brand-primary" />
                <span className="font-medium text-text-secondary">{new Date(publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-surface-secondary/50 rounded-full backdrop-blur-sm">
                <Clock className="w-5 h-5 text-brand-primary" />
                <span className="font-medium text-text-secondary">{post.readTime}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4 pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2 hover:scale-105 transition-all duration-300 bg-surface-secondary/50 backdrop-blur-sm border-surface-tertiary/60 hover:border-brand-primary/50"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:scale-105 transition-all duration-300 bg-surface-secondary/50 backdrop-blur-sm border-surface-tertiary/60 hover:border-brand-primary/50"
              >
                <Bookmark className="w-4 h-4" />
                Save
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Featured Image */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative h-72 sm:h-96 lg:h-[28rem] bg-gradient-to-br from-brand-primary/20 via-brand-secondary/15 to-brand-primary/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-9xl opacity-15 filter blur-[1px]">📝</div>
            </div>
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-xl max-w-none
              prose-headings:text-text-primary prose-headings:font-bold prose-headings:leading-tight prose-headings:tracking-tight
              prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-12
              prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:border-b prose-h2:border-surface-tertiary/30 prose-h2:pb-3
              prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8
              prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6
              prose-p:text-text-secondary prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6
              prose-strong:text-text-primary prose-strong:font-bold
              prose-em:text-text-secondary prose-em:italic
              prose-code:text-brand-primary prose-code:bg-surface-secondary/80 prose-code:px-3 prose-code:py-1 prose-code:rounded-md prose-code:text-base prose-code:font-semibold prose-code:border prose-code:border-surface-tertiary/30
              prose-pre:bg-surface-secondary/80 prose-pre:border prose-pre:border-surface-tertiary/40 prose-pre:rounded-xl prose-pre:p-6 prose-pre:shadow-lg prose-pre:backdrop-blur-sm
              prose-a:text-brand-primary prose-a:no-underline hover:prose-a:text-brand-primary/80 prose-a:transition-all prose-a:duration-300 hover:prose-a:scale-105
              prose-blockquote:border-l-4 prose-blockquote:border-brand-primary/60 prose-blockquote:bg-gradient-to-r prose-blockquote:from-surface-secondary/60 prose-blockquote:to-surface-tertiary/40 prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-blockquote:text-text-secondary prose-blockquote:backdrop-blur-sm prose-blockquote:shadow-lg prose-blockquote:my-8
              prose-ul:text-text-secondary prose-ol:text-text-secondary prose-ul:space-y-2 prose-ol:space-y-2
              prose-li:text-text-secondary prose-li:leading-relaxed prose-li:text-lg
              prose-table:w-full prose-table:border-collapse prose-table:bg-surface-secondary/80 prose-table:rounded-xl prose-table:overflow-hidden prose-table:shadow-xl prose-table:backdrop-blur-sm prose-table:my-8
              prose-thead:bg-surface-tertiary/80
              prose-th:text-text-primary prose-th:font-bold prose-th:p-6 prose-th:text-left prose-th:border-b prose-th:border-surface-tertiary/50 prose-th:text-lg
              prose-td:text-text-secondary prose-td:p-6 prose-td:border-b prose-td:border-surface-tertiary/30 prose-td:text-lg
              prose-tr:hover:bg-surface-tertiary/40 prose-tr:transition-all prose-tr:duration-300"
          >
            {renderContentWithSubtleCTAs(post.content, post.title)}
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 pt-8 border-t border-surface-tertiary/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <Tag className="w-5 h-5 text-brand-primary" />
              <span className="text-lg font-semibold text-text-primary">Tags</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="px-4 py-2 bg-gradient-to-r from-surface-secondary/80 to-surface-tertiary/60 text-text-secondary text-sm font-medium rounded-full hover:from-brand-primary/20 hover:to-brand-secondary/20 hover:text-text-primary hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-sm border border-surface-tertiary/30 hover:border-brand-primary/40"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Related Reading */}
          {post.relatedSlugs && post.relatedSlugs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-12 pt-8 border-t border-surface-tertiary"
            >
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-brand-primary" />
                <h3 className="text-lg font-semibold text-text-primary">Related Reading</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {post.relatedSlugs.map(slug => {
                  const relatedPost = BLOG_POSTS.find(p => p.slug === slug);
                  if (!relatedPost) return null;

                  return (
                    <div
                      key={slug}
                      className="p-4 bg-surface-secondary rounded-lg hover:bg-surface-tertiary transition-colors cursor-pointer group"
                      onClick={() => router.push(`/blog/${slug}`)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">📝</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-text-primary text-sm line-clamp-2 group-hover:text-brand-primary transition-colors">
                            {relatedPost.title}
                          </h4>
                          <p className="text-xs text-text-muted mt-1">
                            {relatedPost.readTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}



          {/* Author Bio */}
          <AuthorBio post={post} />

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex justify-center"
          >
            <Button
              onClick={() => router.push('/blog')}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white"
            >
              View All Posts
            </Button>
          </motion.div>
        </div>
      </main>
      </div>
    </>
  );
}
