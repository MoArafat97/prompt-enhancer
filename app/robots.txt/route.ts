export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://promptenhancer.com/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow important pages
Allow: /blog/
Allow: /about
Allow: /contact
Allow: /pricing`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
