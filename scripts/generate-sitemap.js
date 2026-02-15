import { writeFile } from "fs/promises";
import { join } from "path";

const baseUrl = "https://mikeangelo.art";

const staticPages = [
  { url: "/", lastmod: new Date() },
  { url: "/about", lastmod: new Date() },
  { url: "/projects", lastmod: new Date() }
];

const formatDate = (date) => new Date(date).toISOString().split("T")[0];

const run = async () => {
  try {
    // 1. Await the data fetch
    const response = await fetch("https://cdn.mikeangelo.art/db.json");
    const data = await response.json();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 2. Add static pages
    staticPages.forEach(page => {
      sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${formatDate(page.lastmod)}</lastmod>
  </url>\n`;
    });

    // 3. Add dynamic project pages (Check if data is an array first)
    const projects = Array.isArray(data) ? data : data.projects || [];
    
    projects.forEach(project => {
      if (!project.slug) return;

      const lastMod = project.lastModified || new Date();
      sitemap += `  <url>
    <loc>${baseUrl}/projects/${project.slug}</loc>
    <lastmod>${formatDate(lastMod)}</lastmod>
  </url>\n`;
    });

    sitemap += `</urlset>`;

    // 4. Write the file
    await writeFile(join(process.cwd(), "public", "sitemap.xml"), sitemap);
    console.log("✅ Sitemap generated successfully for mikeangelo.art");
    
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
  }
};

run();