import localDatabase from "../../content/db.json" with { type: "json" };

export type ContentSource = { kind: "cdn"; url: string } | { kind: "local"; data: unknown };

export const contentDatabaseUrl = "https://cdn.mikeangelo.art/db.json";
// One source for every project query and the sitemap; no merging or fallback.
// After publishing this file to the CDN, replace the next line with:
// export const contentSource: ContentSource = { kind: "cdn", url: contentDatabaseUrl };
export const contentSource: ContentSource = { kind: "local", data: localDatabase };
