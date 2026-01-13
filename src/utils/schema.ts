// BreadcrumbList schema generator
export function generateBreadcrumbList(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "item": breadcrumb.url
    }))
  };
}

// Import enhanced NYC Local SEO
import { generateNYCLocalBusinessSchema } from "./nycSeo";

// LocalBusiness schema for NYC targeting (legacy function for backward compatibility)
export function generateLocalBusiness() {
  return generateNYCLocalBusinessSchema();
}

// Organization schema
export function generateOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mike Angelo - Art Director & Web Designer",
    "url": "https://mikeangeloart.com",
    "logo": "https://mikeangeloart.com/favicon.svg",
    "description": "Art Director & Web Designer serving the greater New York area, specializing in advertising campaigns, web design, and content creation.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://linkedin.com/in/mikeangelo",
      "https://twitter.com/mikeangelo"
    ]
  };
}

// Service schema for service areas
export function generateService(serviceName: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "Mike Angelo - Art Director & Web Designer",
      "url": "https://mikeangeloart.com"
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "40.7128",
        "longitude": "-74.0060"
      },
      "geoRadius": "100"
    }
  };
}