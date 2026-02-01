import { writeFile } from "fs/promises";
import { join } from "path";
import data from "../src/db.json" with { type: "json" };

const baseUrl = "https://mikeangelo.art";

const staticPages = [
  { url: "/", lastmod: new Date() },
  { url: "/about", lastmod: new Date() },
  { url: "/projects", lastmod: new Date() }
];

const formatDate = (date) =>
  date.toISOString().split("T")[0];

const generateSitemap = () => {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${formatDate(page.lastmod)}</lastmod>
  </url>\n`;
  });

  data.forEach(project => {
    if (!project.slug || !project.lastModified) return;

    sitemap += `  <url>
    <loc>${baseUrl}/projects/${project.slug}</loc>
    <lastmod>${formatDate(new Date(project.lastModified))}</lastmod>
  </url>\n`;
  });

  sitemap += `</urlset>`;
  return sitemap;
};

writeFile(join(process.cwd(), "public", "sitemap.xml"), generateSitemap())
  .then(() => console.log("Sitemap generated for mikeangelo.art"))
  .catch(console.error);
