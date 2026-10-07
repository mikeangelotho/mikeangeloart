import type { ContentDatabase } from "../content/content-model.ts";
import type { ContentSource } from "./content-source.ts";

type RecordValue = Record<string, unknown>;
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function invalid(path: string, message: string): never {
  throw new Error(`Invalid content database: ${path} ${message}.`);
}

function record(value: unknown, path: string, required: string[], optional: string[] = []): RecordValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) invalid(path, "must be an object");
  const object = value as RecordValue;
  const allowed = new Set([...required, ...optional]);
  for (const key of required) if (!(key in object)) invalid(`${path}.${key}`, "is required");
  for (const key of Object.keys(object)) if (!allowed.has(key)) invalid(`${path}.${key}`, "is not a supported field");
  return object;
}

function string(value: unknown, path: string): asserts value is string {
  if (typeof value !== "string" || !value.trim()) invalid(path, "must be a nonblank string");
}

function strings(object: RecordValue, keys: string[], path: string) {
  for (const key of keys) if (key in object) string(object[key], `${path}.${key}`);
}

function identifier(value: unknown, path: string) {
  string(value, path);
  if (!idPattern.test(value)) invalid(path, "must use lowercase words separated by hyphens");
}

function url(value: unknown, path: string) {
  string(value, path);
  if (/\s/.test(value)) invalid(path, "must encode spaces in URLs");
  if (/^\/(?!\/)/.test(value)) return;
  try {
    const parsed = new URL(value);
    if (["http:", "https:"].includes(parsed.protocol) && !parsed.username && !parsed.password) return;
  } catch { /* Report the field below. */ }
  invalid(path, "must be an HTTP(S) URL or a root-relative path");
}

function date(value: unknown, path: string) {
  string(value, path);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) ||
      new Date(value).toISOString().slice(0, 10) !== value) invalid(path, "must be a real YYYY-MM-DD date");
}

function visibility(value: unknown, path: string) {
  if (value !== "public" && value !== "hidden") invalid(path, "must be public or hidden");
}

function array(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) invalid(path, "must be an array");
  return value;
}

function textArray(value: unknown, path: string, nonempty = false) {
  const list = array(value, path);
  if (nonempty && !list.length) invalid(path, "must contain at least one paragraph");
  list.forEach((entry, index) => string(entry, `${path}[${index}]`));
}

function dimensions(object: RecordValue, path: string) {
  for (const key of ["width", "height"]) {
    if (key in object && (!Number.isInteger(object[key]) || (object[key] as number) < 1)) {
      invalid(`${path}.${key}`, "must be a positive integer");
    }
  }
}

function media(value: unknown, path: string, imageOnly = false): RecordValue {
  const item = record(value, path, ["id", "type", "src", "alt"], ["width", "height", "poster", "title", "caption", "client"]);
  identifier(item.id, `${path}.id`);
  if (item.type !== "image" && (imageOnly || item.type !== "video")) invalid(`${path}.type`, imageOnly ? "must be image" : "must be image or video");
  url(item.src, `${path}.src`);
  strings(item, ["alt", "title", "caption", "client"], path);
  if (item.poster !== undefined) url(item.poster, `${path}.poster`);
  dimensions(item, path);
  return item;
}

function unique(value: unknown, path: string, field: string): RecordValue[] {
  const seen = new Set<unknown>();
  return array(value, path).map((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) invalid(`${path}[${index}]`, "must be an object");
    const item = entry as RecordValue;
    if (seen.has(item[field])) invalid(`${path}[${index}].${field}`, `duplicates '${item[field]}'`);
    seen.add(item[field]);
    return item;
  });
}

function datedEntry(item: RecordValue, path: string) {
  identifier(item.id, `${path}.id`);
  identifier(item.slug, `${path}.slug`);
  date(item.publishedAt, `${path}.publishedAt`);
  date(item.updatedAt, `${path}.updatedAt`);
  if ((item.updatedAt as string) < (item.publishedAt as string)) invalid(`${path}.updatedAt`, "cannot precede publishedAt");
  visibility(item.visibility, `${path}.visibility`);
  textArray(item.tags, `${path}.tags`);
}

function caseStudy(value: unknown, path: string) {
  const item = record(value, path, ["id", "slug", "title", "tags", "publishedAt", "updatedAt", "visibility", "client", "cover", "objective", "intro", "contribution", "results", "featuredMediaIds", "sections", "videos"], ["hero"]);
  datedEntry(item, path);
  strings(item, ["title", "objective"], path);
  textArray(item.intro, `${path}.intro`, true);
  const client = record(item.client, `${path}.client`, ["name", "logo"]);
  string(client.name, `${path}.client.name`);
  media(client.logo, `${path}.client.logo`, true);
  media(item.cover, `${path}.cover`, true);
  if (item.hero !== undefined) media(item.hero, `${path}.hero`);
  const contribution = record(item.contribution, `${path}.contribution`, ["role", "summary", "responsibilities", "collaborators", "deliverables"], ["duration", "tools"]);
  strings(contribution, ["role", "summary", "duration"], `${path}.contribution`);
  for (const field of ["responsibilities", "collaborators", "deliverables", "tools"]) {
    if (field in contribution) textArray(contribution[field], `${path}.contribution.${field}`);
  }
  array(item.results, `${path}.results`).forEach((result, index) => {
    const resultPath = `${path}.results[${index}]`;
    const entry = record(result, resultPath, ["value"], ["label", "context", "source"]);
    strings(entry, ["value", "label", "context", "source"], resultPath);
  });
  const mediaIds = new Set<string>();
  unique(item.sections, `${path}.sections`, "id").forEach((section, index) => {
    const sectionPath = `${path}.sections[${index}]`;
    record(section, sectionPath, ["id", "title", "paragraphs", "media"]);
    identifier(section.id, `${sectionPath}.id`);
    string(section.title, `${sectionPath}.title`);
    textArray(section.paragraphs, `${sectionPath}.paragraphs`, true);
    array(section.media, `${sectionPath}.media`).forEach((entry, mediaIndex) => {
      const entryPath = `${sectionPath}.media[${mediaIndex}]`;
      const asset = media(entry, entryPath);
      if (mediaIds.has(asset.id as string)) invalid(`${entryPath}.id`, "duplicates another section media ID");
      mediaIds.add(asset.id as string);
    });
  });
  const featured = array(item.featuredMediaIds, `${path}.featuredMediaIds`);
  const featuredIds = new Set<string>();
  featured.forEach((id, index) => {
    const refPath = `${path}.featuredMediaIds[${index}]`;
    identifier(id, refPath);
    if (!mediaIds.has(id as string)) invalid(refPath, `references missing section media '${id}'`);
    if (featuredIds.has(id as string)) invalid(refPath, `duplicates '${id}'`);
    featuredIds.add(id as string);
  });
  const videoUrls = new Set<unknown>();
  unique(item.videos, `${path}.videos`, "id").forEach((entry, index) => {
    const entryPath = `${path}.videos[${index}]`;
    const asset = media(entry, entryPath);
    if (asset.type !== "video") invalid(`${entryPath}.type`, "must be video");
    if (videoUrls.has(asset.src)) invalid(`${entryPath}.src`, "duplicates another video URL");
    videoUrls.add(asset.src);
  });
}

function personalProject(value: unknown, path: string) {
  const item = record(value, path, ["id", "title", "category", "summary", "visibility", "screenshots"], ["status", "link", "presentation", "showScreenshotPlaceholders"]);
  identifier(item.id, `${path}.id`);
  visibility(item.visibility, `${path}.visibility`);
  strings(item, ["title", "category", "summary", "status"], path);
  if (item.presentation !== undefined && !["featured", "compact"].includes(item.presentation as string)) invalid(`${path}.presentation`, "must be featured or compact");
  if (item.showScreenshotPlaceholders !== undefined && typeof item.showScreenshotPlaceholders !== "boolean") invalid(`${path}.showScreenshotPlaceholders`, "must be a boolean");
  unique(item.screenshots, `${path}.screenshots`, "id").forEach((entry, index) => {
    const entryPath = `${path}.screenshots[${index}]`;
    record(entry, entryPath, ["id", "type", "title", "alt"], ["caption", "src", "width", "height"]);
    identifier(entry.id, `${entryPath}.id`);
    if (entry.type !== "image") invalid(`${entryPath}.type`, "must be image");
    strings(entry, ["title", "alt", "caption"], entryPath);
    if (entry.src !== undefined) url(entry.src, `${entryPath}.src`);
    dimensions(entry, entryPath);
  });
  if (item.link !== undefined) {
    const link = record(item.link, `${path}.link`, ["label", "href"]);
    string(link.label, `${path}.link.label`);
    url(link.href, `${path}.link.href`);
  }
}

function creativePiece(value: unknown, path: string) {
  const item = record(value, path, ["id", "title", "medium", "type", "src", "alt", "visibility"], ["width", "height", "size"]);
  identifier(item.id, `${path}.id`);
  visibility(item.visibility, `${path}.visibility`);
  strings(item, ["title", "medium", "alt"], path);
  if (item.type !== "image" && item.type !== "video") invalid(`${path}.type`, "must be image or video");
  url(item.src, `${path}.src`);
  dimensions(item, path);
  if (item.size !== undefined && !["small", "wide", "tall", "large"].includes(item.size as string)) invalid(`${path}.size`, "must be small, wide, tall, or large");
}

function writing(value: unknown, path: string) {
  const item = record(value, path, ["id", "slug", "title", "summary", "visibility", "publishedAt", "updatedAt", "tags", "body"], ["cover"]);
  datedEntry(item, path);
  strings(item, ["title", "summary"], path);
  if (item.cover !== undefined) media(item.cover, `${path}.cover`, true);
  const blocks = array(item.body, `${path}.body`);
  if (!blocks.length) invalid(`${path}.body`, "must contain at least one block");
  blocks.forEach((block, index) => {
    const blockPath = `${path}.body[${index}]`;
    const entry = record(block, blockPath, ["type", "text"], ["level"]);
    string(entry.text, `${blockPath}.text`);
    if (entry.type === "heading") {
      if (![2, 3, 4].includes(entry.level as number)) invalid(`${blockPath}.level`, "must be 2, 3, or 4");
    } else if (!["paragraph", "quote"].includes(entry.type as string) || entry.level !== undefined) {
      invalid(blockPath, "must be a paragraph, quote, or heading block");
    }
  });
}

function freeze<T>(value: T): T {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

/** Strict shapes plus references that JSON Schema alone cannot validate. */
export function parseContentDatabase(value: unknown): ContentDatabase {
  const root = record(value, "db", ["schemaVersion", "site", "caseStudies", "personalProjects", "creativePieces", "writing"], ["$schema"]);
  if (root.schemaVersion !== 2) invalid("db.schemaVersion", "must be 2; migrate the published JSON before switching sources");
  if (root.$schema !== undefined) string(root.$schema, "db.$schema");
  const site = record(root.site, "db.site", ["name", "role", "url", "description", "ogImage", "homePage", "aboutPage"], ["personalPage"]);
  strings(site, ["name", "role", "description"], "db.site");
  url(site.url, "db.site.url");
  if (!/^https?:\/\//.test(site.url as string)) invalid("db.site.url", "must be an absolute HTTP(S) URL");
  url(site.ogImage, "db.site.ogImage");
  const homeKeys = ["intro", "projectsIntro", "contactIntro"];
  strings(record(site.homePage, "db.site.homePage", homeKeys), homeKeys, "db.site.homePage");
  const about = record(site.aboutPage, "db.site.aboutPage", ["description", "intro", "sections"]);
  strings(about, ["description", "intro"], "db.site.aboutPage");
  unique(about.sections, "db.site.aboutPage.sections", "id").forEach((section, index) => {
    const path = `db.site.aboutPage.sections[${index}]`;
    record(section, path, ["id", "title", "paragraphs"]);
    identifier(section.id, `${path}.id`);
    string(section.title, `${path}.title`);
    textArray(section.paragraphs, `${path}.paragraphs`, true);
  });
  if (site.personalPage !== undefined) {
    const keys = ["title", "description", "intro", "projectsHeading", "mosaicHeading", "mosaicDescription", "emptyMosaic"];
    const extra = ["supportingHeading", "supportingDescription"];
    const copy = record(site.personalPage, "db.site.personalPage", keys, extra);
    strings(copy, [...keys, ...extra], "db.site.personalPage");
  }
  const validators = { caseStudies: caseStudy, personalProjects: personalProject, creativePieces: creativePiece, writing };
  for (const [key, validate] of Object.entries(validators)) {
    const entries = unique(root[key], `db.${key}`, "id");
    if (key === "caseStudies" || key === "writing") unique(root[key], `db.${key}`, "slug");
    entries.forEach((entry, index) => validate(entry, `db.${key}[${index}]`));
  }
  // Callers cannot accidentally change the cached source for later requests.
  return freeze(structuredClone(root)) as unknown as ContentDatabase;
}

/** One in-flight request and a bounded per-server cache; failures never become cached content. */
export function createContentLoader(
  source: ContentSource,
  fetcher: typeof fetch = fetch,
  { ttlMs = 60_000, now = Date.now }: { ttlMs?: number; now?: () => number } = {},
): () => Promise<ContentDatabase> {
  let cached: ContentDatabase | undefined;
  let expires = 0;
  let pending: Promise<ContentDatabase> | undefined;
  return async () => {
    if (cached && (source.kind === "local" || now() < expires)) return cached;
    if (pending) return pending;
    pending = (async () => {
      let data: unknown;
      if (source.kind === "local") {
        data = source.data;
      } else {
        const response = await fetcher(source.url, {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(10_000),
        });
        if (!response.ok) throw new Error(`Content request failed (${response.status}).`);
        try { data = await response.json(); }
        catch (cause) { throw new Error("Content endpoint returned invalid JSON.", { cause }); }
      }
      const parsed = parseContentDatabase(data);
      cached = parsed;
      expires = now() + ttlMs;
      return parsed;
    })();
    try { return await pending; }
    finally { pending = undefined; }
  };
}
