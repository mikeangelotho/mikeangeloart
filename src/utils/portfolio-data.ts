import type { ContentDatabase, ContentMedia } from "../content/content-model.ts";
import type { Media, PortfolioCollection } from "../types.ts";
import { loadContentDatabase } from "./content-loader.ts";

function film(asset: ContentMedia, client: string): Media {
  return {
    url: asset.src,
    type: asset.type,
    title: asset.title ?? asset.alt,
    client: asset.client ?? client,
    thumbnail: asset.poster ?? "",
    altText: asset.alt,
    description: asset.caption ?? "",
  };
}

/** Presentation fields only. All copy, ordering and selections come from db.json. */
export function toPortfolio(db: ContentDatabase): PortfolioCollection[] {
  return db.caseStudies.filter((project) => project.visibility === "public").map((project) => {
    const keypoints = project.sections.map((section) => ({
      id: section.id,
      title: section.title,
      description: section.paragraphs.join("\n\n"),
      paragraphs: section.paragraphs,
      media: section.media.map((asset) => ({
        id: asset.id, url: asset.src, altText: asset.alt, type: asset.type,
        width: asset.width, height: asset.height, caption: asset.caption, poster: asset.poster,
      })),
    }));
    const assets = new Map(keypoints.flatMap((section) => section.media.map((asset) => [asset.id, asset] as const)));
    return {
      id: project.id,
      author: db.site.name,
      slug: project.slug,
      title: project.title,
      cover: project.cover.src,
      coverAlt: project.cover.alt,
      coverWidth: project.cover.width,
      coverHeight: project.cover.height,
      tags: project.tags,
      dateAdded: project.publishedAt,
      lastModified: project.updatedAt,
      clientName: project.client.name,
      clientLogo: project.client.logo.src,
      clientLogoAlt: project.client.logo.alt,
      projectObjective: project.objective,
      mainKeypointDescription: project.intro.join("\n\n"),
      introParagraphs: project.intro,
      caseStudy: project.contribution,
      results: project.results,
      mainKeypointMedia: project.hero ? film(project.hero, project.client.name) : undefined,
      featuredMedia: project.featuredMediaIds.map((id) => assets.get(id)!),
      projectKeypoints: keypoints,
      projectVideos: project.videos.map((asset) => film(asset, project.client.name)),
    };
  });
}

export async function loadPortfolio(): Promise<PortfolioCollection[]> {
  return toPortfolio(await loadContentDatabase());
}

/** Cards and search do not need every walkthrough paragraph and film record. */
export function summarizePortfolio(projects: PortfolioCollection[]): PortfolioCollection[] {
  return projects.map((project) => ({
    ...project,
    projectKeypoints: [],
    projectVideos: [],
    mainKeypointMedia: undefined,
    introParagraphs: [],
    mainKeypointDescription: "",
    caseStudy: project.caseStudy ? {
      role: project.caseStudy.role,
      summary: project.caseStudy.summary,
      responsibilities: [], collaborators: [], deliverables: [],
    } : undefined,
  }));
}
