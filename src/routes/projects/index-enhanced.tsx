import { For, Show, createMemo, createSignal } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import Collection, { PortfolioCollection } from "~/components/Collection";
import SEO from "~/components/SEO";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { parseFilterParams, extractCategory } from "~/utils/seo";
import data from "../../db.json";

const collectionData: PortfolioCollection[] = data;

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Parse filter parameters
  const filters = createMemo(() => parseFilterParams(searchParams));
  
  // Extract unique categories from all projects
  const categories = createMemo(() => {
    const categorySet = new Set<string>();
    collectionData.forEach(project => {
      const category = extractCategory(project.tags, project.title);
      categorySet.add(category);
    });
    return Array.from(categorySet).sort();
  });
  
  // Filter projects based on current filters
  const filteredProjects = createMemo(() => {
    const f = filters();
    let projects = [...collectionData];
    
    // Filter by category
    if (f.category && f.category !== 'all') {
      projects = projects.filter(project => {
        const projectCategory = extractCategory(project.tags, project.title);
        return projectCategory === f.category;
      });
    }
    
    // Filter by tags
    if (f.tags.length > 0) {
      projects = projects.filter(project => 
        f.tags.some(tag => project.tags.includes(tag))
      );
    }
    
    // Filter by search term
    if (f.search) {
      const searchLower = f.search.toLowerCase();
      projects = projects.filter(project => 
        project.title.toLowerCase().includes(searchLower) ||
        project.clientName.toLowerCase().includes(searchLower) ||
        project.projectObjective.toLowerCase().includes(searchLower) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return projects;
  });
  
  // Projects to display (with pagination)
  const projectsPerPage = 9;
  const paginatedProjects = createMemo(() => {
    const f = filters();
    const start = (f.page - 1) * projectsPerPage;
    return filteredProjects().slice(start, start + projectsPerPage);
  });
  
  const totalPages = createMemo(() => 
    Math.ceil(filteredProjects().length / projectsPerPage)
  );
  
  const handleCategoryChange = (category: string) => {
    const newParams = { ...searchParams };
    if (category === 'all') {
      delete newParams.category;
      delete newParams.page;
    } else {
      newParams.category = category;
      delete newParams.page;
    }
    setSearchParams(newParams);
  };
  
  const handleSearch = (searchTerm: string) => {
    const newParams = { ...searchParams };
    if (searchTerm) {
      newParams.search = searchTerm;
      delete newParams.page;
    } else {
      delete newParams.search;
      delete newParams.page;
    }
    setSearchParams(newParams);
  };
  
  return (
    <>
      <SEO
        title="Projects - Mike Angelo | Art Director & Web Designer Portfolio"
        description="Explore Mike Angelo's portfolio of art direction, web design, and advertising campaigns for clients in New York and beyond."
        canonical="https://mikeangeloart.com/projects"
        ogImage="/og-home.jpg"
        breadcrumbs={[
          { name: "Home", url: "https://mikeangeloart.com" },
          { name: "Projects", url: "https://mikeangeloart.com/projects" }
        ]}
        localBusiness={true}
        organization={true}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Portfolio Projects",
          "description": "A collection of art direction, web design, and advertising campaign projects by Mike Angelo.",
          "url": "https://mikeangeloart.com/projects",
          "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": filteredProjects().length,
            "itemListElement": paginatedProjects().map((project, index) => ({
              "@type": "ListItem",
              "position": (filters().page - 1) * projectsPerPage + index + 1,
              "name": project.title,
              "description": project.projectObjective,
              "url": `https://mikeangeloart.com/projects/${project.slug}`
            }))
          }
        }}
      />
      
      <main class="min-h-screen bg-white dark:bg-neutral-950">
        {/* Header with Breadcrumbs */}
        <div class="border-b border-black/10 dark:border-white/10">
          <div class="max-w-7xl mx-auto px-6 py-6">
            <Breadcrumbs
              items={[
                { name: "Home", url: "/" },
                { name: "Projects", url: "/projects" }
              ]}
            />
            
            <div class="mt-8">
              <h1 class="text-3xl lg:text-4xl font-bold text-black dark:text-white mb-4">
                Projects
              </h1>
              <p class="text-lg text-black/70 dark:text-white/70 max-w-2xl">
                A curated collection of art direction, web design, and advertising campaign projects 
                that showcase creativity, strategy, and measurable results.
              </p>
            </div>
          </div>
        </div>
        
        {/* Filters Section */}
        <div class="bg-white/50 dark:bg-neutral-950/50 backdrop-blur border-b border-black/5 dark:border-white/5 sticky top-0 z-10">
          <div class="max-w-7xl mx-auto px-6 py-6">
            <div class="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div class="flex-1">
                <input
                  type="text"
                  placeholder="Search projects, clients, or keywords..."
                  value={filters().search || ""}
                  onInput={(e) => handleSearch(e.target.value)}
                  class="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-black text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
              
              {/* Category Filter */}
              <div class="flex items-center gap-4">
                <span class="text-sm font-medium text-black/70 dark:text-white/70 whitespace-nowrap">
                  Category:
                </span>
                <div class="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    class={`px-3 py-1 rounded-full text-sm transition-colors ${
                      !filters().category || filters().category === 'all'
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'bg-black/10 text-black/70 dark:bg-white/10 dark:text-white/70 hover:bg-black/20 dark:hover:bg-white/20'
                    }`}
                  >
                    All
                  </button>
                  <For each={categories()}>
                    {(category) => (
                      <button
                        onClick={() => handleCategoryChange(category)}
                        class={`px-3 py-1 rounded-full text-sm transition-colors capitalize ${
                          filters().category === category
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'bg-black/10 text-black/70 dark:bg-white/10 dark:text-white/70 hover:bg-black/20 dark:hover:bg-white/20'
                        }`}
                      >
                        {category.replace('-', ' ')}
                      </button>
                    )}
                  </For>
                </div>
              </div>
            </div>
            
            {/* Results Summary */}
            <div class="mt-4 text-sm text-black/60 dark:text-white/60">
              Showing {filteredProjects().length} of {collectionData.length} projects
              {filters().page > 1 && ` (Page ${filters().page} of ${totalPages()})`}
            </div>
          </div>
        </div>
        
        {/* Projects Grid */}
        <div class="max-w-7xl mx-auto px-6 py-12">
          <Show 
            when={filteredProjects().length > 0} 
            fallback={
              <div class="text-center py-24">
                <p class="text-lg text-black/60 dark:text-white/60 mb-4">
                  No projects found matching your criteria.
                </p>
                <button
                  onClick={() => setSearchParams({})}
                  class="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:bg-black/80 dark:hover:bg-white/80 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            }
          >
            <Collection
              data={paginatedProjects()}
              enableFull={true}
            />
            
            {/* Pagination */}
            <Show when={totalPages() > 1}>
              <div class="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => {
                    const newPage = Math.max(1, filters().page - 1);
                    setSearchParams({ ...searchParams, page: newPage.toString() });
                  }}
                  disabled={filters().page === 1}
                  class="px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Previous
                </button>
                
                <div class="flex items-center gap-1">
                  <For each={Array.from({ length: totalPages() }, (_, i) => i + 1)}>
                    {(page) => (
                      <button
                        onClick={() => setSearchParams({ ...searchParams, page: page.toString() })}
                        class={`w-8 h-8 rounded-full text-sm transition-colors ${
                          page === filters().page
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'hover:bg-black/10 dark:hover:bg-white/10'
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </For>
                </div>
                
                <button
                  onClick={() => {
                    const newPage = Math.min(totalPages(), filters().page + 1);
                    setSearchParams({ ...searchParams, page: newPage.toString() });
                  }}
                  disabled={filters().page === totalPages()}
                  class="px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Next
                </button>
              </div>
            </Show>
          </Show>
        </div>
      </main>
    </>
  );
}