# Original homepage

`index.tsx` is an unchanged copy of `src/routes/index.tsx` from before the
homepage mosaic update on October 18, 2026. It lives outside `src/routes` so
SolidStart does not publish an extra page.

This backup is preserved in Git, outside the application routes and build. To restore the original homepage,
copy `index.tsx` back to `src/routes/index.tsx`, the three files in `components/`
back to `src/components/`, and `utils/media.ts` back to `src/utils/media.ts`.
The portfolio query and remaining dependencies are still available.

The mosaic homepage uses image and video media explicitly marked `showOnHomepage: true`
in the public case studies' sections in `content/db.json`.
The masonry layout preserves each image's proportions:
two columns below 1280px, three from 1280px, and four from 1536px.
