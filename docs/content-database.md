# Editing the content database

`content/db.json` is the complete editable database. It includes the revised
case-study walkthrough copy, headlines, contributions, artwork selections and
project order that previously lived in local TypeScript overrides. The website
now consumes this database rather than maintaining a second editorial layer.

The same file is intended to replace
[`https://cdn.mikeangelo.art/db.json`](https://cdn.mikeangelo.art/db.json) when the
new structure is ready to publish. This migration does not upload or deploy it.

## Collections

| Collection | Content | Current use |
| --- | --- | --- |
| `site` | Professional role, metadata, homepage, About and Projects page wording | Page copy and metadata |
| `caseStudies` | Client projects, walkthroughs, contributions and media | Homepage, work library and individual case studies |
| `personalProjects` | Apps, games and tools with integrated screenshot grids | Projects page |
| `creativePieces` | Renders, sketches, GIFs and motion clips | Projects page mosaic |
| `writing` | Articles with structured paragraphs, headings and quotes | Reserved for a future writing section; no writing route exists yet |

Array order controls display order. Reorder entries or walkthrough sections in
your visual JSON editor without changing their IDs. Set `visibility` to
`"hidden"` to retain an entry in the file while excluding it from public pages.
This is an editorial setting, not privacy: anything in a published JSON file is
publicly downloadable, including hidden entries. Keep private notes elsewhere.

`schemaVersion: 2` identifies this contract. Unknown fields are rejected so a
misspelled property does not silently disappear. When adding a new content
collection or changing its structure, update the schema, application types and
validation together. A breaking structural change should increment the version.

## Local preview and the CDN switch

The default source is `https://cdn.mikeangelo.art/db.json`. During the migration,
`src/utils/content-source.ts` includes this local override:

```ts
source = { kind: "local", data: localDatabase };
```

That one assignment makes both the website and sitemap generator use
`content/db.json`. Removing it restores the CDN source. Editing the JSON during
development is enough to preview content changes; after removing the override,
the published database is fetched on the server.

Keep the override until the version 2 database is published. The old CDN
structure is intentionally rejected by the new validator. Coordinate publishing
the new website and replacing the CDN file to avoid serving incompatible
versions. The local import can remain after the assignment is removed; unused
content is eliminated from the application build.

Publication checklist:

1. Edit `content/db.json`, review the affected pages, and run
   `npm run content:check`, the normal type checks, tests and production build.
2. Deploy the migrated website with the local override still active. It then
   serves the new structure independently of the old CDN file.
3. Replace the CDN's `db.json` with this exact file. Keep a backup of the old
   database and previous site build for rollback.
4. Remove the local override, verify the CDN-backed build, and deploy again.
   Uploading the new database before migrating the old website can break the
   old site's content loader. A rollback must restore matching site and data
   versions.

Publish `content/db.schema.json` alongside the database if you want a remote
schema association in your editor. Publishing the schema is optional for the
website; runtime validation lives in the application.

## Editing case-study copy

Edit the homepage introduction, Projects callout and contact introduction in
`site.homePage`. Edit the About opening, metadata description and ordered text
sections in `site.aboutPage`. `site.role` supplies the shared professional title.
These strings use the same CDN source as the case studies, without a separate
TypeScript copy override.

The walkthrough is direct content, with no override fields:

- `objective` states the project context or goal.
- `intro` contains one or more introductory paragraphs.
- `contribution` describes your role and deliverables without implying sole
  strategy or production ownership.
- Each `sections` entry has an `id`, a visible `title`, a `paragraphs` array and
  its own `media` array. Change a headline in `title` and its explanation in
  `paragraphs`.
- `results` contains any number of reported results. Add `context` for the
  timeframe, measurement scope or attribution and `source` when you have a
  supporting reference. Do not invent missing context or individual causation.

Text is plain text, not executable HTML. Use multiple paragraph strings instead
of embedding HTML or adding blank formatting lines. Keep each section specific
to the problem, your contribution and the artwork it demonstrates.

Preserve existing case-study `slug` values to keep existing links working.
`publishedAt` and `updatedAt` use `YYYY-MM-DD`; update the latter when making a
meaningful content revision rather than giving every build an artificial date.

## Media and featured artwork

A media record has a stable `id`, an explicit `type` (`"image"` or `"video"`),
`src` and descriptive `alt` text. Optional fields include `title`, `caption`,
`poster`, `width`, `height` and `client`. The same record structure is used for
client logos, cover artwork, a hero and section media. Logos and covers must be
images; the standalone `videos` collection must contain videos.

```json
{
  "id": "loopwell-logo-concepts",
  "type": "image",
  "src": "https://cdn.mikeangelo.art/example/logo-concepts.png",
  "alt": "Loopwell logo explorations using organic forms",
  "width": 1600,
  "height": 900
}
```

This is a structure example, not an existing asset URL. Use real artwork URLs.
Root-relative website paths such as `/personal/render.png` also work. Explicit
media types avoid relying on file extensions. GIFs remain image records; MP4 and
HLS media are videos. Specify the actual artwork dimensions when known so the
site can reserve space before an image loads. Do not guess dimensions.

`featuredMediaIds` lists IDs from that case study's section media in the desired
order. Reordering a section or image does not change the selected artwork. Keep
media IDs unique within the case study and do not repeat a featured ID.

The migration preserves known artwork URLs and removes repeated standalone
video definitions. Ambiguous duplicate Loopwell video labels are not evidence
of separate films; verify the actual asset before adding another video record.

## Projects and one-off artwork

`personalProjects` contains brief descriptions and screenshot slots. Each slot
has a title, optional caption, descriptive alt text and `type: "image"`. Omit
`src` until a real screenshot is ready. Planned slots are kept out of the image
grid; a card with no images shows one screenshot notice. Once `src` is present, the
real image opens in the existing lightbox.

Set `presentation` to `"featured"` for the main projects (Cruio, RAID, Indigo)
or `"compact"` for supporting tools (Solobook, R2D2). Omission defaults to
featured. Array order is preserved within each group. Featured cards display
up to four actual images; compact cards display up to two. With three or four
images, the first screenshot is the large overview. See
[the capture guide](personal-project-screenshots.md) for all five projects.
An optional `link` has `label` and `href`; use a verified public destination.

`creativePieces` is the full-width mosaic artwork collection. Add an original piece with
`id`, `title`, `medium`, `type`, `src`, `alt` and `visibility`; optional dimensions
reserve the correct image space. Optional `size` controls the tile span:
`"small"` (default), `"wide"`, `"tall"`, or `"large"`. The layout reserves
different widths and heights while displaying complete artwork. Pieces appear
in array order and open in the
lightbox. An empty collection displays the editable `site.personalPage.emptyMosaic`
message.

## Preparing writing

Writing records have stable IDs and URL slugs, a title, summary, tags, visibility,
dates and a `body` array. The schema supports these blocks:

```json
[
  { "type": "paragraph", "text": "An opening paragraph." },
  { "type": "heading", "level": 2, "text": "A section heading" },
  { "type": "quote", "text": "A short quotation with appropriate attribution." }
]
```

Heading levels are 2, 3 or 4; the eventual page title supplies level 1. A `cover`
can use the shared media structure. These records are validated and ready for a
future renderer; adding a record does not create a public article page today.
New block types, such as embeds or code, should be introduced deliberately with
schema and rendering support.

## Validation and editor support

`content/db.schema.json` is a formal JSON Schema using draft 2020-12. Associate it
with the database in an editor that supports that draft, either through its
settings or the optional top-level `"$schema": "./db.schema.json"` property. The
schema supplies field descriptions and checks nested structures and types.

Run `npm run content:check` before publication. Application validation also
checks semantic relationships that JSON Schema cannot reliably express, such as
duplicate IDs, duplicate slugs, dates and missing featured-media references.
Invalid content should produce a useful field path rather than quietly showing
a broken or misleading page.

After uploading the new database, run `npm run content:check:cdn` to validate
the actual published endpoint before removing the local override. To check a
staging URL, run `npm run content:check -- https://your-host/db.json`. A valid
local file does not prove that the CDN has been replaced or that its cache has
refreshed.

R2D2's current template detector checks top-level array shapes and simple field
types. It is not a full draft 2020-12 validator. Supporting the new root object
and this formal schema will require an editor update; this portfolio migration
does not modify R2D2.

## Delivery and cache settings

The database is fetched on the server and its visible content is rendered into
HTML. The server shares concurrent requests and caches validated CDN data for
60 seconds; editing the published JSON can take up to that interval to appear,
plus any CDN cache lifetime. Projects pages receive only their relevant
collections, so future articles do not enlarge their content payloads. CDN
delivery and server rendering work together; editing the JSON does not require
copying descriptions into route files.

Keep the JSON human-readable for editing. Do not embed images or large binary
data in it; store media separately and reference its URL. A short CDN cache
lifetime suits frequently edited JSON, while versioned media URLs can use a
longer lifetime. CDN cache rules and headers are not changed by this migration.
If the database grows substantially, split collections only when their size or
update patterns justify another fetch and publication workflow.
