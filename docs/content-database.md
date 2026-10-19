# Editing the project database

`content/db.json` is the single version 3 project database. It preserves the
revised case-study copy, contributions, media selections, project tiers, and
ordering. Page copy and site identity live in `src/content/site-content.ts`;
the homepage intro is JSX in `src/routes/index.tsx`, so it can contain normal
SolidJS links. The database rejects page copy, site settings, and writing.

## Collections

| Collection | Content | Current use |
| --- | --- | --- |
| `caseStudies` | Client projects, walkthroughs, contributions and media | Homepage, portfolio library and case-study pages |
| `personalProjects` | Apps, games and tools with screenshots | Personal Projects page |
| `creativePieces` | Renders, sketches, GIFs and motion clips | Projects page mosaic |

The only other root fields are `schemaVersion: 3` and the optional editor
association `$schema`. Array order controls display order. Preserve IDs and
existing slugs when reordering content. Set `visibility` to `"hidden"` to
exclude a project from public pages; a published JSON file still exposes those
records to anyone downloading it.

## One source, then one line to switch

Every project query and the sitemap use the same `contentSource` declaration
in `src/utils/content-source.ts`. The current declaration is:

```ts
export const contentSource: ContentSource = { kind: "local", data: localDatabase };
```

There is no merging, runtime format migration, or fallback to another database.
The JSON schema describes the project data, independent of its storage location.

1. Edit the local file and run `npm run content:check`, `npm run typecheck`,
   `npm test`, and `npm run build`.
2. Push and deploy the site with the local source selected.
3. Replace the CDN's `db.json` with this exact version 3 file. Optionally upload
   `db.schema.json` alongside it for editor support. Keep the old database and
   site build together for rollback.
4. Run `npm run content:check:cdn` to verify the published file.
5. Replace the source declaration with this one line, then build and push again:

```ts
export const contentSource: ContentSource = { kind: "cdn", url: contentDatabaseUrl };
```

The inactive local import does not provide a fallback. Publishing the new JSON
before deploying the local-backed site can break the old production reader.
No upload or deployment is performed by these source changes.

## Editing case-study copy

- `objective` states the project context or goal.
- `intro` holds introductory paragraphs.
- `contribution` describes your role, responsibilities, collaborators, and deliverables.
- Each `sections` entry contains `id`, `title`, `paragraphs`, and `media`.
- `results` holds reported results; use `context` and `source` for attribution.

Project text is plain text. Use paragraph arrays rather than embedded HTML.
Page links belong in the SolidJS route. Dates use `YYYY-MM-DD`; update
`updatedAt` when the project content changes.

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
  "height": 900,
  "showOnHomepage": true
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

Every image and video in `caseStudies[].sections[].media[]` must include a boolean
`showOnHomepage`. Set it to `true` to include the media in the homepage mosaic,
or `false` to keep it only in the case study and any existing featured-card
selection. Use JSON booleans, without quotes. Logos and covers do not
require this field. Media on hidden projects never appear on the homepage.

The homepage selection favors identity work, typography, layouts, interfaces,
advertising, campaign design, UI demonstrations, and branding animations.
Event footage and photos, audience reactions, behind-the-scenes
shots and customer content are set to `false`. This flag is independent of
`featuredMediaIds` and does not change the images in portfolio tiles.

Mosaic videos loop silently inline while visible and pause offscreen. The
homepage's motion toggle pauses or plays all previews. Reduced-motion preferences
start previews paused; visitors can explicitly enable them. Supply measured video
dimensions to reserve the correct shape before loading. Include a representative
`poster` image so paused previews also display reliably on mobile. The current
homepage video posters are stored under `public/mosaic-posters/` and referenced
as `/mosaic-posters/<media-id>.webp`.

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
lightbox. An empty collection displays the application’s `siteContent.personalPage.emptyMosaic`
message.

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

After uploading the database, run `npm run content:check:cdn` before changing
the source declaration. To validate a staging endpoint, run
`npm run content:check -- https://your-host/db.json`. A valid local file does
not prove the CDN has been replaced or its cache refreshed.

## Delivery and cache settings

The database is fetched on the server and its visible content is rendered into
HTML. The server shares concurrent requests and caches validated CDN data for
60 seconds; editing the published JSON can take up to that interval to appear,
plus any CDN cache lifetime. The personal Projects page receives only its relevant collections. CDN
delivery and server rendering work together; editing the JSON does not require
copying descriptions into route files.

Keep the JSON human-readable for editing. Do not embed images or large binary
data in it; store media separately and reference its URL. A short CDN cache
lifetime suits frequently edited JSON, while versioned media URLs can use a
longer lifetime. CDN cache rules and headers are not changed by this migration.
If the database grows substantially, split collections only when their size or
update patterns justify another fetch and publication workflow.
