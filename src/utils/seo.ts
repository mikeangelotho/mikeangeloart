/**
 * Clean slug generation utilities
 */

// Generate a clean, SEO-friendly slug from a string
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .replace(/--+/g, '-'); // Replace multiple hyphens with single
}

// Validate if a slug is clean and SEO-friendly
export function validateSlug(slug: string): boolean {
  // Must be lowercase, alphanumeric with hyphens only
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 100;
}

// Generate category-based URL structure
export function generateCategoryUrl(category: string, slug: string): string {
  const cleanCategory = generateSlug(category);
  return `/projects/${cleanCategory}/${slug}`;
}

// Extract category from tags or create one based on content
export function extractCategory(tags: string[], title: string): string {
  // Priority order for categories
  const categoryPriority = [
    'web design', 'website development', 'art direction', 
    'advertising', 'video editing', 'content creation',
    'branding', 'digital marketing', 'experiential marketing'
  ];
  
  // Look for priority tags first
  for (const priority of categoryPriority) {
    if (tags.some(tag => tag.toLowerCase().includes(priority))) {
      return priority.replace(/\s+/g, '-');
    }
  }
  
  // Fallback to analyzing title/content
  const titleLower = title.toLowerCase();
  if (titleLower.includes('web') || titleLower.includes('site')) return 'web-design';
  if (titleLower.includes('brand') || titleLower.includes('logo')) return 'branding';
  if (titleLower.includes('video') || titleLower.includes('campaign')) return 'advertising';
  if (titleLower.includes('social') || titleLower.includes('content')) return 'content';
  
  return 'general';
}

// Generate pagination URL structure
export function generatePaginationUrl(page: number, category?: string, tags?: string[]): string {
  const params = new URLSearchParams();
  
  if (page > 1) {
    params.set('page', page.toString());
  }
  
  if (category && category !== 'all') {
    params.set('category', category);
  }
  
  if (tags && tags.length > 0) {
    params.set('tags', tags.join(','));
  }
  
  const queryString = params.toString();
  return `/projects${queryString ? '?' + queryString : ''}`;
}

// Parse URL parameters for filtering
export function parseFilterParams(searchParams: Record<string, string>) {
  return {
    page: parseInt(searchParams.page) || 1,
    category: searchParams.category || 'all',
    tags: searchParams.tags ? searchParams.tags.split(',').filter(Boolean) : [],
    search: searchParams.search || ''
  };
}