# Personal project screenshot selection

Use four screenshots for Cruio, three each for RAID and Indigo, and two each for
Solobook and R2D2. Give every image a distinct purpose. Every real image opens
at full size in the lightbox.

The ordered screenshots, captions and alt text are in `content/db.json` under
`personalProjects`. All five projects use WebP files from
`https://cdn.mikeangelo.art/projects-screens/`. Future screenshot records should
include the public URL and actual dimensions; omit `src` until a capture exists.

## Cruio

| Slot | Capture | Purpose |
| --- | --- | --- |
| 1. Project canvas | BB Paid Social July with six deliverables in Carousel and APR groups and visible In review indicators. | Establish the spatial workspace and the relationship between deliverables. |
| 2. Asset review | One Benzel-Busch deliverable at version v1, with Approve and Request revisions controls visible. | Show the review interface without implying feedback has already been posted. |
| 3. Project overview | The Benzel-Busch Projects grid with three campaigns, statuses, asset counts, and search, grouping, and sorting controls. | Show how campaigns are organized within a client workspace. |
| 4. Asset library | The Benzel-Busch Library with 16 asset thumbnails and project/group folders. | Show the shared organizing layer behind the canvases. |

These are real captures from the signed-in Cruio instance on October 5, 2026,
using Benzel-Busch work approved for the portfolio. Each image is 1536 × 645;
the CDN WebP files are `canvas-v1.webp`,
`review-v1.webp`, `projects-v1.webp`, and `library-v1.webp`.

The asset review capture shows version v1 without posted feedback. Existing test
comments are omitted, and this sequence does not present pinned feedback or
side-by-side revisions as captured workflows. Keep those subjects for future
captures when useful examples are available. The tasks board can also be a
future addition without expanding this card beyond four images.

The four CDN WebP files total 243,206 bytes. Original JPEG captures are retained
outside the public website.

## RAID

Three real captures are uploaded to the CDN, showcasing hidden meshes, enemy AI
and the open world.

| Slot | Capture | Purpose |
| --- | --- | --- |
| 1. Hidden meshes | `raid1.webp`, 3837 × 1972 | Show a hidden building wall with the player visible. |
| 2. Enemy AI | `raid3.webp`, 3530 × 1980 | Show the visible Grunt “Unaware” state, enemy health bars and player HUD. |
| 3. Open world | `raid2.webp`, 3525 × 1980 | Show the overhead district and street environment. |

Keep captions tied to the visible prototype. The three CDN WebP files preserve
the full dimensions and total about 2.38 MB, roughly 92% smaller than the PNG
originals. The site uses these verified files without assuming a CDN resizing
endpoint.

The CDN WebP exports prepared on October 7 retain the same dimensions:
`raid1.webp` (468,220 bytes), `raid2.webp` (454,056 bytes), and `raid3.webp`
(1,456,026 bytes). They total 2,378,302 bytes and use quality 85 compression;
the original PNGs remain on the CDN.

## Indigo

Three real screenshots from the public repository are served as CDN WebPs:

| Slot | Capture | Purpose |
| --- | --- | --- |
| 1. Model conversation | History sidebar, formatted response, and composer. | Establish the workspace people interact with. |
| 2. Compute grid | Node initialization and an online model worker. | Show how the system becomes visible in the interface. |
| 3. Conversation setup | Name, model, instructions, and a configured profile. | Explain conversation configuration. |

The captures retain the same images and captions as the repository screenshots.
Label Indigo as a prototype. Its public architecture document contains older
implementation details, so the portfolio describes
observable interactions rather than promising model sharding or performance.
Its premise is spawning small and medium models on devices across a local
network, with basic GPU inference sharing. It supports basic tool calling;
it is not currently an autonomous agent system.

Source: [Indigo repository](https://github.com/mikeangelotho/indigo).

## Solobook and R2D2

Each compact card now has two real screenshots supplied on October 6, 2026.
They are lossless WebP exports of the original PNGs, now served from the same
CDN `projects-screens` folder as Cruio and RAID.

| Project | Capture | Purpose |
| --- | --- | --- |
| Solobook | Chapter reader (`reader-v1.webp`, 3836 × 1840) | Show formatted Markdown, chapter navigation, reading statistics, and progress. |
| Solobook | Chapter organization (`chapters-v1.webp`, 560 × 642) | Show adding files, chapter word counts, and reorder/remove controls in a sidebar detail. |
| R2D2 | Tree editor (`tree-v1.webp`, 3840 × 1844) | Show the bucket file browser and nested, typed JSON editing using the portfolio database. |
| R2D2 | Table editor (`table-v1.webp`, 3838 × 1612) | Show inline editing with keys, values, types, and actions visible. This capture is not a diff. |

The four exports total 264,166 bytes, with original resolution and image content
preserved. Compact cards use matching preview frames to balance the wide reader
and portrait sidebar detail; each opens at full resolution in the lightbox.

Use sample content and remove credentials or private file names from captures.
The public code supports reading/navigation and JSON editing respectively;
the copy does not promise book publishing, cloud sync, full JSON Schema
validation, or production security.

Sources: [Solobook](https://github.com/mikeangelotho/solobook),
[R2D2](https://github.com/mikeangelotho/r2d2).

## Presentation

- Use consistent desktop captures at least 1600 pixels wide when possible.
- Keep enough surrounding interface to explain the feature, and avoid oversized
  unused margins. The site contains the whole capture rather than cropping it.
- Use the same coherent client workspace throughout Cruio’s sequence.
- Give each frame a different purpose; omit redundant menu or splash-screen shots.
- Keep the gallery below these cards for independent sketches, renders and loops.
