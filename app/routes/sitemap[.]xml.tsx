import type { LoaderFunction } from "@remix-run/node";

/**
 * Generate a sitemap for the site
 */
export const loader: LoaderFunction = async () => {
  // Set base URL
  const baseUrl = "https://relynrelax.com";

  // Define the public pages (exclude auth and dashboard pages)
  const publicRoutes = [
    { path: "/", lastModified: new Date().toISOString(), priority: 1.0 },
    { path: "/about", lastModified: new Date().toISOString(), priority: 0.8 },
    { path: "/contact", lastModified: new Date().toISOString(), priority: 0.8 },
    { path: "/terms", lastModified: new Date().toISOString(), priority: 0.5 },
    { path: "/privacy", lastModified: new Date().toISOString(), priority: 0.5 },
    { path: "/refund", lastModified: new Date().toISOString(), priority: 0.5 },
    {
      path: "/data-protection",
      lastModified: new Date().toISOString(),
      priority: 0.5,
    },
  ];

  // Generate the XML
  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${publicRoutes
        .map(
          (route) => `
        <url>
          <loc>${baseUrl}${route.path}</loc>
          <lastmod>${route.lastModified}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>${route.priority}</priority>
        </url>
      `
        )
        .join("")}
    </urlset>
  `.trim();

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
