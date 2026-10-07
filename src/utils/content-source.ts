import localDatabase from "../../content/db.json" with { type: "json" };

export type ContentSource = { kind: "cdn"; url: string } | { kind: "local"; data: unknown };

export const contentDatabaseUrl = "https://cdn.mikeangelo.art/db.json";
let source: ContentSource = { kind: "cdn", url: contentDatabaseUrl };

// Remove only this assignment after the version 2 JSON has been published to the CDN.
source = { kind: "local", data: localDatabase };

export { source as contentSource };
