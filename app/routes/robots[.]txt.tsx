import type { LoaderFunction } from "@remix-run/node";

/**
 * Generate robots.txt to control search engine crawling
 */
export const loader: LoaderFunction = async () => {
  const robotsTxt = `
# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow: /auth/
Disallow: /vehicles/
Disallow: /dashboard/
Disallow: /mobileApp/
Disallow: /api/

# Allow crawling of important public pages
Allow: /
Allow: /about
Allow: /contact
Allow: /terms
Allow: /privacy
Allow: /sitemap.xml

# Sitemap
Sitemap: https://relynrelax.com/sitemap.xml
`.trim();

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
