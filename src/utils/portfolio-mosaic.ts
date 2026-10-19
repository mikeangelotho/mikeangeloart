import type { ContentDatabase, ContentMedia } from "../content/content-model.ts";

export type PortfolioMosaicMedia = Pick<ContentMedia, "id" | "type" | "src" | "alt" | "width" | "height" | "poster"> & {
  projectTitle: string;
  projectSlug: string;
};

/** Homepage curation is independent of the case-study and featured-card selections. */
export function portfolioMosaicMedia(db: ContentDatabase): PortfolioMosaicMedia[] {
  return db.caseStudies
    .filter((project) => project.visibility === "public")
    .flatMap((project) => project.sections.flatMap((section) => section.media
      .filter((media) => media.showOnHomepage === true)
      .map((media) => ({
        id: media.id,
        type: media.type,
        src: media.src,
        alt: media.alt,
        width: media.width,
        height: media.height,
        poster: media.poster,
        projectTitle: project.title,
        projectSlug: project.slug,
      }))));
}
