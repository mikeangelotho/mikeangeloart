# Typography and work hierarchy

Updated October 7, 2026.

## Assessment

The previous typography made supporting copy compete with the work. The root
font size was fixed at 18px, and the global paragraph rule was `1.4rem`, which
made ordinary paragraphs 25.2px before local overrides. The desktop homepage
headline could reach 54px. Expanded headline lettering, generous text panels,
large buttons, and near-equal text/media columns compounded the effect.

The remedy is a smaller, consistent type scale and more space for images and
video. Copy continues to introduce the designer and explain the work, with the
media carrying more of the visual hierarchy. The copy and the CDN-backed JSON
content system are preserved.

## Implementation plan and result

1. Replace the previous font families with Space Grotesk 700 for headlines and
   DM Sans regular for body copy. Retain small monospace accents in the About
   workspace and footer.
2. Restore a `100%` root font size, remove the oversized global paragraph rule,
   and use shared type utilities for display headings, titles, copy, and labels.
3. Give galleries about 70% of desktop featured-project layouts. Reduce text
   panel decoration, spacing, button size, and supporting page introductions while
   retaining readable copy and usable controls.
4. Lead personal-project cards with their title and screenshots before the
   summary on small screens. Give case studies a visible cover and wider media
   galleries instead of a large title over a blurred backdrop.
5. Load only the two required WOFF2 files, with early discovery and a readable
   fallback while fonts arrive.

The site uses SolidStart and SolidJS. These changes extend its existing
components, reactive state, and server rendering; they do not require a
framework migration or a client-side font loader.

## Type scale

The sizes below assume the browser's usual 16px default. They remain relative
to the user's preferred font size. Fluid sizes use `clamp()` to stay within
their intended range.

| Utility | Role | Family and weight | Size | Line height |
| --- | --- | --- | --- | --- |
| `type-display` | Main page title and homepage introduction | Space Grotesk 700 | 28–44px | 1.1 |
| `type-title` | Featured work title | Space Grotesk 700 | 24–32px | 1.15 |
| `type-heading` | Case-study and smaller section heading | Space Grotesk 700 | 20–24px | 1.2 |
| `type-card-title` | Project card title | Space Grotesk 700 | 20–26px | 1.2 |
| `type-section-label` | Quiet section heading | Space Grotesk 700 | 12px | 1.4 |
| `type-body` | Main explanatory copy | DM Sans 400 | 16px | 1.65 |
| `type-intro` | Short page introduction | DM Sans 400 | 16–18px | 1.6 |
| `type-label` | Category and metadata label | DM Sans 500 | 12px | 1.4 |

Supporting controls and metadata may use 14px or 12px text. Main project
explanations use the 16px body scale. DM Sans supplies the medium and bold
weights used by controls; ordinary copy stays regular. Headings use the real
700 font rather than simulated bold.

`H1`, `H2`, `H3`, and `SectionHeading` in `src/layout/Headings.tsx` share these
utilities. `H2 compact` selects `type-heading`; its default is `type-title`.
Do not append another type-size utility to `H2` to change its size: competing
utilities follow generated CSS order, not their order in the class string.

## Media and copy placement

- The homepage introduction fills the visible viewport. Its artwork layer,
  copy layer, and flow spacer share `100dvh`, with a `100vh` fallback. There is
  no maximum height cap. The initial 78svh spacer allowed the following work
  section to cover the full-height artwork and has been removed.
- Homepage featured work uses a roughly 70/30 split between media and copy.
  Larger previews, smaller titles, and restrained role/results labels make the
  work easier to scan. Main previews show the complete artwork in a stable
  frame rather than cropping design details as images change.
- Featured personal projects use a roughly 71/29 split on desktop. On mobile,
  the DOM and visual order is header, screenshot gallery, then summary/link.
  Compact projects use the same sequence in their smaller cards.
- Case-study covers and walkthroughs allocate two-thirds of the desktop row
  to media. Section copy sits beside the gallery and uses narrower line lengths.
  Covers and screenshots retain full-view interactions.
  The role and summary remain visible; a native "Project details" disclosure
  contains the supporting contribution metadata. Reported outcomes follow the
  visual walkthrough. This keeps detail available without placing a long
  metadata list before the work on phones.
- Work collection cards have smaller caption panels. Related work has larger
  image proportions and more compact supporting copy.
- About retains its window manager, mobile stacking, and quiet monospace
  chrome. Its authored copy uses the same body scale as the rest of the site.

Primary buttons and icon controls retain `min-h-11`/`min-w-11` where appropriate,
which is 44px at the default root size. Compact filter tags retain their existing
smaller treatment. The type reduction is not intended to reduce the clickable
area of primary actions.

## Font loading and licensing

The two local files in `public/fonts` total 49,772 bytes (48.6 KiB):

| Asset | Format and style | Bytes |
| --- | --- | ---: |
| `space-grotesk-v22-latin-700.woff2` | WOFF2, Latin, normal, 700 | 12,840 |
| `dm-sans-v17-latin-400-700.woff2` | WOFF2, Latin, normal, variable 400–700 | 36,932 |

DM Sans uses a fixed optical size of 14 and a variable weight axis. This covers
the actual body and UI weights with one file and avoids an unused optical-size
axis. Latin subsets cover the current English content and punctuation; future
content in other scripts would need suitable font subsets or system fallbacks.

`src/app.css` declares the faces with `font-display: swap` and an Arial/sans-serif
fallback. `src/entry-server.tsx` preloads the same two URLs as `font/woff2` with
anonymous CORS. The previous Google Fonts stylesheet and preconnects are removed,
so loading no longer depends on a separate font stylesheet or third-party
connection. The files deploy with the site and can later move to the user's CDN
by updating both the CSS and preload URLs together.

`public/_headers` gives the two versioned font URLs an immutable one-year browser
cache. Nitro preserves these rules alongside its generated asset rules in the
Cloudflare build. Change the asset filename and both references when changing
font bytes, so returning visitors receive the new version. These rules apply to
static font responses rather than server-rendered pages, as described in
[Cloudflare's static asset headers documentation](https://developers.cloudflare.com/workers/static-assets/headers/).

Both fonts use SIL Open Font License 1.1. Their notices and full license texts
are included beside the assets as `space-grotesk-OFL.txt` and `dm-sans-OFL.txt`.
The downloaded files are unmodified. Fallback metric percentages are not guessed;
exact overrides should be based on measured font and fallback metrics if later
performance measurements justify them.

Primary references: [Google Fonts CSS API](https://developers.google.com/fonts/docs/css2),
[web.dev font best practices](https://web.dev/articles/font-best-practices),
[Space Grotesk license](https://github.com/google/fonts/blob/main/ofl/spacegrotesk/OFL.txt),
and [DM Sans license](https://github.com/google/fonts/blob/main/ofl/dmsans/OFL.txt).

## Verification

- Type checking, all 38 existing tests, database validation, and the production
  build pass.
- Checked desktop, tablet, and phone layouts at 1536px, 768px, 390px, and 320px.
  The checked pages have no horizontal overflow. Main copy remains 16px, with
  16–18px introductions and actual 700-weight headline styles.
- Tested navigation, anchor links, filters and reset, screenshot lightboxes,
  About tools, and keyboard opening/closing of the native contribution disclosure.
  Checked the light and dark themes and restored the desktop viewport.
- Both fonts are packaged in `.output/public/fonts` and return HTTP 200 with
  `font/woff2` and the intended cache header in the local Cloudflare runtime.
- Featured homepage cards reveal at 5% intersection rather than 15%. Long
  mobile cards previously hid their initial artwork even when part of it was
  visible below the introduction. Reduced-motion users skip this observer.
- The full-height hero correction was checked at the browser's native desktop
  size, 1536×1080, 390×844, 320×568, 844×390, and 568×320. The shared layers
  and work section boundary match the viewport height at each size. Normal
  scrolling still reveals the work and hides the introductory copy.

The content JSON and the local/CDN source switch were not changed by this pass.
