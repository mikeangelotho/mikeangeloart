import { writeFile } from "fs/promises";
import { join } from "path";
import data from "../src/db.json" with { type: "json" };

const baseUrl = "https://mikeangeloart.com";

const staticPages = [
  { url: "/", changefreq: "weekly", priority: "1.0" },
  { url: "/about", changefreq: "monthly", priority: "0.8" },
  { url: "/projects", changefreq: "weekly", priority: "0.9" }
];

const generateSitemap = () => {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Add project pages
  data.forEach(project => {
    sitemap += `  <url>
    <loc>${baseUrl}/projects/${project.slug}</loc>
    <lastmod>${new Date(project.lastModified).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  sitemap += `</urlset>`;
  return sitemap;
};

const sitemap = generateSitemap();
writeFile(join(process.cwd(), "public", "sitemap.xml"), sitemap)
  .then(() => console.log("Sitemap generated successfully!"))
  .catch(err => console.error("Error generating sitemap:", err));