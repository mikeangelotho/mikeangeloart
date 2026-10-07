# Personal project previews and About workspace

The homepage's decorative Lottie animation uses the full hero height. Its source
has generous empty space, so below the desktop breakpoint it uses a moderate
2.2x zoom, a 10svh downward offset, and 40% opacity. Short screens use a 1.6x zoom
with no offset to keep the artwork in view. Desktop keeps the original placement
and responsive scale.

Home uses three real screenshots from public personal projects. Featured projects
come first, followed by smaller projects; projects with only planned screenshots
are skipped. The small server response includes the project ID, title, and first
available screenshot rather than every walkthrough. With RAID's real images
added, the previews are Cruio, RAID and Indigo. Each links to its project anchor.
All five personal projects use WebPs from the CDN `projects-screens` folder.
RAID's three full-resolution images total about 2.38 MB, roughly 92% smaller
than the original PNGs.

The Projects hero links to `#cruio` and `#creative-work`. Both targets leave space
for the fixed navigation. The latter is the existing full-width mosaic area,
which displays its authored empty state until creative pieces are added.

Anchor clicks share the Lenis provider's smooth scroll rather than the router's
native jump. It synchronizes the real scroll position and cancels older motion
before starting; wheel or touch input can take over from the current position.
The target's CSS scroll margin leaves room for the navigation. Reduced-motion
preferences make the movement immediate. Keyboard focus moves to the target
heading after arrival, without causing a second scroll.

Same-page hash URLs stay in browser history. Links to another page first load
that route without a native hash jump, then scroll when its target appears.
Native Back/Forward restoration is preserved and resynchronized with Lenis.
Modified clicks, downloads, external links, and new-tab links retain browser
behavior. `data-native-scroll` opts a custom link out of the shared handler.

The footer's small `cd ~` / To top button uses the same scroll path, clears the
current fragment, and returns keyboard focus to the page heading. Its lifting
arrow and pixel trail appear on hover or keyboard focus and honor reduced motion.
Footer controls fit a two-column mobile row with copyright beneath it.

About keeps its window manager, with restrained neutral surfaces, thin cyan
active borders, integrated title bars, and a quiet dotted background. Scoped
`about-*` styles in `src/app.css` keep these details separate from gallery cards.
The fixed bottom panel contains Profile, Resume, and a Tools launcher; the panel
does not scroll. Tools appear in a two-column popover, with native vertical
scrolling only when a short viewport requires it.

At 1024px and above, windows can be dragged or moved with the title button's
arrow keys (10px, or 30px with Shift). They stay within the workspace when the
viewport or content changes, and long content scrolls inside its window. On
smaller screens, windows stack in the page and use normal page scrolling.
Opening or selecting a mobile window brings it below the navigation. The panel
reserves bottom space and respects the device's safe area.

Active windows have a cyan border and a matching panel state. Closing a window
returns focus to its launcher. Escape, outside clicks, and outside keyboard
focus dismiss the Tools popover. Pointer listeners and resize observers are
removed when windows close. Both light and dark themes use the same structure.
