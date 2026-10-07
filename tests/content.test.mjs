import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createContentLoader, parseContentDatabase } from "../src/utils/content-data.ts";

const database = JSON.parse(await readFile(new URL("../content/db.json", import.meta.url), "utf8"));
const freshDatabase = () => structuredClone(database);
const cdnSource = { kind: "cdn", url: "https://cdn.mikeangelo.art/db.json" };

function invalidEdit(edit, expected) {
  const source = freshDatabase();
  edit(source);
  assert.throws(() => parseContentDatabase(source), expected);
}

test("validates the complete local database without mutating it and freezes cached content", () => {
  const source = freshDatabase();
  const parsed = parseContentDatabase(source);
  assert.deepEqual(parsed, source);
  assert.notEqual(parsed, source);
  assert.ok(Object.isFrozen(parsed));
  assert.ok(Object.isFrozen(parsed.caseStudies[0].sections[0].media));
  assert.throws(() => { parsed.caseStudies[0].title = "Accidental cached mutation"; }, TypeError);
  assert.deepEqual(source, database);
});

test("rejects legacy databases and unsupported versions with an actionable field path", () => {
  assert.throws(() => parseContentDatabase([]), /db must be an object/);
  assert.throws(() => parseContentDatabase({ projects: [] }), /db\.schemaVersion is required/);
  invalidEdit((source) => { source.schemaVersion = 1; }, /db\.schemaVersion must be 2; migrate/);
});

test("rejects duplicate project IDs and URL slugs", () => {
  invalidEdit((source) => { source.caseStudies[1].id = source.caseStudies[0].id; }, /caseStudies\[1\]\.id duplicates/);
  invalidEdit((source) => { source.caseStudies[1].slug = source.caseStudies[0].slug; }, /caseStudies\[1\]\.slug duplicates/);
  invalidEdit((source) => { source.personalProjects[1].id = source.personalProjects[0].id; }, /personalProjects\[1\]\.id duplicates/);
});

test("rejects missing and repeated featured artwork references rather than silently changing selections", () => {
  invalidEdit((source) => { source.caseStudies[0].featuredMediaIds.push("missing-artwork"); }, /featuredMediaIds\[\d+\] references missing section media 'missing-artwork'/);
  invalidEdit((source) => { source.caseStudies[0].featuredMediaIds.push(source.caseStudies[0].featuredMediaIds[0]); }, /featuredMediaIds\[\d+\] duplicates/);
  invalidEdit((source) => { source.caseStudies[0].sections[1].id = source.caseStudies[0].sections[0].id; }, /sections\[1\]\.id duplicates/);
  invalidEdit((source) => {
    source.caseStudies[0].sections[1].media[0].id = source.caseStudies[0].sections[0].media[0].id;
  }, /media\[0\]\.id duplicates another section media ID/);
});

test("rejects duplicate standalone film URLs and screenshot IDs", () => {
  invalidEdit((source) => {
    const film = structuredClone(source.caseStudies[0].videos[0]);
    film.id = "duplicate-film";
    source.caseStudies[0].videos.push(film);
  }, /videos\[\d+\]\.src duplicates another video URL/);
  invalidEdit((source) => {
    source.personalProjects[0].screenshots[1].id = source.personalProjects[0].screenshots[0].id;
  }, /screenshots\[1\]\.id duplicates/);
});

test("validates dimensions, real dates and publication chronology", () => {
  for (const width of [0, -2, 1.5, "1600"]) {
    invalidEdit((source) => { source.caseStudies[0].cover.width = width; }, /cover\.width must be a positive integer/);
  }
  invalidEdit((source) => { source.caseStudies[0].updatedAt = "2026-02-30"; }, /updatedAt must be a real YYYY-MM-DD date/);
  invalidEdit((source) => { source.caseStudies[0].publishedAt = "2026-10-05T00:00:00Z"; }, /publishedAt must be a real YYYY-MM-DD date/);
  invalidEdit((source) => { source.caseStudies[0].updatedAt = "1900-01-01"; }, /updatedAt cannot precede publishedAt/);
});

test("rejects unsafe media URLs, whitespace paths and relative canonical URLs", () => {
  for (const src of ["javascript:alert(1)", "data:image/png;base64,abc", "//external.example/image.png", "https://user:password@example.com/image.png"]) {
    invalidEdit((source) => { source.caseStudies[0].cover.src = src; }, /cover\.src must be an HTTP\(S\) URL or a root-relative path/);
  }
  invalidEdit((source) => { source.caseStudies[0].cover.src = "/image with spaces.png"; }, /cover\.src must encode spaces in URLs/);
  invalidEdit((source) => { source.site.url = "/"; }, /site\.url/);
  const local = freshDatabase();
  local.caseStudies[0].cover.src = "/personal/example.png";
  assert.equal(parseContentDatabase(local).caseStudies[0].cover.src, "/personal/example.png");
});

test("rejects unknown and incorrectly typed fields instead of hiding editor mistakes", () => {
  invalidEdit((source) => { source.extraCollection = []; }, /db\.extraCollection is not a supported field/);
  invalidEdit((source) => { source.caseStudies[0].sections[0].paragraph = "Misspelled field"; }, /sections\[0\]\.paragraph is not a supported field/);
  invalidEdit((source) => { source.caseStudies[0].cover.type = "video"; }, /cover\.type must be image/);
  invalidEdit((source) => { source.personalProjects[0].screenshots[0].src = ""; }, /screenshots\[0\]\.src must be a nonblank string/);
  const planned = freshDatabase();
  planned.personalProjects[0].screenshots = [{
    id: "planned-screenshot", type: "image", title: "Planned screenshot", alt: "A screenshot awaiting capture",
  }];
  const plannedScreenshots = parseContentDatabase(planned).personalProjects[0].screenshots;
  assert.ok(plannedScreenshots.every((screenshot) => screenshot.src === undefined));
});

function writingEntry() {
  return {
    id: "example-essay", slug: "example-essay", title: "Example essay", summary: "An introduction to an essay.",
    visibility: "hidden", publishedAt: "2026-10-01", updatedAt: "2026-10-05", tags: ["Design"],
    body: [
      { type: "paragraph", text: "Opening paragraph." },
      { type: "heading", level: 2, text: "A section" },
      { type: "quote", text: "A quoted observation." },
    ],
  };
}

test("supports structured writing and rejects incomplete or executable blocks", () => {
  const source = freshDatabase();
  source.writing = [writingEntry()];
  assert.deepEqual(parseContentDatabase(source).writing[0].body, source.writing[0].body);
  for (const body of [[], [{ type: "heading", text: "Missing level" }], [{ type: "heading", level: 1, text: "Invalid level" }], [{ type: "paragraph", level: 2, text: "Paragraph with heading level" }], [{ type: "html", text: "<script>example</script>" }]]) {
    source.writing[0].body = body;
    assert.throws(() => parseContentDatabase(source), /writing\[0\]\.body/);
  }
  source.writing = [writingEntry(), { ...writingEntry(), id: "second-essay" }];
  assert.throws(() => parseContentDatabase(source), /writing\[1\]\.slug duplicates/);
});

test("validates project emphasis and mixed mosaic sizes while keeping both optional", () => {
  const source = freshDatabase();
  source.creativePieces = ["small", "wide", "tall", "large"].map((size) => ({
    id: `piece-${size}`, title: `Artwork ${size}`, medium: "3D study", type: "image",
    src: `/art/${size}.png`, alt: "An original environment study", visibility: "public", size,
  }));
  const parsed = parseContentDatabase(source);
  assert.equal(parsed.personalProjects.find((project) => project.id === "indigo").presentation, "featured");
  assert.equal(parsed.personalProjects.find((project) => project.id === "solobook").presentation, "compact");
  assert.deepEqual(parsed.creativePieces.map((piece) => piece.size), ["small", "wide", "tall", "large"]);
  delete source.personalProjects[0].presentation;
  delete source.creativePieces[0].size;
  assert.doesNotThrow(() => parseContentDatabase(source));
  source.personalProjects[0].presentation = "featuredd";
  assert.throws(() => parseContentDatabase(source), /presentation must be featured or compact/);
  delete source.personalProjects[0].presentation;
  source.creativePieces[0].size = "huge";
  assert.throws(() => parseContentDatabase(source), /size must be small, wide, tall, or large/);
});

test("validates editable site copy and rejects ambiguous About section IDs", () => {
  invalidEdit((source) => { source.site.homePage.intro = "  "; }, /homePage\.intro must be a nonblank string/);
  invalidEdit((source) => { source.site.aboutPage.sections[0].paragraphs = []; }, /paragraphs must contain at least one paragraph/);
  invalidEdit((source) => { source.site.aboutPage.sections[1].id = source.site.aboutPage.sections[0].id; }, /sections\[1\]\.id duplicates/);
});

test("local content never makes a network request and shares the validated result", async () => {
  const load = createContentLoader({ kind: "local", data: freshDatabase() }, async () => {
    assert.fail("Local content attempted a network request");
  });
  const first = await load();
  assert.equal(await load(), first);
  assert.equal(first.schemaVersion, 2);
});

test("CDN content requests JSON with a timeout and shares cached data", async () => {
  let calls = 0;
  const load = createContentLoader(cdnSource, async (url, options) => {
    calls++;
    assert.equal(url, cdnSource.url);
    assert.equal(options.headers.Accept, "application/json");
    assert.ok(options.signal instanceof AbortSignal);
    assert.equal(options.signal.aborted, false);
    return Response.json(freshDatabase());
  });
  const first = await load();
  assert.equal(await load(), first);
  assert.equal(calls, 1);
  assert.deepEqual(first, parseContentDatabase(freshDatabase()), "standalone CDN JSON preserves all local copy, project tiers, and media records");
});

test("concurrent content loads share one in-flight request", async () => {
  let release;
  let calls = 0;
  const load = createContentLoader(cdnSource, () => {
    calls++;
    return new Promise((resolve) => { release = resolve; });
  });
  const first = load();
  const second = load();
  assert.equal(calls, 1);
  release(Response.json(freshDatabase()));
  const [a, b] = await Promise.all([first, second]);
  assert.equal(a, b);
  assert.equal(calls, 1);
});

test("CDN content expires at the configured interval and picks up edited content", async () => {
  let time = 0;
  let calls = 0;
  const load = createContentLoader(cdnSource, async () => {
    calls++;
    const source = freshDatabase();
    source.site.description = `Content revision ${calls}`;
    return Response.json(source);
  }, { ttlMs: 60, now: () => time });
  const first = await load();
  time = 59;
  assert.equal(await load(), first);
  time = 60;
  const refreshed = await load();
  assert.notEqual(refreshed, first);
  assert.equal(refreshed.site.description, "Content revision 2");
  assert.equal(calls, 2);
});

test("HTTP, JSON, shape and network failures are reported and are never cached", async () => {
  const failures = [
    [() => new Response("Unavailable", { status: 503 }), /Content request failed \(503\)/],
    [() => new Response("<html>Not JSON</html>"), /Content endpoint returned invalid JSON/],
    [() => Response.json({ error: "No content" }), /db\.schemaVersion is required/],
    [() => { throw new Error("Network unavailable"); }, /Network unavailable/],
  ];
  for (const [failure, expected] of failures) {
    let calls = 0;
    const load = createContentLoader(cdnSource, async () => {
      calls++;
      return calls === 1 ? failure() : Response.json(freshDatabase());
    });
    await assert.rejects(load(), expected);
    assert.equal((await load()).schemaVersion, 2);
    assert.equal(calls, 2);
  }
});

test("a failed refresh does not reset the cache expiry or prevent a subsequent retry", async () => {
  let time = 0;
  let calls = 0;
  const load = createContentLoader(cdnSource, async () => {
    calls++;
    if (calls === 2) return Response.json({ schemaVersion: 999 });
    const source = freshDatabase();
    source.site.description = `Content revision ${calls}`;
    return Response.json(source);
  }, { ttlMs: 60, now: () => time });
  const original = await load();
  time = 60;
  await assert.rejects(load(), /Invalid content database/);
  const retry = await load();
  assert.equal(calls, 3);
  assert.equal(original.site.description, "Content revision 1");
  assert.equal(retry.site.description, "Content revision 3");
  assert.equal(await load(), retry);
});
