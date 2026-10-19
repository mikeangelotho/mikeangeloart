# Mike Angelo Portfolio

An art direction and multidisciplinary design portfolio built with SolidJS,
SolidStart, TypeScript, Tailwind CSS, Three.js, Lenis, and Video.js. The production
build targets Cloudflare Workers and serves static assets from the same build.

Live site: [mikeangelo.art](https://mikeangelo.art/).

## Local development

Use Node.js 22.18 or newer. The sitemap generator and tests use Node's built-in
support for TypeScript files; the application itself is compiled by SolidStart.

```sh
npm ci
npm run dev
```

The development server defaults to port 3000. Use `npm run dev -- --port 3001`
to choose another port. The dev and build commands permit only one process per
checkout, including when using Bun or choosing a different port. Vinxi writes
shared generated files under `.vinxi` and `node_modules/.vinxi`; simultaneous
processes can leave pages rendered but their buttons unresponsive. Reuse the
existing preview, or stop it before building. A lock from a terminated process
is recovered automatically on the next run. Use these scripts rather than
starting `vinxi` directly, which bypasses the guard.

## Validation and preview

```sh
npm run content:check
npm run typecheck
npm test
npm run build
npm start
```

The checks cover application TypeScript and portfolio/media data behavior. The
build generates `sitemap.xml` and `llms.txt`, then produces `.output/server/index.mjs` and
`.output/public`. `npm start` runs that existing build locally in Wrangler;
`npm run preview` builds first and then starts the same local preview.

`npm run deploy` builds and publishes to the Worker configured in
`wrangler.jsonc`. It requires the appropriate Cloudflare account access.

## Content and structure

- `content/db.json` is the version 3 project database: client case studies,
  walkthroughs, media selections, personal projects, and the artwork mosaic.
- `content/db.schema.json` describes the same project-only structure for
  editors. Run `npm run content:check` before publishing edits.
- Site identity and page copy are application code in
  `src/content/site-content.ts`; the homepage intro is JSX in its route.
- `src/utils/content-source.ts` selects only `content/db.json` for this push.
  After deploying the site and uploading that same file to
  [the CDN](https://cdn.mikeangelo.art/db.json), change the one source declaration
  to `{ kind: "cdn", url: contentDatabaseUrl }`, build, and push again.
  No data is merged and there is no fallback to another database.
- Project content is validated on the server; the sitemap and `llms.txt` use the same source.
  Array order controls presentation and featured artwork uses stable media IDs.
- `src/routes` contains the homepage, portfolio library, individual case studies,
  About page, personal Projects page, and missing-page handling.
- Add project descriptions and screenshots to `personalProjects`;
  add original renders, sketches, GIFs and clips to `creativePieces`. Media can
  use CDN URLs or root-relative paths to files under `public/`. Known media
  dimensions reserve space, and personal project screenshots open in a lightbox.
  See
  [the screenshot selection](docs/personal-project-screenshots.md) for composition
  and feature briefs.
- `scripts/generate-sitemap.js` writes `public/sitemap.xml` and `public/llms.txt`
  from one load of the active validated content source. `llms.txt` lists the site
  pages, public case-study summaries, and personal projects at their local anchors.
  Hidden records are excluded. Run `npm run generate-sitemap` to refresh both files
  without building. A failed request stops the build; static pages do not get
  artificial dates on every build.
- `src/utils/media.ts` classifies media, selects primary films, and builds video
  posters. HLS films use Video.js; regular MP4 files use native playback.
- Homepage mosaic images and videos are selected with each keypoint media's
  `showOnHomepage` flag. Video poster frames live in `public/mosaic-posters/`.
- `backups/homepage-2026-10-18/` preserves the original homepage and its retired
  dependencies outside the application build, with restoration instructions.

See [editing the content database](docs/content-database.md) for the schema,
editor workflow and CDN publication steps. Hidden records are
excluded from pages, but a public CDN file still exposes their content.

`package-lock.json` supports npm and `bun.lock` supports Bun. Keep both in sync
when changing dependencies. Generated build/configuration files are ignored;
edit `app.config.ts`, not its generated timestamp copies.

Local agent settings, environment files, generated Worker types, logs, and
`.local-backups/` are excluded from Git. Never commit private credentials.

