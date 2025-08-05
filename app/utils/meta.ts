import type { MetaFunction } from "@remix-run/node";

export const commonMeta = {
  "og:site_name": "EduManage",
  "og:type": "website",
  "twitter:card": "summary_large_image",
  "twitter:site": "@edumanage",
};

interface MetaOptions {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function generateMeta({
  title,
  description,
  keywords,
  ogImage = "/images/og-image.jpg",
  noIndex = false,
}: MetaOptions) {
  const metaTags = [
    { title: `${title} - EduManage` },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    ...Object.entries(commonMeta).map(([property, content]) => ({
      property,
      content,
    })),
  ];

  if (keywords) {
    metaTags.push({ name: "keywords", content: keywords });
  }

  if (noIndex) {
    metaTags.push(
      { name: "robots", content: "noindex,nofollow" },
      { name: "googlebot", content: "noindex,nofollow" }
    );
  }

  return metaTags;
}

export const defaultMetaFunction: MetaFunction = () => {
  return generateMeta({
    title: "Institute Management System",
    description:
      "Comprehensive institute management solution for modern educational institutions",
    keywords:
      "institute management, academics, admissions, student management, faculty management",
  });
};

export const generatePageMeta = (
  pageName: string,
  description: string,
  keywords?: string
): MetaFunction => {
  return () =>
    generateMeta({
      title: pageName,
      description,
      keywords,
    });
};

// Predefined meta functions for common pages
export const documentationMeta = generatePageMeta(
  "Documentation",
  "Comprehensive documentation and guides for EduManage's institute management system",
  "documentation, api reference, guides, tutorials, integration"
);

export const privacyMeta = generatePageMeta(
  "Privacy Policy",
  "EduManage's privacy policy and data protection practices",
  "privacy policy, data protection, security, GDPR compliance"
);

export const helpMeta = generatePageMeta(
  "Help Center",
  "Get support and answers to your questions about EduManage",
  "help center, support, FAQ, customer service"
);

export const featuresMeta = generatePageMeta(
  "Features",
  "Explore EduManage's powerful features for institute management",
  "academics, admissions, attendance, examinations, library management"
);

// Meta generator for dynamic content
export function generateDynamicMeta(
  baseTitle: string,
  data: { title?: string; description?: string }
): MetaFunction {
  return () =>
    generateMeta({
      title: data.title ? `${data.title} - ${baseTitle}` : baseTitle,
      description: data.description || "EduManage institute management system",
    });
}

// Meta generator for error pages
export function generateErrorMeta(statusCode: number): MetaFunction {
  return () => {
    const title = `${statusCode} - ${
      statusCode === 404 ? "Page Not Found" : "Error"
    }`;
    return generateMeta({
      title,
      description: `${title} - EduManage`,
      noIndex: true,
    });
  };
}

// Meta generator for auth pages
export function generateAuthMeta(action: string): MetaFunction {
  return () =>
    generateMeta({
      title: `${action} - Authentication`,
      description: `${action} to EduManage institute management system`,
      noIndex: true,
    });
}

// Meta generator for dashboard pages
export function generateDashboardMeta(section: string): MetaFunction {
  return () =>
    generateMeta({
      title: `${section} - Dashboard`,
      description: `Manage your institute's ${section.toLowerCase()} with EduManage`,
      noIndex: true,
    });
}

// Types for meta tag properties
export interface MetaTag {
  title?: string;
  name?: string;
  property?: string;
  content?: string;
}

// Utility function to merge meta tags
export function mergeMeta(
  baseMeta: MetaTag[],
  additionalMeta: MetaTag[]
): MetaTag[] {
  const merged = [...baseMeta];
  additionalMeta.forEach((tag) => {
    const existingIndex = merged.findIndex(
      (existing) =>
        (existing.name && existing.name === tag.name) ||
        (existing.property && existing.property === tag.property)
    );
    if (existingIndex >= 0) {
      merged[existingIndex] = tag;
    } else {
      merged.push(tag);
    }
  });
  return merged;
}
