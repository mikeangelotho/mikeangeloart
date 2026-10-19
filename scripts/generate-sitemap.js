import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { siteContent } from "../src/content/site-content.ts";
import { loadContentDatabase } from "../src/utils/content-loader.ts";
import { toPortfolio } from "../src/utils/portfolio-data.ts";

const baseUrl = siteContent.url.replace(/\/$/, "");
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

function markdownText(value) {
  return value.replace(/\s+/g, " ").trim().replace(/[\\`*_[\]<>]/g, "\\$&");
}

function markdownLink(title, path, description) {
  return `- [${markdownText(title)}](${baseUrl}${path}): ${markdownText(description)}`;
}

/** Build the public site index from the same validated database as the pages. */
export function buildLlmsTxt(database) {
  const caseStudies = database.caseStudies.filter((project) => project.visibility === "public");
  const personalProjects = database.personalProjects.filter((project) => project.visibility === "public");
  const sections = [
    `# ${markdownText(siteContent.name)}\n\n> ${markdownText(siteContent.description)}`,
    `## Pages\n\n${[
      markdownLink("Home", "/", `${siteContent.role} portfolio and selected visual work.`),
      markdownLink("Portfolio", "/projects", "Client case studies in brand identity, campaigns, motion, and web design."),
      markdownLink("About", "/about", siteContent.aboutPage.description),
      markdownLink(siteContent.personalPage.title, "/personal", siteContent.personalPage.description),
    ].join("\n")}`,
  ];
  if (caseStudies.length) sections.push(`## Client case studies\n\n${caseStudies.map((project) =>
    markdownLink(project.title, `/projects/${encodeURIComponent(project.slug)}`, project.contribution.summary)
  ).join("\n")}`);
  if (personalProjects.length) sections.push(`## Personal projects\n\n${personalProjects.map((project) =>
    markdownLink(project.title, `/personal#${encodeURIComponent(project.id)}`, project.summary)
  ).join("\n")}`);
  return `${sections.join("\n\n")}\n`;
}

// Importing the builders in tests does not fetch content or write files.
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const database = await loadContentDatabase();
    const projects = toPortfolio(database);
    await writeFile(resolve("public", "sitemap.xml"), buildSitemap(projects));
    await writeFile(resolve("public", "llms.txt"), buildLlmsTxt(database));
    console.log(`Sitemap generated with ${staticPages.length + projects.length} pages; llms.txt generated from public project summaries.`);
  } catch (error) {
    console.error("Sitemap and llms.txt generation failed:", error);
    // Stop the build instead of silently shipping stale discovery files.
    process.exitCode = 1;
  }
}
