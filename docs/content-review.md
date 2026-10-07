# Portfolio content review — October 5, 2026

The professional introduction remains **Art Director & Multidisciplinary
Designer**. The documented work supports hands-on brand, advertising, motion,
video, and web design roles. The personal apps and tools add evidence of
interface design and development; their current prototype status does not
establish a separate senior engineering or product leadership claim.

The revised homepage names the disciplines directly. About explains how they
connect and retains the personal interests that give the page an individual
voice. Agency case studies describe design, implementation, editing, and motion
contributions without assigning campaign strategy or complete production
ownership to Mike. Existing private career context is not published.

## Professional references

These primary portfolio sites were reviewed on October 5, 2026. They informed
the structure and level of specificity; no wording was copied.

| Reference | Pattern applied |
| --- | --- |
| [Gabriela Namie](https://gabrielanamie.com/) | Introduce the professional identity clearly and explain concrete responsibilities. |
| [Kele Dobrinski](https://www.keledobrinski.com/) | State the actual role for each project instead of implying the same ownership everywhere. |
| [Charlota Blunarova — Arc](https://www.blunarova.com/arc) | Explain the client brief, visual work, and collaborators in direct language. |
| [Charlota Blunarova — Play](https://www.blunarova.com/play) | Give experiments their own space alongside client work. |
| [Jonnie Hallman](https://destroytoday.com/) | Support design/development positioning with specific interactions and identifiable projects. |

## Project storytelling

All seven client objectives now explain the actual brief without unsupported
superlatives. Walkthrough headings describe the work shown. Project slugs,
media references, section IDs, and original result numbers are preserved.
Student film and customer content in Secret Stash receive visible attribution
so they read as campaign context rather than Mike's authored film work.

The Road Trip social layouts were visually checked and corrected from their
old user-generated-content label to authored campaign artwork. Blauner's
generic image labels now identify its actual promotional designs. Discipline
tags use a shorter consistent vocabulary; previous tag links retain broader
equivalents. The filter design is documented in [the filter guide](project-filters.md).

The Projects page gives Cruio, RAID, and Indigo primary focus; Solobook and
R2D2 use smaller cards. The public repositories support the descriptions of
Indigo's agent/node/conversation interface, Solobook's Markdown reading
workspace, and R2D2's JSON editing and change review. They do not support claims
of production maturity, distributed model sharding, or full JSON Schema
validation. Indigo's three existing screenshots are real; other capture slots
remain unfilled until actual screenshots are supplied.

## Remaining evidence and assets

The numeric results originated in the existing portfolio database. They remain
labeled as **reported results**, not independently verified outcomes or effects
caused by Mike alone. Measurement periods, baselines, and supporting sources
were not supplied. Add those details to each result's `context` and `source`
before using the numbers as strong evidence in an application or interview.
Loopwell's vague “high-profile clients” claim was replaced with concrete outputs.

The mosaic is ready for original artwork using `small`, `wide`, `tall`, and
`large` tiles. Its collection is empty until real work is selected. Existing
client campaign artwork is not reassigned to a personal experiment by assumption.

## CDN handoff

The editable content is `content/db.json`, with its contract in
`content/db.schema.json`. Homepage, About, project introductions, walkthroughs,
headlines, cards, and artwork arrangement now come from that database. The
unused TypeScript editorial override was removed.

The current CDN still serves the legacy top-level array, so the local override
must remain for review. After replacing the CDN with the complete version 2
file, `npm run content:check:cdn` checks the published response. Removing the
single local assignment in `src/utils/content-source.ts` restores the default
CDN loader. Coordinate the new site and data publication using the sequence in
[the database guide](content-database.md); neither has been published here.
