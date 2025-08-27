import { BLOG_POSTS } from '../blog/_components/BlogListing';

export async function GET() {
  const baseUrl = 'https://promptenhancer.com';

  // Static pages
  const staticPages = [
    '',
    '/blog',
    '/about',
    '/contact',
    '/pricing'
  ];

  // Blog posts - add safety check
  const blogPages = Array.isArray(BLOG_POSTS) ? BLOG_POSTS.map(post => `/blog/${post.slug}`) : [];

  const allPages = [...staticPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page => {
    const blogPost = Array.isArray(BLOG_POSTS) ? BLOG_POSTS.find(post => `/blog/${post.slug}` === page) : null;
    const lastModified = blogPost ? (blogPost.publishedAt || (blogPost as any).date || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0];
    const priority = page === '' ? '1.0' : page === '/blog' ? '0.9' : page.startsWith('/blog/') ? '0.8' : '0.7';
    
    return `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${page.startsWith('/blog/') ? 'monthly' : 'weekly'}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
