/**
 * Schema generators
 * Clean, canonical, and aligned with current SEO + AI parsing behavior
 */

// BreadcrumbList schema
export function generateBreadcrumbList(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url
    }))
  };
}

// Import LocalBusiness schema
import { generateNYCLocalBusinessSchema } from "./nycSeo";

// LocalBusiness (primary business entity)
export function generateLocalBusiness() {
  return generateNYCLocalBusinessSchema();
}

// Organization schema (lightweight, brand-level)
export function generateOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mike Angelo — Art Director & Web Developer",
    url: "https://mikeangelo.art",
    logo: "https://mikeangelo.art/favicon.svg",
    description:
      "Independent art director and web developer working with brands and startups across New Jersey and New York City.",
    sameAs: [
      "https://linkedin.com/in/mikeangelotho",
      "https://www.behance.net/mikeangelotho"
    ]
  };
}

// Service schema (used for pages / sections, not global business identity)
export function generateService(
  serviceName: string,
  description: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description,
    provider: {
      "@type": "LocalBusiness",
      name: "Mike Angelo — Art Director & Web Developer",
      url: "https://mikeangelo.art"
    },
    areaServed: {
      "@type": "Place",
      name: "New York City & Northern New Jersey"
    }
  };
}
