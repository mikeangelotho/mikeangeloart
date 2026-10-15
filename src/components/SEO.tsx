import { Title, Meta, Link } from "@solidjs/meta";
import { createMemo, For, Show } from "solid-js";
import { generateBreadcrumbList, generateLocalBusiness, generateOrganization } from "~/utils/schema";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
  breadcrumbs?: Array<{ name: string; url: string }>;
  localBusiness?: boolean;
  organization?: boolean;
  twitterSite?: string;
  facebookDomainId?: string;
}

const defaultTitle = "Mike Angelo | Art Director & Multidisciplinary Designer";
const defaultDescription = "Mike Angelo is an art director and multidisciplinary designer in New Jersey and New York, creating brands, campaigns, and digital experiences from concept through production.";

export default function SEO(props: SEOProps) {
  const title = () => props.title ?? defaultTitle;
  const description = () => props.description ?? defaultDescription;
  const image = () => new URL(props.ogImage || "https://cdn.mikeangelo.art/og-default.png", "https://mikeangelo.art").href;
  const structuredData = createMemo(() => {
    const data: Record<string, unknown>[] = [];
    if (props.jsonLd) data.push(props.jsonLd);
    if (props.breadcrumbs?.length) data.push(generateBreadcrumbList(props.breadcrumbs));
    if (props.localBusiness) data.push(generateLocalBusiness());
    if (props.organization) data.push(generateOrganization());
    return data;
  });

  return (
    <>
      <Title>{title()}</Title>
      <Meta name="description" content={description()} />
      <Show when={props.canonical}>
        <Link rel="canonical" href={props.canonical!} />
      </Show>
      <Show when={props.noindex}>
        <Meta name="robots" content="noindex, follow" />
      </Show>
      <Meta property="og:type" content={props.ogType ?? "website"} />
      <Meta property="og:title" content={title()} />
      <Meta property="og:description" content={description()} />
      <Meta property="og:image" content={image()} />
      <Show when={props.canonical}>
        <Meta property="og:url" content={props.canonical!} />
      </Show>
      <Meta property="og:site_name" content="Mike Angelo - Art Director & Multidisciplinary Designer" />
      <Meta property="og:locale" content="en_US" />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={title()} />
      <Meta name="twitter:description" content={description()} />
      <Meta name="twitter:image" content={image()} />
      <Show when={props.twitterSite}>
        <Meta name="twitter:site" content={props.twitterSite!} />
        <Meta name="twitter:creator" content={props.twitterSite!} />
      </Show>
      <Show when={props.facebookDomainId}>
        <Meta name="facebook-domain-verification" content={props.facebookDomainId!} />
      </Show>
      <Meta name="author" content="Mike Angelo" />
      <For each={structuredData()}>
        {(schema) => (
          <script type="application/ld+json" innerHTML={JSON.stringify(schema).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")} />
        )}
      </For>
    </>
  );
}
