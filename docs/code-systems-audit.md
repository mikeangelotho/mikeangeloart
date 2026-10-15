# Portfolio code and systems audit

> Historical review from October 5, 2026. The project-only version 3 database
> and current local-to-CDN workflow supersede the content/source descriptions
> below. See [the current database guide](content-database.md).

Reviewed October 5, 2026. This review covers the local site, its content database,
and the build configuration. It does not represent a new production deployment
or a visual evaluation of work that has not been inspected.

## Overall structure

The site uses SolidStart with server-rendered routes and a Cloudflare Workers
build. The frontend combines reusable portfolio components, Three.js decoration,
Lenis scrolling, and native or HLS video playback. Case-study copy, media
selection, Projects content, and future writing records now share one versioned
JSON database.

The main architecture fits the scale of this portfolio. The issues were in
repeated data loading, unchecked external responses, dormant code, media
selection, cleanup, and metadata. They did not require replacing the framework.

## Scope checked

| Area | Review |
| --- | --- |
| Application and routes | Server/client entry points, routing, loading and error states, missing pages, project data selection, layout integration |
| Content and media | Versioned local/CDN JSON, stable media IDs, primary films, image fallbacks, HLS playback, gallery and lightbox behavior |
| Interaction lifecycle | Navigation, project filters, scrolling, decorative animation, reduced motion, cleanup, theme persistence |
| Metadata | Page titles, canonical URLs, structured data, breadcrumbs, robots file, sitemap generation |
| Build and dependencies | Package scripts, both lockfiles, TypeScript scope, Cloudflare configuration, dependency advisories, generated artifacts |

The baseline build completed on Windows with Node 25.1.0, npm 11.6.2, and Bun
1.3.1. The first TypeScript check failed because Worker-generated global types
conflicted with browser types, several dependency declarations were inconsistent,
and unused playground components referenced a missing type file.

## Changes verified in the shared infrastructure

- The homepage and project library use a compact server query, while each case
  study receives its full detail record. The loader validates the complete
  version 2 database, checks HTTP status, invalid JSON, nested references,
  duplicate IDs and slugs, unsafe URLs, dates, and a ten-second request timeout.
  Featured artwork uses stable IDs rather than array coordinates.
- The local `content/db.json` is currently selected by one documented override in
  `src/utils/content-source.ts`. Removing that assignment switches the same
  validated loader back to `https://cdn.mikeangelo.art/db.json` after the new
  file is published there.
- The sitemap uses the same checked data source. Failed generation stops the
  build, and invalid dates are omitted. Static pages no longer claim to change
  whenever the build runs. All four static pages and seven published project
  routes are included.
- TypeScript is an explicit development dependency with a repeatable check.
  The browser application no longer loads the generated Worker runtime globals
  into its type environment. Third-party declaration checking is skipped;
  application source remains under strict checking.
- Video.js is a runtime dependency because the portfolio includes HLS films.
  The preview and start commands now run the Cloudflare build in Wrangler,
  matching the actual deployment target.
- The npm lockfile no longer lists the removed React Lottie package and now
  includes Lenis. Both package managers' lockfiles are maintained.
- Early theme initialization reads the saved `portfolio-theme` preference or
  system preference before rendering the styled page. Browser storage failure
  does not prevent the site from loading.
- Regional structured data no longer invents a street address, mismatched
  coordinates, postal code, fixed opening hours, or a service radius. The
  organization logo points to the actual CDN asset.
- Unused SEO-routing and duplicate GitHub-avatar utilities were removed, along
  with the old ignored timestamp configuration file. The active configuration
  stays in `app.config.ts`.

Twenty-eight regression tests cover database validation, stable artwork IDs,
structured writing, compact/detail projections, malformed responses, request
deduplication and expiry, retry behavior, media behavior, and stable sitemap
dates. The local database passes the content checker and JSON Schema validation.

## Dependency security

The initial dependency audit reported 38 affected packages, including two
critical entries. Compatible updates to Seroval and tar removed those two
critical entries. Seroval's published advisory concerns unsafe deserialization;
tar's advisory concerns unbounded archive processing. This identifies vulnerable
dependencies rather than proving that this specific site was exploited.

References: [Seroval advisory](https://github.com/advisories/GHSA-mv8w-475r-vwqw)
and [tar advisory](https://github.com/advisories/GHSA-23hp-3jrh-7fpw).

Further dependency changes are not part of this pass. A major SolidStart migration or the audit's suggested
Vinxi downgrade is outside this cleanup: neither is a safe substitute for
validating the existing deployment.

## Remaining considerations

- **Analytics configuration:** the document includes both a direct Google
  Analytics tag and a Google Tag Manager container. If the container also
  configures that same analytics property, it could duplicate events. The
  container's private configuration has not been inspected; removing either
  integration without that evidence could break existing tracking.
- **Framework compatibility reporting:** Vinxi 0.5.11 sets its own Nitro
  compatibility date in its build implementation, overriding the application
  setting. The baseline build reported the Cloudflare preset date as
  2024-11-25. Wrangler's actual runtime configuration retains 2025-10-22 with
  `nodejs_compat`. This is an upstream build behavior, not a reason to modify
  installed library files.
- **Publication sequencing:** deploy the site with the local override, replace
  the CDN JSON with the version 2 file, verify the CDN-backed build, then remove
  the override and deploy again. Uploading the new JSON before the migrated site
  is deployed would make the old production reader reject it.
- **Content cache:** validated CDN data is cached for 60 seconds per server
  instance. CDN headers can add another delay; use a short cache lifetime for
  the editable JSON and longer caching for versioned media.
- **Video accessibility:** visible media descriptions do not replace timed
  subtitles or a transcript. The published video data provides neither, and the
  code does not include caption tracks. Accurate caption files require the
  original audio or an approved transcription.

## Final automated validation

`npm run content:check`, `npm run typecheck`, `npm test`, and `npm run build`
all pass. The production build completes for the Cloudflare module target.

## Browser validation

The built Cloudflare preview returned rendered HTML for `/`, `/projects`,
`/personal`, and a representative case study. An unknown project returned a
404 response. The preview was stopped after verification; no deployment was
performed.
