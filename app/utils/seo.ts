/**
 * Utility functions for SEO optimization across routes
 */

interface SEOProps {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  imageUrl?: string;
  type?: string;
  noIndex?: boolean;
}

/**
 * Generate consistent SEO meta tags for all routes
 */
export function generateSEOMeta({
  title,
  description,
  path,
  keywords = "",
  imageUrl = "/images/og-image.png",
  type = "website",
  noIndex = false,
}: SEOProps) {
  const fullTitle = `${title} | relyNrelax`;
  const url = `https://relynrelax.com${path}`;

  return [
    { title: fullTitle },
    { name: "description", content: description },

    // Open Graph / Facebook
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:url", content: url },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },

    // Additional SEO
    { name: "keywords", content: `vehicle documents, relyNrelax, ${keywords}` },
    { name: "author", content: "relyNrelax" },
    {
      name: "robots",
      content: noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large",
    },
    { name: "canonical", content: url },
  ];
}

/**
 * Generate SEO meta tags specifically for the homepage
 */
export function generateHomePageSEO() {
  const title = "India's #1 Vehicle Document Reminder System";
  const description =
    "Never miss document renewals again. Get timely reminders for PUCC, Fitness, RC, and permit expirations. India's leading vehicle documentation management service.";

  return generateSEOMeta({
    title,
    description,
    path: "/",
    keywords:
      "PUCC expiry, fitness certificate, RC renewal, permit expiry, document reminders, vehicle compliance, automotive documents, vehicle management",
    imageUrl: "/images/og-homepage.png",
  });
}

/**
 * Generate SEO meta tags for dashboard pages (authenticated users)
 */
export function generateDashboardSEO(title: string, path: string) {
  return generateSEOMeta({
    title,
    description:
      "Manage your vehicle documents, view upcoming renewals, and set reminders for document expirations.",
    path,
    keywords:
      "dashboard, vehicle management, document tracking, renewal reminders",
    type: "web application",
    noIndex: true, // Dashboard pages shouldn't be indexed
  });
}

/**
 * Generate SEO meta tags for authentication pages
 */
export function generateAuthPageSEO(
  type: "login" | "signup" | "forgot-password"
) {
  const titles = {
    login: "Log In to Your Account",
    signup: "Create a New Account",
    "forgot-password": "Reset Your Password",
  };

  const descriptions = {
    login:
      "Log in to your relyNrelax account to manage your vehicle documents and access renewal reminders.",
    signup:
      "Create a new relyNrelax account to start managing your vehicle documents and get timely renewal reminders.",
    "forgot-password":
      "Reset your relyNrelax account password to regain access to your vehicle document management.",
  };

  const paths = {
    login: "/auth/login",
    signup: "/auth/login",
    "forgot-password": "/auth/forgot-password",
  };

  return generateSEOMeta({
    title: titles[type],
    description: descriptions[type],
    path: paths[type],
    noIndex: true, // Auth pages shouldn't be indexed
  });
}
