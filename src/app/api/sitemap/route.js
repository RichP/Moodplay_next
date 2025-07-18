import { NextResponse } from 'next/server';


// Helper to get the correct base URL for any environment
function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT || 3000}`);
}

// Example: fetch dynamic slugs from your DB or API
async function getDynamicRoutes() {
  const baseUrl = getBaseUrl();
  const [gamesRes, blogRes] = await Promise.all([
    fetch(`${baseUrl}/api/games`),
    fetch(`${baseUrl}/api/blog-posts`)
  ]);
  const games = gamesRes.ok ? await gamesRes.json() : [];
  const blogs = blogRes.ok ? await blogRes.json() : [];
  return {
    gameSlugs: games.map(g => g.slug || g.id),
    blogSlugs: blogs.map(b => b.slug || b.id)
  };
}

export async function GET() {
  const baseUrl = getBaseUrl();
  const staticRoutes = [
    '',
    'about',
    'contact',
    'privacy',
    'terms',
    'suggest',
    'blog',
  ];
  const { gameSlugs, blogSlugs } = await getDynamicRoutes();

  let urls = staticRoutes.map(
    (route) => `<url><loc>${baseUrl}/${route}</loc></url>`
  );
  urls = urls.concat(
    gameSlugs.map(
      (slug) => `<url><loc>${baseUrl}/games/${slug}</loc></url>`
    )
  );
  urls = urls.concat(
    blogSlugs.map(
      (slug) => `<url><loc>${baseUrl}/blog/${slug}</loc></url>`
    )
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.join('\n      ')}
    </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
  'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=60',
    },
  });
}
