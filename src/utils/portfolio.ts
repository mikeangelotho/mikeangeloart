import { query } from "@solidjs/router";
import { loadPortfolio, summarizePortfolio } from "./portfolio-data";

/** One query identity lets home, library and case-study routes reuse their data. */
export const fetchPortfolio = query(async () => {
  "use server";
  return summarizePortfolio(await loadPortfolio());
}, "portfolio");

export const fetchProject = query(async (slug: string) => {
  "use server";
  const projects = await loadPortfolio();
  return {
    project: projects.find((project) => project.slug === slug),
    related: summarizePortfolio(projects),
  };
}, "portfolio-project");
