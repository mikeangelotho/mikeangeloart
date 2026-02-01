/**
 * Slug & URL utilities
 * Designed for stability, readability, and AI-friendly indexing
 */

// Generate a clean, deterministic, SEO-safe slug
export function generateSlug(input: string): string {
  return input
    .normalize("NFKD")                    // Handle accented characters
    .toLowerCase()
    .trim()
    .replace(/[\u0300-\u036f]/g, "")      // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "")         // Remove non-url-safe characters
    .replace(/[\s_-]+/g, "-")             // Normalize separators
    .replace(/^-+|-+$/g, "");             // Trim hyphens
}

// Validate slug structure (used before routing or indexing)
export function validateSlug(slug: string): boolean {
  return (
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) &&
    slug.length >= 3 &&
    slug.length <= 80
  );
}

// Generate canonical project URL
export function generateCategoryUrl(category: string, slug: string): string {
  return `/projects/${generateSlug(category)}/${slug}`;
}

// Derive category from explicit tags first, then title heuristics
export function extractCategory(tags: string[], title: string): string {
  const normalizedTags = tags.map(t => t.toLowerCase());

  const categoryMap: Record<string, string[]> = {
    "web-design": ["web", "website", "frontend", "ui", "ux"],
    "branding": ["brand", "identity", "logo"],
    "art-direction": ["art direction", "creative direction"],
    "advertising": ["campaign", "advertising"],
    "content": ["content", "social"],
    "creative-technology": ["interactive", "experimental", "tech"]
  };

  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (
      normalizedTags.some(tag =>
        keywords.some(keyword => tag.includes(keyword))
      )
    ) {
      return category;
    }
  }

  const titleLower = title.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(keyword => titleLower.includes(keyword))) {
      return category;
    }
  }

  return "general";
}

// Generate pagination + filter URL (stable + shareable)
export function generatePaginationUrl(
  page = 1,
  category?: string,
  client?: string,
  tags?: string[]
): string {
  const params = new URLSearchParams();

  if (page > 1) params.set("page", String(page));
  if (category && category !== "all") params.set("category", category);
  if (client && client !== "all") params.set("client", client);
  if (tags?.length) params.set("tags", tags.join(","));

  const query = params.toString();
  return `/projects${query ? `?${query}` : ""}`;
}

// Parse query params safely for filters/search
export function parseFilterParams(
  searchParams: Record<string, string | undefined>
) {
  return {
    page: Math.max(1, Number(searchParams.page) || 1),
    category: searchParams.category || "all",
    client: searchParams.client || "",
    tags: searchParams.tags?.split(",").filter(Boolean) ?? [],
    search: searchParams.search || ""
  };
}
