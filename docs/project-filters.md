# Project filters and discipline links

The Work page uses a compact, bordered bar above the gallery. Tags (disciplines)
and Clients each open a small dropdown over the gallery, without changing its
position. Only one dropdown opens at a time. Two columns of checkbox options
keep the panel short; its width and maximum height fit the viewport. Both
groups remain available on mobile.

Active selections use small removable tag bubbles in the bar. They scroll
horizontally if needed and occupy a second row on narrow screens. Reset clears
both groups in one URL update. The result count is visible and announced when
it changes. Escape closes the panel and returns focus to its trigger; clicking
or moving keyboard focus outside the bar also closes it. Checkbox labels
retain at least 44px targets at the site's base font size. Dropdown scrolling
is native, while active tag scrolling preserves vertical page scrolling.

Within a group, selections match any chosen value. Between groups, both must
match. The URL holds the selection, so links, reloads, and browser history work.
Changing a filter preserves the scroll position.

If links filter the gallery but Filter and Reset are both inert, check whether
client scripts are loading. Two Vinxi servers in the same checkout can overwrite
each other's dependency cache, affecting all buttons rather than just filters.
The dev/build scripts now share a process lock to prevent this conflict. Stop
the existing preview before starting another server or building, then reload
the page after a restart.

The database uses eight concise disciplines: Art Direction, Brand Design, Web
Design, Motion Design, Video Editing, Campaign Design, Print Design, and
Event Content. New authored disciplines also work. Overlapping
channel labels such as Paid Social Media and Digital Marketing are folded into
Campaign Design. Existing tag URLs are mapped to their corresponding broader
discipline by `src/utils/portfolio-filters.ts`.

Shared tags use compact inline labels with neutral colors
and visible keyboard focus. Active filter bubbles have explicit removal labels
for screen readers. Case-study tags wrap instead of creating another horizontal
scroller. The bar stays in the page flow rather than using the old fixed toolbar.
