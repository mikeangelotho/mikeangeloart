/**
 * Schema generators
 * Clean, canonical, and aligned with current SEO + AI parsing behavior
 */

export function generateBreadcrumbList(
  breadcrumbs: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };
}

import { generateNYCLocalBusinessSchema } from "./nycSeo";

export function generateLocalBusiness() {
  return generateNYCLocalBusinessSchema();
}

export function generateOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mike Angelo — Art Director & Multidisciplinary Designer",
    url: "https://mikeangelo.art",
    logo: "https://cdn.mikeangelo.art/favicon.svg",
    description:
      "Art director and multidisciplinary designer creating brands, campaigns, and digital experiences from concept through production across New Jersey and New York City.",
    sameAs: [
      "https://linkedin.com/in/mikeangelotho",
      "https://www.behance.net/mikeangelotho",
    ],
  };
}
