"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Search, Filter, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Mock blog data - in a real app, this would come from a CMS or API
const BLOG_POSTS = [
  {
    id: '1',
    title: 'STAR Framework for AI Prompts: Structure Better Requests (+ Examples)',
    excerpt: 'Use the STAR framework (Situation, Task, Action, Result) to write clear, outcome-driven AI prompts. Real examples, templates, and best practices.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '7 min read',
    category: 'Frameworks',
    tags: ['STAR', 'Structure', 'Beginner', 'Templates'],
    featuredImage: '/blog/star-framework.jpg',
    slug: 'mastering-star-framework'
  },
  {
    id: '2',
    title: 'Tree of Thought (ToT) Prompting: Branching Reasoning for Better Results',
    excerpt: 'Use Tree of Thought prompting to explore multiple solution paths and select the best approach. Includes pruning, depth control, and examples.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '10 min read',
    category: 'Advanced',
    tags: ['Tree of Thought', 'Advanced', 'Creativity', 'Problem Solving'],
    featuredImage: '/blog/tree-of-thought.jpg',
    slug: 'advanced-tree-of-thought'
  },
  {
    id: '3',
    title: 'Constitutional AI Prompting: Ethical Guardrails for Safer Outputs',
    excerpt: 'Build safer prompts using Constitutional AI. Learn guardrail patterns, audit checklists, and real examples for ethical AI.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '8 min read',
    category: 'Ethics',
    tags: ['Constitutional AI', 'Ethics', 'Safety', 'Guardrails'],
    featuredImage: '/blog/constitutional-ai.jpg',
    slug: 'constitutional-ai-ethical-prompts'
  },
  {
    id: '4',
    title: 'Storytelling Prompts: Narrative Structures that Make AI Content Engaging',
    excerpt: 'Use narrative frameworks (AIDA, AFOREST, Hero\'s Journey) to craft engaging AI content. Templates, tone controls, and examples.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '9 min read',
    category: 'Creative Writing',
    tags: ['Storytelling', 'Narrative', 'Content Creation', 'AIDA'],
    featuredImage: '/blog/storytelling-techniques.jpg',
    slug: 'storytelling-techniques-ai-content'
  },
  {
    id: '5',
    title: 'SCAMPER Prompts: 7 Lenses to Unlock Creative Solutions',
    excerpt: 'Use SCAMPER (Substitute, Combine, Adapt, Modify, Put to Another Use, Eliminate, Reverse) to generate innovative ideas with AI.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '6 min read',
    category: 'Creativity',
    tags: ['SCAMPER', 'Problem Solving', 'Innovation', 'Brainstorming'],
    featuredImage: '/blog/scamper-method.jpg',
    slug: 'scamper-method-creative-problem-solving'
  },
  {
    id: '6',
    title: 'Meta‑Prompting: Recursive Techniques to Generate and Improve Prompts',
    excerpt: 'Use meta‑prompting to generate, critique, and refine prompts automatically. Includes scoring rubrics and reflection loops.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '11 min read',
    category: 'Advanced',
    tags: ['Meta-Prompting', 'Optimization', 'Advanced', 'Recursive'],
    featuredImage: '/blog/meta-prompting.jpg',
    slug: 'meta-prompting-better-prompts'
  },
  {
    id: '7',
    title: 'CO‑STAR Framework for AI Prompts: From Vague Requests to Clear Results',
    excerpt: 'Use CO‑STAR (Context, Objective, Style, Tone, Audience, Response) to design consistent, high‑quality AI prompts. Includes templates and examples.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '8 min read',
    category: 'Frameworks',
    tags: ['CO-STAR', 'Structure', 'Professional', 'Templates'],
    featuredImage: '/blog/co-star-framework.jpg',
    slug: 'co-star-framework-prompts'
  },
  {
    id: '8',
    title: 'CRISPE Framework: Make Prompts Clear and Consistent',
    excerpt: 'Write precise, reliable prompts with CRISPE. Improve clarity, add parameters, and show examples for consistent AI outputs.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '7 min read',
    category: 'Frameworks',
    tags: ['CRISPE', 'Clarity', 'Parameters', 'Examples'],
    featuredImage: '/blog/crispe-framework.jpg',
    slug: 'crispe-framework-prompts'
  },
  {
    id: '9',
    title: 'OKR AI Prompts: Plan Objectives and Key Results with AI (Templates)',
    excerpt: 'Use AI to create and refine OKRs. Includes OKR prompting templates, examples by team, and best practices.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '9 min read',
    category: 'Strategic Planning',
    tags: ['OKR', 'Planning', 'Strategy', 'Templates'],
    featuredImage: '/blog/okr-prompts.jpg',
    slug: 'okr-ai-prompts-templates'
  },
  {
    id: '10',
    title: 'AI SWOT Prompts: Generate Strategic SWOT Analyses Fast',
    excerpt: 'Create SWOT analyses with AI. Strategic prompts, competitive analysis, and examples for product and go‑to‑market teams.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '8 min read',
    category: 'Strategic Planning',
    tags: ['SWOT', 'Strategy', 'Analysis', 'Competitive'],
    featuredImage: '/blog/swot-analysis.jpg',
    slug: 'ai-swot-analysis-prompts'
  },
  {
    id: '11',
    title: 'PDCA Cycle for AI Prompts: Plan-Do-Check-Act for Continuous Improvement',
    excerpt: 'Use the PDCA cycle (Plan-Do-Check-Act) to systematically improve your AI prompts. Learn how continuous improvement principles enhance prompt performance.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '12 min read',
    category: 'Frameworks',
    tags: ['PDCA', 'Continuous Improvement', 'Testing', 'Optimization'],
    featuredImage: '/blog/pdca-cycle.jpg',
    slug: 'pdca-cycle-continuous-improvement'
  },
  {
    id: '12',
    title: 'MoSCoW Method for AI Prompts: Must Have, Should Have, Could Have Prioritization',
    excerpt: 'Use the MoSCoW method (Must have, Should have, Could have, Won\'t have) to prioritize AI prompt requirements and features for better results.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '10 min read',
    category: 'Frameworks',
    tags: ['MoSCoW', 'Prioritization', 'Requirements', 'Scope Management'],
    featuredImage: '/blog/moscow-method.jpg',
    slug: 'moscow-method-prioritization'
  },
  {
    id: '13',
    title: 'RACI Matrix for AI Prompts: Responsible, Accountable, Consulted, Informed Framework',
    excerpt: 'Use the RACI matrix (Responsible, Accountable, Consulted, Informed) to clarify stakeholder roles and responsibilities in AI-generated content and decisions.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '11 min read',
    category: 'Frameworks',
    tags: ['RACI', 'Stakeholder Management', 'Decision Making', 'Communication'],
    featuredImage: '/blog/raci-matrix.jpg',
    slug: 'raci-matrix-stakeholder-framework'
  },
  {
    id: '14',
    title: 'PREP Method for AI Prompts: Point, Reason, Example, Point Communication Structure',
    excerpt: 'Use the PREP method (Point, Reason, Example, Point) to structure clear, persuasive AI-generated communications and presentations.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '9 min read',
    category: 'Frameworks',
    tags: ['PREP', 'Communication', 'Persuasion', 'Structure'],
    featuredImage: '/blog/prep-method.jpg',
    slug: 'prep-method-communication-structure'
  },
  {
    id: '15',
    title: 'TAG Framework for AI Prompts: Task, Action, Goal Structured Approach',
    excerpt: 'Use the TAG framework (Task, Action, Goal) to create focused, actionable AI prompts that deliver specific outcomes efficiently.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '10 min read',
    category: 'Frameworks',
    tags: ['TAG', 'Structure', 'Task Management', 'Goal Setting'],
    featuredImage: '/blog/tag-framework.jpg',
    slug: 'tag-framework-structured-approach'
  },
  {
    id: '16',
    title: 'Porter\'s Five Forces for AI Prompts: Competitive Analysis Framework for Market Positioning',
    excerpt: 'Use Porter\'s Five Forces framework to analyze competitive landscapes and market positioning with AI. Includes templates for strategic business analysis.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '13 min read',
    category: 'Strategic Planning',
    tags: ['Porter\'s Five Forces', 'Competitive Analysis', 'Strategy', 'Market Analysis'],
    featuredImage: '/blog/porters-five-forces.jpg',
    slug: 'porters-five-forces-competitive-analysis'
  },
  {
    id: '17',
    title: 'BCG Matrix for AI Prompts: Business Portfolio Analysis (Stars, Cash Cows, Question Marks, Dogs)',
    excerpt: 'Use the BCG Matrix to analyze business portfolios and make strategic investment decisions with AI. Includes templates for Stars, Cash Cows, Question Marks, and Dogs.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '12 min read',
    category: 'Strategic Planning',
    tags: ['BCG Matrix', 'Portfolio Analysis', 'Strategy', 'Investment Decisions'],
    featuredImage: '/blog/bcg-matrix.jpg',
    slug: 'bcg-matrix-portfolio-analysis'
  },
  {
    id: '18',
    title: 'Ansoff Matrix for AI Prompts: Growth Strategy Framework (Market Penetration, Development, etc.)',
    excerpt: 'Use the Ansoff Matrix to develop growth strategies with AI. Analyze market penetration, market development, product development, and diversification options.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '11 min read',
    category: 'Strategic Planning',
    tags: ['Ansoff Matrix', 'Growth Strategy', 'Market Development', 'Product Development'],
    featuredImage: '/blog/ansoff-matrix.jpg',
    slug: 'ansoff-matrix-growth-strategy'
  },
  {
    id: '19',
    title: 'PEST Analysis for AI Prompts: Political, Economic, Social, Technological Environmental Analysis',
    excerpt: 'Use PEST Analysis to evaluate macro-environmental factors with AI. Analyze Political, Economic, Social, and Technological influences on business strategy.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '12 min read',
    category: 'Strategic Planning',
    tags: ['PEST Analysis', 'Macro Environment', 'Strategic Planning', 'External Analysis'],
    featuredImage: '/blog/pest-analysis.jpg',
    slug: 'pest-analysis-macro-environment'
  },
  {
    id: '20',
    title: 'Balanced Scorecard for AI Prompts: Strategic Performance Measurement Framework',
    excerpt: 'Use the Balanced Scorecard to measure strategic performance with AI. Analyze Financial, Customer, Internal Process, and Learning & Growth perspectives.',
    content: 'Full blog post content would go here...',
    author: 'Mohammed Arafat Khot',
    publishedAt: '2025-08-12',
    readTime: '13 min read',
    category: 'Strategic Planning',
    tags: ['Balanced Scorecard', 'Performance Measurement', 'Strategic Planning', 'KPIs'],
    featuredImage: '/blog/balanced-scorecard.jpg',
    slug: 'balanced-scorecard-performance-measurement'
  }
];

const CATEGORIES = ['All', 'Frameworks', 'Advanced', 'Ethics', 'Creative Writing', 'Creativity', 'Strategic Planning'];

// Export the blog posts data for use in other components
export { BLOG_POSTS };

export function BlogListing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort posts
  const filteredPosts = BLOG_POSTS
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-text-secondary">
        {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
      </div>

      {/* Blog Posts Grid */}
      <AnimatePresence mode="wait">
        {filteredPosts.length > 0 ? (
          <motion.div
            key="posts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="no-posts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No posts found</h3>
            <p className="text-text-secondary">Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface BlogCardProps {
  post: typeof BLOG_POSTS[0];
  index: number;
}

function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card overflow-hidden hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 group hover:scale-[1.02] hover:-translate-y-2"
    >
      {/* Featured Image */}
      <div className="relative h-56 bg-gradient-to-br from-brand-primary/25 via-brand-secondary/20 to-brand-primary/15 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-xs font-semibold rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
            {post.category}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-7xl opacity-15 group-hover:opacity-25 transition-opacity duration-300 filter blur-[0.5px]">📝</div>
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-text-muted mb-4">
          <div className="flex items-center gap-2 px-2 py-1 bg-surface-secondary/50 rounded-full">
            <Calendar className="w-3 h-3 text-brand-primary" />
            <span className="font-medium">{new Date(post.publishedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 bg-surface-secondary/50 rounded-full">
            <Clock className="w-3 h-3 text-brand-primary" />
            <span className="font-medium">{post.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-text-primary mb-4 line-clamp-2 group-hover:text-brand-primary transition-colors duration-300 leading-tight">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-text-secondary text-base leading-relaxed mb-6 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-gradient-to-r from-surface-secondary/80 to-surface-tertiary/60 text-text-secondary text-xs font-medium rounded-full border border-surface-tertiary/30 hover:border-brand-primary/40 transition-colors"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-3 py-1 text-text-muted text-xs font-medium">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-tertiary/30">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {post.author.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-text-secondary text-sm font-medium">{post.author}</span>
        </div>

        {/* Read More */}
        <Button
          variant="outline"
          size="sm"
          className="w-full group-hover:bg-gradient-to-r group-hover:from-brand-primary group-hover:to-brand-secondary group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 font-semibold"
          onClick={() => {
            // Navigate to individual blog post
            window.location.href = `/blog/${post.slug}`;
          }}
        >
          Read More
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </div>
    </motion.article>
  );
}
