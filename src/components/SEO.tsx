import { Title, Meta, Link } from "@solidjs/meta";
import { For, Show } from "solid-js";
import { generateBreadcrumbList, generateLocalBusiness, generateOrganization } from "~/utils/schema";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  jsonLd?: Record<string, any>;
  breadcrumbs?: Array<{ name: string; url: string }>;
  localBusiness?: boolean;
  organization?: boolean;
  twitterSite?: string;
  facebookDomainId?: string;
}

export default function SEO(props: SEOProps) {
  const {
    title = "Art Director & Web Designer in the greater New York area - Mike Angelo | Advertising Campaigns, Web Design, and Content Creation",
    description = "Mike Angelo is an Art Director & Web Designer serving the greater New York area, specializing in advertising campaigns, web design, and content creation.",
    canonical,
    ogImage = "/og-default.jpg",
    ogType = "website",
    noindex = false,
    jsonLd,
    breadcrumbs,
    localBusiness = false,
    organization = false,
    twitterSite,
    facebookDomainId
  } = props;

  const structuredData = [];
  
  // Add custom JSON-LD if provided
  if (jsonLd) {
    structuredData.push(jsonLd);
  }
  
  // Add breadcrumb list if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    structuredData.push(generateBreadcrumbList(breadcrumbs));
  }
  
  // Add LocalBusiness schema
  if (localBusiness) {
    structuredData.push(generateLocalBusiness());
  }
  
  // Add Organization schema
  if (organization) {
    structuredData.push(generateOrganization());
  }
  
  return (
    <>
      <Title>{title}</Title>
      <Meta name="description" content={description} />
      
      {/* Canonical URL */}
      <Show when={canonical}>
        <Link rel="canonical" href={canonical!} />
      </Show>
      
      {/* Robots */}
      <Show when={noindex}>
        <Meta name="robots" content="noindex, nofollow" />
      </Show>
      
      {/* Open Graph */}
      <Meta property="og:type" content={ogType} />
      <Meta property="og:title" content={title} />
      <Meta property="og:description" content={description} />
      <Meta property="og:image" content={ogImage} />
      <Show when={canonical}>
        <Meta property="og:url" content={canonical!} />
      </Show>
      <Meta property="og:site_name" content="Mike Angelo - Art Director & Web Designer" />
      <Meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={title} />
      <Meta name="twitter:description" content={description} />
      <Meta name="twitter:image" content={ogImage} />
      <Show when={twitterSite}>
        <Meta name="twitter:site" content={twitterSite!} />
        <Meta name="twitter:creator" content={twitterSite!} />
      </Show>
      
      {/* Facebook Domain Verification */}
      <Show when={facebookDomainId}>
        <Meta name="facebook-domain-verification" content={facebookDomainId!} />
      </Show>
      
      {/* Additional Meta */}
      <Meta name="author" content="Mike Angelo" />
      <Meta name="keywords" content="art director, web designer, new york, advertising campaigns, web design, content creation, portfolio" />
      <Meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Structured Data */}
      <For each={structuredData}>
        {(schema) => (
          <script type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        )}
      </For>
    </>
  );
}