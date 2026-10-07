import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { loadPortfolio } from "../src/utils/portfolio-data.ts";

const baseUrl = "https://mikeangelo.art";
const staticPages = ["/", "/about", "/projects", "/personal"];

function escapeXml(value) {
  return value.replace(/[<>&"']/g, (character) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
  })[character]);
}

export function buildSitemap(projects) {
  const pages = [
    ...staticPages.map((path) => ({ url: `${baseUrl}${path}` })),
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${encodeURIComponent(project.slug)}`,
      modified: project.lastModified,
    })),
  ];
  const entries = pages.map(({ url, modified }) => {
    const date = modified ? new Date(modified) : undefined;
    const lastmod = date && Number.isFinite(date.getTime())
      ? `\n    <lastmod>${date.toISOString().split("T")[0]}</lastmod>`
      : "";
    return `  <url>\n    <loc>${escapeXml(url)}</loc>${lastmod}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}

// Importing the builder in tests does not fetch content or write a file.
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const projects = await loadPortfolio();
    await writeFile(resolve("public", "sitemap.xml"), buildSitemap(projects));
    console.log(`Sitemap generated with ${staticPages.length + projects.length} pages.`);
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    // Stop the build instead of silently shipping a stale sitemap.
    process.exitCode = 1;
  }
}
